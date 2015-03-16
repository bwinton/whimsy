/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint esnext:true */

/*global self:true, addon:true, dump:true */

'use strict';

var prefs = require('sdk/simple-prefs');
var self = require('sdk/self');
var xulcss = require('xulcss');
var gecko_prefs = require('sdk/preferences/service');

var LIONEL_PREF = 'lionel';
var LIONEL_CSS = self.data.url('lionel.css');
var LOOP_RINGTONE_PREF = 'loop.ringtone';
var LIONEL_OGG = self.data.url('hello.ogg');

var loaded = false;

var run = function () {
  if (!loaded) {
    gecko_prefs.set(LOOP_RINGTONE_PREF, LIONEL_OGG);
    loaded = xulcss.addXULStylesheet(LIONEL_CSS);
  }
};

var stop = function () {
  if (loaded) {
    gecko_prefs.reset(LOOP_RINGTONE_PREF);
    loaded = xulcss.removeXULStylesheet(LIONEL_CSS);
  }
};

var listener = function (prefName) {
  if (prefs.prefs.lionel) {
    run();
  } else {
    stop();
  }
};

exports.load = function () {
  prefs.on(LIONEL_PREF, listener);
  listener(LIONEL_PREF);
};

exports.unload = function () {
  prefs.removeListener(LIONEL_PREF, listener);
};
