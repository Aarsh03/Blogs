import { isDarkTheme } from '../utils/theme';

// Module-level handlers to track listeners and prevent leaks
let _navScrollListener: EventListener | null = null;
let _navSettingsClickListener: EventListener | null = null;
let _navSettingsKeydownListener: EventListener | null = null;

// Page-load handles DOM-specific bindings (buttons, menus)
document.addEventListener('astro:page-load', () => {
  
  // Clean up previous if any
  if (_navScrollListener) {
    window.removeEventListener('scroll', _navScrollListener);
  }
  
  let lastScroll = window.scrollY;
  let ticking = false;
  
  _navScrollListener = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const navbar = document.querySelector('.navbar');
        const currentScroll = window.scrollY;

        if (currentScroll <= 0) {
          navbar?.classList.remove('navbar--hidden');
        } else if (currentScroll > lastScroll) {
          navbar?.classList.add('navbar--hidden');
          // Close settings panel when navbar hides
          const panel = document.getElementById('settings-panel');
          const btn = document.getElementById('settings-toggle');
          if (panel?.getAttribute('aria-hidden') === 'false') {
            panel.setAttribute('aria-hidden', 'true');
            btn?.setAttribute('aria-expanded', 'false');
            btn?.classList.remove('active');
          }
        } else if (currentScroll < lastScroll) {
          navbar?.classList.remove('navbar--hidden');
        }

        if (currentScroll > 20) {
          navbar?.classList.add('navbar--scrolled');
        } else {
          navbar?.classList.remove('navbar--scrolled');
        }

        lastScroll = currentScroll;
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', _navScrollListener, { passive: true });
  
  // Initial check for shadow
  _navScrollListener(new Event('scroll'));

  /* ── Mobile menu ── */
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-overlay');

  function toggleMenu() {
    const isOpen = menu?.classList.toggle('open');
    overlay?.classList.toggle('open');
    btn?.classList.toggle('open');
    btn?.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  btn?.addEventListener('click', toggleMenu);
  overlay?.addEventListener('click', toggleMenu);

  /* ── Theme Manager ── */
  const html = document.documentElement;

  function applyTheme(theme: string) {
    html.setAttribute('data-theme', theme);
    html.setAttribute('data-theme-mode', isDarkTheme(theme) ? 'dark' : 'light');
    localStorage.setItem('theme', theme);
    
    // Update Swatches
    document.querySelectorAll('.theme-swatch').forEach(swatch => {
      swatch.classList.toggle('active', swatch.getAttribute('data-theme-val') === theme);
    });
  }

  // Sync icon on initial load
  const initialTheme = html.getAttribute('data-theme') || 'light';
  applyTheme(initialTheme);

  /* ── Settings Panel ── */
  const settingsBtn = document.getElementById('settings-toggle');
  const settingsPanel = document.getElementById('settings-panel');
  const fontOptions = document.querySelectorAll('.font-option');
  const layoutOptions = document.querySelectorAll('.layout-option');
  const themeSwatches = document.querySelectorAll('.theme-swatch');
  const eyeComfortBtn = document.getElementById('eye-comfort-toggle');

  function closeSettings() {
    settingsPanel?.setAttribute('aria-hidden', 'true');
    settingsBtn?.setAttribute('aria-expanded', 'false');
    settingsBtn?.classList.remove('active');
  }

  function openSettings() {
    settingsPanel?.setAttribute('aria-hidden', 'false');
    settingsBtn?.setAttribute('aria-expanded', 'true');
    settingsBtn?.classList.add('active');
  }

  settingsBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = settingsPanel?.getAttribute('aria-hidden') === 'false';
    if (isOpen) closeSettings(); else openSettings();
  });

  settingsPanel?.addEventListener('click', (e) => e.stopPropagation());

  if (_navSettingsClickListener) {
    document.removeEventListener('click', _navSettingsClickListener);
  }
  _navSettingsClickListener = () => closeSettings();
  document.addEventListener('click', _navSettingsClickListener);

  if (_navSettingsKeydownListener) {
    document.removeEventListener('keydown', _navSettingsKeydownListener);
  }
  _navSettingsKeydownListener = (e: Event) => { if ((e as KeyboardEvent).key === 'Escape') closeSettings(); };
  document.addEventListener('keydown', _navSettingsKeydownListener);

  /* ── Font picker ── */
  function applyFont(font: string) {
    html.setAttribute('data-font', font);
    localStorage.setItem('font', font);
    fontOptions.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-font') === font);
    });
  }

  const initialFont = localStorage.getItem('font') || 'serif';
  applyFont(initialFont);

  fontOptions.forEach(btn => {
    if (!btn.classList.contains('layout-option')) {
      btn.addEventListener('click', () => {
        applyFont(btn.getAttribute('data-font') || 'serif');
      });
    }
  });

  /* ── Layout picker ── */
  function applyLayout(layout: string) {
    html.setAttribute('data-layout', layout);
    localStorage.setItem('layout', layout);
    layoutOptions.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-layout-val') === layout);
    });
  }

  const initialLayout = localStorage.getItem('layout') || 'narrow';
  applyLayout(initialLayout);

  layoutOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      applyLayout(btn.getAttribute('data-layout-val') || 'narrow');
    });
  });

  /* ── Theme Swatches ── */
  themeSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      applyTheme(swatch.getAttribute('data-theme-val') || 'light');
    });
  });

  /* ── Eye Comfort ── */
  const eyeComfortSliderContainer = document.getElementById('eye-comfort-slider-container');
  const eyeComfortSlider = document.getElementById('eye-comfort-slider') as HTMLInputElement;
  
  function applyEyeComfort(on: boolean) {
    html.setAttribute('data-eye-comfort', on ? 'on' : 'off');
    localStorage.setItem('eye-comfort', on ? 'on' : 'off');
    eyeComfortBtn?.setAttribute('aria-checked', String(on));
    eyeComfortBtn?.classList.toggle('on', on);
    if (eyeComfortSliderContainer) {
      eyeComfortSliderContainer.style.display = on ? 'block' : 'none';
    }
  }

  function applyEyeComfortIntensity(val: string) {
    html.style.setProperty('--eye-comfort-intensity', (parseInt(val) / 100).toString());
    localStorage.setItem('eye-comfort-intensity', val);
    if (eyeComfortSlider) {
      eyeComfortSlider.value = val;
    }
  }

  const initialEyeComfort = localStorage.getItem('eye-comfort') === 'on';
  applyEyeComfort(initialEyeComfort);
  
  const initialEyeComfortIntensity = localStorage.getItem('eye-comfort-intensity') || '7';
  applyEyeComfortIntensity(initialEyeComfortIntensity);

  eyeComfortBtn?.addEventListener('click', () => {
    const isOn = html.getAttribute('data-eye-comfort') === 'on';
    applyEyeComfort(!isOn);
  });

  eyeComfortSlider?.addEventListener('input', (e) => {
    applyEyeComfortIntensity((e.target as HTMLInputElement).value);
  });

});

document.addEventListener('astro:before-swap', () => {
  if (_navScrollListener) {
    window.removeEventListener('scroll', _navScrollListener);
    _navScrollListener = null;
  }
  if (_navSettingsClickListener) {
    document.removeEventListener('click', _navSettingsClickListener);
    _navSettingsClickListener = null;
  }
  if (_navSettingsKeydownListener) {
    document.removeEventListener('keydown', _navSettingsKeydownListener);
    _navSettingsKeydownListener = null;
  }
});
