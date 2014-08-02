/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, curly:true, browser:true, es5:true, esnext:true,
  indent:2, maxerr:50, devel:true, node:true, boss:true, white:true,
  globalstrict:true, nomen:false, newcap:true*/

/*global self:true, addon:true */

'use strict';

var prefs = require('sdk/simple-prefs');
var tabs = require('sdk/tabs');
var winutils = require('sdk/window/utils');

var tabActivate = function (tab) {
  var window = winutils.getMostRecentBrowserWindow();
  var searchbox = window.document.getElementById('searchbar');
  if (searchbox) {
    searchbox._textbox.value = '';
  }
};

var run = function () {
  tabs.on('activate', tabActivate);
  tabActivate(tabs.activeTab);
};

var stop = function () {
  tabs.removeListener('activate', tabActivate);
};

var listener = function (prefName) {
  if (prefs.prefs.searchbar) {
    run();
  } else {
    stop();
  }
};

exports.load = function () {
  prefs.on('searchbar', listener);
  listener('searchbar');
};

exports.unload = function () {
  stop();
  prefs.removeListener('searchbar', listener);
};