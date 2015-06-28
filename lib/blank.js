/*! This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

'use strict';

var { attach, detach } = require('sdk/content/mod');
var prefs = require('sdk/simple-prefs');
var self = require('sdk/self');
var { Style } = require('sdk/stylesheet/style');
var tabs = require('sdk/tabs');

var style = Style({
  uri: self.data.url('blank.css')
});

var tabReady = function (tab) {
  if (!tab || tab.url !== 'about:blank') {
    return;
  }

  attach(style, tab);
};

var run = function () {
  tabs.on('ready', tabReady);
  for (let tab of tabs) {
    tabReady(tab);
  }
};

var stop = function () {
  tabs.removeListener('ready', tabReady);

  for (let tab of tabs) {
    if (tab.url === 'about:blank') {
      detach(style, tab);
    }
  }
}

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
