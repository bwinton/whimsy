/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint esnext:true */

/*global addon:true, dump:true */

'use strict';

var privateBrowsing = require('sdk/private-browsing');
var tabs = require('sdk/tabs');
var ui = require('sdk/ui');

var whimsIcon = {
  '18': './whimsycorn-18.png',
  '32': './whimsycorn-32.png',
  '36': './whimsycorn-36.png',
  '48': './whimsycorn-48.png',
  '64': './whimsycorn-64.png'
};

var dimsIcon = {
  '18': './dimsycorn-18.png',
  '32': './dimsycorn-32.png',
  '36': './dimsycorn-36.png',
  '48': './dimsycorn-48.png',
  '64': './dimsycorn-64.png'
};



exports.load = function () {
  let button = ui.ActionButton({
    id: 'whimsy-button',
    label: 'Whimsy!',
    icon: whimsIcon,
    onClick: function (button) {
      var cattab = null;
      for each (var tab in tabs) {
        if (tab.url === 'http://chilloutandwatchsomecatgifs.com/') {
          cattab = tab;
          break;
        }
      }
      if (cattab) {
        cattab.activate();
      } else {
        tabs.open('http://chilloutandwatchsomecatgifs.com/');
      }
    }
  });

  // Listen for tab openings.
  tabs.on('activate', function (tab) {
    if (privateBrowsing.isPrivate(tab)) {
      button.icon = dimsIcon;
    } else {
      button.icon = whimsIcon;
    }
  });

};


exports.unload = function () {
};
