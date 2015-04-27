/*! This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

'use strict';

var debounce = require('./debounce').debounce;
var pageMod = require('sdk/page-mod');
var prefs = require('sdk/simple-prefs');

var currentMod;

var stop = function () {
  if (currentMod) {
    currentMod.destroy();
  }
};

var run = function () {
  var include = prefs.prefs.notify;
  try {
    include = JSON.parse(include);
  } catch (e) {
    if (include === "[\\\"*.mozilla.org\\\", \\\"*.chilloutandwatchsomecatgifs.com\\\"]") {
      prefs.prefs.notify = "[\"*.mozilla.org\", \"*.chilloutandwatchsomecatgifs.com\"]";
      include = JSON.parse("[\"*.mozilla.org\", \"*.chilloutandwatchsomecatgifs.com\"]");
    }
  }
  stop();
  currentMod = pageMod.PageMod({
    include: include,
    contentScript: 'window.postMessage("whimsy:enabled", "*")'
  });
};

var listener = function () {
  if (prefs.prefs.notify) {
    run();
  } else {
    stop();
  }
};

var handler = debounce(listener, 1000);

exports.load = function () {
  prefs.on('notify', handler);
  listener();
};

exports.unload = function () {
  stop();
  prefs.removeListener('notify', handler);
};
