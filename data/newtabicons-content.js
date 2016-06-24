/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* eslint-env browser */
/* globals gAllPages:false */

'use strict';

function mouseOverListener(e) {
  var thumb = e.target.previousElementSibling || e.target;
  if (thumb.classList.contains('tile-img-container')) {
    thumb = thumb.querySelector('.site-icon-background')
  }
  thumb.style.backgroundImage = thumb.dataset.newPreview;
}

function mouseOutListener(e) {
  var thumb = e.target.previousElementSibling || e.target;
  if (thumb.classList.contains('tile-img-container')) {
    thumb = thumb.querySelector('.site-icon-background')
  }
  thumb.style.backgroundImage = thumb.dataset.oldPreview;
}

function mouseMoveListener (e) {
  var thumbnails = window.document.querySelectorAll(selectors);
  for (let i = 0; i < thumbnails.length; ++i) {
    let thumb = thumbnails[i];
    let thumbs = thumb.getElementsByClassName('newtab-thumbnail');
    if (!thumbs.length) {
      thumbs = [thumb];
    }

    let top = Math.round(e.clientY * 100 / window.innerHeight);
    let left = Math.round(e.clientX * 100 / window.innerWidth);
    for (let i = 0; i < thumbs.length; i++) {
      let thumb = thumbs[i];
      thumb.style.backgroundPosition = 'top ' + top + '% left ' + left + '%';
    }
  }
}

function updateThumbnails() {
  var thumbnails = window.document.querySelectorAll(selectors);
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
        thumb.removeEventListener('mouseleave', mouseOutListener);
        window.removeEventListener('mousemove', mouseMoveListener);
        break;
      case 1:
        thumb.style.backgroundImage = thumb.dataset.oldPreview;
        if (thumb.classList.contains('site-icon-background')){
          thumb = thumb.parentNode;
        }
        thumb.addEventListener('mouseover', mouseOverListener);
        thumb.addEventListener('mouseleave', mouseOutListener);
        window.removeEventListener('mousemove', mouseMoveListener);
        break;
      case 2:
        thumb.style.backgroundImage = thumb.dataset.newPreview;
        thumb.removeEventListener('mouseover', mouseOverListener);
        thumb.removeEventListener('mouseleave', mouseOutListener);
        window.addEventListener('mousemove', mouseMoveListener);
        break;
      case 3:
        thumb.style.backgroundImage = thumb.dataset.oldPreview;
        thumb.removeEventListener('mouseover', mouseOverListener);
        thumb.removeEventListener('mouseleave', mouseOutListener);
        window.removeEventListener('mousemove', mouseMoveListener);
      }
    }
  }
}

function addThumbnails(thumbnails) {
  if (thumbnails.length === 0) {
    setTimeout(function () {
      addThumbnails(window.document.querySelectorAll(selectors));
    }, 1000);
    return;
  }

  for (let i = 0; i < thumbnails.length; ++i) {
    let thumb = thumbnails[i];
    if (thumb.querySelector('.site-icon-background')) {
      thumb.querySelector('.site-icon.spotlight-icon').style.backgroundColor = 'transparent';
      thumb.querySelector('.site-icon-background').style.backgroundColor = 'transparent';
    }
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
const selectors = '.newtab-cell, .spotlight-image, .tile-img-container .site-icon-background'
addThumbnails(window.document.querySelectorAll(selectors));
overrideToggle();
