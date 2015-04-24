/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var chrome = require('chrome');
chrome.Cu.import('resource://gre/modules/Home.jsm');
chrome.Cu.import('resource://gre/modules/HomeProvider.jsm');
chrome.Cu.import('resource://gre/modules/Task.jsm');

var Etherpad = require('./etherpad').Etherpad;
var etherpad = new Etherpad('thumbnail-gifs');

const PANEL_ID = 'whimsy.gifs.panel@mozilla.org';
const DATASET_ID = 'whimsy.gifs.dataset@mozilla.org';

etherpad.setDefaults([
  'http://25.media.tumblr.com/tumblr_ma7rqzY6zQ1qis5xyo1_400.gif',
  'https://lh3.googleusercontent.com/-OUw4Q9scVeA/T88ag2ms7nI/AAAAAAAAGYk/k61JJgULnL0/s320/90.gif',
  'https://lh4.googleusercontent.com/-CRSjITDmb4I/USZTvuI_07I/AAAAAAAAIlU/CLKU1HbMC3c/w497-h373/dsf43.gif',
  'http://i.imgur.com/7Bo2HBb.gif',
  'https://gs1.wac.edgecastcdn.net/8019B6/data.tumblr.com/5dd5ebbd60379914270b43e5e9644465/tumblr_mkme23FRxa1qb5gkjo1_400.gif',
  'http://i.imgur.com/VPFVw.gif',
  'http://i.imgur.com/6xaYo.gif',
  'http://i.imgur.com/N0Qe0.gif',
  'http://i.imgur.com/2hyBM.gif',
  'http://i.imgur.com/yjfDD.gif',
  'http://25.media.tumblr.com/tumblr_lwlcls5ra01qzrlhgo1_r1_500.gif',
  'http://media.tumblr.com/tumblr_lmuonu2zHq1qzs6oc.gif'
]);

function optionsCallback() {
  return {
    title: 'Whimsy!',
    views: [{
      type: Home.panels.View.GRID,
      itemType: Home.panels.Item.IMAGE,
      dataset: DATASET_ID
    }]
  };
}

function thumbsToItems(thumbs) {
  var rv = [];

  for (let i = 0; i < thumbs.length; i++) {
    let thumb = thumbs[i];
    let item = {
      'url': thumb,
      'title': '',
      'description': '',
      'image_url': thumb
    };
    rv.push(item);
  }

  return rv;
}

function refreshDataset() {
  var items = etherpad.getRandomItems(9);
  items = thumbsToItems(items);
  Task.spawn(function () {
    let storage = HomeProvider.getStorage(DATASET_ID);
    yield storage.deleteAll();
  }).then(Task.spawn(function () {
    let storage = HomeProvider.getStorage(DATASET_ID);
    yield storage.save(items);
  })).then(null, e => Cu.reportError('Error saving data to HomeProvider: ' + e));
}

function deleteDataset() {
  Task.spawn(function() {
    let storage = HomeProvider.getStorage(DATASET_ID);
    yield storage.deleteAll();
  }).then(null, e => Cu.reportError('Error deleting data from HomeProvider: ' + e));
}

exports.load = function () {
  etherpad.loadPlaceholders();
  Home.panels.register(PANEL_ID, optionsCallback);
  Home.panels.install(PANEL_ID);
  HomeProvider.requestSync(DATASET_ID, refreshDataset);

  // Update data once every hour.
  HomeProvider.addPeriodicSync(DATASET_ID, 3600, refreshDataset);
};

exports.unload = function () {
  Home.panels.uninstall(PANEL_ID);
  HomeProvider.removePeriodicSync(DATASET_ID);
  deleteDataset();
  Home.panels.unregister(PANEL_ID);
};
