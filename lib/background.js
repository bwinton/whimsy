'use strict';

/*eslint-env browser */
/*global chrome:false */

chrome.browserAction.onClicked.addListener(function() {
  // chrome.tabs.query({'url': '*://chilloutandwatchsomecatgifs.com/*'}, (tabs) => {
  chrome.tabs.query({'url': 'http://chilloutandwatchsomecatgifs.com/'}, (tabs) => {
    if (tabs.length) {
      chrome.tabs.update(tabs[0].id, {'active': true});
    } else {
      chrome.tabs.create({'url': 'http://chilloutandwatchsomecatgifs.com/', 'active': true});
    }
  });
});
