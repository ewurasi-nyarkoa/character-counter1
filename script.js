
const body = document.body;
const logo = document.getElementById("logo");
const themeToggle = document.getElementById("themeToggle");



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


