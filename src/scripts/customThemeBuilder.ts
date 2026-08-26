let _wizardKeydown: EventListener | null = null;

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
