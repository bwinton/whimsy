'use strict';

//save user's preferences in storage
function saveOptions(){
  browser.storage.sync.set({
    mario: document.querySelector('#mario').checked,
    sayings: document.querySelector('#sayings').checked
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
  }, onError);

  function onError(error){
    console.log('Error: ${error}');
  }
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("#mario").addEventListener("click", saveOptions);
document.querySelector("#sayings").addEventListener("click", saveOptions);
