/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var prefs = require('sdk/simple-prefs');
var self = require('sdk/self');
var xulcss = require('./xulcss');

var SPINNER_PREF = 'spinner';
var METAL_CSS = self.data.url('metal-spinner.css');
var CAT_CSS = self.data.url('cat-spinner.css');

var loaded = 0;

var getStylesheet = function (version) {
  let stylesheet = null;
  if (version === 1) {
    stylesheet = METAL_CSS;
  } else if (version === 2) {
    stylesheet = CAT_CSS;
  }
  return stylesheet;
};

var listener = function () {
  if (loaded !== prefs.prefs.spinner) {
    let stylesheet = getStylesheet(loaded);
    if (stylesheet) {
      xulcss.removeXULStylesheet(stylesheet);
    }
    stylesheet = getStylesheet(prefs.prefs.spinner);
    if (stylesheet) {
      xulcss.addXULStylesheet(stylesheet);
    }
    loaded = prefs.prefs.spinner;
  }

};

exports.load = function () {
  prefs.on(SPINNER_PREF, listener);
  listener(SPINNER_PREF);
};

exports.unload = function () {
  prefs.removeListener(SPINNER_PREF, listener);
};
