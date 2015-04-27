/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var prefs = require('sdk/simple-prefs');
var self = require('sdk/self');
var xulcss = require('./xulcss');

var HAMBURGER_PREF = 'hamburglar2';
var HAMBURGER_CSS = self.data.url('hamburger.css');
var PANCAKE_CSS = self.data.url('pancake.css');

var loaded = 0;

var getStylesheet = function (version) {
  let stylesheet = null;
  if (version === 1) {
    stylesheet = HAMBURGER_CSS;
  } else if (version === 2) {
    stylesheet = PANCAKE_CSS;
  }
  return stylesheet;
};

var listener = function () {
  if (prefs.prefs.hamburglar2 === 0 && prefs.prefs.hamburglar) {
    prefs.prefs.hamburglar2 = 2;
    prefs.prefs.hamburglar = false;
  }
  if (loaded !== prefs.prefs.hamburglar2) {
    let stylesheet = getStylesheet(loaded);
    if (stylesheet) {
      xulcss.removeXULStylesheet(stylesheet);
    }
    stylesheet = getStylesheet(prefs.prefs.hamburglar2);
    if (stylesheet) {
      xulcss.addXULStylesheet(stylesheet);
    }
    loaded = prefs.prefs.hamburglar2;
  }

};

exports.load = function () {
  prefs.on(HAMBURGER_PREF, listener);
  listener(HAMBURGER_PREF);
};

exports.unload = function () {
  prefs.removeListener(HAMBURGER_PREF, listener);
};
