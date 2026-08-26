const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// 1. Rewrite SettingsPanel.astro
const settingsPanelAstro = `---
---
<!-- Settings (rightmost before hamburger) -->
<div class="settings-wrapper">
  <button class="settings-toggle" id="settings-toggle" aria-label="Settings" aria-expanded="false">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  </button>

  <!-- Settings Panel -->
  <div class="settings-panel" id="settings-panel" aria-hidden="true">
    <div class="settings-section">
      <p class="settings-label">Font</p>
      <div class="font-options">
        <button class="font-option" data-font="serif">Lora</button>
        <button class="font-option" data-font="sans">DM Sans</button>
        <button class="font-option" data-font="playfair">Playfair</button>
        <button class="font-option" data-font="sourceserif">Source Serif</button>
      </div>
    </div>
    <div class="settings-divider"></div>
    <div class="settings-section">
      <p class="settings-label">Theme</p>
      <div class="theme-palette">
        <div class="theme-swatch-wrapper">
          <button class="theme-swatch" data-theme-val="snow" aria-label="Snow Theme"></button>
          <span class="theme-label">Snow</span>
        </div>
        <div class="theme-swatch-wrapper">
          <button class="theme-swatch" data-theme-val="serenity" aria-label="Serenity Theme"></button>
          <span class="theme-label">Serenity</span>
        </div>
        <div class="theme-swatch-wrapper">
          <button class="theme-swatch" data-theme-val="solarized-light" aria-label="Solarized Light Theme"></button>
          <span class="theme-label">Solarized</span>
        </div>
        <div class="theme-swatch-wrapper">
          <button class="theme-swatch" data-theme-val="spring" aria-label="Spring Theme"></button>
          <span class="theme-label">Spring</span>
        </div>
        <div class="theme-swatch-wrapper">
          <button class="theme-swatch" data-theme-val="barbie" aria-label="Pastel Pink Theme"></button>
          <span class="theme-label">Barbie</span>
        </div>
        <div class="theme-swatch-wrapper">
          <button class="theme-swatch" data-theme-val="crimson" aria-label="Crimson Theme"></button>
          <span class="theme-label">Crimson</span>
        </div>
        <div class="theme-swatch-wrapper">
          <button class="theme-swatch" data-theme-val="frost-blue" aria-label="Frost Blue Theme"></button>
          <span class="theme-label">Frost</span>
        </div>
        <div class="theme-swatch-wrapper">
          <button class="theme-swatch" data-theme-val="nature" aria-label="Nature Theme"></button>
          <span class="theme-label">Nature</span>
        </div>
        <div class="theme-swatch-wrapper">
          <button class="theme-swatch" data-theme-val="nebula" aria-label="Nebula Theme"></button>
          <span class="theme-label">Nebula</span>
        </div>
        <div class="theme-swatch-wrapper">
          <button class="theme-swatch" data-theme-val="rose" aria-label="Rosé Pine Theme"></button>
          <span class="theme-label">Rosé</span>
        </div>
        <div class="theme-swatch-wrapper">
          <button class="theme-swatch" data-theme-val="obsidian" aria-label="Obsidian Theme"></button>
          <span class="theme-label">Obsidian</span>
        </div>
        <div class="theme-swatch-wrapper">
          <button class="theme-swatch" data-theme-val="midnight-black" aria-label="Midnight Black Theme"></button>
          <span class="theme-label">Midnight</span>
        </div>
      </div>
    </div>
    <div class="settings-divider"></div>
    <div class="settings-section">
      <div class="settings-row">
        <div class="settings-row-info">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <span>Custom Theme</span>
        </div>
        <button class="eye-comfort-toggle" id="custom-theme-toggle" role="switch" aria-checked="false" aria-label="Custom Theme">
          <span class="eye-comfort-thumb"></span>
        </button>
      </div>
      <p class="settings-hint">Create your own DIY theme</p>
      <button id="open-custom-theme-wizard" class="customize-bubble-btn" style="display: none; margin-top: 10px; width: 100%; padding: 8px; border-radius: 8px; border: 1px solid var(--color-border); background: var(--color-bg-code); color: var(--color-text); cursor: pointer; font-size: 0.8rem; font-family: var(--font-sans);">
        Customize Theme
      </button>
    </div>
    <div class="settings-divider"></div>
    <div class="settings-section">
      <div class="settings-row">
        <div class="settings-row-info">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          <span>Eye Comfort</span>
        </div>
        <button class="eye-comfort-toggle" id="eye-comfort-toggle" role="switch" aria-checked="false" aria-label="Eye Comfort">
          <span class="eye-comfort-thumb"></span>
        </button>
      </div>
      <p class="settings-hint">Warm tint to reduce eye strain</p>
      <div class="slider-container" id="eye-comfort-slider-container" style="display: none;">
        <input type="range" id="eye-comfort-slider" class="eye-comfort-slider" min="2" max="25" value="7" aria-label="Eye Comfort Intensity">
      </div>
    </div>
    <div class="settings-divider layout-settings-divider"></div>
    <div class="settings-section layout-settings-section">
      <p class="settings-label">Layout</p>
      <div class="font-options">
        <button class="font-option layout-option" data-layout-val="narrow">Narrow</button>
        <button class="font-option layout-option" data-layout-val="wide">Wide</button>
      </div>
    </div>
  </div>
</div>
`;
fs.writeFileSync(path.join(srcDir, 'components/navbar/SettingsPanel.astro'), settingsPanelAstro);

