let _toolbarKeydown: EventListener | null = null;
let _dragStart: EventListener | null = null;
let _dragMove: EventListener | null = null;
let _dragEnd: EventListener | null = null;
let _pickerDragStart: EventListener | null = null;
let _pickerDragMove: EventListener | null = null;
let _pickerDragEnd: EventListener | null = null;

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
function hslToRgb(h: number, s: number, l: number) {
  h/=360; s/=100; l/=100;
  let r, g, b;
  if (s===0) { r=g=b=l; } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if(t<0) t+=1; if(t>1) t-=1;
      if(t<1/6) return p+(q-p)*6*t;
      if(t<1/2) return q;
      if(t<2/3) return p+(q-p)*(2/3-t)*6;
      return p;
    };
    let q = l < 0.5 ? l*(1+s) : l+s-l*s;
    let p = 2*l-q;
    r = hue2rgb(p,q,h+1/3); g = hue2rgb(p,q,h); b = hue2rgb(p,q,h-1/3);
  }
  return { r: Math.round(r*255), g: Math.round(g*255), b: Math.round(b*255) };
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

  const rotateBtn = document.getElementById('theme-toolbar-rotate');
  let isVertical = false;
  rotateBtn?.addEventListener('click', () => {
    isVertical = !isVertical;
    toolbar?.classList.toggle('vertical-mode', isVertical);
  });

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
  let tempColor = '#000000';
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
    tempColor = hex;
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
  svArea?.addEventListener('mousedown', (e) => {
    isDraggingSV = true;
    updateSVFromEvent(e);
  });
  document.addEventListener('mousemove', (e) => {
    if (isDraggingSV) updateSVFromEvent(e);
  });
  document.addEventListener('mouseup', () => { isDraggingSV = false; });
  
  function updateSVFromEvent(e: MouseEvent) {
    if (!svArea) return;
    const rect = svArea.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
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
    el.addEventListener('click', (e) => {
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

  /* Drag Logic for Toolbar and Picker */
  function makeDraggable(handleId: string, targetId: string) {
    const handle = document.getElementById(handleId);
    const target = document.getElementById(targetId);
    if (!handle || !target) return;
    
    let isDragging = false;
    let currentX = 0; let currentY = 0;
    let initialX = 0; let initialY = 0;
    let xOffset = 0; let yOffset = 0;
    
    // Parse existing transform if it's translate(-50%, -50%)
    if (target.style.transform.includes('-50%')) {
      target.style.transform = `translate(${0}px, ${0}px)`;
    }

    const start = (e: any) => {
      if (window.innerWidth <= 768) return;
      initialX = (e.touches ? e.touches[0].clientX : e.clientX) - xOffset;
      initialY = (e.touches ? e.touches[0].clientY : e.clientY) - yOffset;
      isDragging = true;
    };
    const move = (e: any) => {
      if (!isDragging || window.innerWidth <= 768) return;
      e.preventDefault();
      currentX = (e.touches ? e.touches[0].clientX : e.clientX) - initialX;
      currentY = (e.touches ? e.touches[0].clientY : e.clientY) - initialY;
      xOffset = currentX; yOffset = currentY;
      target.style.transform = `translate(${currentX}px, ${currentY}px)`;
    };
    const end = () => { isDragging = false; };
    
    handle.addEventListener('mousedown', start);
    handle.addEventListener('touchstart', start, { passive: true });
    document.addEventListener('mousemove', move, { passive: false });
    document.addEventListener('touchmove', move, { passive: false });
    document.addEventListener('mouseup', end);
    document.addEventListener('touchend', end);
    
    return () => {
      handle.removeEventListener('mousedown', start);
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', end);
    };
  }

  let cleanupToolbarDrag = makeDraggable('theme-toolbar-handle', 'custom-theme-toolbar');
  let cleanupPickerDrag = makeDraggable('picker-drag-handle', 'custom-color-picker');

  document.addEventListener('astro:before-swap', () => {
    if (cleanupToolbarDrag) cleanupToolbarDrag();
    if (cleanupPickerDrag) cleanupPickerDrag();
  }, { once: true });
});
