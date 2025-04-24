
const body = document.body;
const logo = document.getElementById("logo");
const themeToggle = document.getElementById("themeToggle");
const textarea = document.querySelector("textarea");
const limitInput = document.getElementById("charLimitInput");
const exceededLimitEl = document.querySelector(".exceeded-limit");
const charCountEl = document.querySelector("#charCount .text");
const wordCountEl = document.querySelector("#wordCount .text");
const sentenceCountEl = document.querySelector("#sentenceCount .text");
const readingTimeEl = document.getElementById("readingTime");
const excludeSpacesCheckbox = document.getElementById("excludeSpaces");
const charLimitCheckbox = document.getElementById("charLimitCheckbox");
const letterDensityContainer = document.getElementById("letterDensityContainer");

let CHARACTER_LIMIT = parseInt(limitInput.value) || 1000;

function setTheme(isDark) {
  body.classList.toggle("light-theme", isDark);
  logo.src = isDark ? "./assets/images/logo-light-theme.svg" : "./assets/images/logo-dark-theme.svg";
  themeToggle.src = isDark ? "./assets/images/icon-moon.svg" : "./assets/images/icon-sun.svg";
  themeToggle.alt = isDark ? "Dark Mode Toggle" : "Light Mode Toggle";
  localStorage.setItem("isLightTheme", JSON.stringify(isDark));
}


window.addEventListener("DOMContentLoaded", () => {
  const isLightTheme = JSON.parse(localStorage.getItem("isLightTheme"));
  if (isLightTheme !== null) {
    setTheme(isLightTheme);
  }
});


themeToggle.addEventListener("click", () => {
  const isDark = body.classList.toggle("light-theme");
  setTheme(isDark);
});


limitInput.addEventListener('input', () => {
  const newLimit = parseInt(limitInput.value);
  if (!isNaN(newLimit) && newLimit > 0) {
    CHARACTER_LIMIT = newLimit;
    if (charLimitCheckbox.checked) {
      updateStats();
    }
  }
});

function updateStats() {
  let text = textarea.value;
  let charCount = excludeSpacesCheckbox.checked ? text.replace(/\s/g, "").length : text.length;
  let wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  let sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

  charCountEl.textContent = charCount;
  wordCountEl.textContent = wordCount;
  sentenceCountEl.textContent = sentenceCount;

  const readingTime = wordCount === 0 ? "< 0 minute" : `${Math.ceil(wordCount / 200)} min read`;
  readingTimeEl.textContent = `Approx. reading time: ${readingTime}`;

  if (charLimitCheckbox.checked && charCount > CHARACTER_LIMIT) {
    textarea.style.boxShadow = "0px 0px 8px 0px rgba(218,55,1,0.8)";
    exceededLimitEl.innerHTML = `<i class="fas fa-info-circle" style="color: #fe8159; margin-right: 6px;"></i><span style="color: #fe8159"> Limit reached! Your text exceeds ${CHARACTER_LIMIT} characters.</span>`;
    exceededLimitEl.style.display = "block";
  } else {
    textarea.style.boxShadow = "none";
    exceededLimitEl.innerHTML = "";
    exceededLimitEl.style.display = "none";
  }

  updateLetterDensity(text);
}

function generateLetterRow(letter, count, percent) {
  const row = document.createElement("div");
  row.classList.add("letter-row");
  row.innerHTML = `
    <span class="letter-label">${letter}</span>
    <div class="letter-bar-wrapper">
      <div class="letter-bar" style="width: ${percent}%"></div>
    </div>
    <span class="percentage">${count} (${percent}%)</span>
  `;
  return row;
}

function updateLetterDensity(text) {
  const lettersOnly = text.toUpperCase().replace(/[^A-Z]/g, "");
  const totalLetters = lettersOnly.length;
  const letterMap = {};

  for (let char of lettersOnly) {
    letterMap[char] = (letterMap[char] || 0) + 1;
  }

  const sortedLetters = Object.entries(letterMap).sort((a, b) => b[1] - a[1]);
  letterDensityContainer.innerHTML = "";

  if (sortedLetters.length === 0) {
    letterDensityContainer.innerHTML = `<p class="no-letters-message">No characters found. Start typing to see letter density.</p>`;
    return;
  }

  letterDensityContainer.style.display = "block";

  sortedLetters.forEach(([letter, count], index) => {
    const percent = ((count / totalLetters) * 100).toFixed(2);
    const row = generateLetterRow(letter, count, percent);

    if (index > 3) {
      row.classList.add("hidden-letter");
      row.style.display = "none";
    }

    letterDensityContainer.appendChild(row);
  });

  if (sortedLetters.length > 4) {
    const toggleRow = document.createElement("div");
    toggleRow.classList.add("see-more");
    let expanded = false;
    toggleRow.innerHTML = `
      <button class="see-more-btn">
        See More <span style="display:inline-block; transform: rotate(90deg);">➤</span>
      </button>
    `;

    const btn = toggleRow.querySelector(".see-more-btn");
    btn.addEventListener("click", () => {
      expanded = !expanded;
      const hiddenRows = document.querySelectorAll(".hidden-letter");
      hiddenRows.forEach(row => row.style.display = expanded ? "flex" : "none");
      btn.innerHTML = expanded
        ? `Show Less <span style="display:inline-block; transform: rotate(-90deg);">➤</span>`
        : `See More <span style="display:inline-block; transform: rotate(90deg);">➤</span>`;
    });

    letterDensityContainer.appendChild(toggleRow);
  }
}

function handleCheckboxChange() {
  console.log("Checkbox toggled");
  limitInput.classList.toggle('limit-hidden', !charLimitCheckbox.checked);
  updateStats();
}

textarea.addEventListener("input", updateStats);
excludeSpacesCheckbox.addEventListener("change", handleCheckboxChange);
charLimitCheckbox.addEventListener("change", handleCheckboxChange);


updateStats();

module.exports = {updateStats};
