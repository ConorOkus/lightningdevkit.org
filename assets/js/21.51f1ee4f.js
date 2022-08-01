(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{334:function(e,t,n){"use strict";n.r(t);var o=n(6),a=Object(o.a)({},(function(){var e=this,t=e._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"chain-activity"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#chain-activity"}},[e._v("#")]),e._v(" Chain Activity")]),e._v(" "),t("p",[e._v("Initially, our node doesn't have any channels and hence has no data to monitor\nfor on-chain. When a channel is opened with a peer, the "),t("code",[e._v("ChannelManager")]),e._v(" creates\na "),t("code",[e._v("ChannelMonitor")]),e._v(" and passes it to the "),t("code",[e._v("ChainMonitor")]),e._v(" to watch.")]),e._v(" "),t("p",[e._v("At this point, you need to feed LDK any chain data of interest so that it can\nrespond accordingly. It supports receiving either full blocks or pre-filtered\nblocks using the "),t("code",[e._v("chain::Listen")]),e._v(" interface. While block data can sourced from\nanywhere, it is your responsibility to call the "),t("code",[e._v("block_connected")]),e._v(" and\n"),t("code",[e._v("block_disconnected")]),e._v(" methods on "),t("code",[e._v("ChannelManager")]),e._v(" and "),t("code",[e._v("ChainMonitor")]),e._v(". This allows\nthem to update channel state and respond to on-chain events, respectively.")]),e._v(" "),t("p",[e._v("LDK comes with a "),t("code",[e._v("lightning-block-sync")]),e._v(" utility that handles polling a block\nsource for the best chain tip, detecting chain forks, and notifying listeners\nwhen blocks are connected and disconnected. It can be configured to:")]),e._v(" "),t("ul",[t("li",[e._v("Poll a custom "),t("code",[e._v("BlockSource")])]),e._v(" "),t("li",[e._v("Notify "),t("code",[e._v("ChannelManager")]),e._v(" and "),t("code",[e._v("ChainMonitor")]),e._v(" of block events")])]),e._v(" "),t("p",[e._v("It is your choice as to whether you use this utility or your own to feed the\nrequired chain data to LDK. If you choose to use it, you will need to implement\nthe "),t("code",[e._v("BlockSource")]),e._v(" interface or use one of the samples that it provides.")]),e._v(" "),t("div",{staticClass:"custom-block tip"},[t("p",{staticClass:"custom-block-title"},[e._v("Note")]),e._v(" "),t("p",[e._v("Currently, "),t("code",[e._v("lightning-block-sync")]),e._v(" is only available in Rust.")])])])}),[],!1,null,null,null);t.default=a.exports}}]);