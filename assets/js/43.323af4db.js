(window.webpackJsonp=window.webpackJsonp||[]).push([[43],{403:function(t,n,s){"use strict";s.r(n);var a=s(7),e=Object(a.a)({},(function(){var t=this,n=t._self._c;return n("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[n("h1",{attrs:{id:"handling-events"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#handling-events"}},[t._v("#")]),t._v(" Handling Events")]),t._v(" "),n("p",[t._v("LDK requires that you handle many different events throughout your app's life cycle. You can learn more by reading about our event-driven "),n("RouterLink",{attrs:{to:"/overview/architecture/"}},[t._v("architecture")]),t._v(".")],1),t._v(" "),n("p",[t._v("To start handling events in your application, run:")]),t._v(" "),n("CodeSwitcher",{attrs:{languages:{rust:"Rust",kotlin:"Kotlin",swift:"Swift"}},scopedSlots:t._u([{key:"rust",fn:function(){return[n("div",{staticClass:"language-rust extra-class"},[n("pre",{pre:!0,attrs:{class:"language-rust"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("use")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token namespace"}},[t._v("lightning"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("::")]),t._v("util"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("::")]),t._v("events"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("::")])]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Event")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// In the event handler passed to BackgroundProcessor::start")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("match")]),t._v(" event "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Event")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("::")]),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("PaymentSent")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" payment_preimage "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Handle successful payment")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Event")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("::")]),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("PaymentFailed")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" payment_hash"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" rejected_by_dest "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Handle failed payment")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Event")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("::")]),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("FundingGenerationReady")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("..")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Generate the funding transaction for the channel")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])])]},proxy:!0},{key:"kotlin",fn:function(){return[n("div",{staticClass:"language-kotlin extra-class"},[n("pre",{pre:!0,attrs:{class:"language-kotlin"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" org"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("ldk"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("structs"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("Event\n\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("event "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("is")]),t._v(" Event"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("PaymentSent"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Handle successful payment")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("event "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("is")]),t._v(" Event"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("PaymentFailed"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Handle failed payment")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("event "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("is")]),t._v(" Event"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("FundingGenerationReady"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Create a funding tx to be broadcast")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n")])])])]},proxy:!0},{key:"swift",fn:function(){return[n("div",{staticClass:"language-Swift extra-class"},[n("pre",{pre:!0,attrs:{class:"language-swift"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("LightningDevKit")]),t._v("\n\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" event "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" event"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("getValueAsPaymentSent")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Handle successful payment")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" event "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" event"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("getValueAsPaymentFailed")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Handle failed payment")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" event "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" event"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("getValueAsFundingGenerationReady")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Create a funding tx to be broadcast")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])])]},proxy:!0}])}),t._v(" "),n("p",[t._v("References: "),n("a",{attrs:{href:"https://docs.rs/lightning/*/lightning/util/events/enum.Event.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("Rust "),n("code",[t._v("Event")]),t._v(" docs"),n("OutboundLink")],1),t._v(", "),n("a",{attrs:{href:"https://github.com/lightningdevkit/ldk-garbagecollected/blob/main/src/main/java/org/ldk/structs/Event.java",target:"_blank",rel:"noopener noreferrer"}},[t._v("Java/Kotlin "),n("code",[t._v("Event")]),t._v(" bindings"),n("OutboundLink")],1)])],1)}),[],!1,null,null,null);n.default=e.exports}}]);