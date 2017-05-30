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
