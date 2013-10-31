/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, unused:true, curly:true, browser:true, white:true,
  moz:true, esnext:false, indent:2, maxerr:50, devel:true, node:true, boss:true,
  globalstrict:true, nomen:false, newcap:false */

"use strict";

var timeout = require('sdk/timers').setTimeout;

/* Original version from https://github.com/rhysbrettbowen/debounce */
exports.debounce = function (func, wait) {
  // we need to save these in the closure
  var timer, args, context, timestamp;

  return function () {

    // save details of latest call
    context = this;
    args = [].slice.call(arguments, 0);
    timestamp = new Date();

    // this is where the magic happens
    var later = function () {

      // how long ago was the last call
      var last = (new Date()) - timestamp;

      // if the latest call was less that the wait period ago
      // then we reset the timer to wait for the difference
      if (last < wait) {
        timer = timeout(later, wait - last);

      // or if not we can null out the timer and run the latest
      } else {
        timer = null;
        func.apply(context, args);
      }
    };

    // we only need to set the timer now if one isn't already running
    if (!timer) {
      timer = timeout(later, wait);
    }
  };
};