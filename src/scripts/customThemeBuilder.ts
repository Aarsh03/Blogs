let _toolbarKeydown: EventListener | null = null;
let _dragStart: EventListener | null = null;
let _dragMove: EventListener | null = null;
let _dragEnd: EventListener | null = null;

document.addEventListener('astro:page-load', () => {
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
  let config = { bg: '#ffffff', card: '#f8f9fa', text: '#0f172a', accent1: '#3b82f6', accent2: '#2563eb' };
  if (saved) {
    try { config = { ...config, ...JSON.parse(saved) }; } catch(e) {}
  }
  updateCustomThemeCSS(config);

  /* Toolbar Logic */
  const openBtn = document.getElementById('open-custom-theme-wizard');
  const toolbar = document.getElementById('custom-theme-toolbar');
  const cancelBtn = document.getElementById('toolbar-cancel');
  const confirmBtn = document.getElementById('toolbar-confirm');
  
  const inputs = {
    bg: document.getElementById('toolbar-color-bg') as HTMLInputElement,
    card: document.getElementById('toolbar-color-card') as HTMLInputElement,
    text: document.getElementById('toolbar-color-text') as HTMLInputElement,
    accent1: document.getElementById('toolbar-color-accent1') as HTMLInputElement,
    accent2: document.getElementById('toolbar-color-accent2') as HTMLInputElement,
  };
  const bubbles = {
    bg: document.getElementById('bubble-bg'),
    card: document.getElementById('bubble-card'),
    text: document.getElementById('bubble-text'),
    accent1: document.getElementById('bubble-accent1'),
    accent2: document.getElementById('bubble-accent2'),
  };

  let backupConfig = { ...config };

  function syncBubbles() {
    Object.keys(inputs).forEach(key => {
      // @ts-ignore
      const val = config[key];
      // @ts-ignore
      if (inputs[key]) inputs[key].value = val;
      // @ts-ignore
      if (bubbles[key]) bubbles[key].style.backgroundColor = val;
    });
  }

  function openToolbar() {
    backupConfig = { ...config };
    syncBubbles();
    toolbar?.setAttribute('aria-hidden', 'false');
    // Ensure data-theme is custom
    if (document.documentElement.getAttribute('data-theme') !== 'custom') {
      // @ts-ignore
      if (window.applyTheme) window.applyTheme('custom');
    }
  }

  function closeToolbar() {
    toolbar?.setAttribute('aria-hidden', 'true');
  }

  // Bind input changes
  Object.keys(inputs).forEach(key => {
    // @ts-ignore
    const input = inputs[key];
    if (input) {
      input.addEventListener('input', (e: Event) => {
        const val = (e.target as HTMLInputElement).value;
        // @ts-ignore
        config[key] = val;
        // @ts-ignore
        if (bubbles[key]) bubbles[key].style.backgroundColor = val;
        updateCustomThemeCSS(config);
      });
    }
  });

  cancelBtn?.addEventListener('click', () => {
    config = { ...backupConfig };
    updateCustomThemeCSS(config);
    closeToolbar();
  });

  confirmBtn?.addEventListener('click', () => {
    localStorage.setItem('customTheme', JSON.stringify(config));
    closeToolbar();
  });

  openBtn?.addEventListener('click', openToolbar);

  if (_toolbarKeydown) document.removeEventListener('keydown', _toolbarKeydown);
  _toolbarKeydown = (e: Event) => {
    if ((e as KeyboardEvent).key === 'Escape') {
      if (toolbar?.getAttribute('aria-hidden') === 'false') {
        cancelBtn?.click();
      }
    }
  };
  document.addEventListener('keydown', _toolbarKeydown);

  /* Drag Logic */
  const handle = document.getElementById('theme-toolbar-handle');
  let isDragging = false;
  let currentX = 0;
  let currentY = 0;
  let initialX = 0;
  let initialY = 0;
  let xOffset = 0;
  let yOffset = 0;

  if (_dragStart) handle?.removeEventListener('mousedown', _dragStart);
  if (_dragStart) handle?.removeEventListener('touchstart', _dragStart);
  if (_dragMove) document.removeEventListener('mousemove', _dragMove);
  if (_dragMove) document.removeEventListener('touchmove', _dragMove);
  if (_dragEnd) document.removeEventListener('mouseup', _dragEnd);
  if (_dragEnd) document.removeEventListener('touchend', _dragEnd);

  _dragStart = (e: any) => {
    if (window.innerWidth <= 600) return; // Disabled on mobile
    if (e.type === 'touchstart') {
      initialX = e.touches[0].clientX - xOffset;
      initialY = e.touches[0].clientY - yOffset;
    } else {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
    }
    isDragging = true;
  };

  _dragMove = (e: any) => {
    if (!isDragging || window.innerWidth <= 600) return;
    e.preventDefault();
    if (e.type === 'touchmove') {
      currentX = e.touches[0].clientX - initialX;
      currentY = e.touches[0].clientY - initialY;
    } else {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
    }
    xOffset = currentX;
    yOffset = currentY;
    if (toolbar) toolbar.style.transform = `translate(${currentX}px, ${currentY}px)`;
  };

  _dragEnd = () => {
    isDragging = false;
  };

  handle?.addEventListener('mousedown', _dragStart);
  handle?.addEventListener('touchstart', _dragStart, { passive: true });
  document.addEventListener('mousemove', _dragMove, { passive: false });
  document.addEventListener('touchmove', _dragMove, { passive: false });
  document.addEventListener('mouseup', _dragEnd);
  document.addEventListener('touchend', _dragEnd);
});

document.addEventListener('astro:before-swap', () => {
  if (_toolbarKeydown) document.removeEventListener('keydown', _toolbarKeydown);
  if (_dragMove) document.removeEventListener('mousemove', _dragMove);
  if (_dragMove) document.removeEventListener('touchmove', _dragMove);
  if (_dragEnd) document.removeEventListener('mouseup', _dragEnd);
  if (_dragEnd) document.removeEventListener('touchend', _dragEnd);
  _toolbarKeydown = null;
  _dragMove = null;
  _dragEnd = null;
});
