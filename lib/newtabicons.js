/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, curly:true, browser:true, es5:true, esnext:true,
  indent:2, maxerr:50, devel:true, node:true, boss:true, white:true,
  globalstrict:true, nomen:false, newcap:true*/

/*global self:true, addon:true */

"use strict";

var clipboard = require('sdk/clipboard');
var cm = require('sdk/context-menu');
var Etherpad = require('./etherpad').Etherpad;
var etherpad = new Etherpad('thumbnail-gifs');
var prefs = require('sdk/simple-prefs');
var privateBrowsing = require('sdk/private-browsing');
var Request = require('sdk/request').Request;
var self = require('sdk/self');
var tabs = require('sdk/tabs');
var winutils = require('sdk/window/utils');

var running = false;
var menuitem;  // Context menu item to copy thumbnail URL.

etherpad.setDefaults([
  'http://25.media.tumblr.com/tumblr_ma7rqzY6zQ1qis5xyo1_400.gif'
]);

var tabOpen = function (tab) {
  if (!tab) {
    tab = tabs.activeTab;
  }
  tab.on('ready', function (tab) {
    if (tab.url === 'about:privatebrowsing') {
      tab.url = 'about:newtab';
    }
    if (tab.url === 'about:newtab') {
      var thumbs = etherpad.getRandomItems(9);
      if (privateBrowsing.isPrivate(tab)) {
        thumbs = [
          "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRz7aAUMhPIKvcAiFWokRIbILbwTI3OCTGYMuefA5PciEYzsIUEnw",
          "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS913tBN0-2OIAHotcjx8oYsKKoWAXffmb8P9pp44UGUBr9c4oj_g",
          "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTAcsmLmu2L9KYzXGQ-4DBSS8930IriKJoxSRuGL3BmJfDH2MJ-",
          "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQd_g-T0FZEJbg_LgT_LcSSSqlDa9_wwwoIND-1usLtpWFjWHic",
          "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQTswAxCw4KUoqfQd-ayxyu7udW1lSE-kwH1WsMjm42EfUDq8PEug",
          "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQlCQaf-K2bqFojqxSvkRlqLHdAJUMEbCyH0bN_St0vUxbbexVW",
          "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ50GKva5FC_Nso3YNxQ1YSHgGIOXc8yfQnBQMZ7S-uJ-V8Tkrl",
          "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRXU8DGYZPIQByrnccrW4kdZ9NvhoAABwqhNjZnQdRKEe3Ur8rDEA",
          "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRBJvyZNEqevDPgBgPaqNutEXqXzrVNFNh16Ut5ONpPqfCDNUqftA",
        ];
      }
      tab.attach({
        contentScriptFile: self.data.url("newtabicons-content.js"),
        contentScriptOptions: { "thumbs" : thumbs,
                                "showAlways" : prefs.prefs.newtabicons2 === 2 }
      });
    }
  });
};

var run = function () {
  if (running) {
    return;
  }
  running = true;

  var window = winutils.getMostRecentBrowserWindow();
  etherpad.loadPlaceholders();
  tabs.on('open', tabOpen);
  tabOpen();

  menuitem = cm.Item({
    label: 'Copy Thumbnail URL',
    context: [
      cm.URLContext('about:newtab'),
      cm.SelectorContext('.newtab-thumbnail')
    ],
    contentScript: 'self.on("click", function(node, data) {' +
                   '  self.postMessage(node.getAttribute("data-thumburl"));' +
                   '});',
    onMessage: function (thumbUrl) {
      clipboard.set(thumbUrl);
    }
  });
  menuitem.image = null;
};

var stop = function () {
  if (!running) {
    return;
  }
  running = false;

  tabs.removeListener('open', tabOpen);
  var window = winutils.getMostRecentBrowserWindow();

  if (menuitem) {
    menuitem.destroy();
    menuitem = null;
  }
};

var listener = function (prefName) {
  if (prefs.prefs.newtabicons2) {
    run();
  } else {
    stop();
  }
};

exports.load = function () {
  prefs.on('newtabicons2', listener);
  listener('newtabicons2');
};

exports.unload = function () {
  prefs.removeListener('newtabicons2', listener);
};
