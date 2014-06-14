/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint esnext:true */

/*global self:true, addon:true, dump:true */

"use strict";

let prefs = require('sdk/simple-prefs');
let self = require('sdk/self');
const { Cc, Cu, Cr, Ci } = require('chrome');

const INVINCIBLE_PREF = 'invincible';
const INVINCIBLE_URL = self.data.url('invincible.mp3');
const PAINT_FLASHING_PREF = "nglayout.debug.paint_flashing";

Cu.import("resource://gre/modules/Services.jsm");

// Hack alert - in order to play audio, we need to use the
// Audio API that's available in content scripts. The problem
// is that the invincible.mp3 file is a resource:// url which
// about:blank is not privledged enough to access. about:about,
// however, is privledged, _and_ can run audio. I felt this was
// better than piping over a data URI.
let pageWorker = require('sdk/page-worker').Page({
  contentScriptFile: self.data.url('audio-content.js'),
  contentURL: 'about:about'
});

var ready = false;

pageWorker.port.on("loaded", function() {
  ready = true;
});

let observer = {
  observe: function(aSubject, aTopic, aData) {
    if (aTopic == "nsPref:changed" &&
        aData == PAINT_FLASHING_PREF) {
      if (Services.prefs.getBoolPref(PAINT_FLASHING_PREF)) {
        this.startAudio();
      } else {
        this.stopAudio();
      }
    }
  },

  startAudio: function() {
    pageWorker.port.emit("play-loop", {
      url: INVINCIBLE_URL
    });
  },

  stopAudio: function() {
    pageWorker.port.emit("play-loop-stop", {
      url: INVINCIBLE_URL
    });
  }
};

var run = function () {
  Services.prefs.addObserver(PAINT_FLASHING_PREF, observer, false);
};

var stop = function () {
  observer.stopAudio();
  Services.prefs.removeObserver(PAINT_FLASHING_PREF, observer, false);
};

let listener = function (prefName) {
  if (prefs.prefs.invincible) {
    run();
  } else {
    stop();
  }
};

exports.load = function () {
  prefs.on(INVINCIBLE_PREF, listener);
  listener();
};

exports.unload = function () {
  prefs.removeListener(INVINCIBLE_PREF, listener);
};
