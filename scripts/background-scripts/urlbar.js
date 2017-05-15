'use strict'

var placeholders = [];
var url = 'https://raw.github.com/bwinton/whimsy/gh-pages/urlbar-sayings.txt';

setDefaults([
  'Where do you want to go today?',
  'Just type ”google.com“.  You know you’re going to.',
  'Let’s do this thing!',
  'Hey, I wonder what we should have for lunch?',
  'Where to, boss?',
  'I hear Facebook is nice this time of year…',
  'You know you can search from here, right?',
  'Have you thought about trying Private Browsing Mode?',
  'You are in a maze of twisty web pages, all alike.',
  'Hi!  My name is Url.'
]);

function setDefaults(defaults){
  placeholders = defaults;
}
function loadPlaceholders() {
  //load sayings from url
  return new Promise((resolve, reject) => {
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", () => {
      if (req.status === 200){
        resolve(req.response);
      } else {
        reject(Error("Error code: " + req.statusText));
      }
    });
    req.send();
  });
}
function onChange(text, suggest){
  //get preference setting
  var getting = browser.storage.sync.get('sayings');
  getting.then((result)=>{
    if (result.sayings){
      //load new saying on input changes
      loadPlaceholders()
      .then(response => {
        placeholders = response.split('\n');
        placeholders = placeholders.map(function(x){
          return x.trim();
        }).filter(function(x){
          return !x.startsWith('#') && (x !== '');
        });
      })
      .then(addSuggestions)
      .then(suggest);
    }
  });
}
function addSuggestions(){
  return new Promise(resolve => {
    let suggestions = [];
    //pick a random saying
    let rand = Math.floor(Math.random() * placeholders.length);
    //add as suggestion
    suggestions.push({
      content: placeholders[rand],
      description: placeholders[rand],
    });
    return resolve(suggestions);
  });
}
function onCreateTab(tab){
  //set current tab browserAction title to random saying
  let rand = Math.floor(Math.random() * placeholders.length);
  browser.browserAction.setTitle({
    title: placeholders[rand],
    tabId: tab.id
  });
}

//browser.omnibox.setDefaultSuggestion({description: "Whimsy sayings"});
browser.omnibox.onInputChanged.addListener(onChange);
browser.tabs.onCreated.addListener(onCreateTab);