// 2. Create CustomThemeWizard.astro
const customThemeWizardAstro = `---
---
<div id="custom-theme-wizard" class="search-modal" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Custom Theme Builder">
  <div class="search-modal__backdrop" id="wizard-backdrop"></div>
  <div class="search-modal__content" style="max-width: 400px;">
    <div class="search-modal__header">
      <span class="search-modal__title" id="wizard-title">Step 1: Background</span>
      <button class="search-modal__close" id="wizard-close" aria-label="Close wizard">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    
    <div class="search-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px; gap: 1.5rem;">
      <p id="wizard-desc" style="color: var(--color-text-muted); font-size: 0.9rem; text-align: center;">Pick the main background color for your site.</p>
      <input type="color" id="wizard-color-picker" value="#ffffff" style="-webkit-appearance: none; border: none; width: 80px; height: 80px; border-radius: 12px; cursor: pointer; padding: 0; background: none;">
    </div>
    
    <div class="search-modal__footer" style="justify-content: space-between;">
      <button id="wizard-prev" style="padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid var(--color-border); background: transparent; color: var(--color-text); cursor: pointer; visibility: hidden;">Back</button>
      <button id="wizard-next" style="padding: 0.5rem 1rem; border-radius: 8px; border: none; background: var(--color-accent-2); color: white; cursor: pointer; font-weight: 600;">Next</button>
    </div>
  </div>
</div>
`;
fs.writeFileSync(path.join(srcDir, 'components/CustomThemeWizard.astro'), customThemeWizardAstro);

// 3. Update BaseLayout to include CustomThemeWizard
let baseLayout = fs.readFileSync(path.join(srcDir, 'layouts/BaseLayout.astro'), 'utf8');
baseLayout = baseLayout.replace("import SearchModal from '../components/SearchModal.astro';", "import SearchModal from '../components/SearchModal.astro';\nimport CustomThemeWizard from '../components/CustomThemeWizard.astro';");
baseLayout = baseLayout.replace("<SearchModal />", "<SearchModal />\n    <CustomThemeWizard />");
fs.writeFileSync(path.join(srcDir, 'layouts/BaseLayout.astro'), baseLayout);

// 4. Create new scripts
const scriptsDir = path.join(srcDir, 'scripts');

// navbar.ts (stripped down)
const newNavbarTs = `// Navigation scrolling & mobile menu
let _navScrollListener: EventListener | null = null;

document.addEventListener('astro:page-load', () => {
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
});

document.addEventListener('astro:before-swap', () => {
  if (_navScrollListener) {
    window.removeEventListener('scroll', _navScrollListener);
    _navScrollListener = null;
  }
});
`;
fs.writeFileSync(path.join(scriptsDir, 'navbar.ts'), newNavbarTs);

