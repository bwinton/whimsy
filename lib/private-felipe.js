/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var prefs = require('sdk/simple-prefs');
var self = require('sdk/self');
var xulcss = require('xulcss');

var PRIVATE_FELIPE_PREF = 'private_felipe';
var PRIVATE_FELIPE_CSS = self.data.url('private-browsing-felipe.css');

var loaded = false;

var run = function () {
  if (!loaded) {
    loaded = xulcss.addXULStylesheet(PRIVATE_FELIPE_CSS);
  }
};

var stop = function () {
  if (loaded) {
    loaded = xulcss.removeXULStylesheet(PRIVATE_FELIPE_CSS);
  }
};

var listener = function () {
  if (prefs.prefs.private_felipe) {
    run();
  } else {
    stop();
  }
};

exports.load = function () {
  prefs.on(PRIVATE_FELIPE_PREF, listener);
  listener(PRIVATE_FELIPE_PREF);
};

exports.unload = function () {
  prefs.removeListener(PRIVATE_FELIPE_PREF, listener);
};
