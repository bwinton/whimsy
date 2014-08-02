/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, unused:true, curly:true, browser:true, white:true,
  moz:true, esnext:false, indent:2, maxerr:50, devel:true, node:true, boss:true,
  globalstrict:true, nomen:false, newcap:false */

let kUrlAudioMap = {};

self.port.on('play-once', function(aPayload) {
  let url = aPayload.url;
  let audio = new Audio(url);
  audio.addEventListener('ended', function onAudioEnded(aEvent) {
    audio.removeEventListener('ended', onAudioEnded);
    audio = null;
  });
  audio.play();
});

self.port.on('play-loop', function(aPayload) {
  let url = aPayload.url;
  let audio = new Audio(url);
  audio.loop = true;
  audio.play();
  kUrlAudioMap[url] = audio;
});

self.port.on('play-loop-stop', function(aPayload) {
  let url = aPayload.url;
  let audio = kUrlAudioMap[url];
  if (audio) {
    audio.pause();
    delete kUrlAudioMap[url];
  }
});

self.port.emit('loaded');
