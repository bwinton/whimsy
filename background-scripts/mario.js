'use strict';

function onCreate(){
   playSound("audio/coin.mp3");
}
function onRemove(){
   playSound("audio/goomba-stomp.wav");
}

function playSound(url){
   var getting = browser.storage.sync.get('mario');
   getting.then((result)=>{
      if (result.mario){
         //play coin/goomba stomp sound
         var audio = new Audio();
         audio.src=browser.extension.getURL(url);
         audio.autoplay=true;
         audio.load();
      }
   });
}

browser.bookmarks.onCreated.addListener(onCreate);
browser.bookmarks.onRemoved.addListener(onRemove);
