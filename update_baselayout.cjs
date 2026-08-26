const fs = require('fs');

let baseLayout = fs.readFileSync('src/layouts/BaseLayout.astro', 'utf8');

// 1. Initial Load Script
let oldInitial = `        var validThemes = ['obsidian', 'serenity', 'crimson', 'rose', 'nebula', 'barbie', 'solarized-light', 'frost-blue', 'midnight-black', 'snow', 'nature', 'spring'];`;
let newInitial = `        var validThemes = ['obsidian', 'serenity', 'crimson', 'rose', 'nebula', 'barbie', 'solarized-light', 'frost-blue', 'midnight-black', 'snow', 'nature', 'spring', 'custom'];`;

baseLayout = baseLayout.replace(oldInitial, newInitial); // First occurrence

// After setting `data-theme`, we need to apply the custom theme variables if the theme is 'custom'
let oldThemeSet = `document.documentElement.setAttribute('data-theme', theme);`;
let newThemeSet = `document.documentElement.setAttribute('data-theme', theme);
        
        if (theme === 'custom') {
          var customTheme = localStorage.getItem('customTheme');
          if (customTheme) {
            try {
              var parsed = JSON.parse(customTheme);
              var s = document.createElement('style');
              s.id = 'custom-theme-vars';
              s.textContent = '[data-theme="custom"] { ' +
                '--color-bg: ' + (parsed.bg || '#ffffff') + '; ' +
                '--color-bg-card: ' + (parsed.card || '#f8f9fa') + '; ' +
                '--color-bg-nav: ' + (parsed.nav || 'rgba(255,255,255,0.8)') + '; ' +
                '--color-bg-code: ' + (parsed.code || '#f1f5f9') + '; ' +
                '--color-accent-1: ' + (parsed.accent1 || '#3b82f6') + '; ' +
                '--color-accent-2: ' + (parsed.accent2 || '#2563eb') + '; ' +
                '--color-accent-3: ' + (parsed.accent3 || '#60a5fa') + '; ' +
                '--color-accent-4: ' + (parsed.accent4 || '#1d4ed8') + '; ' +
                '--color-text: ' + (parsed.text || '#0f172a') + '; ' +
                '--color-text-muted: ' + (parsed.textMuted || '#64748b') + '; ' +
                '--color-text-light: ' + (parsed.textLight || '#94a3b8') + '; ' +
                '--color-border: ' + (parsed.border || '#e2e8f0') + '; ' +
                '--color-link: var(--color-accent-2); ' +
                '--color-code-text: var(--color-accent-1); ' +
                '--color-success: #10b981; ' +
              '}';
              document.head.appendChild(s);
            } catch(e) {}
          }
        }`;

baseLayout = baseLayout.replace(oldThemeSet, newThemeSet);

// 2. View transition swap script
let oldSwapThemes = `          var validThemes = ['obsidian', 'serenity', 'crimson', 'rose', 'nebula', 'barbie', 'solarized-light', 'frost-blue', 'midnight-black', 'snow', 'nature', 'spring'];`;
let newSwapThemes = `          var validThemes = ['obsidian', 'serenity', 'crimson', 'rose', 'nebula', 'barbie', 'solarized-light', 'frost-blue', 'midnight-black', 'snow', 'nature', 'spring', 'custom'];`;

baseLayout = baseLayout.replace(oldSwapThemes, newSwapThemes);

let oldSwapThemeSet = `document.documentElement.setAttribute('data-theme', t);`;
let newSwapThemeSet = `document.documentElement.setAttribute('data-theme', t);
          
          var existingCustom = document.getElementById('custom-theme-vars');
          if (existingCustom) existingCustom.remove();
          
          if (t === 'custom') {
            var customTheme = localStorage.getItem('customTheme');
            if (customTheme) {
              try {
                var parsed = JSON.parse(customTheme);
                var s = document.createElement('style');
                s.id = 'custom-theme-vars';
                s.textContent = '[data-theme="custom"] { ' +
                  '--color-bg: ' + (parsed.bg || '#ffffff') + '; ' +
                  '--color-bg-card: ' + (parsed.card || '#f8f9fa') + '; ' +
                  '--color-bg-nav: ' + (parsed.nav || 'rgba(255,255,255,0.8)') + '; ' +
                  '--color-bg-code: ' + (parsed.code || '#f1f5f9') + '; ' +
                  '--color-accent-1: ' + (parsed.accent1 || '#3b82f6') + '; ' +
                  '--color-accent-2: ' + (parsed.accent2 || '#2563eb') + '; ' +
                  '--color-accent-3: ' + (parsed.accent3 || '#60a5fa') + '; ' +
                  '--color-accent-4: ' + (parsed.accent4 || '#1d4ed8') + '; ' +
                  '--color-text: ' + (parsed.text || '#0f172a') + '; ' +
                  '--color-text-muted: ' + (parsed.textMuted || '#64748b') + '; ' +
                  '--color-text-light: ' + (parsed.textLight || '#94a3b8') + '; ' +
                  '--color-border: ' + (parsed.border || '#e2e8f0') + '; ' +
                  '--color-link: var(--color-accent-2); ' +
                  '--color-code-text: var(--color-accent-1); ' +
                  '--color-success: #10b981; ' +
                '}';
                document.head.appendChild(s);
              } catch(e) {}
            }
          }`;

baseLayout = baseLayout.replace(oldSwapThemeSet, newSwapThemeSet);

fs.writeFileSync('src/layouts/BaseLayout.astro', baseLayout);
console.log("Updated BaseLayout.astro");
