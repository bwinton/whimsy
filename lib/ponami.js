/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, curly:true, browser:true, es5:true, esnext:true,
  indent:2, maxerr:50, devel:true, node:true, boss:true, white:true,
  globalstrict:true, nomen:false, newcap:true*/

/*global self:true, addon:true */

"use strict";

var image = require('./ponami-image.js').image;
var prefs = require('simple-prefs');
var self = require('self');
var windowUtils = require("sdk/deprecated/window-utils");

var tracker = null;
var about = null;

var code = [
  "0:38", "0:38", "0:40", "0:40",
  "0:37", "0:39", "0:37", "0:39",
  "98:0", "97:0", "0:13"
];

var konamiState = function (window, previous, e) {
  var current = 0;
  var x = e.charCode + ":" + e.keyCode;
  if (x === code[previous]) {
    current = previous + 1;
  } else {
    if (x === code[current]) {
      current += 1;
      if (previous === 2) {
        current += 1;
      }
    }
  }

  if (current === code.length) {
    var leftBox = window.document.getElementById('leftBox');
    leftBox.style.backgroundImage = 'url(' + image + ')';
    leftBox.style.minWidth = "210px";
    leftBox.style.backgroundRepeat = "no-repeat";
    leftBox.style.backgroundPosition = "center";
    var rightBox = window.document.getElementById('rightBox');
    rightBox.style.marginLeft = "70px";
    current = 0;
  }
  return current;
};

var run = function () {
  if (tracker === null) {
    tracker = windowUtils.WindowTracker({
      onTrack: function (window) {
        var current = 0;
        if (window.location.toString() === "chrome://browser/content/aboutDialog.xul") {
          window.document.onkeypress = function (e) {
            current = konamiState(window, current, e);
          };
        }
      }
    });
  }
};

var stop = function () {
  if (tracker !== null) {
    tracker.unload();
    tracker = null;
  }
};

var listener = function (prefName) {
  if (prefs.prefs.ponami) {
    run();
  } else {
    stop();
  }
};

exports.load = function () {
  prefs.on('ponami', listener);
  listener('ponami');
};

exports.unload = function () {
  prefs.removeListener('ponami', listener);
};