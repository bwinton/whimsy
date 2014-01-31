/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, unused:true, curly:true, browser:true, white:true,
  moz:true, esnext:false, indent:2, maxerr:50, devel:true, node:true, boss:true,
  globalstrict:true, nomen:false, newcap:false */

"use strict";

// var debounce = require('./debounce').debounce;
// var micropilot = require('./micropilot');
// var prefs = require('sdk/simple-prefs');

var button = require('./button');
var clearSearch = require('./clear-search');
var newtabicons = require('./newtabicons');
var nope = require('./nope');
var ponami = require('./ponami');
var throbber = require('./throbber');
var urlbar = require('./urlbar');
var hamburger = require('./hamburger');


// const STUDY_ID = 'whimsy';
// const UPLOAD_URL = 'https://whimsy.paas.allizom.org/data/' + STUDY_ID;

// var study = micropilot.Micropilot(STUDY_ID);


// var registerListener = debounce(function () {
//   study.record({
//     id: 'registration_attempted',
//     ts: Date.now(),
//     urlbar: prefs.prefs.urlbar,
//     ponami: prefs.prefs.ponami,
//     hamburglar: prefs.prefs.hamburglar,
//     newtabicons: prefs.prefs.newtabicons2,
//     searchbar: prefs.prefs.searchbar,
//     register: prefs.prefs.register2
//   });
//   study.ezupload({
//     url: UPLOAD_URL //, simulate: true
//   });
// }, 1000);

exports.main = function () {
  // study.start();

  button.load();
  clearSearch.load();
  newtabicons.load();
  nope.load();
  ponami.load();
  throbber.load();
  urlbar.load();
  hamburger.load();

  // POST to https://???/  (Dependant on ops)
    // Possibly deploy it in paas?
  // JSON data
  // Registration text, into fileappender.
  // dot-delimited counter name, into statsd.
    // Something like "whimsy.<uid>".
    // Counters for the same key may get rolled up.

  // prefs.on('register2', registerListener);
  // registerListener();
};

exports.onUnload = function () {
  // prefs.removeListener('register2', registerListener);

  button.unload();
  clearSearch.unload();
  newtabicons.unload();
  nope.unload();
  ponami.unload();
  throbber.unload();
  urlbar.unload();
  hamburger.unload();

  // study.ezupload({
  //   url: UPLOAD_URL //, simulate: true
  // });
};