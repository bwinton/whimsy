/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*eslint-env browser */

let kUrlAudioMap = {};

self.port.on('play-once', function(aPayload) {
  let url = aPayload.url;
  let audio = new Audio(url);
  audio.addEventListener('ended', function onAudioEnded() {
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
