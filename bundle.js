(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function hexToRgb (hex) {

  if (hex.charAt && hex.charAt(0) === '#') {
    hex = removeHash(hex)
  }

  if (hex.length === 3) {
    hex = expand(hex)
  }

  var bigint = parseInt(hex, 16)
  var r = (bigint >> 16) & 255
  var g = (bigint >> 8) & 255
  var b = bigint & 255

  return [r, g, b]
}

function removeHash (hex) {

  var arr = hex.split('')
  arr.shift()
  return arr.join('')
}

function expand (hex) {

  return hex
    .split('')
    .reduce(function (accum, value) {

      return accum.concat([value, value])
    }, [])
    .join('')
}

},{}],2:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty;

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?&]+)=?([^&]*)/g
    , result = {}
    , part;

  //
  // Little nifty parsing hack, leverage the fact that RegExp.exec increments
  // the lastIndex property so we can continue executing this loop until we've
  // parsed all results.
  //
  for (;
    part = parser.exec(query);
    result[decodeURIComponent(part[1])] = decodeURIComponent(part[2])
  );

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = [];

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (var key in obj) {
    if (has.call(obj, key)) {
      pairs.push(encodeURIComponent(key) +'='+ encodeURIComponent(obj[key]));
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;

},{}],3:[function(require,module,exports){
'use strict';

/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};

},{}],4:[function(require,module,exports){
"use strict";

// What is the size of the images, in pixels?
const IMAGE_SIZE = 160;

const hexToRgb = require("hex-to-rgb");
const urlParse = require("url-parse");

const sites = require("./top_sites.json").map(site => {
  return Object.assign({}, site, {background_color_rgb: hexToRgb(site.background_color)});
});

function getDomain(url) {
  let domain = urlParse(url, false).host;
  if (domain && domain.startsWith("www.")) {
    domain = domain.slice(4);
  }
  return domain;
}

const sitesByDomain = {};
sites.forEach(site => {
  if ("url" in site) {
    sitesByDomain[getDomain(site.url)] = site;
  }
  if ("urls" in site) {
    for (let url of site.urls) {
      sitesByDomain[getDomain(url)] = site;
    }
  }
});

/**
 * Get the site data for the given url.
 * Returns and empty object if there is no match.
 */
function getSiteData(url) {
  let siteData = {};
  let key;
  try {
    key = getDomain(url);
  } catch (e) {
    key = null;
  }
  if (key && key in sitesByDomain) {
    siteData = sitesByDomain[key];
  }
  return siteData;
}

module.exports.sites = sites;
module.exports.getSiteData = getSiteData;
module.exports.IMAGE_SIZE = IMAGE_SIZE;

},{"./top_sites.json":5,"hex-to-rgb":1,"url-parse":6}],5:[function(require,module,exports){
module.exports=[
  {
    "title": "aa",
    "url": "https://www.aa.com/",
    "image_url": "aa-com.png",
    "background_color": "#FAFAFA",
    "domain": "aa.com"
  },
  {
    "title": "abcnews.go",
    "url": "http://abcnews.go.com/",
    "image_url": "abcnews-go-com.png",
    "background_color": "#FFF",
    "domain": "abcnews.go.com"
  },
  {
    "title": "about",
    "url": "http://www.about.com/",
    "image_url": "about-com.png",
    "background_color": "#FFF",
    "domain": "about.com"
  },
  {
    "title": "accuweather",
    "url": "http://www.accuweather.com/",
    "image_url": "accuweather-com.png",
    "background_color": "#f56b17",
    "domain": "accuweather.com"
  },
  {
    "title": "adobe",
    "url": "http://www.adobe.com/",
    "image_url": "adobe-com.png",
    "background_color": "#e22919",
    "domain": "adobe.com"
  },
  {
    "title": "adp",
    "url": "http://www.adp.com/",
    "image_url": "adp-com.png",
    "background_color": "#f02311",
    "domain": "adp.com"
  },
  {
    "title": "airbnb",
    "url": "https://www.airbnb.com/",
    "image_url": "airbnb-com.png",
    "background_color": "#ff585a",
    "domain": "airbnb.com"
  },
  {
    "title": "allrecipes",
    "url": "http://allrecipes.com/",
    "image_url": "allrecipes-com.png",
    "background_color": "#ffb333",
    "domain": "allrecipes.com"
  },
  {
    "title": "amazon",
    "url": "http://www.amazon.com/",
    "image_url": "amazon-com.png",
    "background_color": "#FFF",
    "domain": "amazon.com"
  },
  {
    "title": "americanexpress",
    "url": "https://www.americanexpress.com",
    "image_url": "americanexpress-com.png",
    "background_color": "#e0e0e0",
    "domain": "americanexpress.com"
  },
  {
    "title": "ancestry",
    "url": "http://www.ancestry.com/",
    "image_url": "ancestry-com.png",
    "background_color": "#9bbf2f",
    "domain": "ancestry.com"
  },
  {
    "title": "answers",
    "url": "http://www.answers.com",
    "image_url": "answers-com.png",
    "background_color": "#3c67d5",
    "domain": "answers.com"
  },
  {
    "title": "aol",
    "url": "http://www.aol.com/",
    "image_url": "aol-com.png",
    "background_color": "#e0e0e0",
    "domain": "aol.com"
  },
  {
    "title": "apple",
    "url": "http://www.apple.com/",
    "image_url": "apple-com.png",
    "background_color": "#6d6e71",
    "domain": "apple.com"
  },
  {
    "title": "ask.com",
    "url": "http://www.ask.com",
    "image_url": "ask-com.png",
    "background_color": "#cf0000",
    "domain": "ask.com"
  },
  {
    "title": "att",
    "url": "https://www.att.com/",
    "image_url": "att-com.png",
    "background_color": "#5ba1ca",
    "domain": "att.com"
  },
  {
    "title": "aws.amazon",
    "url": "https://aws.amazon.com/",
    "image_url": "amazonaws-com.png",
    "background_color": "#FFF",
    "domain": "aws.amazon.com"
  },
  {
    "title": "baidu",
    "url": "http://baidu.com/",
    "image_url": "baidu-com.png",
    "background_color": "#c33302",
    "domain": "baidu.com"
  },
  {
    "title": "bankofamerica",
    "url": "https://www.bankofamerica.com",
    "image_url": "bankofamerica-com.png",
    "background_color": "#eb3146",
    "domain": "bankofamerica.com"
  },
  {
    "title": "bbc",
    "url": "http://www.bbc.com/",
    "image_url": "bbc-com.png",
    "background_color": "#000000",
    "domain": "bbc.com"
  },
  {
    "title": "bestbuy",
    "url": "http://www.bestbuy.com",
    "image_url": "bestbuy-com.png",
    "background_color": "#003a65",
    "domain": "bestbuy.com"
  },
  {
    "title": "bing",
    "url": "http://www.bing.com/",
    "image_url": "bing-com.png",
    "background_color": "#138484",
    "domain": "bing.com"
  },
  {
    "title": "blackboard",
    "url": "http://www.blackboard.com/",
    "image_url": "blackboard-com.png",
    "background_color": "#e6e6e6",
    "domain": "blackboard.com"
  },
  {
    "title": "bleacherreport",
    "url": "http://bleacherreport.com/",
    "image_url": "bleacherreport-com.png",
    "background_color": "#ec412e",
    "domain": "bleacherreport.com"
  },
  {
    "title": "blogger",
    "url": "https://www.blogger.com/home",
    "image_url": "blogger-com.png",
    "background_color": "#ff8822",
    "domain": "blogger.com"
  },
  {
    "title": "box",
    "url": "https://www.box.com/",
    "image_url": "box-com.png",
    "background_color": "#4daee8",
    "domain": "box.com"
  },
  {
    "title": "businessinsider",
    "url": "http://www.businessinsider.com",
    "image_url": "businessinsider-com.png",
    "background_color": "#1d5b7d",
    "domain": "businessinsider.com"
  },
  {
    "title": "buzzfeed",
    "url": "http://www.buzzfeed.com/index",
    "image_url": "buzzfeed-com.png",
    "background_color": "#ee3322",
    "domain": "buzzfeed.com"
  },
  {
    "title": "buzzlie",
    "url": "http://buzzlie.com/",
    "image_url": "buzzlie-com.png",
    "background_color": "#ff68b6",
    "domain": "buzzlie.com"
  },
  {
    "title": "California",
    "url": "http://ca.gov/",
    "image_url": "ca-gov.png",
    "background_color": "#000201",
    "domain": "ca.gov"
  },
  {
    "title": "capitalone",
    "url": "https://www.capitalone.com/",
    "image_url": "capitalone-com.png",
    "background_color": "#303e4f",
    "domain": "capitalone.com"
  },
  {
    "title": "cbc",
    "url": "http://www.cbc.ca/",
    "image_url": "cbc-ca.png",
    "background_color": "#fff",
    "domain": "cbc.ca"
  },
  {
    "title": "cbsnews",
    "url": "http://www.cbsnews.com/",
    "image_url": "cbsnews-com.png",
    "background_color": "#000",
    "domain": "cbsnews.com"
  },
  {
    "title": "cbssports",
    "url": "http://www.cbssports.com/",
    "image_url": "cbssports-com.png",
    "background_color": "#014a8f",
    "domain": "cbssports.com"
  },
  {
    "title": "chase",
    "url": "https://www.chase.com",
    "image_url": "chase-com.png",
    "background_color": "#0d68c1",
    "domain": "chase.com"
  },
  {
    "title": "cnet",
    "url": "http://www.cnet.com/",
    "image_url": "cnet-com.png",
    "background_color": "#FFF",
    "domain": "cnet.com"
  },
  {
    "title": "cnn",
    "url": "http://www.cnn.com",
    "image_url": "cnn-com.png",
    "background_color": "#d41c1e",
    "domain": "cnn.com"
  },
  {
    "title": "comcast",
    "urls": ["http://www.comcast.net/", "http://www.xfinity.com/"],
    "image_url": "xfinity-com.png",
    "background_color": "#000",
    "domain": "comcast.net"
  },
  {
    "title": "conservativetribune",
    "url": "http://conservativetribune.com/",
    "image_url": "conservativetribune-com.png",
    "background_color": "#ae0001",
    "domain": "conservativetribune.com"
  },
  {
    "title": "costco",
    "url": "http://www.costco.com/",
    "image_url": "costco-com.png",
    "background_color": "#005bad",
    "domain": "costco.com"
  },
  {
    "title": "craigslist",
    "url": "http://craigslist.org/",
    "image_url": "craigslist-org.png",
    "background_color": "#652892",
    "domain": "craigslist.org"
  },
  {
    "title": "dailymail",
    "url": "http://www.dailymail.co.uk/",
    "image_url": "dailymail-co-uk.png",
    "background_color": "#ffffff",
    "domain": "dailymail.co.uk"
  },
  {
    "title": "dailybeast",
    "url": "https://www.thedailybeast.com/",
    "image_url": "dailybeast-com.png",
    "background_color": "#f54927",
    "domain": "dailybeast.com"
  },
  {
    "title": "delta",
    "url": "https://www.delta.com/",
    "image_url": "delta-com.png",
    "background_color": "#1d649e",
    "domain": "delta.com"
  },
  {
    "title": "deviantart",
    "url": "http://www.deviantart.com/",
    "image_url": "deviantart-com.png",
    "background_color": "#00ce3e",
    "domain": "deviantart.com"
  },
  {
    "title": "digg",
    "url": "http://digg.com/",
    "image_url": "digg-com.png",
    "background_color": "#000",
    "domain": "digg.com"
  },
  {
    "title": "diply",
    "url": "http://diply.com/",
    "image_url": "diply-com.png",
    "background_color": "#2168b3",
    "domain": "diply.com"
  },
  {
    "title": "discover",
    "urls": ["https://www.discover.com/", "https://www.discovercard.com/"],
    "image_url": "discovercard-com.png",
    "background_color": "#d6d6d6",
    "domain": "discover.com"
  },
  {
    "title": "dropbox",
    "url": "https://www.dropbox.com/",
    "image_url": "dropbox-com.png",
    "background_color": "#007fe2",
    "domain": "dropbox.com"
  },
  {
    "title": "drudgereport",
    "url": "http://drudgereport.com/",
    "image_url": "drudgereport-com.png",
    "background_color": "#FFF",
    "domain": "drudgereport.com"
  },
  {
    "title": "ebates",
    "url": "http://www.ebates.com/",
    "image_url": "ebates-com.png",
    "background_color": "#14af44",
    "domain": "ebates.com"
  },
  {
    "title": "ebay",
    "url": "http://www.ebay.com",
    "image_url": "ebay-com.png",
    "background_color": "#ededed",
    "domain": "ebay.com"
  },
  {
    "title": "espn.go",
    "url": "http://espn.go.com",
    "image_url": "espn-go-com.png",
    "background_color": "#4b4b4b",
    "domain": "espn.go.com"
  },
  {
    "title": "etsy",
    "url": "https://www.etsy.com/",
    "image_url": "etsy-com.png",
    "background_color": "#f76300",
    "domain": "etsy.com"
  },
  {
    "title": "eventbrite",
    "url": "https://www.eventbrite.com/",
    "image_url": "eventbrite-com.png",
    "background_color": "#ff8000",
    "domain": "eventbrite.com"
  },
  {
    "title": "expedia",
    "url": "https://www.expedia.com/",
    "image_url": "expedia-com.png",
    "background_color": "#003460",
    "domain": "expedia.com"
  },
  {
    "title": "facebook",
    "url": "https://www.facebook.com/",
    "image_url": "facebook-com.png",
    "background_color": "#3b5998",
    "domain": "facebook.com"
  },
  {
    "title": "faithtap",
    "url": "http://faithtap.com/",
    "image_url": "faithtap-com.png",
    "background_color": "#4c286f",
    "domain": "faithtap.com"
  },
  {
    "title": "fedex",
    "url": "http://www.fedex.com/",
    "image_url": "fedex-com.png",
    "background_color": "#391675",
    "domain": "fedex.com"
  },
  {
    "title": "feedly",
    "url": "http://feedly.com/",
    "image_url": "feedly-com.png",
    "background_color": "#20b447",
    "domain": "feedly.com"
  },
  {
    "title": "fitbit",
    "url": "https://www.fitbit.com/",
    "image_url": "fitbit-com.png",
    "background_color": "#00b0ba",
    "domain": "fitbit.com"
  },
  {
    "title": "flickr",
    "url": "https://www.flickr.com",
    "image_url": "flickr-com.png",
    "background_color": "#dcdcdc",
    "domain": "flickr.com"
  },
  {
    "title": "foodnetwork",
    "url": "http://www.foodnetwork.com/",
    "image_url": "foodnetwork-com.png",
    "background_color": "#f50024",
    "domain": "foodnetwork.com"
  },
  {
    "title": "forbes",
    "url": "http://www.forbes.com/",
    "image_url": "forbes-com.png",
    "background_color": "#4177ab",
    "domain": "forbes.com"
  },
  {
    "title": "foxnews",
    "url": "http://www.foxnews.com",
    "image_url": "foxnews-com.png",
    "background_color": "#9e0b0f",
    "domain": "foxnews.com"
  },
  {
    "title": "gap",
    "url": "http://www.gap.com/",
    "image_url": "gap-com.png",
    "background_color": "#002861",
    "domain": "gap.com"
  },
  {
    "title": "gawker",
    "url": "http://gawker.com/",
    "image_url": "gawker-com.png",
    "background_color": "#d75343",
    "domain": "gawker.com"
  },
  {
    "title": "gfycat",
    "url": "http://gfycat.com/",
    "image_url": "gfycat-com.png",
    "background_color": "#eaeaea",
    "domain": "gfycat.com"
  },
  {
    "title": "GitHub",
    "url": "https://github.com/",
    "image_url": "github-com.png",
    "background_color": "#000",
    "domain": "github.com"
  },
  {
    "title": "gizmodo",
    "url": "http://gizmodo.com/",
    "image_url": "gizmodo-com.png",
    "background_color": "#000",
    "domain": "gizmodo.com"
  },
  {
    "title": "glassdoor",
    "url": "https://www.glassdoor.com/",
    "image_url": "glassdoor-com.png",
    "background_color": "#7aad28",
    "domain": "glassdoor.com"
  },
  {
    "title": "go",
    "url": "http://go.com",
    "image_url": "go-com.png",
    "background_color": "#000",
    "domain": ".com"
  },
  {
    "title": "goodreads",
    "url": "http://www.goodreads.com/",
    "image_url": "goodreads-com.png",
    "background_color": "#382110",
    "domain": "goodreads.com"
  },
  {
    "title": "google",
    "url": "https://www.google.com/",
    "image_url": "google-com.png",
    "background_color": "#FFF",
    "domain": "google.com"
  },
  {
    "title": "admin.google",
    "url": "https://admin.google.com/",
    "image_url": "google-admin.png",
    "background_color": "#FFF",
    "domain": "admin.google.com"
  },
  {
    "title": "calendar.google",
    "url": "https://calendar.google.com/",
    "image_url": "google-calendar.png",
    "background_color": "#FFF",
    "domain": "calendar.google.com"
  },
  {
    "title": "contacts.google",
    "url": "https://contacts.google.com/",
    "image_url": "google-contacts.png",
    "background_color": "#FFF",
    "domain": "contacts.google.com"
  },
  {
    "title": "docs.google",
    "url": "https://docs.google.com/",
    "image_url": "google-docs.png",
    "background_color": "#FFF",
    "domain": "docs.google.com"
  },
  {
    "title": "drive.google",
    "url": "https://drive.google.com/",
    "image_url": "google-drive.png",
    "background_color": "#FFF",
    "domain": "drive.google.com"
  },
  {
    "title": "forms.google",
    "url": "https://forms.google.com/",
    "image_url": "google-forms.png",
    "background_color": "#FFF",
    "domain": "forms.google.com"
  },
  {
    "title": "gmail",
    "urls": ["https://mail.google.com/", "https://gmail.com"],
    "image_url": "google-gmail.png",
    "background_color": "#FFF",
    "domain": "mail.google.com"
  },
  {
    "title": "groups.google",
    "url": "https://groups.google.com/",
    "image_url": "google-groups.png",
    "background_color": "#FFF",
    "domain": "groups.google.com"
  },
  {
    "title": "hangouts.google",
    "url": "https://hangouts.google.com/",
    "image_url": "google-hangouts.png",
    "background_color": "#FFF",
    "domain": "hangouts.google.com"
  },
  {
    "title": "plus.google",
    "url": "https://plus.google.com/",
    "image_url": "google-plus.png",
    "background_color": "#FFF",
    "domain": "plus.google.com"
  },
  {
    "title": "sheets.google",
    "url": "https://sheets.google.com/",
    "image_url": "google-sheets.png",
    "background_color": "#FFF",
    "domain": "sheets.google.com"
  },
  {
    "title": "sites.google",
    "url": "https://sites.google.com/",
    "image_url": "google-sites.png",
    "background_color": "#FFF",
    "domain": "sites.google.com"
  },
  {
    "title": "slides.google",
    "url": "https://slides.google.com/",
    "image_url": "google-slides.png",
    "background_color": "#FFF",
    "domain": "slides.google.com"
  },
  {
    "title": "photos.google",
    "url": "https://photos.google.com/",
    "image_url": "google-photos.png",
    "background_color": "#FFF",
    "domain": "photos.google.com"
  },
  {
    "title": "images.google",
    "url": "https://images.google.com/",
    "image_url": "google-com.png",
    "background_color": "#FFF",
    "domain": "images.google.com"
  },
  {
    "title": "groupon",
    "url": "https://www.groupon.com/",
    "image_url": "groupon-com.png",
    "background_color": "#53a318",
    "domain": "groupon.com"
  },
  {
    "title": "homedepot",
    "url": "http://www.homedepot.com/",
    "image_url": "homedepot-com.png",
    "background_color": "#f7d5a4",
    "domain": "homedepot.com"
  },
  {
    "title": "houzz",
    "url": "https://www.houzz.com/",
    "image_url": "houzz-com.png",
    "background_color": "#52a02a",
    "domain": "houzz.com"
  },
  {
    "title": "huffingtonpost",
    "url": "http://www.huffingtonpost.com/",
    "image_url": "huffingtonpost-com.png",
    "background_color": "#7dbdb8",
    "domain": "huffingtonpost.com"
  },
  {
    "title": "hulu",
    "url": "http://www.hulu.com/",
    "image_url": "hulu-com.png",
    "background_color": "#97c64f",
    "domain": "hulu.com"
  },
  {
    "title": "ign",
    "url": "http://www.ign.com/",
    "image_url": "ign-com.png",
    "background_color": "#ff0000",
    "domain": "ign.com"
  },
  {
    "title": "ikea",
    "url": "http://www.ikea.com/",
    "image_url": "ikea-com.png",
    "background_color": "#00329c",
    "domain": "ikea.com"
  },
  {
    "title": "imdb",
    "url": "http://www.imdb.com/",
    "image_url": "imdb-com.png",
    "background_color": "#ffd100",
    "domain": "imdb.com"
  },
  {
    "title": "imgur",
    "url": "http://imgur.com/",
    "image_url": "imgur-com.png",
    "background_color": "#2a2c25",
    "domain": "imgur.com"
  },
  {
    "title": "instagram",
    "url": "https://www.instagram.com/",
    "image_url": "instagram-com.png",
    "background_color": "#0b558a",
    "domain": "instagram.com"
  },
  {
    "title": "instructure",
    "url": "https://www.instructure.com/",
    "image_url": "instructure-com.png",
    "background_color": "#efefef",
    "domain": "instructure.com"
  },
  {
    "title": "intuit",
    "url": "http://www.intuit.com/",
    "image_url": "intuit-com.png",
    "background_color": "#f6f6f6",
    "domain": "intuit.com"
  },
  {
    "title": "irs",
    "url": "https://www.irs.gov/",
    "image_url": "irs-gov.png",
    "background_color": "#efefef",
    "domain": "irs.gov"
  },
  {
    "title": "invision",
    "urls": ["https://www.invisionapp.com/", "https://mozilla.invisionapp.com/"],
    "image_url": "invision-com.png",
    "background_color": "#ff2e63",
    "domain": "invisionapp.com"
  },
  {
    "title": "jcpenney",
    "url": "http://www.jcpenney.com/",
    "image_url": "jcpenney-com.png",
    "background_color": "#fa0026",
    "domain": "jcpenney.com"
  },
  {
    "title": "jd",
    "url": "http://www.jd.com/",
    "image_url": "jd-com.png",
    "background_color": "#e50000",
    "domain": "jd.com"
  },
  {
    "title": "kayak",
    "url": "https://www.kayak.com/",
    "image_url": "kayak-com.png",
    "background_color": "#fff",
    "domain": "kayak.com"
  },
  {
    "title": "kohl's",
    "url": "http://www.kohls.com",
    "image_url": "kohls-com.png",
    "background_color": "#000",
    "domain": "kohls.com"
  },
  {
    "title": "latimes",
    "url": "http://www.latimes.com/",
    "image_url": "latimes-com.png",
    "background_color": "#FFF",
    "domain": "latimes.com"
  },
  {
    "title": "lifehacker",
    "url": "http://lifehacker.com/",
    "image_url": "lifehacker-com.png",
    "background_color": "#94b330",
    "domain": "lifehacker.com"
  },
  {
    "title": "linkedin",
    "url": "https://www.linkedin.com/",
    "image_url": "linkedin-com.png",
    "background_color": "#00659b",
    "domain": "linkedin.com"
  },
  {
    "title": "lowes",
    "url": "http://www.lowes.com/",
    "image_url": "lowes-com.png",
    "background_color": "#004793",
    "domain": "lowes.com"
  },
  {
    "title": "macys",
    "url": "http://www.macys.com/",
    "image_url": "macys-com.png",
    "background_color": "#ea0000",
    "domain": "macys.com"
  },
  {
    "title": "login.microsoftonline",
    "url": "https://login.microsoftonline.com/",
    "image_url": "microsoftonline-com.png",
    "background_color": "#ce4f00",
    "domain": "login.microsoftonline.com"
  },
  {
    "title": "mail.live",
    "url": "https://mail.live.com",
    "image_url": "live-com.png",
    "background_color": "#0070c9",
    "domain": "mail.live.com"
  },
  {
    "title": "mapquest",
    "url": "http://www.mapquest.com/",
    "image_url": "mapquest-com.png",
    "background_color": "#373737",
    "domain": "mapquest.com"
  },
  {
    "title": "mashable",
    "url": "http://mashable.com/stories/",
    "image_url": "mashable-com.png",
    "background_color": "#00aef0",
    "domain": "mashable.com"
  },
  {
    "title": "microsoft",
    "url": "http://www.microsoft.com/",
    "image_url": "microsoft-com.png",
    "background_color": "#FFF",
    "domain": "microsoft.com"
  },
  {
    "title": "mlb",
    "url": "http://mlb.mlb.com/",
    "image_url": "mlb-com.png",
    "background_color": "#ffffff",
    "domain": "mlb.com"
  },
  {
    "title": "msn",
    "url": "http://www.msn.com/",
    "image_url": "msn-com.png",
    "background_color": "#000",
    "domain": "msn.com"
  },
  {
    "title": "nbcnews",
    "url": "http://www.nbcnews.com/",
    "image_url": "nbcnews-com.png",
    "background_color": "#003a51",
    "domain": "nbcnews.com"
  },
  {
    "title": "netflix",
    "url": "https://www.netflix.com/",
    "image_url": "netflix-com.png",
    "background_color": "#000",
    "domain": "netflix.com"
  },
  {
    "title": "newegg",
    "url": "http://www.newegg.com/",
    "image_url": "newegg-com.png",
    "background_color": "#cecece",
    "domain": "newegg.com"
  },
  {
    "title": "news.ycombinator",
    "url": "https://news.ycombinator.com/",
    "image_url": "news-ycombinator-com.png",
    "background_color": "#fb651e",
    "domain": "news.ycombinator.com"
  },
  {
    "title": "nih",
    "url": "http://www.nih.gov/",
    "image_url": "nih-gov.png",
    "background_color": "#efefef",
    "domain": "nih.gov"
  },
  {
    "title": "nordstrom",
    "url": "http://shop.nordstrom.com/",
    "image_url": "nordstrom-com.png",
    "background_color": "#7f7d7a",
    "domain": "nordstrom.com"
  },
  {
    "title": "npr",
    "url": "http://www.npr.org/",
    "image_url": "npr-org.png",
    "background_color": "#FFF",
    "domain": "npr.org"
  },
  {
    "title": "nypost",
    "url": "http://nypost.com/",
    "image_url": "nypost-com.png",
    "background_color": "#FFF",
    "domain": "nypost.com"
  },
  {
    "title": "nytimes",
    "url": "http://www.nytimes.com",
    "image_url": "nytimes-com.png",
    "background_color": "#FFF",
    "domain": "nytimes.com"
  },
  {
    "title": "office",
    "url": "https://www.office.com/",
    "image_url": "office-com.png",
    "background_color": "#000",
    "domain": "office.com"
  },
  {
    "title": "online.citi",
    "url": "https://online.citi.com/",
    "image_url": "citi-com.png",
    "background_color": "#FFF",
    "domain": "online.citi.com"
  },
  {
    "title": "overstock",
    "url": "http://www.overstock.com/",
    "image_url": "overstock-com.png",
    "background_color": "#fff",
    "domain": "overstock.com"
  },
  {
    "title": "pandora",
    "url": "http://www.pandora.com/",
    "image_url": "pandora-com.png",
    "background_color": "#efefef",
    "domain": "pandora.com"
  },
  {
    "title": "Patch",
    "url": "http://patch.com",
    "image_url": "patch-com.png",
    "background_color": "#519442",
    "domain": "patch.com"
  },
  {
    "title": "paypal",
    "url": "https://www.paypal.com/home",
    "image_url": "paypal-com.png",
    "background_color": "#009cde",
    "domain": "paypal.com"
  },
  {
    "title": "people.com",
    "url": "http://www.people.com/",
    "image_url": "people-com.png",
    "background_color": "#27c4ff",
    "domain": "people.com"
  },
  {
    "title": "pinterest",
    "url": "https://www.pinterest.com/",
    "image_url": "pinterest-com.png",
    "background_color": "#ba212b",
    "domain": "pinterest.com"
  },
  {
    "title": "politico",
    "url": "http://www.politico.com/",
    "image_url": "politico-com.png",
    "background_color": "#9f0000",
    "domain": "politico.com"
  },
  {
    "title": "quora",
    "url": "https://www.quora.com/",
    "image_url": "quora-com.png",
    "background_color": "#bb2920",
    "domain": "quora.com"
  },
  {
    "title": "qq",
    "url": "https://www.qq.com/",
    "image_url": "qq-com.png",
    "background_color": "#2d91da",
    "domain": "qq.com"
  },
  {
    "title": "realtor",
    "url": "http://www.realtor.com/",
    "image_url": "realtor-com.png",
    "background_color": "#fcfcfc",
    "domain": "realtor.com"
  },
  {
    "title": "reddit",
    "url": "https://www.reddit.com/",
    "image_url": "reddit-com.png",
    "background_color": "#cee3f8",
    "domain": "reddit.com"
  },
  {
    "title": "salesforce",
    "url": "http://www.salesforce.com/",
    "image_url": "salesforce-com.png",
    "background_color": "#efefef",
    "domain": "salesforce.com"
  },
  {
    "title": "sears",
    "url": "http://www.sears.com/",
    "image_url": "sears-com.png",
    "background_color": "#00265a",
    "domain": "sears.com"
  },
  {
    "title": "sina",
    "url": "http://www.sina.com/",
    "image_url": "sina-com.png",
    "background_color": "#ff0000",
    "domain": "sina.com"
  },
  {
    "title": "slate",
    "url": "http://www.slate.com/",
    "image_url": "slate-com.png",
    "background_color": "#670033",
    "domain": "slate.com"
  },
  {
    "title": "slickdeals",
    "url": "http://slickdeals.net",
    "image_url": "slickdeals-net.png",
    "background_color": "#0072bd",
    "domain": "slickdeals.net"
  },
  {
    "title": "soundcloud",
    "url": "https://soundcloud.com/",
    "image_url": "soundcloud-com.png",
    "background_color": "#F95300",
    "domain": "soundcloud.com"
  },
  {
    "title": "southwest",
    "url": "https://www.southwest.com/",
    "image_url": "southwest-com.png",
    "background_color": "#3452c1",
    "domain": "southwest.com"
  },
  {
    "title": "spotify",
    "url": "https://www.spotify.com/",
    "image_url": "spotify-com.png",
    "background_color": "#dd08a7",
    "domain": "spotify.com"
  },
  {
    "title": "stackexchange",
    "url": "http://stackexchange.com/",
    "image_url": "stackexchange-com.png",
    "background_color": "#fff",
    "domain": "stackexchange.com"
  },
  {
    "title": "stackoverflow",
    "url": "http://stackoverflow.com/",
    "image_url": "stackoverflow-com.png",
    "background_color": "#f48024",
    "domain": "stackoverflow.com"
  },
  {
    "title": "staples",
    "url": "http://www.staples.com/",
    "image_url": "staples-com.png",
    "background_color": "#F3F1F3",
    "domain": "staples.com"
  },
  {
    "title": "strava",
    "url": "http://www.strava.com/",
    "image_url": "strava-com.png",
    "background_color": "#ff4b00",
    "domain": "strava.com"
  },
  {
    "title": "surveymonkey",
    "url": "https://www.surveymonkey.com/",
    "image_url": "surveymonkey-com.png",
    "background_color": "#a6c32f",
    "domain": "surveymonkey.com"
  },
  {
    "title": "swagbucks",
    "url": "http://www.swagbucks.com/",
    "image_url": "swagbucks-com.png",
    "background_color": "#5fb5d6",
    "domain": "swagbucks.com"
  },
  {
    "title": "talkingpointsmemo",
    "url": "http://talkingpointsmemo.com/",
    "image_url": "talkingpointsmemo-com.png",
    "background_color": "#ab1500",
    "domain": "talkingpointsmemo.com"
  },
  {
    "title": "t-mobile",
    "url": "http://www.t-mobile.com/",
    "image_url": "t-mobile-com.png",
    "background_color": "#f32f9d",
    "domain": "t-mobile.com"
  },
  {
    "title": "taboola",
    "url": "https://www.taboola.com/",
    "image_url": "taboola-com.png",
    "background_color": "#1761a8",
    "domain": "taboola.com"
  },
  {
    "title": "taobao",
    "url": "https://www.taobao.com/",
    "image_url": "taobao-com.png",
    "background_color": "#ff8300",
    "domain": "taobao.com"
  },
  {
    "title": "target",
    "url": "http://www.target.com",
    "image_url": "target-com.png",
    "background_color": "#e81530",
    "domain": "target.com"
  },
  {
    "title": "theguardian",
    "url": "http://www.theguardian.com/",
    "image_url": "guardian-com.png",
    "background_color": "#00558a",
    "domain": "theguardian.com"
  },
  {
    "title": "thesaurus",
    "url": "http://www.thesaurus.com/",
    "image_url": "thesaurus-com.png",
    "background_color": "#ffce80",
    "domain": "thesaurus.com"
  },
  {
    "title": "ticketmaster",
    "url": "http://www.ticketmaster.com/",
    "image_url": "ticketmaster-com.png",
    "background_color": "#fff",
    "domain": "ticketmaster.com"
  },
  {
    "title": "tripadvisor",
    "url": "https://www.tripadvisor.com/",
    "image_url": "tripadvisor-com.png",
    "background_color": "#5ba443",
    "domain": "tripadvisor.com"
  },
  {
    "title": "trulia",
    "url": "http://www.trulia.com/",
    "image_url": "trulia-com.png",
    "background_color": "#62be06",
    "domain": "trulia.com"
  },
  {
    "title": "tumblr",
    "url": "https://www.tumblr.com/",
    "image_url": "tumblr-com.png",
    "background_color": "#4ebd89",
    "domain": "tumblr.com"
  },
  {
    "title": "twitch",
    "url": "https://www.twitch.tv/",
    "image_url": "twitch-tv.png",
    "background_color": "#5A43A9",
    "domain": "twitch.tv"
  },
  {
    "title": "twitter",
    "url": "https://twitter.com/",
    "image_url": "twitter-com.png",
    "background_color": "#049ff5",
    "domain": "twitter.com"
  },
  {
    "title": "ups",
    "url": "https://www.ups.com/",
    "image_url": "ups-com.png",
    "background_color": "#281704",
    "domain": "ups.com"
  },
  {
    "title": "usaa",
    "url": "https://www.usaa.com/",
    "image_url": "usaa-com.png",
    "background_color": "#002a41",
    "domain": "usaa.com"
  },
  {
    "title": "usatoday",
    "url": "http://www.usatoday.com/",
    "image_url": "usatoday-com.png",
    "background_color": "#000",
    "domain": "usatoday.com"
  },
  {
    "title": "usbank",
    "url": "https://www.usbank.com/",
    "image_url": "usbank-com.png",
    "background_color": "#ff0022",
    "domain": "usbank.com"
  },
  {
    "title": "usps",
    "url": "https://www.usps.com/",
    "image_url": "usps-com.png",
    "background_color": "#f5f5f5",
    "domain": "usps.com"
  },
  {
    "title": "verizon",
    "url": "http://www.verizon.com/",
    "image_url": "verizon-com.png",
    "background_color": "#f00000",
    "domain": "verizon.com"
  },
  {
    "title": "verizonwireless",
    "url": "http://www.verizonwireless.com/",
    "image_url": "verizonwireless-com.png",
    "background_color": "#fff",
    "domain": "verizonwireless.com"
  },
  {
    "title": "vice",
    "url": "http://www.vice.com/",
    "image_url": "vice-com.png",
    "background_color": "#000",
    "domain": "vice.com"
  },
  {
    "title": "vimeo",
    "url": "https://vimeo.com/",
    "image_url": "vimeo-com.png",
    "background_color": "#00b1f2",
    "domain": "vimeo.com"
  },
  {
    "title": "walmart",
    "url": "http://www.walmart.com/",
    "image_url": "walmart-com.png",
    "background_color": "#fff",
    "domain": "walmart.com"
  },
  {
    "title": "washingtonpost",
    "url": "https://www.washingtonpost.com/regional/",
    "image_url": "washingtonpost-com.png",
    "background_color": "#fff",
    "domain": "washingtonpost.com"
  },
  {
    "title": "wayfair",
    "url": "http://www.wayfair.com/",
    "image_url": "wayfair-com.png",
    "background_color": "#ffffff",
    "domain": "wayfair.com"
  },
  {
    "title": "weather",
    "url": "https://weather.com/",
    "image_url": "weather-com.png",
    "background_color": "#2147a8",
    "domain": "weather.com"
  },
  {
    "title": "webmd",
    "url": "http://www.webmd.com/default.htm",
    "image_url": "webmd-com.png",
    "background_color": "#00639a",
    "domain": "webmd.com"
  },
  {
    "title": "wellsfargo",
    "url": "https://www.wellsfargo.com",
    "image_url": "wellsfargo-com.png",
    "background_color": "#ba1613",
    "domain": "wellsfargo.com"
  },
  {
    "title": "wikihow",
    "url": "http://www.wikihow.com/",
    "image_url": "wikihow-com.png",
    "background_color": "#455046",
    "domain": "wikihow.com"
  },
  {
    "title": "wikipedia",
    "url": "https://www.wikipedia.org/",
    "image_url": "wikipedia-org.png",
    "background_color": "#fff",
    "domain": "wikipedia.org"
  },
  {
    "title": "wired",
    "url": "https://www.wired.com/",
    "image_url": "wired-com.png",
    "background_color": "#000",
    "domain": "wired.com"
  },
  {
    "title": "wittyfeed",
    "url": "http://www.wittyfeed.com",
    "image_url": "wittyfeed-com.png",
    "background_color": "#d83633",
    "domain": "wittyfeed.com"
  },
  {
    "title": "wordpress",
    "url": "https://wordpress.com",
    "image_url": "wordpress-com.png",
    "background_color": "#00739c",
    "domain": "wordpress.com"
  },
  {
    "title": "wsj",
    "url": "http://www.wsj.com/",
    "image_url": "wsj-com.png",
    "background_color": "#000000",
    "domain": "wsj.com"
  },
  {
    "title": "wunderground",
    "url": "https://www.wunderground.com/",
    "image_url": "wunderground-com.png",
    "background_color": "#000000",
    "domain": "wunderground.com"
  },
  {
    "title": "yahoo",
    "url": "https://www.yahoo.com/",
    "image_url": "yahoo-com.png",
    "background_color": "#5009a7",
    "domain": "yahoo.com"
  },
  {
    "title": "yelp",
    "url": "http://yelp.com/",
    "image_url": "yelp-com.png",
    "background_color": "#d83633",
    "domain": "yelp.com"
  },
  {
    "title": "youtube",
    "url": "https://www.youtube.com/",
    "image_url": "youtube-com.png",
    "background_color": "#db4338",
    "domain": "youtube.com"
  },
  {
    "title": "zillow",
    "url": "http://www.zillow.com/",
    "image_url": "zillow-com.png",
    "background_color": "#98c554",
    "domain": "zillow.com"
  }
]

},{}],6:[function(require,module,exports){
'use strict';

var required = require('requires-port')
  , lolcation = require('./lolcation')
  , qs = require('querystringify')
  , protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i;

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/:(\d+)$/, 'port', undefined, 1],    // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @return {ProtocolExtract} Extracted information.
 * @api private
 */
function extractProtocol(address) {
  var match = protocolre.exec(address);

  return {
    protocol: match[1] ? match[1].toLowerCase() : '',
    slashes: !!match[2],
    rest: match[3]
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @api private
 */
function resolve(relative, base) {
  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
    , i = path.length
    , last = path[i - 1]
    , unshift = false
    , up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} location Location defaults for relative paths.
 * @param {Boolean|Function} parser Parser for the query string.
 * @api public
 */
function URL(address, location, parser) {
  if (!(this instanceof URL)) {
    return new URL(address, location, parser);
  }

  var relative, extracted, parse, instruction, index, key
    , instructions = rules.slice()
    , type = typeof location
    , url = this
    , i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = qs.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '');
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (!extracted.slashes) instructions[2] = [/(.*)/, 'pathname'];

  for (; i < instructions.length; i++) {
    instruction = instructions[i];
    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      if (~(index = address.indexOf(parse))) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if (index = parse.exec(address)) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (
      relative && instruction[3] ? location[key] || '' : ''
    );

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (
      relative
    && location.slashes
    && url.pathname.charAt(0) !== '/'
    && (url.pathname !== '' || location.pathname !== '')
  ) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';
  if (url.auth) {
    instruction = url.auth.split(':');
    url.username = instruction[0] || '';
    url.password = instruction[1] || '';
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL}
 * @api public
 */
URL.prototype.set = function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname +':'+ value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':'+ url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (/:\d+$/.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
      url.pathname = value.length && value.charAt(0) !== '/' ? '/' + value : value;

      break;

    default:
      url[part] = value;
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  url.href = url.toString();

  return url;
};

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String}
 * @api public
 */
URL.prototype.toString = function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query
    , url = this
    , protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result = protocol + (url.slashes ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  }

  result += url.host + url.pathname;

  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

  if (url.hash) result += url.hash;

  return result;
};

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
URL.extractProtocol = extractProtocol;
URL.location = lolcation;
URL.qs = qs;

module.exports = URL;

},{"./lolcation":7,"querystringify":2,"requires-port":3}],7:[function(require,module,exports){
(function (global){
'use strict';

var slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 }
  , URL;

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @api public
 */
module.exports = function lolcation(loc) {
  loc = loc || global.location || {};
  URL = URL || require('./');

  var finaldestination = {}
    , type = typeof loc
    , key;

  if ('blob:' === loc.protocol) {
    finaldestination = new URL(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new URL(loc, {});
    for (key in ignore) delete finaldestination[key];
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./":6}],8:[function(require,module,exports){
'use strict'

var placeholders = [];
var url = 'https://bwinton.github.io/whimsy/thumbnail-gifs.txt';
var getting = browser.storage.sync.get('newtab');
var listener = false;
var tippyTopSites = require('tippy-top-sites');

initialize();

function onError(error) {
  console.log(error);
}
function loadTopSites(){
  //display top sites
  browser.topSites.get().then((topSitesArray) => {
    var grid = document.querySelector("#newtab-grid");
    grid.innerHTML = "";
    for (let topSite of topSitesArray) {
      grid.innerHTML +=
      "<div class='newtab-cell'><div class='newtab-site' draggable='true' type='history'>"+
          "<a class='newtab-link' title="+topSite.title+" href="+topSite.url+">"+
            "<span class='newtab-thumbnail thumbnail' style='background-size: cover; background-image: ;'></span>"+
            "<span class='newtab-title'>"+topSite.title+"</span>"+
          "</a>"+
        "</div>"+
      "</div>"
    }
  }, onError);
}
function initialize(){
  fetch(url).then(function(response){
    if(response.ok){
      response.text().then(function(data){
        placeholders = data;
        placeholders = placeholders.split('\n');
        placeholders = placeholders.map(function(x){
          return x.trim();
        }).filter(function(x){
          return !x.startsWith('#') && (x !== '');
        })
      }).then(setThumbnail)
    } else {
      throw new Error('Network response was not ok.');
    }
  }).catch(function(error) {
    console.log('There has been a problem with your fetch operation: ' + error.message);
  });
}
function setThumbnail(){
  getting.then((result) => {
    if (result.newtab == "on" || result.newtab == null){
      document.querySelectorAll(".thumbnail").forEach(function(img){
        if(listener){
          img.removeEventListener(onMouseOver);
          img.removeEventListener(onMouseLeave);
        }
        let rand = Math.floor(Math.random() * placeholders.length);
        img.style.backgroundImage = "url("+placeholders[rand]+")";
      })
    } else if (result.newtab == "hover"){
      document.querySelectorAll(".newtab-link").forEach(function(link){
        //set default thumbnail
        var href = link.href;
        link.querySelectorAll(".thumbnail").forEach(function(img){
          //set gifs
          let rand = Math.floor(Math.random() * placeholders.length);
          img.style.backgroundImage = "url("+placeholders[rand]+")";

          //add canvas on every gif
          var canvas = document.createElement('canvas');
          canvas.class = "newtab-thumbnail thumbnail";
          canvas.width = 290;
          canvas.height = 180;

          var ctx = canvas.getContext("2d");
          ctx.fillStyle = "rgba(255, 255, 255, 0)";
          ctx.fillRect(0,0,290,180);
          img.appendChild(canvas);

          //show favicon on canvas
          var info = tippyTopSites.getSiteData(href);
          if(info.image_url != null){
            canvas.style.backgroundImage = "url(../node_modules/tippy-top-sites/images/"+info.image_url+")";
            canvas.style.backgroundColor = info.background_color;
            canvas.style.backgroundSize = "auto";
            canvas.style.backgroundPosition = "center";
            canvas.style.backgroundRepeat = "no-repeat";
          } else {
            var newUrl = new URL("/favicon.ico", href);
            canvas.style.backgroundImage = "url("+newUrl+")";
            canvas.style.backgroundColor = "white";
            canvas.style.backgroundSize = "100px";
            canvas.style.backgroundPosition = "center";
            canvas.style.backgroundRepeat = "no-repeat";
          }
          img.addEventListener("mouseover", onMouseOver);
          img.addEventListener("mouseout", onMouseLeave);
          listener = true;
        })
      })
    } else if (result.newtab == "pics"){
      document.querySelectorAll(".thumbnail").forEach(function(img){
        if(listener){
          img.removeEventListener(onMouseOver);
          img.removeEventListener(onMouseLeave);
        }
        var newImg = document.createElement('img');
        img.parentNode.replaceChild(newImg, img);
        let rand = Math.floor(Math.random() * placeholders.length);
        newImg.src = placeholders[rand];
        newImg.style.opacity = 0;
        //set to paused gif
        var c = document.createElement('canvas');
        var width = c.width = newImg.width = 290;
        var height = c.height = newImg.height = 180;
        var freeze = function(){
          c.getContext('2d').drawImage(newImg,0,0,width,height);
          c.style.position = 'absolute';
          newImg.parentNode.insertBefore(c, newImg);
        }
        newImg.addEventListener('load', freeze, true);
      })
    } else if (result.newtab == "off"){
      document.querySelectorAll(".newtab-link").forEach(function(link){
        if(listener){
          img.removeEventListener(onMouseOver);
          img.removeEventListener(onMouseLeave);
        }
        //set thumbnail to favicon
        var href = link.href;
        link.querySelectorAll(".thumbnail").forEach(function(img){
          var info = tippyTopSites.getSiteData(href);
          if(info.image_url != null){
            img.style.backgroundImage = "url(../node_modules/tippy-top-sites/images/"+info.image_url+")";
            img.style.backgroundColor = info.background_color;
            img.style.backgroundSize = "auto";
            img.style.backgroundPosition = "center";
          } else {
            var newUrl = new URL("/favicon.ico", href);
            img.style.backgroundImage = "url("+newUrl+")";
            img.style.backgroundSize = "100px";
            img.style.backgroundPosition = "center";
          }
        })
      })
    }
  })
}
function onMouseOver(e){
  //hide canvas/show gif
  var i = 1.0;
  var interval = setInterval(fade, 35);
  function fade(){
    e.target.style.opacity = i;
    i-=0.1;
    if (i <= 0){
      clearInterval(interval);
    }
  }
}
function onMouseLeave(e){
  //show canvas/hide gif
  var i = 0.0;
  var interval = setInterval(fade, 35);
  function fade(){
    e.target.style.opacity = i;
    i+=0.1;
    if (i >= 1.0){
      clearInterval(interval);
    }
  }
}
function onStorageChange(changes, area) {
  if(changes.newtab.newValue != changes.newtab.oldValue){
    setThumbnail();
    //refresh open new tab pages
    var querying = browser.tabs.query({title: "New Tab"});
    querying.then((tabs) => {
      tabs.forEach(function(tab){
        browser.tabs.reload(tab.id);
      })
    });
  }
}

document.addEventListener('DOMContentLoaded', loadTopSites);
browser.storage.onChanged.addListener(onStorageChange);

},{"tippy-top-sites":4}]},{},[8]);
