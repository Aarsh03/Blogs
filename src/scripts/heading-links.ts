document.addEventListener('astro:page-load', () => {
  // Add Copy Link buttons to headings in prose
  document.querySelectorAll('.prose h2, .prose h3').forEach((heading) => {
    if (!heading.id) return;
    if (heading.querySelector('.heading-link-btn')) return;
    
    // Ensure relative positioning
    if (window.getComputedStyle(heading).position === 'static') {
      (heading as HTMLElement).style.position = 'relative';
    }
    
    const linkBtn = document.createElement('button');
    linkBtn.className = 'heading-link-btn';
    linkBtn.ariaLabel = 'Copy link to heading';
    linkBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
    
    heading.appendChild(linkBtn);
    
    linkBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const url = new URL(window.location.href);
      url.hash = heading.id;
      try {
        await navigator.clipboard.writeText(url.toString());
        window.history.pushState({}, '', url);
        linkBtn.classList.add('copied');
        setTimeout(() => {
          linkBtn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy heading link', err);
      }
    });
  });
});
