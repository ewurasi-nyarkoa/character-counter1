
const body = document.body;
const logo = document.getElementById("logo");
const themeToggle = document.getElementById("themeToggle");
const textarea = document.querySelector("textarea");
const limitInput = document.querySelector('.limit');
const exceededLimitEl = document.querySelector('.exceeded-limit');
const charCountEl = document.querySelectorAll(".stat-card .text")[0];
const wordCountEl = document.querySelectorAll(".stat-card .text")[1];
const sentenceCountEl = document.querySelectorAll(".stat-card .text")[2];
const readingTimeEl = document.querySelector(".checkbox-options p.label");
const excludeSpacesCheckbox = document.querySelectorAll("input[type='checkbox']")[0];
const charLimitCheckbox = document.querySelectorAll("input[type='checkbox']")[1];
const letterDensityContainer = document.getElementById("letterDensityContainer");
console.log(limitInput)


themeToggle.addEventListener("click", () => {
    const isDark = body.classList.toggle("light-theme");
  
    if (isDark) {
      // Light theme active
      logo.src = "./assets/images/logo-light-theme.svg";
      themeToggle.src = "./assets/images/icon-moon.svg"; 
      themeToggle.alt = "Dark Mode Toggle";
    } else {
      // Dark theme active
      logo.src = "./assets/images/logo-dark-theme.svg";
      themeToggle.src = "./assets/images/icon-sun.svg"; 
      themeToggle.alt = "Light Mode Toggle";
    }
  });

let CHARACTER_LIMIT = 300;
limitInput.addEventListener('input', () => {
  const newLimit = parseInt(limitInput.value);
  if (!isNaN(newLimit) && newLimit > 0) {
    CHARACTER_LIMIT = newLimit;
    updateCharacterCount(); 
  }
  
});


function updateStats() {
    let text = textarea.value;
  
    let charCount = excludeSpacesCheckbox.checked
      ? text.replace(/\s/g, "").length
      : text.length;
  
    let wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    let sentenceCount = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
  
    charCountEl.textContent = charCount;
    wordCountEl.textContent = wordCount;
    sentenceCountEl.textContent = sentenceCount;
  
    const readingTime = wordCount === 0 ? "< 0 minute" : `${Math.ceil(wordCount / 200)} min read`;
    readingTimeEl.textContent = `Approx. reading time: ${readingTime}`;

  
  
    if (charLimitCheckbox.checked && charCount > CHARACTER_LIMIT) {
      textarea.style.boxShadow = "0px 0px 8px 0px rgba(218,55,1,0.8)"; 
      exceededLimitEl.innerHTML = `<i class="fas fa-info-circle" style="color: red; margin-right: 6px;"></i> <span>Limit reached!Your text exceeds ${CHARACTER_LIMIT} characters.</span>`;

      exceededLimitEl.style.display = "block";
    } else {
      textarea.style.border = "";
      exceededLimitEl.innerHTML = "";
      exceededLimitEl.style.display = "none";
    }
  
 
    updateLetterDensity(text);
  }
// Function to update letter density  

textarea.addEventListener("input", updateStats);
excludeSpacesCheckbox.addEventListener("change", updateStats);
charLimitCheckbox.addEventListener("change", updateStats);

// Initial run
updateStats();

// Add event listeners to the checkboxes
excludeSpacesCheckbox.addEventListener("change", () => {
    console.log("Exclude spaces checkbox toggled");
    updateStats();
  });
  
  charLimitCheckbox.addEventListener("change", () => {
    console.log("Character limit checkbox toggled");
    if(charLimitCheckbox.checked){
      limitInput.classList.remove('limit-hidden')
      console.log('limit')
    }else{
      limitInput.classList.add('limit-hidden')
      console.log('limit-hidden')
    }
    updateStats();
  });   

  function updateLetterDensity(text) {
    const lettersOnly = text.toUpperCase().replace(/[^A-Z]/g, "");
    const totalLetters = lettersOnly.length;
    const letterMap = {};
  
    // Count letter frequency
    for (let char of lettersOnly) {
      letterMap[char] = (letterMap[char] || 0) + 1;
    }
  
    // Convert to array and sort by frequency
    const sortedLetters = Object.entries(letterMap).sort((a, b) => b[1] - a[1]);
  
    // Clear previous
    letterDensityContainer.innerHTML = "";
  
    // Show or hide the container based on letter count
    if (sortedLetters.length === 0) {
      letterDensityContainer.textContent = "No characters found. Start typing to see letter density.";
      letterDensityContainer.className = "letter";
      return; 
    } else {
      letterDensityContainer.style.display = "block";
    }


  sortedLetters.forEach(([letter, count], index) => {
    const percent = ((count / totalLetters) * 100).toFixed(2);
    const barWidth = Math.min(percent, 100);
  
    const row = document.createElement("div");
    row.classList.add("letter-row");
    row.innerHTML = `
      <span class="letter-label">${letter}</span>
      <div class="letter-bar-wrapper">
        <div class="letter-bar" style="width: ${barWidth}%"></div>
      </div>
      <span class="percentage">${count} (${percent}%)</span>
    `;
  
    // Hide anything after the 4th
    if (index > 3) {
      row.classList.add("hidden-letter");
      row.style.display = "none";
    }
  
    letterDensityContainer.appendChild(row);
  
    //  Add button after the 4th item
    if (index === 3 && sortedLetters.length > 4) {
      const seeMoreRow = document.createElement("div");
      seeMoreRow.classList.add("see-more");
      seeMoreRow.innerHTML = `
        <button class="see-more-btn">
          See More <span style="display:inline-block; transform: rotate(90deg);">➤</span>
        </button>
      `;
  
      seeMoreRow.querySelector(".see-more-btn").addEventListener("click", () => {
        const hiddenRows = document.querySelectorAll(".hidden-letter");
        hiddenRows.forEach(row => row.style.display = "flex"); 
        seeMoreRow.style.display = "none"; 
      });
  
      letterDensityContainer.appendChild(seeMoreRow);
    }
  });
  
  }
  
  