// settings.ts
const settingsTs = `let _navSettingsClickListener: EventListener | null = null;
let _navSettingsKeydownListener: EventListener | null = null;

document.addEventListener('astro:page-load', () => {
  const html = document.documentElement;
  const settingsBtn = document.getElementById('settings-toggle');
  const settingsPanel = document.getElementById('settings-panel');
  const fontOptions = document.querySelectorAll('.font-option');
  const layoutOptions = document.querySelectorAll('.layout-option');
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

  /* Font picker */
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

  /* Layout picker */
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

  /* Eye Comfort */
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
  if (_navSettingsClickListener) {
    document.removeEventListener('click', _navSettingsClickListener);
    _navSettingsClickListener = null;
  }
  if (_navSettingsKeydownListener) {
    document.removeEventListener('keydown', _navSettingsKeydownListener);
    _navSettingsKeydownListener = null;
  }
});
`;
fs.writeFileSync(path.join(scriptsDir, 'settings.ts'), settingsTs);

// themeManager.ts
const themeManagerTs = `import { isDarkTheme } from '../utils/theme';

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
`;
fs.writeFileSync(path.join(scriptsDir, 'themeManager.ts'), themeManagerTs);

// customThemeBuilder.ts
const customThemeBuilderTs = `let _wizardKeydown: EventListener | null = null;

document.addEventListener('astro:page-load', () => {
  const html = document.documentElement;
  
  function updateCustomThemeCSS(parsed: any) {
    let s = document.getElementById('custom-theme-vars');
    if (!s) {
      s = document.createElement('style');
      s.id = 'custom-theme-vars';
      document.head.appendChild(s);
    }
    s.textContent = '[data-theme="custom"] { ' +
      '--color-bg: ' + (parsed.bg || '#ffffff') + '; ' +
      '--color-bg-card: ' + (parsed.card || '#f8f9fa') + '; ' +
      '--color-bg-nav: ' + (parsed.bg ? parsed.bg + 'd9' : 'rgba(255,255,255,0.85)') + '; ' +
      '--color-bg-code: ' + (parsed.card || '#f1f5f9') + '; ' +
      '--color-accent-1: ' + (parsed.accent1 || '#3b82f6') + '; ' +
      '--color-accent-2: ' + (parsed.accent2 || '#2563eb') + '; ' +
      '--color-accent-3: ' + (parsed.accent1 || '#60a5fa') + '; ' +
      '--color-accent-4: ' + (parsed.accent2 || '#1d4ed8') + '; ' +
      '--color-text: ' + (parsed.text || '#0f172a') + '; ' +
      '--color-text-muted: ' + (parsed.text || '#64748b') + '; ' +
      '--color-text-light: ' + (parsed.text || '#94a3b8') + '; ' +
      '--color-border: ' + (parsed.card || '#e2e8f0') + '; ' +
      '--color-link: var(--color-accent-2); ' +
      '--color-code-text: var(--color-accent-1); ' +
      '--color-success: #10b981; ' +
    '}';
  }

  // Load existing
  const saved = localStorage.getItem('customTheme');
  let config = {
    bg: '#ffffff',
    card: '#f8f9fa',
    text: '#0f172a',
    accent1: '#3b82f6',
    accent2: '#2563eb'
  };
  if (saved) {
    try { config = { ...config, ...JSON.parse(saved) }; } catch(e) {}
  }
  updateCustomThemeCSS(config);

  /* Wizard Logic */
  const wizardBtn = document.getElementById('open-custom-theme-wizard');
  const wizardModal = document.getElementById('custom-theme-wizard');
  const wizardClose = document.getElementById('wizard-close');
  const wizardBackdrop = document.getElementById('wizard-backdrop');
  
  const title = document.getElementById('wizard-title');
  const desc = document.getElementById('wizard-desc');
  const picker = document.getElementById('wizard-color-picker') as HTMLInputElement;
  const btnPrev = document.getElementById('wizard-prev') as HTMLButtonElement;
  const btnNext = document.getElementById('wizard-next') as HTMLButtonElement;

  const steps = [
    { key: 'bg', title: 'Step 1: Background', desc: 'Pick the main background color for your site.' },
    { key: 'card', title: 'Step 2: Cards', desc: 'Pick the background color for floating cards and code blocks.' },
    { key: 'text', title: 'Step 3: Text', desc: 'Pick your main text color. (Ensure good contrast!)' },
    { key: 'accent1', title: 'Step 4: Primary Accent', desc: 'Pick the color for links and primary buttons.' },
    { key: 'accent2', title: 'Step 5: Secondary Accent', desc: 'Pick the color for hover states and secondary elements.' }
  ];
  let currentStep = 0;

  function openWizard() {
    wizardModal?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    currentStep = 0;
    renderStep();
  }

  function closeWizard() {
    wizardModal?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function renderStep() {
    const step = steps[currentStep];
    if (title) title.textContent = step.title;
    if (desc) desc.textContent = step.desc;
    // @ts-ignore
    if (picker) picker.value = config[step.key];
    
    if (btnPrev) btnPrev.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
    if (btnNext) btnNext.textContent = currentStep === steps.length - 1 ? 'Finish' : 'Next';
  }

  picker?.addEventListener('input', (e) => {
    const val = (e.target as HTMLInputElement).value;
    // @ts-ignore
    config[steps[currentStep].key] = val;
    localStorage.setItem('customTheme', JSON.stringify(config));
    updateCustomThemeCSS(config);
  });

  btnNext?.addEventListener('click', () => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      renderStep();
    } else {
      closeWizard();
    }
  });

  btnPrev?.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      renderStep();
    }
  });

  wizardBtn?.addEventListener('click', openWizard);
  wizardClose?.addEventListener('click', closeWizard);
  wizardBackdrop?.addEventListener('click', closeWizard);

  if (_wizardKeydown) document.removeEventListener('keydown', _wizardKeydown);
  _wizardKeydown = (e: Event) => {
    if ((e as KeyboardEvent).key === 'Escape') closeWizard();
  };
  document.addEventListener('keydown', _wizardKeydown);
});

document.addEventListener('astro:before-swap', () => {
  if (_wizardKeydown) {
    document.removeEventListener('keydown', _wizardKeydown);
    _wizardKeydown = null;
  }
});
`;
fs.writeFileSync(path.join(scriptsDir, 'customThemeBuilder.ts'), customThemeBuilderTs);

