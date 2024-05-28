function scrapeTags() {
  const mainTags = Array.from(document.querySelectorAll('h3.tag-card-title')).map(tag => tag.textContent.trim());

  const relatedTags = Array.from(document.querySelectorAll('.wt-action-group__item-container a'))
    .map(tag => tag.textContent.trim())
    .filter(tag => !tag.toLowerCase().includes('page'));

  chrome.runtime.sendMessage({
    action: 'setTags',
    mainTags: mainTags,
    relatedTags: relatedTags
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'scrapeTags') {
    scrapeTags();
    sendResponse({ status: 'tags scraped' });
  }
});
