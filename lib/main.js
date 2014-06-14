/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, unused:true, curly:true, browser:true, white:true,
  moz:true, esnext:false, indent:2, maxerr:50, devel:true, node:true, boss:true,
  globalstrict:true, nomen:false, newcap:false */

'use strict';

// var debounce = require('./debounce').debounce;
// var micropilot = require('./micropilot');
// var prefs = require('sdk/simple-prefs');


var app = require('sdk/system/xul-app');
var features = {};
var featureNames = {};

if (app.is('Firefox')) {
  featureNames = {
    'button': true,
    'clear-search': true,
    'newtabicons': true,
    'nope': true,
    'ponami': true,
    'throbber': true,
    'urlbar': true,
    'hamburger': true,
    'coin': true,
  };

  // Yeah, so this needs to be here because the add-on sdk resolves
  // requirements when the add-on is packaged, not at run-time.  :P
  let grantAuthority = function() {
    require('./button');
    require('./clear-search');
    require('./newtabicons');
    require('./nope');
    require('./ponami');
    require('./throbber');
    require('./urlbar');
    require('./hamburger');
    require('./coin');
  }
} else if (app.is('Fennec')) {
  featureNames = {
    'nope': true,
    'panelicons': true
  };

  let grantAuthority = function() {
    require('./nope');
    require('./panelicons');
  }
}

for (let name in featureNames) {
  try {
    features[name] = require('./' + name);
  } catch (e) {
    console.log('Could not require ./' + name + '.');
    // console.exception(e)
  }
}

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

  for (let name in features) {
    try {
      features[name].load();
    } catch(e) {
      console.log(name + ' failed to load.');
      // console.exception(e);
    }
  }

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

  for (let name in features) {
    try {
      features[name].unload();
    } catch (e) {
      console.log(name + ' failed to unload.');
      // console.exception(e);
    }
  }

  // study.ezupload({
  //   url: UPLOAD_URL //, simulate: true
  // });
};
