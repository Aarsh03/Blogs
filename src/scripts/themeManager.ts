import { isDarkTheme } from '../utils/theme';

// Make applyTheme globally available for command palette
declare global {
  interface Window {
    applyTheme: (theme: string) => void;
  }
}

document.addEventListener('astro:page-load', () => {
  const html = document.documentElement;
  const themeSwatches = document.querySelectorAll('.theme-swatch');

  window.applyTheme = function(theme: string) {
    html.setAttribute('data-theme', theme);
    html.setAttribute('data-theme-mode', isDarkTheme(theme) ? 'dark' : 'light');
    localStorage.setItem('theme', theme);
    
    // Update Custom Builder visibility
    const customToggleBtn = document.getElementById('custom-theme-toggle');
    const customBuilderBtn = document.getElementById('open-custom-theme-wizard');
    const isCustom = theme === 'custom';
    
    if (customToggleBtn) {
      customToggleBtn.setAttribute('aria-checked', String(isCustom));
      customToggleBtn.classList.toggle('on', isCustom);
    }
    if (customBuilderBtn) {
      customBuilderBtn.style.display = isCustom ? 'block' : 'none';
    }
    
    // Update Swatches
    themeSwatches.forEach(swatch => {
      swatch.classList.toggle('active', swatch.getAttribute('data-theme-val') === theme);
    });
  }

  // Sync icon on initial load
  const initialTheme = html.getAttribute('data-theme') || 'light';
  window.applyTheme(initialTheme);

  /* Theme Swatches */
  themeSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      window.applyTheme(swatch.getAttribute('data-theme-val') || 'light');
    });
  });

  /* Custom Theme Toggle */
  const customToggleBtn = document.getElementById('custom-theme-toggle');
  customToggleBtn?.addEventListener('click', () => {
    const isCurrentlyCustom = html.getAttribute('data-theme') === 'custom';
    if (!isCurrentlyCustom) {
      window.applyTheme('custom');
    } else {
      window.applyTheme('obsidian'); // fallback if toggled off
    }
  });
});
