self.port.on('play-once', function(aPayload) {
  let url = aPayload.url;
  let audio = new Audio(url);
  audio.addEventListener("ended", function onAudioEnded(aEvent) {
    audio.removeEventListener("ended", onAudioEnded);
    audio = null;
  });
  audio.play();
});

self.port.emit('loaded');
