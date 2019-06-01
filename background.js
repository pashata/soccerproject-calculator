chrome.browserAction.setBadgeBackgroundColor({ color: [165, 14, 14, 255] });
chrome.browserAction.setBadgeText({text: '5'});

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({url: chrome.extension.getURL('notes.html')});
});