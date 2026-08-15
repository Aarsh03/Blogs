document.addEventListener('astro:page-load', () => {
  const blocks = document.querySelectorAll('.prose pre');
  blocks.forEach((block) => {
    // Ensure the pre block is positioned relative for absolute positioning of the button
    if (window.getComputedStyle(block).position === 'static') {
      (block as HTMLElement).style.position = 'relative';
    }

    const language = block.getAttribute('data-language');
    if (language) {
      const badge = document.createElement('span');
      badge.className = 'code-language-badge';
      badge.innerText = language;
      block.appendChild(badge);
    }
    
    const button = document.createElement('button');
    button.className = 'copy-code-btn';
    button.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
    button.ariaLabel = 'Copy code';
    
    block.appendChild(button);
    
    button.addEventListener('click', async () => {
      const code = block.querySelector('code')?.innerText || '';
      try {
        await navigator.clipboard.writeText(code);
        button.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        button.classList.add('copied');
        setTimeout(() => {
          button.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
          button.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    });
  });
});
