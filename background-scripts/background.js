function openPage(){
  browser.tabs.create({
    url: "http://chilloutandwatchsomecatgifs.com/"
  });
}

browser.browserAction.onClicked.addListener(openPage);
