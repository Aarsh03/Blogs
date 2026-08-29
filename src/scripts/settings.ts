let _navSettingsClickListener: EventListener | null = null;
let _navSettingsKeydownListener: EventListener | null = null;

document.addEventListener('astro:page-load', () => {
  const html = document.documentElement;
  const settingsBtn = document.getElementById('settings-toggle');
  const settingsPanel = document.getElementById('settings-panel');
  const fontOptions = document.querySelectorAll('.font-option:not(.layout-option)');
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
