/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, curly:true, browser:true, es5:true, esnext:true,
  indent:2, maxerr:50, devel:true, node:true, boss:true, white:true,
  globalstrict:true, nomen:false, newcap:true*/

/*global self:true, addon:true, dump:true */

"use strict";

var Etherpad = require('./etherpad').Etherpad;
var etherpad = new Etherpad('thumbnail-gifs');
var pageMod = require('sdk/page-mod');
var prefs = require('simple-prefs');
var Request = require('sdk/request').Request;
var tabs = require('tabs');
var winutils = require('window/utils');

var mod = null;

etherpad.setDefaults([
  'http://25.media.tumblr.com/tumblr_ma7rqzY6zQ1qis5xyo1_400.gif'
]);

var tabActivate = function (tab) {
  var window = winutils.getMostRecentBrowserWindow();
};

var run = function () {
  etherpad.loadPlaceholders();
  if (!mod) {
    mod = pageMod.PageMod({
      include: 'about:newtab',
      contentScript: 'document.body.innerHTML = ' +
                     ' "<h1>Page matches ruleset</h1>";'
      // contentStyle: '.newtab-thumbnail { border: 3px solid red; }'
    });
  }
};

var stop = function () {
  if (mod) {
    mod.destroy();
    mod = null;
  }
};

var listener = function (prefName) {
  if (prefs.prefs.newtabicons) {
    run();
  } else {
    stop();
  }
};

exports.load = function () {
  prefs.on('newtabicons', listener);
  listener('newtabicons');
};

exports.unload = function () {
  prefs.removeListener('newtabicons', listener);
};