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
      excludeSpacesCheckbox.checked
    );
  
    // Update DOM elements
    charCountEl.textContent = charCount;
    wordCountEl.textContent = wordCount;
    sentenceCountEl.textContent = sentenceCount;
    readingTimeEl.textContent = `Approx. reading time: ${readingTime}`;
  

    if (charLimitCheckbox.checked && charCount > window.CHARACTER_LIMIT) {
      textarea.style.boxShadow = '0px 0px 8px 0px rgba(218,55,1,0.8)';
      exceededLimitEl.innerHTML = `<i class="fas fa-info-circle" style="color: red; margin-right: 6px;"></i> <span>Limit reached! Your text exceeds ${window.CHARACTER_LIMIT} characters.</span>`;
      exceededLimitEl.style.display = 'block';
    } else {
      textarea.style.boxShadow = 'none';
      exceededLimitEl.innerHTML = '';
      exceededLimitEl.style.display = 'none';
    }
  }
  
  // Test 
  describe('String Length Calculation', () => {
    test('Correctly counts characters in a given string', () => {
      const text = 'Hello World!';
      const result = calculateStats(text, false);
      expect(result.charCount).toBe(12);
    });
  
    test('Handles edge cases (empty input, special characters, excessive whitespace)', () => {
      const emptyText = '';
      const specialText = '   Hello,   World!   ';
      const resultEmpty = calculateStats(emptyText, false);
      const resultSpecial = calculateStats(specialText, false);
  
      expect(resultEmpty.charCount).toBe(0);
      expect(resultSpecial.charCount).toBe(21);
    });
  });
  
  describe('Word and Sentence Count', () => {
    test('Correctly splits text into words', () => {
      const text = 'Hello World! This is a test.';
      const result = calculateStats(text, false);
      expect(result.wordCount).toBe(6);
    });
  
    test('Correctly identifies sentence-ending punctuation', () => {
      const text = 'Hello. How are you doing? I am fine!';
      const result = calculateStats(text, false);
      expect(result.sentenceCount).toBe(3);
    });
  });
  
  describe('DOM Updates', () => {
    let domElements;
  
    beforeEach(() => {
      // Mock DOM elements
      document.body.innerHTML = `
        <div>
          <textarea></textarea>
          <div class="stat-card">
            <span class="text"></span>
            <span class="text"></span>
            <span class="text"></span>
          </div>
          <p class="checkbox-options label"></p>
          <input type="checkbox" />
          <input type="checkbox" />
          <div id="letterDensityContainer"></div>
          <div class="exceeded-limit"></div>
          <img id="logo" />
          <button id="themeToggle"></button>
          <input class="limit" />
        </div>
      `;
  
      domElements = {
        body: document.body,
        textarea: document.querySelector('textarea'),
        charCountEl: document.querySelectorAll('.stat-card .text')[0],
        wordCountEl: document.querySelectorAll('.stat-card .text')[1],
        sentenceCountEl: document.querySelectorAll('.stat-card .text')[2],
        readingTimeEl: document.querySelector('.checkbox-options.label'),
        excludeSpacesCheckbox: document.querySelectorAll('input[type="checkbox"]')[0],
        charLimitCheckbox: document.querySelectorAll('input[type="checkbox"]')[1],
        exceededLimitEl: document.querySelector('.exceeded-limit'),
      };
    });
  
    test('Simulates user typing and updates counters dynamically', () => {
      domElements.textarea.value = 'Hello World!';
      updateStats(domElements);
  
      expect(domElements.charCountEl.textContent).toBe('12'); 
      expect(domElements.wordCountEl.textContent).toBe('2');
      expect(domElements.sentenceCountEl.textContent).toBe('1');
    });
  
    test('Displays warnings when approaching/exceeding character limits', () => {
      window.CHARACTER_LIMIT = 10; 
      domElements.textarea.value = 'Hello World!';
      domElements.charLimitCheckbox.checked = true;
  
      updateStats(domElements);
  
      expect(domElements.exceededLimitEl.style.display).toBe('block');
      expect(domElements.exceededLimitEl.innerHTML).toContain('Limit reached!');
    });
  
    test('Updates estimated reading time correctly', () => {
      domElements.textarea.value = 'This is a test message with multiple words.';
      updateStats(domElements);
  
      expect(domElements.readingTimeEl.textContent).toBe('Approx. reading time: 1 min read');
    });
  });