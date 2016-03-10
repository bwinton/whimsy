/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var image = require('./ponami-image').image;
var prefs = require('sdk/simple-prefs');
let self = require('sdk/self');
var windowUtils = require('sdk/deprecated/window-utils');

var tracker = null;

var code = [
  '0:38', '0:38', '0:40', '0:40',
  '0:37', '0:39', '0:37', '0:39',
  '98:0', '97:0'
];

var konamiState = function (window, previous, e) {
  var current = 0;
  var x = e.charCode + ':' + e.keyCode;
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
    leftBox.style.minWidth = '210px';
    leftBox.style.backgroundRepeat = 'no-repeat';
    leftBox.style.backgroundPosition = 'center';
    var rightBox = window.document.getElementById('rightBox');
    rightBox.style.marginLeft = '70px';
    current = 0;
  }
  return current;
};

var run = function () {
  if (tracker === null) {
    tracker = windowUtils.WindowTracker({
      onTrack: function (window) {
        var current = 0;
        if (window.location.toString() === 'chrome://browser/content/aboutDialog.xul') {
          window.document.onkeypress = function (e) {
            current = konamiState(window, current, e);
          };
        } else if (window.location.toString() === 'chrome://mozapps/content/update/updates.xul') {
          let content = window.document.querySelector('#finishedBackground > .update-content > spacer');
          content.style.backgroundImage = `url(${self.data.url('Whimsycorn.svg')})`;
          content.style.minWidth = '210px';
          content.style.backgroundRepeat = 'no-repeat';
          content.style.backgroundPosition = 'center';
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

var listener = function () {
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
