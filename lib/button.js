/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint esnext:true */

/*global addon:true, dump:true */

"use strict";

var ui = require('sdk/ui');

exports.load = function () {
  let button = ui.ActionButton({
    id: 'whimsy-button',
    label: 'Whimsy!',
    icon: {
      '18': './whimsycorn-18.png',
      '32': './whimsycorn-32.png',
      '36': './whimsycorn-36.png',
      '48': './whimsycorn-48.png',
      '64': './whimsycorn-64.png'
    },
    onClick: function (button) {
      console.log(button.id, button.label);
    }
  });
};

exports.unload = function () {
};
