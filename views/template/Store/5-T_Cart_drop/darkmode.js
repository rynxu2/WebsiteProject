// Dark Mode Toggle Functionality
document.addEventListener("DOMContentLoaded", function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // Check for saved dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Apply saved preference
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      updateDarkModeButton(true);
    }
    
    // Toggle dark mode on button click
    darkModeToggle.addEventListener('click', function() {
      const isDarkModeActive = document.body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', isDarkModeActive);
      updateDarkModeButton(isDarkModeActive);
    });
    
    // Update button text and icon
    function updateDarkModeButton(isDarkMode) {
      if (isDarkMode) {
        darkModeToggle.innerHTML = '<i class="fas fa-sun me-1"></i> Light Mode';
        darkModeToggle.classList.remove('btn-outline-light');
        darkModeToggle.classList.add('btn-light');
      } else {
        darkModeToggle.innerHTML = '<i class="fas fa-moon me-1"></i> Dark Mode';
        darkModeToggle.classList.remove('btn-light');
        darkModeToggle.classList.add('btn-outline-light');
      }
    }
  });