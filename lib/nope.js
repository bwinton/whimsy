/*! This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
 
/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
strict:true, undef:true, unused:true, curly:true, browser:true, white:true,
moz:true, esnext:false, indent:2, maxerr:50, devel:true, node:true, boss:true,
globalstrict:true, nomen:false, newcap:false */
 
"use strict";

var prefs = require('sdk/simple-prefs');
var protocol = require('./jetpack-protocol/index');
var self = require('sdk/self');

var nope_override = function nope_override(request, response) {
  response.contentType = 'text/html';
  response.end('<html><head><title>Nope.</title><style>' +
    'body {' +
    'width: 100%;' +
    'height: 100%;' +
    'background-size: contain;' +
    'background-repeat: no-repeat;' +
    'background-image: url("' + self.data.url('nopetopus.gif') + '"),' +
    ' linear-gradient(0deg, #639986, #639986 60%, #4bbbbe);' +
    '}</style></head><body>&nbsp</body></html>');
};

var nope = protocol.about('nope', {
  onRequest: nope_override
});


var run = function () {
  nope.register();
};

var stop = function () {
  nope.unregister();
};

var listener = function () {
  if (prefs.prefs.nope) {
    run();
  } else {
    stop();
  }
};

exports.load = function () {
  prefs.on('nope', listener);
  listener('nope');
};

exports.unload = function () {
  prefs.removeListener('nope', listener);
};
