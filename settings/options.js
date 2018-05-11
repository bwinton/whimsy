'use strict';

//save user's preferences in storage
function saveOptions() {
  let overrideNewtab = document.querySelector('#newtabOverride'); 
  browser.whimsyExp.setNewtabOverride(overrideNewtab.checked);
  document.querySelector('#newtab-submenu').style.display = overrideNewtab.checked ? "contents" : "none";
  
  browser.storage.sync.set({
    mario: document.querySelector('#mario').checked,
    sayings: document.querySelector('#sayings').checked,
    newtab: document.querySelector('#newtab').value,
    newtabOverride: overrideNewtab.checked
  });
}

//load preferences or set to default true
function restoreOptions(){
  let overrideNewtab = document.querySelector('#newtabOverride'); 
  var getting = browser.storage.sync.get(null);
  getting.then((result)=>{
    if (!result.mario){
      document.querySelector("#mario").checked = true;
    } else {
      document.querySelector("#mario").checked = result.mario;
    }
    if (!result.sayings){
      document.querySelector("#sayings").checked = true;
    } else {
      document.querySelector("#sayings").checked = result.sayings;
    }
    if (!result.newtab){
      document.querySelector("#newtab").value = "on";
    } else {
      document.querySelector("#newtab").value = result.newtab;
    }
    if (!result.newtabOverride){
      overrideNewtab.checked = true;
    } else {
      overrideNewtab.checked = result.newtabOverride;
    }
    browser.whimsyExp.setNewtabOverride(overrideNewtab.checked);
    overrideNewtab.checked ? document.querySelector('#newtab-submenu').style.display = "contents": "none";
  }, onError);

  function onError (error){
    console.log('Error: ${error}');
  }
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("#mario").addEventListener("click", saveOptions);
document.querySelector("#sayings").addEventListener("click", saveOptions);
document.querySelector("#newtab").addEventListener("change", saveOptions);
document.querySelector("#newtabOverride").addEventListener("click", saveOptions);
