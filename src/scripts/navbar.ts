// Navigation scrolling & mobile menu
let _navScrollListener: EventListener | null = null;

document.addEventListener('astro:page-load', () => {
  if (_navScrollListener) {
    window.removeEventListener('scroll', _navScrollListener);
  }
  
  let lastScroll = window.scrollY;
  let ticking = false;
  
  _navScrollListener = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const navbar = document.querySelector('.navbar');
        const currentScroll = window.scrollY;

        if (currentScroll <= 0) {
          navbar?.classList.remove('navbar--hidden');
        } else if (currentScroll > lastScroll) {
          navbar?.classList.add('navbar--hidden');
          // Close settings panel when navbar hides
          const panel = document.getElementById('settings-panel');
          const btn = document.getElementById('settings-toggle');
          if (panel?.getAttribute('aria-hidden') === 'false') {
            panel.setAttribute('aria-hidden', 'true');
            btn?.setAttribute('aria-expanded', 'false');
            btn?.classList.remove('active');
          }
        } else if (currentScroll < lastScroll) {
          navbar?.classList.remove('navbar--hidden');
        }

        if (currentScroll > 20) {
          navbar?.classList.add('navbar--scrolled');
        } else {
          navbar?.classList.remove('navbar--scrolled');
        }

        lastScroll = currentScroll;
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', _navScrollListener, { passive: true });
  _navScrollListener(new Event('scroll'));

  /* ── Mobile menu ── */
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-overlay');

  function toggleMenu() {
    const isOpen = menu?.classList.toggle('open');
    overlay?.classList.toggle('open');
    btn?.classList.toggle('open');
    btn?.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  btn?.addEventListener('click', toggleMenu);
  overlay?.addEventListener('click', toggleMenu);
});

document.addEventListener('astro:before-swap', () => {
  if (_navScrollListener) {
    window.removeEventListener('scroll', _navScrollListener);
    _navScrollListener = null;
  }
});
