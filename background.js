var timer = {};
var current;

var sites = ['facebook', 'twitter'];

var startTimer = function(tabId) {
  current = tabId;
  timer[tabId] = new Date();
}

var stopTimer = function(tabId) {
  var duration = (new Date()) - timer[tabId];
  delete timer.tabId;

  current = false;
  console.log("Completed " + duration);
}

chrome.tabs.onActivated.addListener(function(){
  if(current) {
    stopTimer(current);
  }
})

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.url) {
    if (current) {
      stopTimer(current);
    }
    chrome.tabs.get(tabId, function(tab) {
      for (var i = sites.length - 1; i >= 0; i--) {
        if (tab.url.search(sites[i]) > -1) {
          console.log("Started for " + tab.url);
          startTimer(tabId);        
          return;
        }
      }

    });
  }
});

chrome.tabs.onCreated.addListener(function(tab) {
  chrome.pageAction.show(tab.id);
})

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  if(current){
    stopTimer(tabId);
  }
});