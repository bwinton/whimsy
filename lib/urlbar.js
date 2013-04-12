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
var etherpad = new Etherpad('urlbar-sayings');
var prefs = require('sdk/simple-prefs');
var Request = require('sdk/request').Request;
var tabs = require('sdk/tabs');
var winutils = require('sdk/window/utils');

etherpad.setDefaults([
  'Where do you want to go today?',
  'Just type ”google.com“.  You know you’re going to.',
  'Let’s do this thing!',
  'Hey, I wonder what we should have for lunch?',
  'Where to, boss?',
  'I hear Facebook is nice this time of year…',
  'You know you can search from here, right?',
  'Have you thought about trying Private Browsing Mode?',
  'You are in a maze of twisty web pages, all alike.',
  'Hi!  My name is Url.'
]);

var tabActivate = function (tab) {
  var window = winutils.getMostRecentBrowserWindow();
  window.gURLBar.placeholder = etherpad.getItem(tab.id);
};

var run = function () {
  var window = winutils.getMostRecentBrowserWindow();
  window.gURLBar.placeholder = etherpad.getItem(0);
  etherpad.loadPlaceholders();
  tabs.on('activate', tabActivate);
  tabActivate(tabs.activeTab);
};

var stop = function () {
  tabs.removeListener('activate', tabActivate);
  var window = winutils.getMostRecentBrowserWindow();
  window.gURLBar.placeholder = 'Search or enter address';
};

var listener = function (prefName) {
  if (prefs.prefs.urlbar) {
    run();
  } else {
    stop();
  }
};

exports.load = function () {
  prefs.on('urlbar', listener);
  listener('urlbar');
};

exports.unload = function () {
  prefs.removeListener('urlbar', listener);
};