/*! This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:false,
strict:true, undef:true, unused:true, curly:true, browser:true, white:true,
moz:true, esnext:false, indent:2, maxerr:50, devel:true, node:true, boss:true,
globalstrict:true, nomen:false, newcap:false */

"use strict";

const { Class } = require('sdk/core/heritage');
var Request = require('sdk/request').Request;
var timers = require('sdk/timers');

const Etherpad = Class({
  initialize: function initialize(page) {
    this.PLACEHOLDERS = {};
    this.page = page;
    this.urls = [
      'https://raw.github.com/bwinton/whimsy/gh-pages/' + this.page + '.txt',
      'https://firefox-ux.etherpad.mozilla.org/ep/pad/export/' + this.page + '/latest?format=txt'
    ];
  },

  setDefaults: function (defaults) {
    this.PLACEHOLDERS = defaults;
  },

  loadPlaceholders: function () {
    var self = this;
    console.log("BW: Loading data for " + self.urls[0]);
    new Request({
      url: self.urls[0],
      onComplete: function (response) {
        if (response.text.length < 100 || response.status < 200 || response.status >= 300) {
          if (self.urls.length > 1) {
            console.log("BW: " + self.urls[0] + " failed.  Popping.");
            self.urls.shift();
            timers.setTimeout(self.loadPlaceholders.bind(self), 1);
          } else {
            console.log("BW: " + self.urls[0] + " failed.  Nothing left to pop.");
          }
          return;
        }
        var result = response.text.split('\n');
        result = result.map(function (x) {
          return x.trim();
        }).filter(function (x) {
          return !x.startsWith('#') && (x !== '');
        });
        self.PLACEHOLDERS = result;
      }
    }).get();
    timers.setTimeout(self.loadPlaceholders.bind(self), 4 * 60 * 60 * 1000);
  },

  hashCode: function (input) {
    var hash = 0;
    if (input.length === 0) {
      return hash;
    }
    for (let i = 0; i < input.length; i++) {
      let char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  },

  getItem: function (id, values) {
    if (typeof(id) === "string") {
      id = this.hashCode(id);
    }
    if (!values) {
      values = this.PLACEHOLDERS;
    }
    id %= values.length;
    id += values.length;
    id %= values.length;
    return values[id];
  },

  getRandomItem: function () {
    var id = Math.floor(Math.random() * this.PLACEHOLDERS.length);
    return this.getItem(id);
  },

  getRandomItems: function (n) {
    var rv = [];
    var values = this.PLACEHOLDERS.slice(0);

    for (var i = 0; i < n; ++i) {
      var id = Math.floor(Math.random() * values.length);
      var item = this.getItem(id, values);
      values.splice(id, 1);
      rv.push(item);
    }
    return rv;
  }

});
exports.Etherpad = Etherpad;