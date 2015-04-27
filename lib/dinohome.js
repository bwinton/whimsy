/*! This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

'use strict';

var debounce = require('./debounce').debounce;
var pageMod = require('sdk/page-mod');
var prefs = require('sdk/simple-prefs');
var self = require('sdk/self');

var currentMod;

var stop = function () {
  if (currentMod) {
    currentMod.destroy();
  }
};

var run = function () {
  stop();
  currentMod = pageMod.PageMod({
    include: 'about:home',
    contentScript: `
      var logo = window.document.getElementById('brandLogo');
      if (${prefs.prefs.dinohome}) {
        var image = window.devicePixelRatio > 1 ?
          'url("${self.data.url('dino@2x.png')}")' :
          'url("${self.data.url('dino.png')}")';
        logo.style.backgroundImage = image;
      } else {
        logo.style.backgroundImage = none;
      }`
  });
};

var listener = function () {
  if (prefs.prefs.dinohome) {
    run();
  } else {
    stop();
  }
};

var handler = debounce(listener, 1000);

exports.load = function () {
  prefs.on('dinohome', handler);
  listener();
};

exports.unload = function () {
  stop();
  prefs.removeListener('dinohome', handler);
};
