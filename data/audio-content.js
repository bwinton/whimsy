let kUrlAudioMap = {};

self.port.on('play-once', function(aPayload) {
  let url = aPayload.url;
  new Audio(url).play();
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
