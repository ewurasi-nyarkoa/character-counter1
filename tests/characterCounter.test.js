const { calculateStats, updateStats } = require('../index');
  
  describe('String Length Calculation', () => {
    test('Correctly counts characters in a given string', () => {
      const text = 'Hello World!';
      const result = calculateStats(text, false).charCount;
      expect(result).toBe(12);
    });
  
    test('Handles edge cases (empty input, special characters, excessive whitespace)', () => {
      const emptyText = '';
      const specialText = '   Hello,   World!   ';
      const resultEmpty = calculateStats(emptyText, false).charCount;
      const resultSpecial = calculateStats(specialText, false).charCount;
  
      expect(resultEmpty).toBe(0);
      expect(resultSpecial).toBe(21);
    });
  });
  
  describe('Word and Sentence Count', () => {
    test('Correctly splits text into words', () => {
      const text = 'Hello World! This is a test.';
      const result = calculateStats(text, false).wordCount;
      expect(result).toBe(6);
    });
  
    test('Correctly identifies sentence-ending punctuation', () => {
      const text = 'Hello. How are you doing? I am fine!';
      const result = calculateStats(text, false).sentenceCount;
      expect(result).toBe(3);
    });
  });
  
  describe('DOM Updates', () => {
    let domElements;
  
    beforeEach(() => {
      // Mock DOM elements
      const mockDocument = document.implementation.createHTMLDocument('Mock Document');
      mockDocument.body.innerHTML = `
      <div>
        <textarea></textarea>
        <div class="stat-card">
        <span class="text char-count"></span>
        <span class="text word-count"></span>
        <span class="text sentence-count"></span>
        </div>
        <p class="checkbox-options label"></p>
        <input type="checkbox" name="excludeSpaces" />
        <input type="checkbox" name="charLimit" />
        <div id="letterDensityContainer"></div>
        <div class="exceeded-limit"></div>
        <img id="logo" />
        <button id="themeToggle"></button>
        <input class="limit" />
      </div>
      `;
    
      domElements = {
      body: mockDocument.body,
      textarea: mockDocument.querySelector('textarea'),
      charCountEl: mockDocument.querySelector('.stat-card .text.char-count'),
      wordCountEl: mockDocument.querySelector('.stat-card .text.word-count'),
      sentenceCountEl: mockDocument.querySelector('.stat-card .text.sentence-count'),
      readingTimeEl: mockDocument.querySelector('.checkbox-options.label'),
      excludeSpacesCheckbox: mockDocument.querySelector('input[type="checkbox"][name="excludeSpaces"]'),
      charLimitCheckbox: mockDocument.querySelector('input[type="checkbox"][name="charLimit"]'),
      exceededLimitEl: mockDocument.querySelector('.exceeded-limit'),
      };
    });
  
    test('Simulates user typing and updates reading time dynamically', () => {
      domElements.textarea.value = 'Hello World!';
      updateStats(domElements);
      expect(domElements.readingTimeEl.textContent).toBe('Approx. reading time: 1 min read');
    });

    test('Simulates user typing and updates character count dynamically', () => {
      domElements.textarea.value = 'Hello World!';
      updateStats(domElements);
      expect(domElements.charCountEl.textContent).toBe('12');
    });

    test('Simulates user typing and updates word count dynamically', () => {
      domElements.textarea.value = 'Hello World!';
      updateStats(domElements);
      expect(domElements.wordCountEl.textContent).toBe('2');
    });

    test('Simulates user typing and updates sentence count dynamically', () => {
      domElements.textarea.value = 'Hello World!';
      updateStats(domElements);
      expect(domElements.sentenceCountEl.textContent).toBe('1');
    });
  
    test('Displays warnings when approaching/exceeding character limits', () => {
      window.CHARACTER_LIMIT = 12; 
      domElements.textarea.value = 'Hello World!';
      domElements.charLimitCheckbox.checked = true;
  
      updateStats(domElements);
  
      expect(domElements.exceededLimitEl.innerHTML).toContain('Limit reached!');
    });
  
    test('Handles reading time calculation correctly', () => {
      domElements.textarea.value = 'This is a test sentence.';
      updateStats(domElements);
      expect(domElements.readingTimeEl.textContent).toBe('Approx. reading time: 1 min read');
    });
  });