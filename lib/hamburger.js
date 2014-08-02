/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint esnext:true */

/*global self:true, addon:true, dump:true */

'use strict';

var prefs = require('sdk/simple-prefs');
var self = require('sdk/self');
var xulcss = require('xulcss');

var HAMBURGER_PREF = 'hamburglar';
var HAMBURGER_CSS = self.data.url('hamburger.css');

var loaded = false;

var run = function () {
  if (!loaded) {
    loaded = xulcss.addXULStylesheet(HAMBURGER_CSS);
  }
};

var stop = function () {
  if (loaded) {
    loaded = xulcss.removeXULStylesheet(HAMBURGER_CSS);
  }
};

var listener = function (prefName) {
  if (prefs.prefs.hamburglar) {
    run();
  } else {
    stop();
  }
};

exports.load = function () {
  prefs.on(HAMBURGER_PREF, listener);
  listener(HAMBURGER_PREF);
};

exports.unload = function () {
  prefs.removeListener(HAMBURGER_PREF, listener);
};
