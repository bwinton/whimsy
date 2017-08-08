'use strict';

function playSound(url) {
  if (pref) {
    //play coin/goomba stomp sound
    var audio = new Audio();
    audio.src=browser.extension.getURL(url);
    audio.autoplay=true;
    audio.load();
  }
}

browser.bookmarks.onCreated.addListener(() => playSound("audio/coin.mp3"));
browser.bookmarks.onRemoved.addListener(() => playSound("audio/goomba-stomp.wav"));

var pref = false;

browser.storage.sync.get('mario').then((result) => {
  pref = result.mario || result.mario == null;
});

browser.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.mario) {
    pref = changes.mario.newValue || changes.mario.newValue == null;
  }
});
