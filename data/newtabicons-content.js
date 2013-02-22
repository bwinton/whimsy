/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, curly:true, browser:true, es5:true, esnext:true,
  indent:2, maxerr:50, devel:true, node:true, boss:true, white:true,
  globalstrict:true, nomen:false, newcap:true*/

/*global self:true, addon:true, dump:true */

"use strict";

var thumbnails = window.document.getElementsByClassName('newtab-thumbnail');
dump("\n\nBW: Got " + thumbnails.length + " thumbnails!\n");

for (var i = 0; i < thumbnails.length; ++i) {
  var thumbnail = thumbnails[i];
  dump(self.options[i] + "\n");
  thumbnail.style.backgroundImage = 'url("' + self.options[i] + '")';
}
