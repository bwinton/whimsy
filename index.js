/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var prefs = require('sdk/simple-prefs');
var { UITelemetry } = require('resource://gre/modules/UITelemetry.jsm');
var app = require('sdk/system/xul-app');
var features = {};
var featureNames = {};

if (app.is('Firefox')) {
  featureNames = {
    'blank': true,
    'button': true,
    'clear-search': true,
    'dinohome': true,
    'newtabicons': true,
    'nope': true,
    'notify': true,
    'ponami': true,
    'spinner': true,
    'throbber': true,
    'urlbar': true,
    'hamburger': true,
    'mario': true,
    'private-felipe': true
  };

  // Yeah, so this needs to be here because the add-on sdk resolves
  // requirements when the add-on is packaged, not at run-time.  :P
  let grantAuthority = function() { // eslint-disable-line no-unused-vars
    require('./lib/blank');
    require('./lib/button');
    require('./lib/clear-search');
    require('./lib/dinohome');
    require('./lib/newtabicons');
    require('./lib/nope');
    require('./lib/notify');
    require('./lib/ponami');
    require('./lib/spinner');
    require('./lib/throbber');
    require('./lib/urlbar');
    require('./lib/hamburger');
    require('./lib/mario');
    require('./lib/private-felipe');
  };
} else if (app.is('Fennec')) {
  featureNames = {
    'nope': true,
    'panelicons': true
  };

  let grantAuthority = function() { // eslint-disable-line no-unused-vars
    require('./lib/nope');
    require('./lib/panelicons');
  };
}

for (let name in featureNames) {
  try {
    features[name] = require('./lib/' + name);
  } catch (e) {
    // console.log('Could not require ./lib/' + name + '.');
    // console.exception(e);
  }
}

var telemetry = {};

var registerListener = function () {
  telemetry = {
    urlbar: +prefs.prefs.urlbar,
    ponami: +prefs.prefs.ponami,
    hamburglar: +prefs.prefs.hamburglar2,
    newtabicons: +prefs.prefs.newtabicons2,
    searchbar: +prefs.prefs.searchbar,
    nope: +prefs.prefs.nope,
    mario: +prefs.prefs.mario,
    felipe: +prefs.prefs.private_felipe,
    dinohome: +prefs.prefs.dinohome,
    spinner: +prefs.prefs.spinner,
    blank: +prefs.prefs.blank,
    register: +(prefs.prefs.register2.trim() !== ''),
    notify: +(prefs.prefs.notify.trim() !== '["*.mozilla.org", "*.chilloutandwatchsomecatgifs.com"]')
  };
};


exports.main = function () {
  for (let name in features) {
    try {
      features[name].load();
    } catch(e) {
      // console.log(name + ' failed to load.');
      // console.exception(e);
    }
  }

  prefs.on('register2', registerListener);
  registerListener();

  if (UITelemetry.enabled) {
    UITelemetry.removeSimpleMeasureFunction('whimsy');
    UITelemetry.addSimpleMeasureFunction('whimsy', function () {
      return telemetry;
    });
  }

};

exports.onUnload = function (reason) {
  prefs.removeListener('register2', registerListener);

  for (let name in features) {
    try {
      features[name].unload();
    } catch (e) {
      // console.log(name + ' failed to unload.');
      // console.exception(e);
    }
  }

  if (UITelemetry.enabled && reason !== 'shutdown') {
    UITelemetry.removeSimpleMeasureFunction('whimsy');
  }
};
