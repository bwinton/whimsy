/*! This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:false,
strict:true, undef:true, unused:true, curly:true, browser:true, white:true,
moz:true, esnext:false, indent:2, maxerr:50, devel:true, node:true, boss:true,
globalstrict:true, nomen:false, newcap:false */

'use strict';

var debounce = require('debounce').debounce;
var pageMod = require('sdk/page-mod');
var prefs = require('sdk/simple-prefs');

var tabActivate = function (tab) {
  var window = winutils.getMostRecentBrowserWindow();
  var placeholder = tab.placeholder;
  if (!placeholder) {
    placeholder = etherpad.getItem(tab.id);
  }
  window.gURLBar.placeholder = placeholder;
};

var currentMod;

var run = function () {
  var include = prefs.prefs.notify;
  try {
    include = JSON.parse(include);
  } catch (e) {}
  stop();
  currentMod = pageMod.PageMod({
    include: include,
    contentScript: 'window.postMessage("whimsy:enabled", "*")'
  });
};

var stop = function () {
  if (currentMod) {
    currentMod.destroy();
  }
};

var listener = function () {
  if (prefs.prefs.notify) {
    run();
  } else {
    stop();
  }
}
var handler = debounce(listener, 1000);

exports.load = function () {
  prefs.on('notify', handler);
  listener();
};

exports.unload = function () {
  stop();
  prefs.removeListener('notify', handler);
};