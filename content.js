function scrapeEtsyTags() {
  console.log('Scraping tags from the page.');

  // Use the correct selector based on the provided HTML structure for main tags
  const tagElements = document.querySelectorAll('h3.tag-card-title');
  const mainTags = Array.from(tagElements).map(el => el.textContent.trim());

  if (mainTags.length === 0) {
    console.log('No main tags found using h3.tag-card-title');
  }

  // Use the correct selector based on the provided HTML structure for related tags
  const relatedTagElements = document.querySelectorAll('.wt-action-group__item-container a');
  const relatedTags = Array.from(relatedTagElements).map(el => el.textContent.trim());

  // Filter out any unrelated elements
  const filteredRelatedTags = relatedTags.filter(tag => !tag.match(/(Previous page|Current page|\d|Next page)/));

  if (filteredRelatedTags.length === 0) {
    console.log('No related tags found using .wt-action-group__item-container a');
  }

  // Send the tags back to the popup
  chrome.runtime.sendMessage({ mainTags: mainTags, relatedTags: filteredRelatedTags });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrapeTags') {
    scrapeEtsyTags();
    sendResponse({ status: 'scraping' });
  }
});
