/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, curly:true, browser:true, es5:true, esnext:true,
  indent:2, maxerr:50, devel:true, node:true, boss:true, white:true,
  globalstrict:true, nomen:false, newcap:true*/

/*global self:true, addon:true, dump:true */

"use strict";

const { Class } = require('sdk/core/heritage');
var Request = require('sdk/request').Request;
var setTimeout = require('sdk/timers').setTimeout;

const Etherpad = Class({
  initialize: function initialize(page) {
    this.PLACEHOLDERS = {};
    this.page = page;
  },

  setDefaults: function (defaults) {
    this.PLACEHOLDERS = defaults;
  },

  loadPlaceholders: function () {
    var self = this;
    console.log("BW: Loading data for " + self.page);
    var etherpadRequest = new Request({
      url: 'https://firefox-ux.etherpad.mozilla.org/ep/pad/export/' + this.page + '/latest?format=txt',
      onComplete: function (response) {

        if (response.status !== 200) {
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
    setTimeout(self.loadPlaceholders.bind(self), 4*60*60*1000);
  },

  getItem: function (id, values) {
    if (!values) {
      values = this.PLACEHOLDERS;
    }
    return values[id % values.length];
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