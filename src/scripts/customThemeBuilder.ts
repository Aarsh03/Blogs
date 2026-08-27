// Color conversions
function hexToRgb(hex: string) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1]+hex[1], 16); g = parseInt(hex[2]+hex[2], 16); b = parseInt(hex[3]+hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1,3), 16); g = parseInt(hex.substring(3,5), 16); b = parseInt(hex.substring(5,7), 16);
  }
  return {r,g,b};
}
function rgbToHsl(r: number, g: number, b: number) {
  r/=255; g/=255; b/=255;
  let max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h = 0, s = 0, l = (max+min)/2;
  if (max !== min) {
    let d = max-min;
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    switch(max) {
      case r: h = (g-b)/d + (g<b ? 6 : 0); break;
      case g: h = (b-r)/d + 2; break;
      case b: h = (r-g)/d + 4; break;
    }
    h/=6;
  }
  return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) };
}
function rgbToCmyk(r: number, g: number, b: number) {
  let c = 1 - (r/255); let m = 1 - (g/255); let y = 1 - (b/255);
  let k = Math.min(c, Math.min(m, y));
  if (k === 1) return { c:0, m:0, y:0, k:100 };
  c = (c-k)/(1-k); m = (m-k)/(1-k); y = (y-k)/(1-k);
  return { c: Math.round(c*100), m: Math.round(m*100), y: Math.round(y*100), k: Math.round(k*100) };
}
function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1<<24) + (r<<16) + (g<<8) + b).toString(16).slice(1).toUpperCase();
}
function parseInput(val: string, format: string) {
  try {
    if (format==='hex') {
      if(val[0] !== '#') val = '#'+val;
      if(/^#[0-9A-Fa-f]{6}$/.test(val)) return val;
    }
    // simple parsers for other formats could be added here
  } catch(e) {}
  return null;
}

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
    '--color-bg-nav-links: ' + (parsed.card || '#f1f5f9') + '; ' +
    '--color-nav-links-border: ' + (parsed.text ? 'color-mix(in srgb, ' + parsed.text + ' 10%, transparent)' : '#e2e8f0') + '; ' +
    '--shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); ' +
    '--shadow-card-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); ' +
      '--color-accent-1: ' + (parsed.accent1 || '#3b82f6') + '; ' +
      '--color-accent-2: ' + (parsed.accent2 || '#2563eb') + '; ' +
      '--color-accent-3: ' + (parsed.accent3 || '#60a5fa') + '; ' +
      '--color-accent-4: ' + (parsed.accent4 || '#1d4ed8') + '; ' +
      '--color-text: ' + (parsed.text || '#0f172a') + '; ' +
      '--color-text-muted: ' + (parsed.text ? 'color-mix(in srgb, ' + parsed.text + ' 70%, transparent)' : '#64748b') + '; ' +
      '--color-text-light: ' + (parsed.text ? 'color-mix(in srgb, ' + parsed.text + ' 50%, transparent)' : '#94a3b8') + '; ' +
      '--color-border: ' + (parsed.text ? 'color-mix(in srgb, ' + parsed.text + ' 15%, transparent)' : '#e2e8f0') + '; ' +
      '--color-link: var(--color-accent-2); ' +
      '--color-code-text: var(--color-accent-1); ' +
      '--color-success: #10b981; ' +
    '}';

      if (parsed.bg) {
        try {
          const r = parseInt(parsed.bg.slice(1,3), 16), g = parseInt(parsed.bg.slice(3,5), 16), b = parseInt(parsed.bg.slice(5,7), 16);
          const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          document.documentElement.setAttribute('data-theme-mode', luma < 128 ? 'dark' : 'light');
        } catch(e) {}
      }
    }

  const saved = localStorage.getItem('customTheme');
  let config = { bg: '#ffffff', card: '#f8f9fa', text: '#0f172a', accent1: '#3b82f6', accent2: '#2563eb', accent3: '#60a5fa', accent4: '#1d4ed8' };
  if (saved) {
    try { config = { ...config, ...JSON.parse(saved) }; } catch(e) {}
  }
  updateCustomThemeCSS(config);

  const openBtn = document.getElementById('open-custom-theme-wizard');
  const toolbar = document.getElementById('custom-theme-toolbar');
  const cancelBtn = document.getElementById('toolbar-cancel');
  const confirmBtn = document.getElementById('toolbar-confirm');
  let backupConfig = { ...config };

  function syncBubbles() {
    ['bg','card','text','accent1','accent2','accent3','accent4'].forEach(key => {
      const bubble = document.getElementById('bubble-'+key);
      // @ts-ignore
      if (bubble) bubble.style.backgroundColor = config[key] || '#000';
    });
  }

  function openToolbar() {
    backupConfig = { ...config };
    syncBubbles();
    toolbar?.setAttribute('aria-hidden', 'false');
    if (document.documentElement.getAttribute('data-theme') !== 'custom') {
      // @ts-ignore
      if (window.applyTheme) window.applyTheme('custom');
    }
  }

  function closeToolbar() {
    toolbar?.setAttribute('aria-hidden', 'true');
    closePicker();
  }

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

  let isVertical = false;
  // Rotation is wired via setupRotate() later in this file.

  /* Custom Color Picker Logic */
  const picker = document.getElementById('custom-color-picker');
  const pTitle = document.getElementById('picker-title');
  const pPreview = document.getElementById('picker-preview');
  const pHex = document.getElementById('input-hex') as HTMLInputElement;
  const pRgb = document.getElementById('input-rgb') as HTMLInputElement;
  const pHsl = document.getElementById('input-hsl') as HTMLInputElement;
  const pCmyk = document.getElementById('input-cmyk') as HTMLInputElement;
  const pCancel = document.getElementById('picker-cancel');
  const pConfirm = document.getElementById('picker-confirm');
  
  const svArea = document.getElementById('sv-area');
  const svCursor = document.getElementById('sv-cursor');
  const svBgHue = document.getElementById('sv-bg-hue');
  const hueSlider = document.getElementById('hue-slider') as HTMLInputElement;

  let activeKey: string | null = null;
  let curH = 0, curS = 100, curV = 100;

  function HSVtoRGB(h: number, s: number, v: number) {
    let r=0, g=0, b=0, i, f, p, q, t;
    h/=360; s/=100; v/=100;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }

  function RGBtoHSV(r: number, g: number, b: number) {
    r/=255; g/=255; b/=255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h=0, s, v = max;
    let d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max !== min) {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
  }

  function updatePickerUIFromHSV() {
    const {r,g,b} = HSVtoRGB(curH, curS, curV);
    const hex = rgbToHex(r,g,b);
    if (pPreview) pPreview.style.backgroundColor = hex;
    const hsl = rgbToHsl(r,g,b);
    const cmyk = rgbToCmyk(r,g,b);
    
    if (pHex) pHex.value = hex;
    if (pRgb) pRgb.value = `${r}, ${g}, ${b}`;
    if (pHsl) pHsl.value = `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;
    if (pCmyk) pCmyk.value = `${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`;
    
    // Update cursor position
    if (svCursor && svArea) {
      svCursor.style.left = curS + '%';
      svCursor.style.top = (100 - curV) + '%';
    }
    // Update hue background
    if (svBgHue) svBgHue.style.backgroundColor = `hsl(${curH}, 100%, 50%)`;
    if (hueSlider) hueSlider.value = curH.toString();
    
    // Live update blog
    if (activeKey) {
      // @ts-ignore
      config[activeKey] = hex;
      syncBubbles();
      updateCustomThemeCSS(config);
    }
  }

  function setColorFromHex(hex: string) {
    const {r,g,b} = hexToRgb(hex);
    const hsv = RGBtoHSV(r,g,b);
    curH = hsv.h; curS = hsv.s; curV = hsv.v;
    updatePickerUIFromHSV();
  }

  hueSlider?.addEventListener('input', (e: any) => {
    curH = parseInt(e.target.value);
    updatePickerUIFromHSV();
  });

  let isDraggingSV = false;
  const svMove = (e: MouseEvent | TouchEvent) => { 
    if (isDraggingSV) {
      if (e.cancelable) e.preventDefault();
      updateSVFromEvent(e); 
    }
  };
  const svUp = () => { isDraggingSV = false; };
  
  const svDown = (e: MouseEvent | TouchEvent) => {
    isDraggingSV = true;
    updateSVFromEvent(e);
  };
  
  svArea?.addEventListener('mousedown', svDown);
  svArea?.addEventListener('touchstart', svDown, { passive: false });
  document.addEventListener('mousemove', svMove);
  document.addEventListener('touchmove', svMove, { passive: false });
  document.addEventListener('mouseup', svUp);
  document.addEventListener('touchend', svUp);
  
  document.addEventListener('astro:before-swap', () => {
    document.removeEventListener('mousemove', svMove);
    document.removeEventListener('touchmove', svMove);
    document.removeEventListener('mouseup', svUp);
    document.removeEventListener('touchend', svUp);
  }, { once: true });
  
  function updateSVFromEvent(e: MouseEvent | TouchEvent) {
    if (!svArea) return;
    const rect = svArea.getBoundingClientRect();
    
    // @ts-ignore
    const clientX = e.touches ? e.touches[0].clientX : (e as MouseEvent).clientX;
    // @ts-ignore
    const clientY = e.touches ? e.touches[0].clientY : (e as MouseEvent).clientY;
    
    let x = clientX - rect.left;
    let y = clientY - rect.top;
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));
    curS = (x / rect.width) * 100;
    curV = 100 - ((y / rect.height) * 100);
    updatePickerUIFromHSV();
  }

  pHex?.addEventListener('change', (e: any) => {
    let val = parseInput(e.target.value, 'hex');
    if (val) setColorFromHex(val);
  });

  // Open picker when bubble clicked
  document.querySelectorAll('.toolbar-bubble-wrapper').forEach(el => {
    el.addEventListener('click', () => {
      activeKey = el.getAttribute('data-key');
      if (pTitle) pTitle.textContent = el.getAttribute('data-title');
      // @ts-ignore
      setColorFromHex(config[activeKey] || '#000000');
      picker?.setAttribute('aria-hidden', 'false');
    });
  });

  function closePicker() {
    picker?.setAttribute('aria-hidden', 'true');
    activeKey = null;
  }
  pCancel?.addEventListener('click', () => {
    // Revert logic handled by main toolbar cancel. Here just close modal if they hit cancel.
    // Actually we should revert the single color. Let's revert to backupConfig.
    if (activeKey) {
      // @ts-ignore
      config[activeKey] = backupConfig[activeKey];
      updateCustomThemeCSS(config);
      syncBubbles();
    }
    closePicker();
  });
  pConfirm?.addEventListener('click', () => {
    // Save to backupConfig so it becomes the new baseline if they cancel the whole toolbar
    if (activeKey) {
      // @ts-ignore
      backupConfig[activeKey] = config[activeKey];
    }
    closePicker();
  });

  /* ── Drag Logic ────────────────────────────────────────────── */
  function makeDraggable(handleEl: HTMLElement | null, targetEl: HTMLElement | null) {
    if (!handleEl || !targetEl) return () => {};

    let isDragging = false;
    let startClientX = 0, startClientY = 0;
    let startLeft = 0, startTop = 0;

    /** Convert the toolbar from CSS-positioned to JS-positioned */
    function anchorToAbsolute() {
      const rect = targetEl.getBoundingClientRect();
      targetEl.style.left = rect.left + 'px';
      targetEl.style.top = rect.top + 'px';
      targetEl.style.bottom = 'auto';
      targetEl.style.transform = 'none';
    }

    function clamp(value: number, min: number, max: number) {
      return Math.max(min, Math.min(max, value));
    }

    const start = (e: MouseEvent | TouchEvent) => {
      // On mobile, only allow toolbar drag (not color picker)
      if (targetEl.id === 'custom-color-picker' && window.innerWidth <= 768) return;
      // Switch from CSS bottom/transform anchoring to JS absolute positioning
      if (!targetEl.style.left || targetEl.style.transform !== 'none') {
        anchorToAbsolute();
      }
      const touch = (e as TouchEvent).touches?.[0];
      startClientX = touch ? touch.clientX : (e as MouseEvent).clientX;
      startClientY = touch ? touch.clientY : (e as MouseEvent).clientY;
      startLeft = parseFloat(targetEl.style.left) || 0;
      startTop = parseFloat(targetEl.style.top) || 0;
      isDragging = true;
    };

    const move = (e: MouseEvent | TouchEvent) => {
      if (targetEl.id === 'custom-color-picker' && window.innerWidth <= 768) return;
      if (!isDragging) return;
      e.preventDefault();
      const touch = (e as TouchEvent).touches?.[0];
      const clientX = touch ? touch.clientX : (e as MouseEvent).clientX;
      const clientY = touch ? touch.clientY : (e as MouseEvent).clientY;
      const rect = targetEl.getBoundingClientRect();
      const newLeft = clamp(startLeft + clientX - startClientX, 0, window.innerWidth - rect.width);
      const newTop = clamp(startTop + clientY - startClientY, 0, window.innerHeight - rect.height);
      targetEl.style.left = newLeft + 'px';
      targetEl.style.top = newTop + 'px';
    };

    const end = () => { isDragging = false; };

    handleEl.addEventListener('mousedown', start);
    handleEl.addEventListener('touchstart', start, { passive: true });
    document.addEventListener('mousemove', move, { passive: false });
    document.addEventListener('touchmove', move, { passive: false });
    document.addEventListener('mouseup', end);
    document.addEventListener('touchend', end);

    return () => {
      handleEl.removeEventListener('mousedown', start);
      handleEl.removeEventListener('touchstart', start);
      document.removeEventListener('mousemove', move);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('mouseup', end);
      document.removeEventListener('touchend', end);
    };
  }

  /* Wire up both drag handles (desktop inline + mobile strip) */
  const toolbarEl = document.getElementById('custom-theme-toolbar') as HTMLElement | null;
  const desktopHandle = document.getElementById('theme-toolbar-handle-desktop');
  const mobileHandle = document.getElementById('theme-toolbar-handle');
  let cleanupDesktopDrag = makeDraggable(desktopHandle, toolbarEl);
  let cleanupMobileDrag = makeDraggable(mobileHandle, toolbarEl);
  let cleanupPickerDrag = makeDraggable(
    document.getElementById('picker-drag-handle'),
    document.getElementById('custom-color-picker')
  );

  /* ── Rotate Logic ───────────────────────────────────────────── */
  function setupRotate(btnId: string) {
    const btn = document.getElementById(btnId);
    btn?.addEventListener('click', () => {
      isVertical = !isVertical;
      toolbar?.classList.toggle('vertical-mode', isVertical);
      // After class toggle, wait one frame for layout, then bounds-check
      requestAnimationFrame(() => {
        if (!toolbar) return;
        const rect = toolbar.getBoundingClientRect();
        // If still CSS-positioned (no style.left yet), just check if we're offscreen
        // and switch to absolute if needed
        const isAbsolute = toolbar.style.transform === 'none' && toolbar.style.left;
        if (isAbsolute) {
          let newLeft = parseFloat(toolbar.style.left);
          let newTop = parseFloat(toolbar.style.top);
          if (rect.right > window.innerWidth) newLeft = Math.max(0, window.innerWidth - rect.width);
          if (rect.bottom > window.innerHeight) newTop = Math.max(0, window.innerHeight - rect.height);
          if (rect.left < 0) newLeft = 0;
          if (rect.top < 0) newTop = 0;
          toolbar.style.left = newLeft + 'px';
          toolbar.style.top = newTop + 'px';
        } else {
          // CSS-positioned — if it went offscreen, anchor it to absolute safe position
          if (rect.right > window.innerWidth || rect.bottom > window.innerHeight || rect.left < 0 || rect.top < 0) {
            toolbar.style.left = Math.max(0, Math.min(rect.left, window.innerWidth - rect.width)) + 'px';
            toolbar.style.top = Math.max(0, Math.min(rect.top, window.innerHeight - rect.height)) + 'px';
            toolbar.style.bottom = 'auto';
            toolbar.style.transform = 'none';
          }
        }
      });
    });
  }
  setupRotate('theme-toolbar-rotate');
  setupRotate('theme-toolbar-rotate-desktop');

  document.addEventListener('astro:before-swap', () => {
    cleanupDesktopDrag();
    cleanupMobileDrag();
    cleanupPickerDrag();
  }, { once: true });
});
