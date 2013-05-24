/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, curly:true, browser:true, es5:true, esnext:true,
  indent:2, maxerr:50, devel:true, node:true, boss:true, white:true,
  globalstrict:true, nomen:false, newcap:true*/

/*global self:true, addon:true */

"use strict";

var tabs = require('sdk/tabs');
var winutils = require('sdk/window/utils');

var run = function () {
  tabs.on('activate', function (tab) {
    var window = winutils.getMostRecentBrowserWindow();
    var searchbox = window.document.getElementById("searchbar")._textbox;
    searchbox.value = "";
  });
};

var stop = function () {
};

exports.load = function () {
  run();
};

exports.unload = function () {
  stop();
};
