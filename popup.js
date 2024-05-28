document.addEventListener('DOMContentLoaded', () => {
    const scrapeButton = document.getElementById('scrapeTagsButton');
    const copyButton = document.getElementById('copyButton');
    const clearButton = document.getElementById('clearButton');
    const mainTagsTextbox = document.getElementById('mainTagsTextbox');
    const relatedTagsTextbox = document.getElementById('relatedTagsTextbox');
  
    // Load saved tags from local storage
    chrome.storage.local.get(['mainTags', 'relatedTags'], (result) => {
      mainTagsTextbox.value = result.mainTags || '';
      relatedTagsTextbox.value = result.relatedTags || '';
    });
  
    scrapeButton.addEventListener('click', () => {
      // Send a message to the content script to scrape tags
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: scrapeTags
        }, (injectionResults) => {
          for (const frameResult of injectionResults) {
            const { mainTags, relatedTags } = frameResult.result;
            mainTagsTextbox.value = mainTags.join(', ');
            relatedTagsTextbox.value = relatedTags.join(', ');
            // Save to local storage
            chrome.storage.local.set({
              mainTags: mainTagsTextbox.value,
              relatedTags: relatedTagsTextbox.value
            });
          }
        });
      });
    });
  
    // Copy the content of both text boxes to clipboard
    copyButton.addEventListener('click', () => {
      // Create a temporary textarea element to hold the text
      const tempTextarea = document.createElement('textarea');
      tempTextarea.style.position = 'fixed'; // Avoid scrolling to bottom
      tempTextarea.style.opacity = '0'; // Hide the element
      tempTextarea.value = `${mainTagsTextbox.value}\t${relatedTagsTextbox.value}`;
      document.body.appendChild(tempTextarea);
      tempTextarea.select();
      document.execCommand('copy');
      document.body.removeChild(tempTextarea);
      alert('Tags copied to clipboard!');
    });
  
    // Clear the content of both text boxes
    clearButton.addEventListener('click', () => {
      mainTagsTextbox.value = '';
      relatedTagsTextbox.value = '';
      chrome.storage.local.remove(['mainTags', 'relatedTags']);
    });
  });
  
  function scrapeTags() {
    const mainTags = Array.from(document.querySelectorAll('h3.tag-card-title')).map(tag => tag.textContent.trim());
  
    const relatedTags = Array.from(document.querySelectorAll('.wt-action-group__item-container a'))
      .map(tag => tag.textContent.trim())
      .filter(tag => !tag.toLowerCase().includes('page'));
  
    return { mainTags, relatedTags };
  }
  