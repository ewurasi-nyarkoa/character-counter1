// Define the required functions directly in the test file for testing

function calculateStats(text, excludeSpaces = false) {
    const charCount = excludeSpaces ? text.replace(/\s/g, '').length : text.length;
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const sentenceCount = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
    const readingTime = wordCount === 0 ? '< 0 minute' : `${Math.ceil(wordCount / 200)} min read`;
  
    return { charCount, wordCount, sentenceCount, readingTime };
  }
  
  // Update Stats in the DOM
function updateStats(domElements) {
    const { textarea, charCountEl, wordCountEl, sentenceCountEl, readingTimeEl, excludeSpacesCheckbox, charLimitCheckbox, exceededLimitEl } = domElements;
  
    const text = textarea.value;
  
    // Calculate stats
    const { charCount, wordCount, sentenceCount, readingTime } = calculateStats(
      text,
      excludeSpacesCheckbox?.checked || false
    );
        // Update DOM elements
        charCountEl.textContent = charCount;
        wordCountEl.textContent = wordCount;
        sentenceCountEl.textContent = sentenceCount;
        readingTimeEl.textContent = `Approx. reading time: ${readingTime}`;
      
    
        if (charLimitCheckbox?.checked && charCount > window.CHARACTER_LIMIT) {
          exceededLimitEl.innerHTML = `<i class="fas fa-info-circle" style="color: red; margin-right: 6px;"></i> <span>Limit reached! Your text exceeds ${window.CHARACTER_LIMIT} characters.</span>`;
         } else {
          exceededLimitEl.innerHTML = '';
        }
     }

module.exports = { calculateStats, updateStats };