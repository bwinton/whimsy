'use strict';

/*eslint-env browser */
/*global chrome:false */

chrome.browserAction.setBadgeText({text: 'ᕕ( ᐛ)ᕗ'});
chrome.browserAction.setBadgeBackgroundColor({color: '#FFF'});

chrome.browserAction.onClicked.addListener(function(aTab) {
  // chrome.tabs.query({'url': '*://chilloutandwatchsomecatgifs.com/*'}, (tabs) => {
  chrome.browserAction.setBadgeBackgroundColor({color: '#' + Math.floor(Math.random() * 255 * 255 * 255).toString(16)});
  chrome.tabs.query({'url': 'http://chilloutandwatchsomecatgifs.com/'}, (tabs) => {
    if (tabs.length) {
      var tab = tabs.reduce((active, item) => {
        if (item.id === aTab.id) {
          active.push(item);
        }
        return active;
      }, []);
      if (tab.length === 0) {
        chrome.tabs.update(tabs[0].id, {'active': true});
      }
    } else {
      chrome.tabs.create({'url': 'http://chilloutandwatchsomecatgifs.com/', 'active': true});
    }
  });
});
