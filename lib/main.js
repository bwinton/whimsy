/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, unused:true, curly:true, browser:true, white:true,
  moz:true, esnext:false, indent:2, maxerr:50, devel:true, node:true, boss:true,
  globalstrict:true, nomen:false, newcap:false */

/* global Experiments: false, Services:false, UITelemetry:false */

'use strict';

var prefs = require('sdk/simple-prefs');
var { Cu } = require('chrome');
Cu.import('resource://gre/modules/UITelemetry.jsm');

var app = require('sdk/system/xul-app');
var features = {};
var featureNames = {};

if (app.is('Firefox')) {
  featureNames = {
    'button': true,
    'clear-search': true,
    'newtabicons': true,
    'nope': true,
    'notify': true,
    'ponami': true,
    'throbber': true,
    'urlbar': true,
    'hamburger': true,
    'mario': true,
    'private-felipe': true,
    'lionel': true,
  };

  // Yeah, so this needs to be here because the add-on sdk resolves
  // requirements when the add-on is packaged, not at run-time.  :P
  let grantAuthority = function() {
    require('./button');
    require('./clear-search');
    require('./newtabicons');
    require('./nope');
    require('./notify');
    require('./ponami');
    require('./throbber');
    require('./urlbar');
    require('./hamburger');
    require('./mario');
    require('./private-felipe');
    require('./lionel');
  }
} else if (app.is('Fennec')) {
  featureNames = {
    'nope': true,
    'panelicons': true
  };

  let grantAuthority = function() {
    require('./nope');
    require('./panelicons');
  }
}

for (let name in featureNames) {
  try {
    features[name] = require('./' + name);
  } catch (e) {
    console.log('Could not require ./' + name + '.');
    // console.exception(e)
  }
}

var telemetry = {};

var registerListener = function () {
  telemetry = {
    urlbar: +prefs.prefs.urlbar,
    ponami: +prefs.prefs.ponami,
    hamburglar: +prefs.prefs.hamburglar,
    newtabicons: +prefs.prefs.newtabicons2,
    searchbar: +prefs.prefs.searchbar,
    nope: +prefs.prefs.nope,
    mario: +prefs.prefs.mario,
    felipe: +prefs.prefs.private_felipe,
    register: +(prefs.prefs.register2.trim() !== ''),
    notify: +(prefs.prefs.notify.trim() !== '["*.mozilla.org", "*.chilloutandwatchsomecatgifs.com"]'),
    lionel: +prefs.prefs.lionel,
  };
};

exports.main = function () {
  for (let name in features) {
    try {
      features[name].load();
    } catch(e) {
      console.log(name + ' failed to load.');
      // console.exception(e);
    }
  }

  prefs.on('register2', registerListener);
  registerListener();

  if (UITelemetry.enabled) {
    UITelemetry.addSimpleMeasureFunction('whimsy', function () {
      return telemetry;
    });
  }

};

exports.onUnload = function () {
  prefs.removeListener('register2', registerListener);

  for (let name in features) {
    try {
      features[name].unload();
    } catch (e) {
      console.log(name + ' failed to unload.');
      // console.exception(e);
    }
  }

  if (UITelemetry.enabled) {
    UITelemetry.removeSimpleMeasureFunction('whimsy');
  }
};
