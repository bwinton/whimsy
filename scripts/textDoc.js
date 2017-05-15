

class TextDoc {
  constructor(page){
    this.PLACEHOLDERS = {};
    this.page = page;
    this.urls = [
      'https://raw.github.com/bwinton/whimsy/gh-pages/' + this.page + '.txt',
      'https://firefox-ux.etherpad.mozilla.org/ep/pad/export/' + this.page + '/latest?format=txt'
    ];
  }
  setDefaults: function(defaults){
    this.PLACEHOLDERS = defaults;
    console.log("defaults set");
  }
  loadPlaceholders: function() {
    // var self = this;
    // var req = new XMLHttpRequest();
    // // req.addEventListener("load", {
    // //   console.log(response);
    // // });
    // req.open("GET", self.urls[0]);
    // req.send();
  }

}
