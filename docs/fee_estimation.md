# Fee Estimation

## Overview
LDK provides a ```FeeEstimator``` trait which, once implemented, assists in variety of on-chain and off-chain tasks. It's important to note that the ```FeeEstimator``` only describes the architectural requirements that must be satisfied to successfully incorporate LDK into your project. It does not, itself, provide the logic or implementation to calculate a feerate. 

In LDK, feerates are separated into eight categories. Each category is known as a ```ConfirmationTarget```. We'll provide a brief review of these shortly, but, for now, it's sufficient to understand that these categories represent various scenarios in which we need feerate information. For example, one ```ConfirmationTarget``` is ```ConfirmationTarget::MinAllowedAnchorChannelRemoteFee```, which describes the lowest feerate we will allow our channel counterparty to have in an anchor channel.

Feerates and their functionality within LDK can be conceptually separated into on-chain (Bitcoin) and off-chain (Lightning Network) tasks.

#### On-Chain
Lightning's security model is dependent on the ability to confirm a claim transaction under a variety of circumstances, such as before a timelock expires. To ensure that LDK is able to confirm claim transactions in a timely manner or bump the fee on an existing transaction, LDK utilizes the ```FeeEstimator``` to fetch feerates for high priority transactions. For example, the ```ConfirmationTarget::UrgentOnChainSweep``` specifies the feerate used when we have funds available on-chain that must be spent before a certain expiry time, beyond which our counterparty could potentially steal them. Additionally, the ```ConfirmationTarget::OutputSpendingFee``` is used by the ```OutputSweeper``` utility to ensure that, after channel closure, all funds are eventually swept to an onchain address controlled by the user.

#### Off-Chain
From an off-chain perspective, the ```FeeEstimator``` provides vital information that is used when opening, closing, and operating channels with peers on the Lightning Network. For example, when opening an inbound channel or updating an existing channel with a counterparty, LDK will compare the counterparty's proposed feerate with the minimum feerate that is allowed for that type of channel (e.g., anchor or non-anchor channel). If the proposed fee is too low, LDK may return an error and suggest closing the channel. During these operations, LDK will reference the ```ConfirmationTarget::MinAllowedAnchorChannelRemoteFee``` and the ```ConfirmationTarget::MinAllowedNonAnchorChannelRemoteFee```. Therefore, it's recommended to ensure that the minimum allowable fees are not set too high, thus increasing the risk that a peer's proposed feerate is too low, potentially resulting in a force closure.

On the other hand, when determining if a counterparty's proposed feerate is too high, LDK will reference the ```ConfirmationTarget::MaximumFeeEstimate```. This ```ConfirmationTarget``` is particularly important, as it helps a node distinguish between reasonably high fees (e.g., during high-fee environments) and purposefully high fees (e.g., griefing attacks). See the [**Best Practices**](#best-practices) section in this documentation for more helpful tips when implementing LDK's ```FeeEstimator```.

Another instance where LDK utilizes the ```FeeEstimator``` is during a cooperative channel closure. In this case, LDK references the ```ConfirmationTarget::ChannelCloseMinimum``` and ```ConfirmationTarget::NonAnchorChannelFee``` to estimate a feerate range, which is then proposed to the counterparty for closing the channel.


## The ```FeeEstimator```
LDK's ```FeeEstimator``` trait (seen below) is at the heart of fee estimation within LDK. 

You'll notice that it has **one required method**, ```get_est_sat_per_1000_weight```. This method is referenced throughout LDK to fetch feerate information when performing actions such as opening lightning channels, closing lightning channels, or sweeping funds on-chain. You'll also notice that the ```get_est_sat_per_1000_weight``` has **one required input**: a ```ConfirmationTarget```. The next section will describe the ```ConfirmationTarget``` in more detail. For now, it's important to note that the implementation of ```get_est_sat_per_1000_weight``` must be completed by the developer. Once completed, this method should return the estimated fee (in sats/KW) for the given ```ConfirmationTarget```.

```rust
pub trait FeeEstimator {
	/// Gets estimated satoshis of fee required per 1000 Weight-Units.
	///
	/// LDK will wrap this method and ensure that the value returned is no smaller than 253
	/// (ie 1 satoshi-per-byte rounded up to ensure later round-downs don't put us below 1 satoshi-per-byte).
	///
	/// The following unit conversions can be used to convert to sats/KW:
	///  * satoshis-per-byte * 250
	///  * satoshis-per-kbyte / 4
	fn get_est_sat_per_1000_weight(&self, confirmation_target: ConfirmationTarget) -> u32;
}
```

