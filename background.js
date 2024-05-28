chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: scrapeEtsyTags
  });
});

function scrapeEtsyTags() {
  console.log('Background script: content script triggered.');
}