// 5. Update Navbar.astro to import all scripts instead of just navbar.ts
let navbarAstro = fs.readFileSync(path.join(srcDir, 'components/Navbar.astro'), 'utf8');
navbarAstro = navbarAstro.replace("import '../scripts/navbar';", "import '../scripts/navbar';\n    import '../scripts/settings';\n    import '../scripts/themeManager';\n    import '../scripts/customThemeBuilder';");
fs.writeFileSync(path.join(srcDir, 'components/Navbar.astro'), navbarAstro);

// 6. Update SearchModal interceptor to use window.applyTheme
let searchModal = fs.readFileSync(path.join(srcDir, 'components/SearchModal.astro'), 'utf8');
const searchOld = `                const darkThemes = ['obsidian', 'rose', 'nebula', 'midnight-black'];
                function applyCommandTheme(t: string) {
                  document.documentElement.setAttribute('data-theme', t);
                  document.documentElement.setAttribute('data-theme-mode', darkThemes.includes(t) ? 'dark' : 'light');
                  localStorage.setItem('theme', t);
                  // Update swatches visually if they exist
                  document.querySelectorAll('.theme-swatch').forEach(swatch => {
                    swatch.classList.toggle('active', swatch.getAttribute('data-theme-val') === t);
                  });
                }`;
const searchNew = `                function applyCommandTheme(t: string) {
                  // @ts-ignore
                  if (window.applyTheme) window.applyTheme(t);
                }`;
searchModal = searchModal.replace(searchOld, searchNew);
fs.writeFileSync(path.join(srcDir, 'components/SearchModal.astro'), searchModal);

console.log("Refactor Complete");
