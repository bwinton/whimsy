/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var clipboard = require('sdk/clipboard');
var cm = require('sdk/context-menu');
var Etherpad = require('./etherpad').Etherpad;
var etherpad = new Etherpad('thumbnail-gifs');
var prefs = require('sdk/simple-prefs');
var PrefSvc = require('sdk/preferences/service');
var privateBrowsing = require('sdk/private-browsing');
var self = require('sdk/self');
var tabs = require('sdk/tabs');

var worker = null;
var menuitem;  // Context menu item to copy thumbnail URL.
const selectors = '.newtab-cell, .spotlight-image, .tile-img-container .site-icon-background';

const PRIVATE_THUMBS = [
  'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQ87WpQQt7ddLZc9PcB_dIP23--m5UK3tJ-4-Wo-ExvzhOcFphy3g',
  'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRz7aAUMhPIKvcAiFWokRIbILbwTI3OCTGYMuefA5PciEYzsIUEnw',
  'https://ak-s.ostkcdn.com/images/products/6045215/76/0/Tungsten-Carbide-Mens-Black-Diamond-Accent-Black-Ring-P13723610.jpg',
  'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS913tBN0-2OIAHotcjx8oYsKKoWAXffmb8P9pp44UGUBr9c4oj_g',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6C5L42aH6YtUAR8syCf7eWZDIzpguMaTkVguzn4bDH1U97xeVfA',
  'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTAcsmLmu2L9KYzXGQ-4DBSS8930IriKJoxSRuGL3BmJfDH2MJ-',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPEpEv9HFMK4-vmRrWuPwmzHhKn-liHBsonJzLN0LwVzzVZnPmte5L3g',
  'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQd_g-T0FZEJbg_LgT_LcSSSqlDa9_wwwoIND-1usLtpWFjWHic',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnODRxd672VfZPfZrt6s11xbxK02lgYavkJV88CyY_xHqlaRHWJkji3A',
  'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQTswAxCw4KUoqfQd-ayxyu7udW1lSE-kwH1WsMjm42EfUDq8PEug',
  'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRe8eIYt9zREjyQesN_vU1bcbhuTEIbIXhaTq6FxotAM45jU5G1Jw',
  'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQlCQaf-K2bqFojqxSvkRlqLHdAJUMEbCyH0bN_St0vUxbbexVW',
  'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ50GKva5FC_Nso3YNxQ1YSHgGIOXc8yfQnBQMZ7S-uJ-V8Tkrl',
  'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTfgvcrXxRRk0MRhmF5VLlKM7jcGlkxbrsxnqdLPIvDAt4BBXj37A',
  'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRXU8DGYZPIQByrnccrW4kdZ9NvhoAABwqhNjZnQdRKEe3Ur8rDEA'
];

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
  'http://media.tumblr.com/tumblr_lmuonu2zHq1qzs6oc.gif',
  'http://medias.omgif.net/wp-content/uploads/2011/09/Darth-Vader-goes-to-disneyland.gif',
  'http://s3-ec.buzzfed.com/static/enhanced/web05/2011/12/7/17/anigif_enhanced-buzz-2749-1323295539-27.gif',
  'http://media.topito.com/wp-content/uploads/2013/01/code-03.gif'
]);

var addContentScript = function (tab) {
  if (tab.url === 'about:privatebrowsing') {
    tab.url = 'about:newtab';
  }
  if (tab.url === 'about:newtab'|| tab.url ===  'resource://activity-streams/data/content/activity-streams.html#/') {
    var thumbs = etherpad.getRandomItems(15);
    if (privateBrowsing.isPrivate(tab)) {
      thumbs = [
        'http://rocketdock.com/images/screenshots/the-one-ring-icon.png',
        ...etherpad.getRandomItems(15, PRIVATE_THUMBS)
      ];
    }
    worker = tab.attach({
      contentScriptFile: self.data.url('newtabicons-content.js'),
      contentScriptOptions: { 'thumbs': thumbs,
                              'showPref': prefs.prefs.newtabicons2,
                              'selectors': selectors }
    });
    worker.port.on('toggle clicked', function () {
      var pref = prefs.prefs.newtabicons2;
      pref += 1;
      pref %= 4;
      prefs.prefs.newtabicons2 = pref;
    });
    worker.port.emit('showPrefUpdated', prefs.prefs.newtabicons2);
  }
};

var tabReady = function (tab) {
  if (!tab) {
    tab = tabs.activeTab;
  }
  return addContentScript(tab);
};

var run = function () {
  if (worker) {
    return;
  }

  etherpad.loadPlaceholders();
  tabs.on('ready', tabReady);

  tabReady();
};

var addMenuItem = function () {
  if (!menuitem) {
    menuitem = cm.Item({
      label: 'Copy Thumbnail URL',
      context: [
        cm.URLContext(['resource://activity-streams/data/content/activity-streams.html#/', 'about:newtab']),
        cm.SelectorContext(selectors)
      ],
      contentScript: 'self.on("click", function(node, data) {\n' +
                     '  let thumbs = node.getElementsByClassName("newtab-thumbnail");\n' +
                     '  if (thumbs.length) {\n' +
                     '    node = thumbs[0];\n' +
                     '  }\n' +
                     '  self.postMessage("" + node.dataset.thumburl);\n' +
                     '});\n',
      onMessage: function (thumbUrl) {
        clipboard.set(thumbUrl);
      }
    });
    menuitem.image = null;
  }
};

var removeMenuItem = function () {
  if (menuitem) {
    menuitem.destroy();
    menuitem = null;
  }
};

var listener = function () {
  if (worker) {
    worker.port.emit('showPrefUpdated', prefs.prefs.newtabicons2);
  }
  if (prefs.prefs.newtabicons2 === 0 || prefs.prefs.newtabicons2 === 3) {
    removeMenuItem();
  } else {
    addMenuItem();
  }
};

exports.load = function () {
  prefs.prefs.browser_newtab_preload = PrefSvc.isSet('browser.newtab.preload');  // eslint-disable-line camelcase
  PrefSvc.set('browser.newtab.preload', false);
  prefs.on('newtabicons2', listener);
  run();
  listener('newtabicons2');
};

exports.unload = function () {
  prefs.removeListener('newtabicons2', listener);
  tabs.removeListener('ready', tabReady);
  PrefSvc.set('browser.newtab.preload', prefs.prefs.browser_newtab_preload);
};
