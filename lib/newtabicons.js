/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, curly:true, browser:true, es5:true, esnext:true,
  indent:2, maxerr:50, devel:true, node:true, boss:true, white:true,
  globalstrict:true, nomen:false, newcap:true*/

/*global self:true, addon:true, dump:true */

"use strict";

var Etherpad = require('./etherpad').Etherpad;
var etherpad = new Etherpad('thumbnail-gifs');
var prefs = require('simple-prefs');
var Request = require('sdk/request').Request;
var self = require('self');
var tabs = require('tabs');
var winutils = require('window/utils');

var tracker = null;

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
        contentScriptOptions: etherpad.getRandomItems(9)
      });
    }
  });
};

var run = function () {
  var window = winutils.getMostRecentBrowserWindow();
  window.gURLBar.placeholder = etherpad.getItem(0);
  etherpad.loadPlaceholders();
  tabs.on('open', tabOpen);
  tabOpen();
};

var stop = function () {
  tabs.removeListener('open', tabOpen);
  var window = winutils.getMostRecentBrowserWindow();
  window.gURLBar.placeholder = 'Search or enter address';
};

var listener = function (prefName) {
  if (prefs.prefs.newtabicons) {
    run();
  } else {
    stop();
  }
};

exports.load = function () {
  prefs.on('newtabicons', listener);
  listener('newtabicons');
};

exports.unload = function () {
  prefs.removeListener('newtabicons', listener);
};