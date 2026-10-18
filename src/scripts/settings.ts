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

// Global delegated click handler (attached once permanently)
if (!_settingsDelegated && typeof window !== 'undefined') {
  _settingsDelegated = true;

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    // Toggle button click
    const toggleBtn = target.closest('#settings-toggle');
    if (toggleBtn) {
      e.stopPropagation();
      const settingsPanel = document.getElementById('settings-panel');
      const isOpen = settingsPanel?.getAttribute('aria-hidden') === 'false';
      if (isOpen) closeSettings(); else openSettings();
      return;
    }

    // Inside panel click -> don't close
    const insidePanel = target.closest('#settings-panel');
    if (insidePanel) {
      return;
    }

    // Outside click -> close
    closeSettings();
  });

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeSettings();
  });
}

document.addEventListener('astro:page-load', () => {
  const html = document.documentElement;
  const fontOptions = document.querySelectorAll('.font-option:not(.layout-option)');
  const layoutOptions = document.querySelectorAll('.layout-option');
  const eyeComfortBtn = document.getElementById('eye-comfort-toggle');
  const eyeComfortSliderContainer = document.getElementById('eye-comfort-slider-container');
  const eyeComfortSlider = document.getElementById('eye-comfort-slider') as HTMLInputElement;

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
