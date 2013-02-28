/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, curly:true, browser:true, es5:true, esnext:true,
  indent:2, maxerr:50, devel:true, node:true, boss:true, white:true,
  globalstrict:true, nomen:false, newcap:true*/

/*global self:true, addon:true, dump:true */

"use strict";

var clipboard = require('sdk/clipboard');
var cm = require('sdk/context-menu');
var Etherpad = require('./etherpad').Etherpad;
var etherpad = new Etherpad('thumbnail-gifs');
var prefs = require('simple-prefs');
var Request = require('sdk/request').Request;
var self = require('self');
var tabs = require('tabs');
var winutils = require('window/utils');

var running = false;
var menuitem;  // Context menu item to copy icon URL.

etherpad.setDefaults([
  'http://25.media.tumblr.com/tumblr_ma7rqzY6zQ1qis5xyo1_400.gif'
]);

var tabOpen = function (tab) {
  if (!tab) {
    tab = tabs.activeTab;
  }
  tab.on('ready', function (tab) {
    if (tab.url === 'about:newtab') {
      tab.attach({
        contentScriptFile: self.data.url("newtabicons-content.js"),
        contentScriptOptions: { "thumbs" : etherpad.getRandomItems(9),
                                "showAlways" : prefs.prefs.newtabicons2 === 2 }
      });
    }
  });
};

var run = function () {
  if (running) {
    return;
  }
  running = true;

  var window = winutils.getMostRecentBrowserWindow();
  window.gURLBar.placeholder = etherpad.getItem(0);
  etherpad.loadPlaceholders();
  tabs.on('open', tabOpen);
  tabOpen();

  menuitem = cm.Item({
    label: 'Copy icon URL',
    context: [
      cm.URLContext('about:newtab'),
      cm.SelectorContext('.newtab-thumbnail')
    ],
    contentScript: 'self.on("click", function(node, data) {' +
                   '  self.postMessage(node.getAttribute("data-iconurl"));' +
                   '});',
    onMessage: function(iconUrl) {
      clipboard.set(iconUrl);
    }
  });
};

var stop = function () {
  if (!running) {
    return;
  }
  running = false;

  tabs.removeListener('open', tabOpen);
  var window = winutils.getMostRecentBrowserWindow();
  window.gURLBar.placeholder = 'Search or enter address';

  if (menuitem) {
    menuitem.destroy();
    menuitem = null;
  }
};

var listener = function (prefName) {
  if (prefs.prefs.newtabicons2) {
    run();
  } else {
    stop();
  }
};

exports.load = function () {
  prefs.on('newtabicons2', listener);
  listener('newtabicons2');
};

exports.unload = function () {
  prefs.removeListener('newtabicons2', listener);
};
