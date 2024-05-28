document.addEventListener('DOMContentLoaded', () => {
    const scrapeButton = document.getElementById('scrapeTagsButton');
    const copyButton = document.getElementById('copyButton');
    const clearButton = document.getElementById('clearButton');
    const mainTagsTextbox = document.getElementById('mainTagsTextbox');
    const relatedTagsTextbox = document.getElementById('relatedTagsTextbox');
  
    // Load saved tags from local storage
    mainTagsTextbox.value = localStorage.getItem('mainTags') || '';
    relatedTagsTextbox.value = localStorage.getItem('relatedTags') || '';
  
    scrapeButton.addEventListener('click', () => {
      // Send a message to the content script to scrape tags
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'scrapeTags' }, (response) => {
          console.log(response.status);
        });
      });
    });
  
    // Listen for messages from the content script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.mainTags) {
        // Display the main tags in the text box
        mainTagsTextbox.value = message.mainTags.join(', ');
        // Save to local storage
        localStorage.setItem('mainTags', mainTagsTextbox.value);
      }
      if (message.relatedTags) {
        // Display the related tags in the text box
        relatedTagsTextbox.value = message.relatedTags.join(', ');
        // Save to local storage
        localStorage.setItem('relatedTags', relatedTagsTextbox.value);
      }
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
      localStorage.removeItem('mainTags');
      localStorage.removeItem('relatedTags');
    });
  });
  