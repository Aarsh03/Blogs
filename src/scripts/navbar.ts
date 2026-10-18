// Navigation scrolling, mobile menu, and elastic nav-switch glider
let _navScrollListener: EventListener | null = null;
let _navResizeListener: EventListener | null = null;
let _hasInitialPlacement = false;

function syncActiveNavLinks() {
  const navSwitch = document.getElementById('nav-switch');
  const mobileMenu = document.getElementById('mobile-menu');
  const curPath = window.location.pathname;

  function updateLinks(container: Element | null, selector: string) {
    if (!container) return;
    const links = container.querySelectorAll(selector);
    links.forEach(link => {
      const href = (link as HTMLAnchorElement).getAttribute('href') || '';
      // Home link check (exact match or trailing slash)
      const isHome = href.endsWith('/Blogs/') || href.endsWith('/Blogs') || href === '/';
      let active = false;
      if (isHome) {
        active = curPath === href || curPath === href + '/' || curPath.replace(/\/$/, '') === href.replace(/\/$/, '');
      } else {
        active = curPath.startsWith(href);
      }
      link.classList.toggle('active', active);
    });
  }

  updateLinks(navSwitch, '.navbar__link');
  updateLinks(mobileMenu, '.mobile-link');
}

function updateNavGlider(animate = true) {
  const navSwitch = document.getElementById('nav-switch');
  const glider = document.getElementById('nav-switch-glider');
  if (!navSwitch || !glider) return;

  const activeLink = navSwitch.querySelector('.navbar__link.active') as HTMLElement;
  if (!activeLink) {
    glider.style.opacity = '0';
    return;
  }

  const switchRect = navSwitch.getBoundingClientRect();
  const linkRect = activeLink.getBoundingClientRect();

  const left = linkRect.left - switchRect.left;
  const width = linkRect.width;

  if (!animate) {
    glider.style.transition = 'none';
  } else {
    glider.style.transition = '';
  }

  glider.style.transform = `translateX(${left}px)`;
  glider.style.width = `${width}px`;
  glider.style.opacity = '1';
}

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

  // Remove existing listeners if any to prevent duplicate triggers on persisted elements
  const newBtn = btn?.cloneNode(true) as HTMLElement;
  btn?.parentNode?.replaceChild(newBtn, btn);
  newBtn?.addEventListener('click', toggleMenu);

  const newOverlay = overlay?.cloneNode(true) as HTMLElement;
  overlay?.parentNode?.replaceChild(newOverlay, overlay);
  newOverlay?.addEventListener('click', toggleMenu);

  /* ── Sync Links & Elastic Nav Glider ── */
  syncActiveNavLinks();

  // If first time load, position instantly. If navigating across persisted navbar, animate fluidly!
  updateNavGlider(_hasInitialPlacement);
  _hasInitialPlacement = true;

  const navLinks = document.querySelectorAll('.navbar__nav-switch .navbar__link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const glider = document.getElementById('nav-switch-glider');
      glider?.classList.add('elastic-stretching');
      updateNavGlider(true);
      setTimeout(() => {
        glider?.classList.remove('elastic-stretching');
      }, 500);
    });
  });

  if (_navResizeListener) {
    window.removeEventListener('resize', _navResizeListener);
  }
  _navResizeListener = () => updateNavGlider(false);
  window.addEventListener('resize', _navResizeListener, { passive: true });
});

document.addEventListener('astro:before-swap', () => {
  if (_navScrollListener) {
    window.removeEventListener('scroll', _navScrollListener);
    _navScrollListener = null;
  }
  if (_navResizeListener) {
    window.removeEventListener('resize', _navResizeListener);
    _navResizeListener = null;
  }
});
