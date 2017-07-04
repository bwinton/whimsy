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
function loadTopSites(){
  //display top sites
  browser.topSites.get().then((topSitesArray) => {
    var grid = document.querySelector("#newtab-grid");
    grid.innerHTML = "";
    for (let topSite of topSitesArray) {
      grid.innerHTML +=
      "<div class='newtab-cell'><div class='newtab-site' draggable='true' type='history'>"+
      "<a class='newtab-link' title="+topSite.title+" href="+topSite.url+">"+
      "<span class='newtab-thumbnail thumbnail' style='background-size: cover; background-position: center; background-image: ;'></span>"+
      "<span class='newtab-title'>"+topSite.title+"</span>"+
      "</a>"+
      "</div>"+
      "</div>"
    }
  }, onError)
  .then(initialize('https://bwinton.github.io/whimsy/thumbnail-gifs.txt', setThumbnail))
}

function setThumbnail(placeholders){
  if (pref == "on" || pref == null){
    document.querySelectorAll(".thumbnail").forEach(function(img){
      if(listener){
        img.removeEventListener("mouseover", onMouseOver);
        img.removeEventListener("mouseover", onMouseLeave);
      }
      let rand = Math.floor(Math.random() * placeholders.length);
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
