'use strict'

var placeholders = [];
var url = 'https://bwinton.github.io/whimsy/urlbar-sayings.txt';

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
initialize('https://bwinton.github.io/whimsy/urlbar-sayings.txt', setTitle);

function setDefaults(defaults){
  placeholders = defaults;
}
function setTitle(placeholders){
  var getting = browser.storage.sync.get('sayings');
  getting.then((result)=>{
    if (result.sayings || result.sayings == null){
      //set browserAction title to random saying
      let rand = Math.floor(Math.random() * placeholders.length);
      browser.tabs.onActivated.addListener(onActivated);
      browser.browserAction.setTitle({
        title: placeholders[rand]
      });
    } else {
      browser.tabs.onActivated.removeListener(onActivated);
      browser.browserAction.setTitle({
        title: "Whimsy"
      });
    }
  })
}
function onChange(text, suggest){
  //get preference setting
  var getting = browser.storage.sync.get('sayings');
  getting.then((result)=>{
    if (result.sayings || result.sayings == null){
      addSuggestions()
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
function onActivated(activeInfo){
  let rand = Math.floor(Math.random() * placeholders.length);
  browser.browserAction.setTitle({
    title: placeholders[rand],
    tabId: activeInfo.tabId
  });
}
function onStorageChange(changes, area) {
  if (changes.sayings.oldValue != changes.sayings.newValue){
    setTitle(placeholders);
  }
}

//browser.omnibox.setDefaultSuggestion({description: "Whimsy sayings"});
browser.omnibox.onInputChanged.addListener(onChange);
browser.tabs.onActivated.addListener(onActivated);
browser.storage.onChanged.addListener(onStorageChange);
