/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, unused:true, curly:true, browser:true, white:true,
  moz:true, esnext:false, indent:2, maxerr:50, devel:true, node:true, boss:true,
  globalstrict:true, nomen:false, newcap:false */

/*global self:false, gAllPages:false */

"use strict";

function mouseOverListener(e) {
  e.target.style.backgroundImage = e.target.dataset.newPreview;
}

function mouseOutListener(e) {
  e.target.style.backgroundImage = e.target.dataset.oldPreview;
}

function updateThumbnails() {
  var thumbnails = window.document.getElementsByClassName('newtab-cell');
  if (thumbnails.length === 0) {
    setTimeout(updateThumbnails, 500);
    return;
  }

  var toggle = document.getElementById("newtab-toggle");
  switch (self.options.showPref) {
  case 0:
    toggle.setAttribute("title", "Show whimsical thumbnails on hover");
    break;
  case 1:
    toggle.setAttribute("title", "Always show whimsical thumbnails");
    break;
  case 2:
    toggle.setAttribute("title", "Hide the new tab page");
    break;
  case 3:
    toggle.setAttribute("title", "Show the plain new tab page");
  }

  for (let i = 0; i < thumbnails.length; ++i) {
    let thumb = thumbnails[i];
    let thumbs = thumb.getElementsByClassName('newtab-thumbnail');
    if (thumbs.length) {
      thumb = thumbs[0];
    }

    switch (self.options.showPref) {
    case 0:
      thumb.style.backgroundImage = thumb.dataset.oldPreview;
      thumb.removeEventListener("mouseover", mouseOverListener);
      thumb.removeEventListener("mouseout", mouseOutListener);
      break;
    case 1:
      thumb.style.backgroundImage = thumb.dataset.oldPreview;
      thumb.addEventListener("mouseover", mouseOverListener);
      thumb.addEventListener("mouseout", mouseOutListener);
      break;
    case 2:
      thumb.style.backgroundImage = thumb.dataset.newPreview;
      thumb.removeEventListener("mouseover", mouseOverListener);
      thumb.removeEventListener("mouseout", mouseOutListener);
      break;
    case 3:
      thumb.style.backgroundImage = thumb.dataset.oldPreview;
      thumb.removeEventListener("mouseover", mouseOverListener);
      thumb.removeEventListener("mouseout", mouseOutListener);
    }
  }

  window.addEventListener("mousemove", function (e) {
    var thumbnails = window.document.getElementsByClassName('newtab-cell');
    for (let i = 0; i < thumbnails.length; ++i) {
      let thumb = thumbnails[i];
      let top = Math.round(e.clientY * 100 / window.innerHeight);
      let left = Math.round(e.clientX * 100 / window.innerWidth);
      thumb.style.backgroundPosition = "top " + top + "% left " + left + "%";
    }
  });
}

function addThumbnails(thumbnails) {
  if (thumbnails.length === 0) {
    setTimeout(function () {
      addThumbnails(window.document.getElementsByClassName('newtab-cell'));
    }, 1000);
    return;
  }

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
    thumb.dataset.newPreview = 'url("' + self.options.thumbs[i] + '")';
    thumb.dataset.oldPreview = thumb.style.backgroundImage;
    thumb.dataset.thumburl = self.options.thumbs[i];
  }
  updateThumbnails();
}

function overrideToggle() {
  // Tell the add-on when the toggle is clicked…
  var toggle = document.getElementById("newtab-toggle");
  toggle.onclick = function () {
    self.port.emit('toggle clicked', {});
  };
  // And eventually it'll tell us what the new value of the pref is…
  self.port.on('showPrefUpdated', function (e) {
    self.options.showPref = e;
    gAllPages.enabled = self.options.showPref !== 3;
    updateThumbnails();
  });
}

addThumbnails(window.document.getElementsByClassName('newtab-cell'));
overrideToggle();