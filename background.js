chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'setTags') {
    chrome.storage.local.set({
      mainTags: message.mainTags,
      relatedTags: message.relatedTags
    });
  }
});
