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

var button;
var clearSearch;
var newtabicons;
var nope;
var ponami;
var throbber;
var urlbar;
var hamburger;

try {
  button = require('./button');
} catch (e) {
  console.log('Could not require button.');
}
try {
  clearSearch = require('./clear-search');
} catch (e) {
  console.log('Could not require clearSearch.');
}
try {
  newtabicons = require('./newtabicons');
} catch (e) {
  console.log('Could not require newtabicons.');
}
try {
  nope = require('./nope');
} catch (e) {
  console.log('Could not require nope.');
}
try {
  ponami = require('./ponami');
} catch (e) {
  console.log('Could not require ponami.');
}
try {
  throbber = require('./throbber');
} catch (e) {
  console.log('Could not require throbber.');
}
try {
  urlbar = require('./urlbar');
} catch (e) {
  console.log('Could not require urlbar.');
}
try {
  hamburger = require('./hamburger');
} catch (e) {
  console.log('Could not require hamburger.');
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

  try {
    button.load();
  } catch(e) {
    console.log('button failed to load.');
  }
  try {
    clearSearch.load();
  } catch(e) {
    console.log('clearSearch failed to load.');
  }
  try {
    newtabicons.load();
  } catch(e) {
    console.log('newtabicons failed to load.');
  }
  try {
    nope.load();
  } catch(e) {
    console.log('nope failed to load.');
  }
  try {
    ponami.load();
  } catch(e) {
    console.log('ponami failed to load.');
  }
  try {
    throbber.load();
  } catch(e) {
    console.log('throbber failed to load.');
  }
  try {
    urlbar.load();
  } catch(e) {
    console.log('urlbar failed to load.');
  }
  try {
    hamburger.load();
  } catch(e) {
    console.log('hamburger failed to load.');
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

  try {
    button.unload();
  } catch (e) {
    console.log('button failed to unload.');
  }
  try {
    clearSearch.unload();
  } catch (e) {
    console.log('clearSearch failed to unload.');
  }
  try {
    newtabicons.unload();
  } catch (e) {
    console.log('newtabicons failed to unload.');
  }
  try {
    nope.unload();
  } catch (e) {
    console.log('nope failed to unload.');
  }
  try {
    ponami.unload();
  } catch (e) {
    console.log('ponami failed to unload.');
  }
  try {
    throbber.unload();
  } catch (e) {
    console.log('throbber failed to unload.');
  }
  try {
    urlbar.unload();
  } catch (e) {
    console.log('urlbar failed to unload.');
  }
  try {
    hamburger.unload();
  } catch (e) {
    console.log('hamburger failed to unload.');
  }

  // study.ezupload({
  //   url: UPLOAD_URL //, simulate: true
  // });
};