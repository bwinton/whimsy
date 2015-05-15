/*! This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
strict:true, undef:true, unused:true, curly:true, browser:true, white:true,
moz:true, esnext:false, indent:2, maxerr:50, devel:true, node:true, boss:true,
globalstrict:true, nomen:false, newcap:false */

/*global d3:false, $:false */

'use strict';

(function () {
  d3.csvPromise = function (url) {
    var promise = $.Deferred();
    d3.csv(url).get(function (error, rows) {
      if (rows) {
        promise.resolve(rows);
      } else {
        promise.reject(error);
      }
    });
    return promise;
  };

  d3.jsonPromise = function (url, github) {
    var promise = $.Deferred();
    var json = d3.json(url);
    if (github) {
      json.header('Accept', 'application/vnd.github.3.raw')
    }
    json.get(function (error, data) {
      if (data) {
        promise.resolve(data);
      } else {
        promise.reject(error);
      }
    });
    return promise;
  };

  d3.htmlPromise = function (url) {
    var promise = $.Deferred();
    d3.html(url).get(function (error, data) {
      if (data) {
        promise.resolve(data);
      } else {
        promise.reject(error);
      }
    });
    return promise;
  };
})();