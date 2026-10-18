// Settings panel interactions & user preferences
let _settingsDelegated = false;

function closeSettings() {
  const settingsPanel = document.getElementById('settings-panel');
  const settingsBtn = document.getElementById('settings-toggle');
  settingsPanel?.setAttribute('aria-hidden', 'true');
  settingsBtn?.setAttribute('aria-expanded', 'false');
  settingsBtn?.classList.remove('active');
}

function openSettings() {
  const settingsPanel = document.getElementById('settings-panel');
  const settingsBtn = document.getElementById('settings-toggle');
  settingsPanel?.setAttribute('aria-hidden', 'false');
  settingsBtn?.setAttribute('aria-expanded', 'true');
  settingsBtn?.classList.add('active');
}

/* Font picker */
function applyFont(font: string) {
  const html = document.documentElement;
  html.setAttribute('data-font', font);
  localStorage.setItem('font', font);
  const fontOptions = document.querySelectorAll('.font-option:not(.layout-option)');
  fontOptions.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-font') === font);
  });
}

/* Layout picker */
function applyLayout(layout: string) {
  const html = document.documentElement;
  html.setAttribute('data-layout', layout);
  localStorage.setItem('layout', layout);
  const layoutOptions = document.querySelectorAll('.layout-option');
  layoutOptions.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-layout-val') === layout);
  });
}

/* Eye Comfort */
function applyEyeComfort(on: boolean) {
  const html = document.documentElement;
  const eyeComfortBtn = document.getElementById('eye-comfort-toggle');
  const eyeComfortSliderContainer = document.getElementById('eye-comfort-slider-container');
  html.setAttribute('data-eye-comfort', on ? 'on' : 'off');
  localStorage.setItem('eye-comfort', on ? 'on' : 'off');
  eyeComfortBtn?.setAttribute('aria-checked', String(on));
  eyeComfortBtn?.classList.toggle('on', on);
  if (eyeComfortSliderContainer) {
    eyeComfortSliderContainer.style.display = on ? 'block' : 'none';
  }
}

function applyEyeComfortIntensity(val: string) {
  const html = document.documentElement;
  const eyeComfortSlider = document.getElementById('eye-comfort-slider') as HTMLInputElement;
  html.style.setProperty('--eye-comfort-intensity', (parseInt(val) / 100).toString());
  localStorage.setItem('eye-comfort-intensity', val);
  if (eyeComfortSlider) {
    eyeComfortSlider.value = val;
  }
}

// Global delegated event handlers (attached once permanently)
if (!_settingsDelegated && typeof window !== 'undefined') {
  _settingsDelegated = true;

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    // 1. Settings Toggle Button click
    const toggleBtn = target.closest('#settings-toggle');
    if (toggleBtn) {
      e.stopPropagation();
      const settingsPanel = document.getElementById('settings-panel');
      const isOpen = settingsPanel?.getAttribute('aria-hidden') === 'false';
      if (isOpen) closeSettings(); else openSettings();
      return;
    }

    // 2. Eye Comfort Toggle click
    const eyeToggle = target.closest('#eye-comfort-toggle');
    if (eyeToggle) {
      const html = document.documentElement;
      const isOn = html.getAttribute('data-eye-comfort') === 'on';
      applyEyeComfort(!isOn);
      return;
    }

    // 3. Font Option click
    const fontBtn = target.closest('.font-option:not(.layout-option)');
    if (fontBtn) {
      applyFont(fontBtn.getAttribute('data-font') || 'serif');
      return;
    }

    // 4. Layout Option click
    const layoutBtn = target.closest('.layout-option');
    if (layoutBtn) {
      applyLayout(layoutBtn.getAttribute('data-layout-val') || 'narrow');
      return;
    }

    // 5. Inside panel click -> don't close
    const insidePanel = target.closest('#settings-panel');
    if (insidePanel) {
      return;
    }

    // 6. Outside click -> close
    closeSettings();
  });

  document.addEventListener('input', (e) => {
    const target = e.target as HTMLElement;
    if (target && target.id === 'eye-comfort-slider') {
      applyEyeComfortIntensity((target as HTMLInputElement).value);
    }
  });

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeSettings();
  });
}

document.addEventListener('astro:page-load', () => {
  const initialFont = localStorage.getItem('font') || 'serif';
  applyFont(initialFont);

  const initialLayout = localStorage.getItem('layout') || 'narrow';
  applyLayout(initialLayout);

  const initialEyeComfort = localStorage.getItem('eye-comfort') === 'on';
  applyEyeComfort(initialEyeComfort);
  
  const initialEyeComfortIntensity = localStorage.getItem('eye-comfort-intensity') || '7';
  applyEyeComfortIntensity(initialEyeComfortIntensity);
});
