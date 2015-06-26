/*! This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

'use strict';

var { attach } = require('sdk/content/mod');
var prefs = require('sdk/simple-prefs');
var self = require('sdk/self');
var { Style } = require('sdk/stylesheet/style');
var tabs = require('sdk/tabs');

var style = Style({
  uri: self.data.url('blank.css')
});

var tabReady = function (tab) {
  if (!tab) {
    tab = tabs.activeTab;
  }

  if (tab.url !== 'about:blank') {
    return;
  }

  // worker = tab.attach({
  //   contentScriptFile: self.data.url('newtab-content.js'),
  //   contentScriptOptions: { 'bucket': telemetry.bucket, 'icon': self.data.url('chatheads.svg') }
  // });
  attach(style, tab);
};

var run = function () {
  tabs.on('ready', tabReady);
  tabReady();
};

var listener = function () {
  if (prefs.prefs.blank) {
    run();
  } else {
    stop();
  }
};

exports.load = function () {
  prefs.on('blank', listener);
  listener('blank');
};

exports.unload = function () {
  prefs.removeListener('blank', listener);
};
