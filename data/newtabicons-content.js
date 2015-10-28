/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* eslint-env browser */
/* globals gAllPages:false */

'use strict';

function mouseOverListener(e) {
  let thumb = e.target.previousElementSibling;
  thumb.style.backgroundImage = thumb.dataset.newPreview;
}

function mouseOutListener(e) {
  let thumb = e.target.previousElementSibling;
  thumb.style.backgroundImage = thumb.dataset.oldPreview;
}

function updateThumbnails() {
  var thumbnails = window.document.getElementsByClassName('newtab-cell');
  if (thumbnails.length === 0) {
    setTimeout(updateThumbnails, 500);
    return;
  }

  var toggle = document.getElementById('newtab-toggle');
  if (toggle) {
    switch (self.options.showPref) {
    case 0:
      toggle.setAttribute('title', 'Show whimsical thumbnails on hover');
      break;
    case 1:
      toggle.setAttribute('title', 'Always show whimsical thumbnails');
      break;
    case 2:
      toggle.setAttribute('title', 'Hide the new tab page');
      break;
    case 3:
      toggle.setAttribute('title', 'Show the plain new tab page');
    }
  }

  for (let i = 0; i < thumbnails.length; ++i) {
    let thumb = thumbnails[i];
    let thumbs = thumb.getElementsByClassName('newtab-thumbnail');
    if (!thumbs.length) {
      thumbs = [thumb];
    }

    for (let i = 0; i < thumbs.length; i++) {
      let thumb = thumbs[i];
      switch (self.options.showPref) {
      case 0:
        thumb.style.backgroundImage = thumb.dataset.oldPreview;
        thumb.removeEventListener('mouseover', mouseOverListener);
        thumb.removeEventListener('mouseout', mouseOutListener);
        break;
      case 1:
        thumb.style.backgroundImage = thumb.dataset.oldPreview;
        thumb.addEventListener('mouseover', mouseOverListener);
        thumb.addEventListener('mouseout', mouseOutListener);
        break;
      case 2:
        thumb.style.backgroundImage = thumb.dataset.newPreview;
        thumb.removeEventListener('mouseover', mouseOverListener);
        thumb.removeEventListener('mouseout', mouseOutListener);
        break;
      case 3:
        thumb.style.backgroundImage = thumb.dataset.oldPreview;
        thumb.removeEventListener('mouseover', mouseOverListener);
        thumb.removeEventListener('mouseout', mouseOutListener);
      }
    }
  }
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
    if (!thumbs.length) {
      thumbs = [thumb];
    }
    for (let j = 0; j < thumbs.length; j++) {
      let thumb = thumbs[j];
      thumb.style.backgroundSize = 'cover';
      thumb.style.backgroundRepeat = 'no-repeat';
      thumb.style.backgroundClip = 'paddingBox';
      thumb.dataset.newPreview = 'url("' + self.options.thumbs[i] + '")';
      thumb.dataset.oldPreview = thumb.style.backgroundImage;
      thumb.dataset.thumburl = self.options.thumbs[i];
    }
  }
  updateThumbnails();
}

function overrideToggle() {
  var toggle = document.getElementById('newtab-toggle');
  if (toggle) {
    // Tell the add-on when the toggle is clicked…
    toggle.onclick = function () {
      self.port.emit('toggle clicked', {});
    };
  }
  // And eventually it'll tell us what the new value of the pref is…
  self.port.on('showPrefUpdated', function (e) {
    self.options.showPref = e;
    gAllPages.enabled = self.options.showPref !== 3;
    updateThumbnails();
  });
}

window.addEventListener('load', function () {
    addThumbnails(window.document.getElementsByClassName('newtab-cell'));
  overrideToggle();
}, false);
