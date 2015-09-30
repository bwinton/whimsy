'use strict';

/*global chrome:false */

chrome.browserAction.setBadgeText({text: 'ᕕ( ᐛ)ᕗ'});
chrome.browserAction.setBadgeBackgroundColor({color: '#FFF'});

var chillOut = function (aTab) {
  // chrome.tabs.query({'url': '*://chilloutandwatchsomecatgifs.com/*'}, (tabs) => {
  chrome.tabs.query({'url': 'http://chilloutandwatchsomecatgifs.com/'}, (tabs) => {
    if (tabs.length) {
      var tab = tabs.reduce((active, item) => {
        if (aTab && item.id === aTab.id) {
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
};

var count = 0;

chrome.notifications.onClicked.addListener(function (notificationId) {
  // This doesn't work yet.
  console.log("Notification Clicked!!!", notificationId);
  chrome.tabs.query({active: true}, function (aTab) {
    chillOut(aTab);
  });
});

chrome.bookmarks.onCreated.addListener(function (id, bookmark) {
  console.log('bookmark', id, bookmark);
  /* Should be:
  "11",
  {
    dateAdded: 1443627984866,
    id: "11",
    index: 0,
    parentId: "1",
    title: "Extensions",
    url: "chrome://extensions/"
  }
  */
});

chrome.alarms.onAlarm.addListener(function (alarm) {
  console.log("Alarm!!!", alarm, count);
  chrome.browserAction.setBadgeBackgroundColor({color: '#' + Math.floor(Math.random() * 255 * 255 * 255).toString(16)});
  count = (count + 1) % (Math.floor(Math.random() * 10) + 1);
  if (alarm.name === 'chillOut' && count === 0) {
    chrome.notifications.create('chillOut', {
      type: 'basic',
      iconUrl: 'icon64.png',
      title: 'Chill Out!',
      message: '…and watch some cat gifs!',
      contextMessage: 'yo.',
      isClickable: true
    });
    chrome.tabs.query({active: true}, function (aTab) {
      chillOut(aTab);
    });
  }
});

chrome.alarms.create('chillOut', {periodInMinutes: 1});
chrome.browserAction.onClicked.addListener(function (aTab) {
  chillOut(aTab);
});
