/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, curly:true, browser:true, es5:true, esnext:true,
  indent:2, maxerr:50, devel:true, node:true, boss:true, white:true,
  globalstrict:true, nomen:false, newcap:true*/

/*global self:true, addon:true */

"use strict";

var self = require('sdk/self');
var tabs = require('sdk/tabs');
var winutils = require('sdk/window/utils');

var indices = [];

var run = function () {
  var document = winutils.getMostRecentBrowserWindow().document;
  var sheet = document.styleSheets.item(document.styleSheets.length - 1);

  var rule1 = '.tab-throbber {list-style-image: url("' + self.data.url('connecting-01.png') + '"); }';
  var rule2 = '.tab-throbber[progress] {list-style-image: url("' + self.data.url('loading-01.png') + '");}';
  indices.push(sheet.insertRule(rule2, sheet.cssRules.length));
  indices.push(sheet.insertRule(rule1, sheet.cssRules.length));
};

var stop = function () {
  var document = winutils.getMostRecentBrowserWindow().document;
  var sheet = document.styleSheets.item(document.styleSheets.length - 1);
  while (indices.length) {
    sheet.deleteRule(indices.pop());
  }
};

exports.load = function () {
  run();
};

exports.unload = function () {
  stop();
};
