# Web Extension Notes:

* `chrome.browserAction.onClicked.addListener` seems to need the `tabs` permission, whereas [the sample code](http://src.chromium.org/viewvc/chrome/trunk/src/chrome/common/extensions/docs/examples/api/browserAction/make_page_red/background.js?revision=193858) suggests it shouldn’t.
  * [Bug 1198402][d49f04b6]
  * Worked around for now.
* `chrome.tabs.query`’s [`url` parameter](https://developer.chrome.com/extensions/tabs#property-queryInfo-url) says it should match “one or more URL patterns”, but we currently do [a `!=` comparison](https://dxr.mozilla.org/mozilla-central/source/browser/components/extensions/ext-tabs.js#366).
  * [Bug 1198405][a164d99b]
  * Worked around for now.
* [`tabbrowser`](https://dxr.mozilla.org/mozilla-central/source/browser/components/extensions/ext-tabs.js#301) should probably be [`tab.ownerDocument.defaultView.gBrowser`](https://dxr.mozilla.org/mozilla-central/source/addon-sdk/source/lib/sdk/tabs/utils.js?offset=0#106) instead of `tab.ownerDocument.gBrowser`.
  * [Bug 1198395][56529a9a]
  * Can’t switch to the open cat gif tab until this is fixed.

  [d49f04b6]: https://bugzilla.mozilla.org/show_bug.cgi?id=1198402 "chrome.browserAction.onClicked.addListener needs the tabs permission to access tab.url."
  [a164d99b]: https://bugzilla.mozilla.org/show_bug.cgi?id=1198405 "chrome.tabs.query’s url parameter doesn't match “one or more URL patterns”."
  [56529a9a]: https://bugzilla.mozilla.org/show_bug.cgi?id=1198395 "chrome.tabs.update reports "tabbrowser is undefined", and fails to update."
