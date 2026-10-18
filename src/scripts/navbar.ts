// Navigation scrolling, mobile menu, and elastic nav-switch glider
let _navScrollListener: EventListener | null = null;
let _navResizeListener: EventListener | null = null;
let _hasInitialPlacement = false;
let _lastLeft = -1;
let _currentAnimation: Animation | null = null;

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

  const targetLeft = Math.round(linkRect.left - switchRect.left);
  const targetWidth = Math.round(linkRect.width);

  // If already at target position and visible, don't restart
  if (Math.abs(targetLeft - _lastLeft) < 1 && glider.style.opacity === '1') {
    return;
  }

  if (!animate) {
    if (_currentAnimation) {
      _currentAnimation.cancel();
      _currentAnimation = null;
    }
    glider.style.transform = `translateX(${targetLeft}px)`;
    glider.style.width = `${targetWidth}px`;
    glider.style.opacity = '1';
    _lastLeft = targetLeft;
    return;
  }

  const startLeft = _lastLeft >= 0 ? _lastLeft : targetLeft;
  const startWidth = parseFloat(glider.style.width) || targetWidth;
  const delta = targetLeft - startLeft;

  if (Math.abs(delta) < 2) {
    glider.style.transform = `translateX(${targetLeft}px)`;
    glider.style.width = `${targetWidth}px`;
    glider.style.opacity = '1';
    _lastLeft = targetLeft;
    return;
  }

  if (_currentAnimation) {
    _currentAnimation.cancel();
    _currentAnimation = null;
  }

  const dist = Math.abs(delta);
  // Stretches smoothly across ~80-85% of total distance, eliminating the isolated middle oval
  const maxSpan = dist + targetWidth;
  const stretchWidth = Math.round(Math.min(maxSpan, targetWidth * 1.52));
  const duration = 380; // Snappy, fluid 380ms

  let keyframes: Keyframe[] = [];

  if (delta > 0) {
    // Moving Right (Home -> About)
    // 1. Left stays anchored at Home, right edge shoots into About
    // 2. Left snaps forward to catch up
    // 3. Impact squash and slight rebound into rest
    keyframes = [
      {
        transform: `translateX(${startLeft}px) scaleY(1)`,
        width: `${startWidth}px`,
        easing: 'cubic-bezier(0.2, 0, 0.38, 1)'
      },
      {
        transform: `translateX(${startLeft}px) scaleY(0.90)`,
        width: `${stretchWidth}px`,
        offset: 0.32,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      },
      {
        transform: `translateX(${targetLeft - (stretchWidth - targetWidth)}px) scaleY(0.94)`,
        width: `${stretchWidth}px`,
        offset: 0.65,
        easing: 'cubic-bezier(0.34, 1.3, 0.64, 1)'
      },
      {
        transform: `translateX(${targetLeft + 3}px) scaleY(1.06)`,
        width: `${targetWidth - 4}px`,
        offset: 0.84,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      },
      {
        transform: `translateX(${targetLeft - 1}px) scaleY(0.99)`,
        width: `${targetWidth + 1}px`,
        offset: 0.94,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      },
      {
        transform: `translateX(${targetLeft}px) scaleY(1)`,
        width: `${targetWidth}px`,
        offset: 1
      }
    ];
  } else {
    // Moving Left (About -> Home)
    // 1. Right stays anchored at About, left edge shoots into Home
    // 2. Right snaps forward to catch up
    // 3. Impact squash and slight rebound into rest
    keyframes = [
      {
        transform: `translateX(${startLeft}px) scaleY(1)`,
        width: `${startWidth}px`,
        easing: 'cubic-bezier(0.2, 0, 0.38, 1)'
      },
      {
        transform: `translateX(${startLeft - (stretchWidth - startWidth)}px) scaleY(0.90)`,
        width: `${stretchWidth}px`,
        offset: 0.32,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      },
      {
        transform: `translateX(${targetLeft}px) scaleY(0.94)`,
        width: `${stretchWidth}px`,
        offset: 0.65,
        easing: 'cubic-bezier(0.34, 1.3, 0.64, 1)'
      },
      {
        transform: `translateX(${targetLeft - 3}px) scaleY(1.06)`,
        width: `${targetWidth - 4}px`,
        offset: 0.84,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      },
      {
        transform: `translateX(${targetLeft + 1}px) scaleY(0.99)`,
        width: `${targetWidth + 1}px`,
        offset: 0.94,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      },
      {
        transform: `translateX(${targetLeft}px) scaleY(1)`,
        width: `${targetWidth}px`,
        offset: 1
      }
    ];
  }

  glider.style.opacity = '1';
  _lastLeft = targetLeft;

  _currentAnimation = glider.animate(keyframes, {
    duration,
    fill: 'forwards'
  });

  _currentAnimation.onfinish = () => {
    glider.style.transform = `translateX(${targetLeft}px)`;
    glider.style.width = `${targetWidth}px`;
    _currentAnimation = null;
  };
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

  if (_navResizeListener) {
    window.removeEventListener('resize', _navResizeListener);
  }
  _navResizeListener = () => updateNavGlider(false);
  window.addEventListener('resize', _navResizeListener, { passive: true });
});

// Single event delegation for persisted nav-switch links (avoids duplicate listeners)
document.addEventListener('click', (e) => {
  const link = (e.target as HTMLElement)?.closest('.navbar__nav-switch .navbar__link') as HTMLElement;
  if (!link) return;
  const navSwitch = document.getElementById('nav-switch');
  if (!navSwitch) return;

  const navLinks = navSwitch.querySelectorAll('.navbar__link');
  navLinks.forEach(l => l.classList.remove('active'));
  link.classList.add('active');
  updateNavGlider(true);
});

document.addEventListener('astro:before-swap', () => {
  if (_currentAnimation) {
    _currentAnimation.finish();
    _currentAnimation = null;
  }
  if (_navScrollListener) {
    window.removeEventListener('scroll', _navScrollListener);
    _navScrollListener = null;
  }
  if (_navResizeListener) {
    window.removeEventListener('resize', _navResizeListener);
    _navResizeListener = null;
  }
});
