const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// 1. BaseLayout.astro fixes
let baseLayout = fs.readFileSync(path.join(srcDir, 'layouts/BaseLayout.astro'), 'utf8');

// Add 'custom' to validThemes on line 78
baseLayout = baseLayout.replace(
  "var validThemes = ['obsidian', 'serenity', 'crimson', 'rose', 'nebula', 'barbie', 'solarized-light', 'frost-blue', 'midnight-black', 'snow', 'nature', 'spring'];",
  "var validThemes = ['obsidian', 'serenity', 'crimson', 'rose', 'nebula', 'barbie', 'solarized-light', 'frost-blue', 'midnight-black', 'snow', 'nature', 'spring', 'custom'];"
);

// Remove theme-icon-critical injected style block (lines 127-135)
baseLayout = baseLayout.replace(
  /\/\/ Inject critical CSS synchronously so icons are correct before first paint\.[\s\S]*?document\.head\.appendChild\(s\);/,
  ""
);

// Fix fallback logic for parsed.textMuted etc (Lines 111-113 & 186-188)
baseLayout = baseLayout.replace(/--color-bg-nav: \'\ \+ \(parsed\.nav \|\| \'rgba\(255\,255\,255\,0\.8\)\'\)/g, "--color-bg-nav: ' + (parsed.bg ? parsed.bg + 'd9' : 'rgba(255,255,255,0.85)')");
baseLayout = baseLayout.replace(/--color-bg-code: \'\ \+ \(parsed\.code \|\| \'#f1f5f9\'\)/g, "--color-bg-code: ' + (parsed.card || '#f1f5f9')");
baseLayout = baseLayout.replace(/--color-accent-3: \'\ \+ \(parsed\.accent3 \|\| \'#60a5fa\'\)/g, "--color-accent-3: ' + (parsed.accent1 || '#60a5fa')");
baseLayout = baseLayout.replace(/--color-accent-4: \'\ \+ \(parsed\.accent4 \|\| \'#1d4ed8\'\)/g, "--color-accent-4: ' + (parsed.accent2 || '#1d4ed8')");
baseLayout = baseLayout.replace(/--color-text-muted: \'\ \+ \(parsed\.textMuted \|\| \'#64748b\'\)/g, "--color-text-muted: ' + (parsed.text || '#64748b')");
baseLayout = baseLayout.replace(/--color-text-light: \'\ \+ \(parsed\.textLight \|\| \'#94a3b8\'\)/g, "--color-text-light: ' + (parsed.text || '#94a3b8')");
baseLayout = baseLayout.replace(/--color-border: \'\ \+ \(parsed\.border \|\| \'#e2e8f0\'\)/g, "--color-border: ' + (parsed.card || '#e2e8f0')");

fs.writeFileSync(path.join(srcDir, 'layouts/BaseLayout.astro'), baseLayout);

// 2. TagChip.astro
let tagChip = fs.readFileSync(path.join(srcDir, 'components/TagChip.astro'), 'utf8');
tagChip = tagChip.replace(
  '<a href={`${base}?tag=${tag}`} class="tag">',
  '<a href={`${base}?tags=${tag}`} class="tag">'
);
fs.writeFileSync(path.join(srcDir, 'components/TagChip.astro'), tagChip);

// 3. SearchModal.astro
let searchModal = fs.readFileSync(path.join(srcDir, 'components/SearchModal.astro'), 'utf8');
// Fix body scroll on astro:before-swap
searchModal = searchModal.replace(
  "document.removeEventListener('keydown', _keydownListener);\n      _keydownListener = null;\n    }",
  "document.removeEventListener('keydown', _keydownListener);\n      _keydownListener = null;\n    }\n    const modal = document.getElementById('search-modal');\n    if (modal && modal.getAttribute('aria-hidden') === 'false') {\n      document.body.style.overflow = '';\n    }"
);
// Fix routes & basePath
searchModal = searchModal.replace(
  "if (cmd === 'home') window.location.href = '/';\n                if (cmd === 'about') window.location.href = '/about';\n                if (cmd === 'projects') window.location.href = '/projects';",
  "if (cmd === 'home') window.location.href = import.meta.env.BASE_URL;\n                if (cmd === 'about') window.location.href = import.meta.env.BASE_URL + 'about';"
);
// Fix MutationObserver race condition
searchModal = searchModal.replace(
  "const observer = new MutationObserver((mutations, obs) => {",
  `const setupInput = (input: Element, obs?: MutationObserver) => {\n            input.addEventListener('input', (e) => {\n              const val = (e.target as HTMLInputElement).value.trim().toLowerCase();\n              if (val.startsWith('>')) {\n                const cmd = val.substring(1);\n                function applyCommandTheme(t: string) {\n                  // @ts-ignore\n                  if (window.applyTheme) window.applyTheme(t);\n                }\n                if (cmd === 'dark') applyCommandTheme('obsidian');\n                if (cmd === 'light') applyCommandTheme('serenity');\n                const themes = ['obsidian', 'serenity', 'crimson', 'rose', 'nebula', 'barbie', 'solarized-light', 'frost-blue', 'midnight-black', 'snow', 'nature', 'spring', 'custom'];\n                if (cmd.startsWith('theme ')) {\n                  const targetTheme = cmd.split(' ')[1];\n                  if (themes.includes(targetTheme)) applyCommandTheme(targetTheme);\n                }\n                if (cmd === 'home') window.location.href = import.meta.env.BASE_URL;\n                if (cmd === 'about') window.location.href = import.meta.env.BASE_URL + 'about';\n              }\n            });\n            if (obs) obs.disconnect();\n          };\n\n          const existingInput = searchDiv.querySelector('.pagefind-ui__search-input');\n          if (existingInput) {\n            setupInput(existingInput);\n          } else {\n            const observer = new MutationObserver((mutations, obs) => {\n              const input = searchDiv.querySelector('.pagefind-ui__search-input');\n              if (input) setupInput(input, obs);\n            });\n            observer.observe(searchDiv, { childList: true, subtree: true });\n          }`
);

// Need to remove the old observer block
const oldObserverBlockRegex = /const observer = new MutationObserver\(\(mutations, obs\) => \{[\s\S]*?observer\.observe\(searchDiv, \{ childList: true, subtree: true \}\);/;
searchModal = searchModal.replace(oldObserverBlockRegex, "");
// The regex above will remove the old block, wait, I already replaced part of it.
// Let's reset and replace cleanly
