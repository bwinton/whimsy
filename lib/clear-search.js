/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var prefs = require('sdk/simple-prefs');
var tabs = require('sdk/tabs');
var winutils = require('sdk/window/utils');

var tabActivate = function () {
  var window = winutils.getMostRecentBrowserWindow();
  var searchbox = window.document.getElementById('searchbar');
  if (searchbox) {
    searchbox._textbox.value = ''; // eslint-disable-line no-underscore-dangle
  }
};

var run = function () {
  tabs.on('activate', tabActivate);
  tabActivate(tabs.activeTab);
};

var stop = function () {
  tabs.removeListener('activate', tabActivate);
};

var listener = function () {
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
