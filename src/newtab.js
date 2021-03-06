'use strict'

var listener = false;
var tippyTopSites = require('tippy-top-sites');
var pref = null;

browser.storage.sync.get('newtab').then((result) => {
  pref = result.newtab;
});

function onError(error) {
  console.log(error);
}

function createElement(label, attrs, children=[]) {
  let rv = document.createElement(label);
  if (attrs) {
    for (let attr in attrs) {
      rv.setAttribute(attr, attrs[attr]);
    }
  }
  for (var index = 0; index < children.length; index++) {
    rv.appendChild(children[index]);
  }
  return rv;
}

function createTopSite(topSite) {
  console.log("Topsite:", topSite.title || topSite.url, topSite);
  const rv = createElement('div', {'class': 'newtab-cell', 'contextmenu': 'context-menu'}, [
    createElement('a', {'class': 'newtab-link', 'title': topSite.title || '', 'href':topSite.url}, [
      createElement('span', {'class': 'newtab-thumbnail thumbnail'}),
      createElement('span', {'class': 'newtab-title'}, [
        document.createTextNode(topSite.title || topSite.url)
      ])
    ])
  ]);
  return rv;
}

function loadTopSites(){
  //display top sites
  const menu = document.getElementById('context-menu');
  menu.addEventListener('click', e => {
    let copyElement = document.createElement('input');
    copyElement.setAttribute('type', 'text');
    copyElement.setAttribute('value', menu.dataset.url);
    copyElement = document.body.appendChild(copyElement);
    copyElement.select();
    document.execCommand('copy');
    copyElement.remove();
  });
  browser.topSites.get().then((topSitesArray) => {
    const node = document.getElementById('newtab-grid');

    const sites = document.createDocumentFragment(); 
    for (let topSite of topSitesArray) {
      sites.appendChild(createTopSite(topSite));
    }
    const grid = node.cloneNode(false);
    grid.append(sites);
    node.parentNode.replaceChild(grid, node);
    grid.addEventListener('contextmenu', e => {
      let target = e.target;
      while (target && !target.classList.contains('newtab-link')) {
        target = target.parentNode;
      }
      if (!target) {
        e.preventDefault();
        return false;
      }
      menu.dataset.url = target.dataset.url;
    });
  }, onError)
  .then(initialize('https://bwinton.github.io/whimsy/thumbnail-gifs.txt', setThumbnail))
  .then(initialize('https://bwinton.github.io/whimsy/urlbar-sayings.txt', setTitle));
}

function setTitle(placeholders) {
  let rand = Math.floor(Math.random() * placeholders.length);
  document.title = `New Tab: ${placeholders[rand]}`;
}

function setThumbnail(placeholders){
  if (pref == "on" || pref == null){
    document.querySelectorAll(".thumbnail").forEach(function(img){
      if(listener){
        img.removeEventListener("mouseover", onMouseOver);
        img.removeEventListener("mouseover", onMouseLeave);
      }
      let rand = Math.floor(Math.random() * placeholders.length);
      img.parentNode.dataset.url = placeholders[rand];
      img.style.backgroundImage = "url("+placeholders[rand]+")";
    })
  } else if (pref == "hover"){
    document.querySelectorAll(".newtab-link").forEach(function(link){
      //set default thumbnail
      var href = link.href;
      link.querySelectorAll(".thumbnail").forEach(function(img){
        createCanvas(href, link, img);
      })
    })
  } else if (pref == "pics"){
    document.querySelectorAll(".thumbnail").forEach(function(img){
      if(listener){
        img.removeEventListener("mouseover", onMouseOver);
        img.removeEventListener("mouseout", onMouseLeave);
      }
      var newImg = document.createElement('img');
      img.parentNode.replaceChild(newImg, img);
      let rand = Math.floor(Math.random() * placeholders.length);
      newImg.src = placeholders[rand];
      newImg.style.opacity = 0;
      newImg.style.marginTop = "-180px";
      //set to paused gif
      var c = document.createElement('canvas');
      var width = c.width = newImg.width = 290;
      var height = c.height = newImg.height = 180;
      var freeze = function(){
        c.getContext('2d').drawImage(newImg,0,0,width,height);
        // c.style.position = 'absolute';
        newImg.parentNode.insertBefore(c, newImg);
      }
      newImg.addEventListener('load', freeze, true);
      newImg.addEventListener("mouseover", onMouseOver);
      newImg.addEventListener("mouseout", onMouseLeave);
    })
  } else if (pref == "off"){
    document.querySelectorAll(".newtab-link").forEach(function(link){
      //set thumbnail to favicon
      var href = link.href;
      link.querySelectorAll(".thumbnail").forEach(function(img){
        if(listener){
          img.removeEventListener("mouseover", onMouseOver);
          img.removeEventListener("mouseout", onMouseLeave);
        }
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
}
function createCanvas(href, link, img){
  //set gifs
  let rand = Math.floor(Math.random() * placeholders.length);
  img.parentNode.dataset.url = placeholders[rand];
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
}

function onMouseOver(e){
  //hide canvas/show gif
  // console.log("Got over", e.target);
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
    pref = changes.newtab.newValue;
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
