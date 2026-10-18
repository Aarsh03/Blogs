import { isDarkTheme } from '../utils/theme';

// Make applyTheme globally available for command palette
declare global {
  interface Window {
    applyTheme: (theme: string) => void;
  }
}

let _themeManagerDelegated = false;

window.applyTheme = function(theme: string) {
  const html = document.documentElement;
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
    customBuilderBtn.style.display = isCustom ? 'flex' : 'none';
  }
  
  // Update Swatches
  const themeSwatches = document.querySelectorAll('.theme-swatch');
  themeSwatches.forEach(swatch => {
    swatch.classList.toggle('active', swatch.getAttribute('data-theme-val') === theme);
  });
};

if (!_themeManagerDelegated && typeof window !== 'undefined') {
  _themeManagerDelegated = true;

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    // 1. Custom Theme Toggle click
    const customToggleBtn = target.closest('#custom-theme-toggle');
    if (customToggleBtn) {
      const html = document.documentElement;
      const isCurrentlyCustom = html.getAttribute('data-theme') === 'custom';
      if (!isCurrentlyCustom) {
        localStorage.setItem('preCustomTheme', html.getAttribute('data-theme') || 'obsidian');
        window.applyTheme('custom');
      } else {
        const prev = localStorage.getItem('preCustomTheme') || 'obsidian';
        window.applyTheme(prev);
      }
      return;
    }

    // 2. Theme Swatch click
    const swatch = target.closest('.theme-swatch') as HTMLElement;
    if (swatch) {
      window.applyTheme(swatch.getAttribute('data-theme-val') || 'light');
      return;
    }
  });
}

document.addEventListener('astro:page-load', () => {
  const html = document.documentElement;
  const initialTheme = html.getAttribute('data-theme') || 'light';
  window.applyTheme(initialTheme);
});