## The ```ConfirmationTarget```
The ```ConfirmationTarget``` enables the user to define the feerate that LDK will use for a variety of on-chain and off-chain tasks. For a detailed description of each ```ConfirmationTarget```, please visit [here](https://docs.rs/lightning/latest/lightning/chain/chaininterface/enum.ConfirmationTarget.html#).

## Best Practices

### Estimating Fees
The end goal is to implement the function ```get_est_sat_per_1000_weight``` such that it will return a feerate in sats/KW (satoshis-per-byte * 250) for each of the ```ConfirmationTarget``` options. Therefore, the question is: **how should we determine the right feerate to provide when ```get_est_sat_per_1000_weight``` is called?**

A popular approach is to fetch feerate information from a third-party such as mempool.space by sending a GET request to their [get-recommended-fees](https://mempool.space/docs/api/rest#get-recommended-fees) endpoint. Another option is to connect to your own local mempool. Depending on which approach you take, you may get fee estimates that are already separated into categories (e.g., high, medium, low), or you may have to request fee estimates with a specific confirmation target in mind (e.g., fetching fees for a transaction that you want to be mined within the next 6 blocks). Regardless of your approach, you will ultimately have to map the feerate estimate back to each ```ConfirmationTarget```. To help make this easier, a table has been provided below with recommendations for how you could map each ```ConfirmationTarget``` to both a mempool.space fee category and the estimated number of blocks each ```ConfirmationTarget``` may represent. Please keep in mind, these are only recommendations. In practice, confirmation targets are influenced by each developer's fee strategy and risk-tolerance and may change accordingly.

| ConfirmationTarget| mempool.space Category | Number of Blocks |
| :---------------- | :------: | :----: |
| MaximumFeeEstimate        |   fastestFee   | 1 |
| UrgentOnChainSweep        |   hourFee   | 6 |
| MinAllowedAnchorChannelRemoteFee           |   minimumFee   | 1008 |
| MinAllowedNonAnchorChannelRemoteFee    |  economyFee   | 144 |
| AnchorChannelFee |  economyFee   | 144 |
| NonAnchorChannelFee |  economyFee   | 12 |
| ChannelCloseMinimum |  economyFee   | 144 |
| OutputSpendingFee |  economyFee   | 12 |

**NOTE**: Setting ```ConfirmationTarget::MinAllowedAnchorChannelRemoteFee``` or ```ConfirmationTarget::MinAllowedNonAnchorChannelRemoteFee``` **too high**, will increase the risk that a peer's proposed feerate is, comparatively, too low, potentially resulting in a force closure. Similarly, setting ```ConfirmationTarget::AnchorChannelFee``` or ```ConfirmationTarget::NonAnchorChannelFee``` **too low**, will increase the risk that your node's proposed feerate is, comparatively, too low, potentially resulting in a force closure. 

Relatedly, recall that ```ConfirmationTarget::MaximumFeeEstimate``` helps to avoid force-closures by setting the upper bound for an acceptable proposed feerate from a peer. Therefore, this should be the most aggressive (i.e., highest) feerate estimate available.

### General Architecture Approaches
Now that we've seen a few approaches towards retrieving feerate estimates such that we can return a recommended fee for each ```ConfirmationTarget```, let's review some best practices for ```FeeEstimator``` architecture.

First, let's circle back to ```get_est_sat_per_1000_weight``` function. While there are many ways to develop logic to determine which feerate to provide for a specific ```ConfirmationTarget```, a popular approach is to fetch this information using a tiered methodology. This will help ensure that, if there is a failure in retrieving fees from one method, another method can serve as a backup and ensure that normal node operations are not impacted. For example, one approach to populating fees is the following:
- If mempool.space successfully returns fee estimates, use those.
- Otherwise, fetch fee estimates from your local mempool
- If both of the above fail, use hard-coded fall-back fees, mapped to each ```ConfirmationTarget```.

Please note, if you're using a third-party fee estimator, there are a few things you should keep in mind:
- Third parties often rate-limit users such that they can only access a limited number of fee estimates within a given timeframe. If you require a certain service level agreement (SLA), it's recommended to run your own Bitcoin node or explore paid services with SLA guarantees, such as [mempool.space enterprise accounts](https://mempool.space/enterprise).
- Leveraging third-party providers may leave you more exposed to a griefing attack, where your fee estimator purposely overestimates the feerate, causing you to accept more dust HTLCs than you would otherwise.
- Third-party fee estimates may affect the propagation of your pre-signed transactions at any time and, therefore, endanger the safety of channel funds.

Running your own Bitcoin node can relieve some of these concerns, but it may require additional technical expertise and maintenance to operate properly. These trade-offs should be considered carefully when deciding how your application will retrieve fee estimates.

A savvy reader may have noticed that the above architecture is not very performant. LDK may generate a substantial number of fee-estimation calls in some cases. So, if we have to call an API every time we want a fee estimate, we'll add a significant amount of additional load to our application, and we may substantially slow HTLC handling. To ensure your application remains performant, you should pre-calculate and cache the fee estimates so that they can simply be retrieved when needed. Additionally, it's recommended to refresh fee estimates every 5-10 minutes so that your application has access to fresh freerates.

### Feerate API Options
While mempool.space serves as the primary example in this documentation, it is not the only third-party option for retrieving feerate estimates. A few more options are listed below. For completeness, mempool.space is also included below.
| Third Party| API Documentation | Response Type |
| :---------------- | :------: | :----: |
| Mempool.space  |   [API Docs](https://mempool.space/docs/api/rest#get-recommended-fees) | Categories (e.g., fastestFee, halfHourFee, hourFee, economyFee, minimumFee)|
| Blockstream  |   [API Docs](https://github.com/Blockstream/esplora/blob/master/API.md#get-fee-estimates)  | Confirmation Targets (in blocks) |
| bitcoiner.live    |  [API Docs](https://bitcoiner.live/doc/api)   | Confirmation Targets (in minutes) |
| BitGo |  [API Docs](https://developers.bitgo.com/api/v2.tx.getfeeestimate)   | Confirmation Targets (in blocks) |
| blockchain.info |  Missing Documentation. API is here: https://api.blockchain.info/mempool/fees  | Categories (e.g., regular, priority) |

## Coding Example
Now that we've reviewed the basic architecture, let's code up an example to demonstrate how you can implement the ```FeeEstimator``` in your project. 

### Optional: Set Up
If you'd like to follow along with this demo, you can set up a new Rust project using ```cargo new``` followed by the name of the project. We'll call this ```ldk-fee-estimator```.

```
$ cargo new ldk-fee-estimator
$ cd ldk-fee-estimator
```

Once you've created the directory, open the ```Cargo.toml``` file, which Cargo uses to manage version and package dependencies, and copy/paste the following code into that file.

```rust
[package]
name = "ldk-fee-estimator"
version = "0.1.0"
edition = "2024"

[dependencies]
lightning = { version = "0.0.124", features = ["max_level_trace"] }
lightning-block-sync = { version = "0.0.124", features = [ "rpc-client" ] }
lightning-invoice = { version = "0.31.0" }
lightning-net-tokio = { version = "0.0.124" }
lightning-persister = { version = "0.0.124" }
lightning-background-processor = { version = "0.0.124" }
lightning-rapid-gossip-sync = { version = "0.0.124" }
reqwest = { version = "0.11", features = ["json", "blocking"] }
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1", features = ["full"] }  # Async runtime, required for reqwest
```

Finally, go to main.rs and place the following code at the top of the file.

```rust
use lightning::chain::chaininterface::{
    ConfirmationTarget, FeeEstimator, FEERATE_FLOOR_SATS_PER_KW,
};
use reqwest::Client;
use reqwest::Error;
use serde::Deserialize;
use std::collections::HashMap;
use std::cmp;
```

### Defining ```MyAppFeeEstimator```
First, we'll start by defining a structure, called ```MyAppFeeEstimator```, which will be used to store feerates associated with each ```ConfirmationTarget```. The field ```fee_rate_cache``` will contain a **HashMap** where the keys are of type ```ConfirmationTarget``` and the values are the feerates (type ```u32```) in sats/KW. We'll store them in sats/KW because, as we saw earlier, the ```get_est_sat_per_1000_weight``` method in LDK's ```FeeEstimator``` [expects fees to be provided in 1000 Weight-Units](https://docs.rs/lightning/latest/lightning/chain/chaininterface/trait.FeeEstimator.html#required-methods), so we'll store them in sats/KW.

```rust
pub struct MyAppFeeEstimator {
    fee_rate_cache: HashMap<ConfirmationTarget, u32>,
}
```

### Retrieving Fees From mempool.space And Implementing ```MyAppFeeEstimator```
Now that we have our basic structure for ```MyAppFeeEstimator```, let's write some code to fetch the feerates themselves. For this example, we'll fetch feerates from mempool.space. To do this, we'll start by defining a ```MempoolFeeRate``` structure. Since mempool's [recommmended fees API](https://mempool.space/docs/api/rest#get-recommended-fees) returns five different feerates (fastestFee, halfHourFee, hourFee, economyFee, minimumFee), we'll create a field for each rate. Also, since this structure will have to deserialize "camalCase" JSON data fetched from the API, we'll have to add those attributes to our structure.

```rust
#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct MempoolFeeRate {
    pub fastest_fee: u32,
    pub half_hour_fee: u32,
    pub hour_fee: u32,
    pub economy_fee: u32,
    pub minimum_fee: u32,
}
```

Now that our ```MempoolFeeRate``` structure is defined, we can begin building out the ```MyAppFeeEstimator```. We'll start by implementing the ```MyAppFeeEstimator``` and adding our first function to this structure: ```fetch_fee_from_mempool```. This function will fetch the feerates from mempool's API, process the response according to our ```MempoolFeeRate``` structure, and return the result. Since we'll be making an HTTP request using Rust's ```reqwest``` crate, we'll tag this function as asynchronous (```async```).

```rust
impl MyAppFeeEstimator {
    async fn fetch_fee_from_mempool() -> Result<MempoolFeeRate, reqwest::Error> {
        let url = "https://mempool.space/api/v1/fees/recommended";
        reqwest::Client::new()
                    .get(url)
                    .send()
                    .await?
                    .json::<MempoolFeeRate>()
                    .await
    }
}
```

### Retrieving Default Fees 
Great, we now have a function that will return mempool.space feerates! However, as discussed earlier, we don't want to rely on only one source for our fee estimates. In a real production environment, we'd likely have a local mempool that we're sourcing feerates from and, perhaps, one or more third-party services. For this demo, we'll hard-code fallback feerates and return those if we're unable to retrieve a feerate from mepool.space.

Another reason we need default fee estimates is so that we can create instances of ```MyAppFeeEstimator``` without waiting for the feerates to be fetched from mempool.space (or any async operation). Therefore, we'll write a function that will return a hard-coded feerate for a given ```ConfirmationTarget```. For simplicity, feerates below are presented as sats/vByte * 250 so that they are easier to read but, ultimately, they are stored within the cache as sats/KW. Note that this function is also a method within ```MyAppFeeEstimator```.

```rust
pub fn default_fee_from_conf_target(confirmation_target: ConfirmationTarget) -> u32 {
    match confirmation_target {
        ConfirmationTarget::MaximumFeeEstimate => 75 * 250,
        ConfirmationTarget::MinAllowedAnchorChannelRemoteFee => 10 * 250,
        ConfirmationTarget::MinAllowedNonAnchorChannelRemoteFee => 10 * 250,
        ConfirmationTarget::ChannelCloseMinimum => 20 * 250,
        ConfirmationTarget::AnchorChannelFee => 20 * 250,
        ConfirmationTarget::NonAnchorChannelFee => 30 * 250,
        ConfirmationTarget::UrgentOnChainSweep => 50 * 250,
        ConfirmationTarget::OutputSpendingFee => 10 * 250,
    }
}
```

### Creating a ```MyAppFeeEstimator``` Instance
Now that we've built the functionality to fetch feerates, we can start linking everything together. Let's begin by writing a ```new``` method, which we'll call each time we initialize a fee estimator. The ```new``` method will initialize an empty HashMap called ```fee_rate_cache```, which we defined in our ```MyAppFeeEstimator``` structure earlier. It will then proceed to populate each of the required ```ConfirmationTarget``` fields with its respective feerate. Remember, to ensure our application is performant and does not have to wait for network operations when initializing a fee estimator, we will originally load the feerates with our default values.

```rust
pub fn new() -> Self {
    let mut fee_rate_cache = HashMap::new();
    use ConfirmationTarget::*;
        for target in &[
            MinAllowedAnchorChannelRemoteFee,
            MinAllowedNonAnchorChannelRemoteFee,
            ChannelCloseMinimum,
            AnchorChannelFee,
            NonAnchorChannelFee,
            UrgentOnChainSweep,
            OutputSpendingFee,
            MaximumFeeEstimate,
        ] {
        let default_fee = Self::default_fee_from_conf_target(*target);
        fee_rate_cache.insert(*target, default_fee);
    }

    MyAppFeeEstimator {
        fee_rate_cache
    }
}
```

### Updating Fees
Great, we now have a ```new``` function that will populate each instance of our fee estimator with the default rates. 

However, we're not done yet! We already wrote code to fetch feerates from mempool.space, but we haven't inserted them into our cache. Let's do that now. We'll accomplish this by writing an ```update_fees``` method. A keen eye will likely notice that the feerates are multiplied by 250 before being added to the cache. This is because mempool.space returns feerates in sats/vByte, but we need them in sats/KW, so we can multiply them by 250 to convert them to sats/KW and then store them within our cache. Make sure both ```update_fees``` and ```new``` are added as methods within ```MyAppFeeEstimator```!

```rust
pub async fn update_fees(&mut self) -> Result<(), reqwest::Error> {
    let fee_rates = Self::fetch_fee_from_mempool().await;

    match fee_rates {
        Ok(rates) => {
            self.fee_rate_cache.insert(ConfirmationTarget::MaximumFeeEstimate, rates.fastest_fee * 250 as u32);
            self.fee_rate_cache.insert(ConfirmationTarget::UrgentOnChainSweep, rates.fastest_fee * 250 as u32);
            self.fee_rate_cache.insert(ConfirmationTarget::OutputSpendingFee, rates.fastest_fee * 250 as u32);
            self.fee_rate_cache.insert(ConfirmationTarget::NonAnchorChannelFee, rates.economy_fee * 250 as u32);
            self.fee_rate_cache.insert(ConfirmationTarget::AnchorChannelFee, rates.minimum_fee * 250 as u32);
            self.fee_rate_cache.insert(ConfirmationTarget::ChannelCloseMinimum, rates.minimum_fee * 250 as u32);
            self.fee_rate_cache.insert(ConfirmationTarget::MinAllowedNonAnchorChannelRemoteFee, rates.minimum_fee * 250 as u32);
            self.fee_rate_cache.insert(ConfirmationTarget::MinAllowedAnchorChannelRemoteFee, rates.minimum_fee * 250 as u32);
        },
        Err(_) => {
            // If the API call fails, the fallback fees are already in cache
        }
    }

    Ok(())
}
```
### Retrieving Fees Based On A ```ConfirmationTarget```
We're making solid progress! Remember, the end goal here is to build out a robust fee estimation logic that we can link back to the ```get_est_sat_per_1000_weight``` function in LDK's ```FeeEstimator```. Since ```get_est_sat_per_1000_weight``` takes one input, a ```ConfirmationTarget```, we'll have to write a function that returns the feerate for a specific ```ConfirmationTarget```. Now that we have mempool.space fees cached within the ```MyAppFeeEstimator```, we can do just that. Also, to ensure that fee estimates are not too low such that they run the risk of never being mined, we'll check that the fee we return is at least 253 sats/KW. This fee is also enforced within LDK's implementation of the ```FeeEstimator``` and is defined [here](https://docs.rs/lightning/latest/lightning/chain/chaininterface/constant.FEERATE_FLOOR_SATS_PER_KW.html). We'll import this constant and use it in our function as well.

Below is a function that takes a ```ConfirmationTarget``` as an input, fetches the feerate for that ```ConfirmationTarget``` from our cache, and returns the result. If the fetched feerate is lower than the minimum feerate defined in LDK, ```FEERATE_FLOOR_SATS_PER_KW```, we'll return ```FEERATE_FLOOR_SATS_PER_KW``` instead. As with the above, make sure this is added as a method within ```MyAppFeeEstimator```!

```rust
pub fn get_fee_rate(&self, confirmation_target: ConfirmationTarget) -> u32 {
    self.fee_rate_cache.get(&confirmation_target)
        .map(|rate| cmp::max(*rate, FEERATE_FLOOR_SATS_PER_KW))
        .expect("all ConfirmationTarget should be present in the cache")
}
```

### Linking Our Code To LDK's ```FeeEstimator```
Finally, we'll link our code to LDK's ```FeeEstimator``` by specifying that the ```MyAppFeeEstimator``` is a concrete implementation of the ```FeeEstimator``` and we have satisfied the trait requirement that ```get_est_sat_per_1000_weight``` is implemented.

Since we've already done most of the work, all we have to do is call the ```get_fee_rate``` in our ```MyAppFeeEstimator```, and it will retrieve the feerate for the specified ```ConfirmationTarget```, returning the value in sats/KW (satoshis-per-byte * 250), as specified by the LDK documentation.

```rust
impl FeeEstimator for MyAppFeeEstimator {
    fn get_est_sat_per_1000_weight(&self, confirmation_target: ConfirmationTarget) -> u32 {
        self.get_fee_rate(confirmation_target)
    }
}
```

### Testing And Improving Our Code 
Now that the ```MyAppFeeEstimator``` has been completed, we can  create an instance of the ```MyAppFeeEstimator``` and run a few tests.

In the below code, we start by creating ```fee_estimator```, an instance of the ```MyAppFeeEstimator```. Remember, since the ```fee_estimator``` is originally initialized with default values, we'll have to call ```update_fees()``` to fetch feerates from mempool.space and insert those updates into our cache.

We then define two fee targets, ```high_fee_target``` and ```low_fee_target``` for the ```ConfirmationTarget::UrgentOnChainSweep``` and ```ConfirmationTarget::MinAllowedAnchorChannelRemoteFee```. Finally, we'll pass these confirmation targets into ```fee_estimator.get_est_sat_per_1000_weight``` and print the feerates (sats/KW) to the terminal.

One best-practice that was not implemented in this demo but is left as an exercise to the developer is refreshing the updates every 5-10 minutes. One approach toward accomplishing that would be to keep track of the last time the ```fee_estimator``` fees were refreshed and create a background process to update those fees periodically. Another exercise that is left to the reader is to create additional functionality within the ```MyAppFeeEstimator``` to retrieve the feerate for custom circumstances. For example, you could create a function called ```get_high_feerate```, which takes no arguments and, instead, returns the feerate that should be used for a high-priority transaction. If you'd like to review a production-quality implementation of a ```FeeEstimator```, you can review LDK Node's implementation [here](https://github.com/lightningdevkit/ldk-node/blob/main/src/fee_estimator.rs).
```rust
#[tokio::main]
async fn main() {
    let mut fee_estimator = MyAppFeeEstimator::new();

    if let Err(e) = fee_estimator.update_fees().await {
        eprintln!("Failed to update fees: {}", e);
    }

    // Example of calling 'get_est_sat_per_1000_weight' with a specific confirmation target
    let high_fee_target = ConfirmationTarget::UrgentOnChainSweep;
    let low_fee_target = ConfirmationTarget::MinAllowedAnchorChannelRemoteFee;
    println!("Feerate for {:?}: {:?}", high_fee_target, fee_estimator.get_est_sat_per_1000_weight(high_fee_target));
    println!("Feerate for {:?}: {:?}", low_fee_target, fee_estimator.get_est_sat_per_1000_weight(low_fee_target));
}
```

### Demo Codebase
If you've been following the demo or would like to run/experiment with this code yourself, the entire main.rs file is provided below.

Just run ```$ cargo run``` in the terminal (from the root directory of this project), and you'll see live fee estimates print to your terminal!

```rust
use lightning::chain::chaininterface::{
    ConfirmationTarget, FeeEstimator, FEERATE_FLOOR_SATS_PER_KW,
};

use reqwest::Client;
use reqwest::Error;
use serde::Deserialize;
use std::collections::HashMap;
use std::cmp;

pub struct MyAppFeeEstimator {
    fee_rate_cache: HashMap<ConfirmationTarget, u32>,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct MempoolFeeRate {
    pub fastest_fee: u32,
    pub half_hour_fee: u32,
    pub hour_fee: u32,
    pub economy_fee: u32,
    pub minimum_fee: u32,
}

impl MyAppFeeEstimator {
    async fn fetch_fee_from_mempool() -> Result<MempoolFeeRate, reqwest::Error> {
        let url = "https://mempool.space/api/v1/fees/recommended";
        reqwest::Client::new()
                    .get(url)
                    .send()
                    .await?
                    .json::<MempoolFeeRate>()
                    .await
    }

    pub fn new() -> Self {
        let mut fee_rate_cache = HashMap::new();
        use ConfirmationTarget::*;
        for target in &[
            MinAllowedAnchorChannelRemoteFee,
            MinAllowedNonAnchorChannelRemoteFee,
            ChannelCloseMinimum,
            AnchorChannelFee,
            NonAnchorChannelFee,
            UrgentOnChainSweep,
            OutputSpendingFee,
            MaximumFeeEstimate,
        ] {
            let default_fee = Self::default_fee_from_conf_target(*target);
            fee_rate_cache.insert(*target, default_fee);
        }

        MyAppFeeEstimator {
            fee_rate_cache
        }
    }

    pub async fn update_fees(&mut self) -> Result<(), reqwest::Error> {
        let fee_rates = Self::fetch_fee_from_mempool().await;

        match fee_rates {
            Ok(rates) => {
                self.fee_rate_cache.insert(ConfirmationTarget::MaximumFeeEstimate, rates.fastest_fee * 250 as u32);
                self.fee_rate_cache.insert(ConfirmationTarget::UrgentOnChainSweep, rates.fastest_fee * 250 as u32);
                self.fee_rate_cache.insert(ConfirmationTarget::OutputSpendingFee, rates.fastest_fee * 250 as u32);
                self.fee_rate_cache.insert(ConfirmationTarget::NonAnchorChannelFee, rates.economy_fee * 250 as u32);
                self.fee_rate_cache.insert(ConfirmationTarget::AnchorChannelFee, rates.minimum_fee * 250 as u32);
                self.fee_rate_cache.insert(ConfirmationTarget::ChannelCloseMinimum, rates.minimum_fee * 250 as u32);
                self.fee_rate_cache.insert(ConfirmationTarget::MinAllowedNonAnchorChannelRemoteFee, rates.minimum_fee * 250 as u32);
                self.fee_rate_cache.insert(ConfirmationTarget::MinAllowedAnchorChannelRemoteFee, rates.minimum_fee * 250 as u32);
            },
            Err(_) => {
                // If the API call fails, the fallback fees are alreadyy in cache
            }
        }

        Ok(())
    }

    pub fn get_fee_rate(&self, confirmation_target: ConfirmationTarget) -> u32 {
        self.fee_rate_cache.get(&confirmation_target)
            .map(|rate| cmp::max(*rate, FEERATE_FLOOR_SATS_PER_KW))
            .expect("all ConfirmationTarget should be present in the cache")
    }

    pub fn default_fee_from_conf_target(confirmation_target: ConfirmationTarget) -> u32 {
        match confirmation_target {
            ConfirmationTarget::MaximumFeeEstimate => 75 * 250,
            ConfirmationTarget::MinAllowedAnchorChannelRemoteFee => 3 * 250,
            ConfirmationTarget::MinAllowedNonAnchorChannelRemoteFee => 3 * 250,
            ConfirmationTarget::ChannelCloseMinimum => 10 * 250,
            ConfirmationTarget::AnchorChannelFee => 10 * 250,
            ConfirmationTarget::NonAnchorChannelFee => 20 * 250,
            ConfirmationTarget::UrgentOnChainSweep => 50 * 250,
            ConfirmationTarget::OutputSpendingFee => 50 * 250,
        }
    }

}

impl FeeEstimator for MyAppFeeEstimator {
    fn get_est_sat_per_1000_weight(&self, confirmation_target: ConfirmationTarget) -> u32 {
        self.get_fee_rate(confirmation_target)
    }
}


#[tokio::main]
async fn main() {
    let mut fee_estimator = MyAppFeeEstimator::new();

    if let Err(e) = fee_estimator.update_fees().await {
        eprintln!("Failed to update fees: {}", e);
    }

    // Example of calling 'get_est_sat_per_1000_weight' with a specific confirmation target
    let high_fee_target = ConfirmationTarget::UrgentOnChainSweep;
    let low_fee_target = ConfirmationTarget::MinAllowedAnchorChannelRemoteFee;
    println!("Feerate for {:?}: {:?}", high_fee_target, fee_estimator.get_est_sat_per_1000_weight(high_fee_target));
    println!("Feerate for {:?}: {:?}", low_fee_target, fee_estimator.get_est_sat_per_1000_weight(low_fee_target));
}
```
