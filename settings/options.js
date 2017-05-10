'use strict';

//save user's Mario mode preference in storage
function saveOptions(e){
   browser.storage.sync.set({
      mario: document.querySelector('#mario').checked
   });
   e.preventDefault();
}
//load Mario mode preference or set to default true
function restoreOptions(){
   var getting = browser.storage.sync.get('mario');
   getting.then((result)=>{
      document.querySelector("#mario").checked = result.mario || false;
   });

   function onError(error){
      console.log('Error: ${error}');
   }
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
