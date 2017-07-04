'use strict';

//save user's preferences in storage
function saveOptions(){
  browser.storage.sync.set({
    mario: document.querySelector('#mario').checked,
    sayings: document.querySelector('#sayings').checked,
    newtab: document.querySelector('#newtab').value
  });
}
//load preferences or set to default true
function restoreOptions(){
  var getting = browser.storage.sync.get(null);
  getting.then((result)=>{
    if (result.mario==null){
      document.querySelector("#mario").checked=true;
    }
    else{
      document.querySelector("#mario").checked = result.mario ;
    }
    if (result.sayings==null){
      document.querySelector("#sayings").checked=true;
    }
    else{
      document.querySelector("#sayings").checked = result.sayings ;
    }
    if (result.newtab==null){
      document.querySelector("#newtab").value="on";
    }
    else{
      document.querySelector("#newtab").value = result.newtab ;
    }
  }, onError);

  function onError(error){
    console.log('Error: ${error}');
  }
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("#mario").addEventListener("click", saveOptions);
document.querySelector("#sayings").addEventListener("click", saveOptions);
document.querySelector("#newtab").addEventListener("change", saveOptions);
