/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, curly:true, browser:true, es5:true, esnext:true,
  indent:2, maxerr:50, devel:true, node:true, boss:true, white:true,
  globalstrict:true, nomen:false, newcap:true*/

/*global self:true, addon:true, dump:true */

"use strict";

let thumbnails = window.document.getElementsByClassName('newtab-cell');

for (let i = 0; i < thumbnails.length; ++i) {
  let thumb = thumbnails[i];
  let thumbs = thumb.getElementsByClassName('newtab-thumbnail');
  if (thumbs.length) {
    thumb = thumbs[0];
  } else {
    thumb.style.backgroundSize = "cover";
    thumb.style.backgroundRepeat = "no-repeat";
    thumb.style.backgroundClip = "paddingBox";
  }
  let newPreview = 'url("' + self.options.thumbs[i] + '")';
  let oldPreview = thumb.style.backgroundImage;

  thumb.setAttribute('data-thumburl', self.options.thumbs[i]);
  if (self.options.showAlways) {
    thumb.style.backgroundImage = newPreview;
  } else {
    thumb.addEventListener("mouseover", function(el, image) {
      return function() {
        el.style.backgroundImage = image;
      }
    }(thumb, newPreview));

    thumb.addEventListener("mouseout", function(el, image) {
      return function() {
        el.style.backgroundImage = image;
      }
    }(thumb, oldPreview));
  }
}
