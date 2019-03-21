function openPage(){
  browser.tabs.create({
    url: "https://chilloutandwatchsomecatgifs.github.io/"
  });
}

browser.browserAction.onClicked.addListener(openPage);
