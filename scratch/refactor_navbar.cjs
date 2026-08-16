const fs = require('fs');

const navbarPath = 'C:/Users/suhan/Downloads/Blogs/src/components/Navbar.astro';
let content = fs.readFileSync(navbarPath, 'utf8');

// Extract CSS
const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch) {
  const css = styleMatch[1];
  fs.writeFileSync('C:/Users/suhan/Downloads/Blogs/src/styles/navbar.css', css.trim());
  content = content.replace(styleMatch[0], ''); // Remove <style> block
}

// Write the modified Navbar.astro back
fs.writeFileSync(navbarPath, content);
console.log('Navbar CSS extracted.');
