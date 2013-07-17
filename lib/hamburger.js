/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint esnext:true */

/*global self:true, addon:true, dump:true */

"use strict";

var chrome = require('chrome');
var when = require('sdk/system/unload').when
var prefs = require('sdk/simple-prefs');
var windowUtils = require("sdk/deprecated/window-utils");
var self = require("sdk/self");

var HAMBURGER_PREF = "hamburglar";
var HAMBURGER_CSS = self.data.url("hamburger.css");

var loaded = false;

function newURI(uriStr, base) {
	var ios = chrome.Cc['@mozilla.org/network/io-service;1']
                	.getService(chrome.Ci.nsIIOService);
  try {
    var baseURI = base ? ios.newURI(base, null, null) : null;
    return ios.newURI(uriStr, null, baseURI);
  }
  catch (e) {
    if (e.result === chrome.Cr.NS_ERROR_MALFORMED_URI) {
      throw new Error("malformed URI: " + uriStr);
    } else if (e.result === chrome.Cr.NS_ERROR_FAILURE ||
               e.result === chrome.Cr.NS_ERROR_ILLEGAL_VALUE) {
      throw new Error("invalid URI: " + uriStr);
    }
  }
  return null;
}

function addXULStylesheet(url) {
  var uri = newURI(url);
  var sss = chrome.Cc["@mozilla.org/content/style-sheet-service;1"]
                  .getService(chrome.Ci.nsIStyleSheetService);
  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
  loaded = true;
  // auto unload just in case
  when(function () {
  	removeXULStylesheet(url);
  });
}

function removeXULStylesheet(url) {
  var uri = newURI(url);
  var sss = chrome.Cc["@mozilla.org/content/style-sheet-service;1"]
                  .getService(chrome.Ci.nsIStyleSheetService);
  if (sss.sheetRegistered(uri, sss.AGENT_SHEET)) {
  	sss.unregisterSheet(uri, sss.AGENT_SHEET);
    loaded = false;
  }
};

var run = function () {
  if (!loaded) {
  	addXULStylesheet(HAMBURGER_CSS);
  }
};

var stop = function () {
  if (loaded) {
  	removeXULStylesheet(HAMBURGER_CSS);
  }
};

var listener = function (prefName) {
  if (prefs.prefs.hamburglar) {
    run();
  } else {
    stop();
  }
};

exports.load = function () {
  prefs.on(HAMBURGER_PREF, listener);
  listener(HAMBURGER_PREF);
};

exports.unload = function () {
  prefs.removeListener(HAMBURGER_PREF, listener);
};
