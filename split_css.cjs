const fs = require('fs');
const path = require('path');

const globalCssPath = 'C:/Users/suhan/Downloads/Blogs/src/styles/global.css';
const stylesDir = 'C:/Users/suhan/Downloads/Blogs/src/styles/';
const content = fs.readFileSync(globalCssPath, 'utf8');

const baseBlocks = [];
const proseBlocks = [];
const alertsBlocks = [];
const tagsBlocks = [];
const transitionsBlocks = [];
let currentSection = 'themes';

const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('LAYOUTS') || line.includes('BASE RESET') || line.includes('ACCESSIBILITY') || line.includes('SCROLLBAR') || line.includes('SELECTION')) {
    currentSection = 'base';
  } else if (line.includes('PROSE (blog post body)') || line.includes('EYE COMFORT MODE') || line.includes('CODE BLOCKS') || line.includes('TABLES') || line.includes('IMAGES & FIGURES') || line.includes('BLOCKQUOTES') || line.includes('HR')) {
    currentSection = 'prose';
  } else if (line.includes('MARKDOWN ALERTS')) {
    currentSection = 'alerts';
  } else if (line.includes('TAG SYSTEM')) {
    currentSection = 'tags';
  } else if (line.includes('ANIMATIONS') || line.includes('VIEW TRANSITIONS') || line.includes('KEYFRAMES')) {
    currentSection = 'transitions';
  }
  
  if (line.includes('THEMES')) {
    currentSection = 'themes';
  }

  if (currentSection === 'base') baseBlocks.push(line);
  if (currentSection === 'prose') proseBlocks.push(line);
  if (currentSection === 'alerts') alertsBlocks.push(line);
  if (currentSection === 'tags') tagsBlocks.push(line);
  if (currentSection === 'transitions') transitionsBlocks.push(line);
}

fs.writeFileSync(path.join(stylesDir, 'base.css'), baseBlocks.join('\n').trim());
fs.writeFileSync(path.join(stylesDir, 'prose.css'), proseBlocks.join('\n').trim());
fs.writeFileSync(path.join(stylesDir, 'alerts.css'), alertsBlocks.join('\n').trim());
fs.writeFileSync(path.join(stylesDir, 'tags.css'), tagsBlocks.join('\n').trim());
fs.writeFileSync(path.join(stylesDir, 'transitions.css'), transitionsBlocks.join('\n').trim());

const newGlobalCss = `/* ═══════════════════════════════════════
   THEMES
   ═══════════════════════════════════════ */
@import url('./themes/light.css');
@import url('./themes/dark.css');
@import url('./themes/dracula.css');
@import url('./themes/rose-pine.css');
@import url('./themes/solarized-light.css');
@import url('./themes/lavender-dark.css');
@import url('./themes/pastel-pink.css');
@import url('./themes/frost-blue.css');
@import url('./themes/midnight-black.css');
@import url('./themes/snow.css');
@import url('./themes/nature.css');
@import url('./themes/spring.css');

/* ═══════════════════════════════════════
   MODULES
   ═══════════════════════════════════════ */
@import url('./base.css');
@import url('./prose.css');
@import url('./alerts.css');
@import url('./tags.css');
@import url('./transitions.css');
@import url('./pagefind.css');
`;
fs.writeFileSync(globalCssPath, newGlobalCss);
console.log('Split complete.');
