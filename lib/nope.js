/*! This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

'use strict';

var prefs = require('sdk/simple-prefs');
var protocol = require('./jetpack-protocol/index');
var self = require('sdk/self');

var nopeOverride = function nopeOverride(request, response) {
  response.contentType = 'text/html';
  response.end(`<html><head><title>Nope.</title><style>
    body {
      width: 100%;
      height: 100%;
      background-size: contain;
      background-repeat: no-repeat;
      background-image: url("${self.data.url('nopetopus.gif')}"),
        linear-gradient(0deg, #639986, #639986 60%, #4bbbbe);
     }
     </style></head><body>&nbsp</body></html>`
   );
};

var nope = protocol.about('nope', {
  onRequest: nopeOverride
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
