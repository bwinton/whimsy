self.port.on('play-once', function(aPayload) {
  let url = aPayload.url;
  new Audio(url).play();
});

self.port.emit('loaded');
