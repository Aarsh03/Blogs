// Segmented Home / About nav-switch controller using FLIP lifecycle on persisted navbar

let _prevGliderLeft = -1;
let _hasInitialPlacement = false;
let _currentAnimation: Animation | null = null;
let _resizeListener: EventListener | null = null;

export function syncActiveNavSwitch() {
  const navSwitch = document.getElementById('nav-switch');
  if (!navSwitch) return;
  const curPath = window.location.pathname;

  const links = navSwitch.querySelectorAll('.navbar__link');
  links.forEach(link => {
    const href = (link as HTMLAnchorElement).getAttribute('href') || '';
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

export function updateNavGlider(animate = true) {
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

  // Hidden on mobile or unrendered
  if (targetWidth === 0) {
    return;
  }

  // Set width once on the DOM layout
  glider.style.width = `${targetWidth}px`;

  // First time placement or static positioning
  if (!animate || _prevGliderLeft < 0) {
    if (_currentAnimation) {
      _currentAnimation.cancel();
      _currentAnimation = null;
    }
    glider.style.transform = `translateX(${targetLeft}px) scaleX(1) scaleY(1)`;
    glider.style.opacity = '1';
    _prevGliderLeft = targetLeft;
    return;
  }

  let startLeft = _prevGliderLeft;

  // If an animation is already in flight, catch live visual coordinates smoothly
  if (_currentAnimation && _currentAnimation.playState === 'running') {
    const currentGliderRect = glider.getBoundingClientRect();
    startLeft = Math.round(currentGliderRect.left - switchRect.left);
    _currentAnimation.cancel();
    _currentAnimation = null;
  }

  const delta = targetLeft - startLeft;

  if (Math.abs(delta) < 2) {
    glider.style.transform = `translateX(${targetLeft}px) scaleX(1) scaleY(1)`;
    glider.style.opacity = '1';
    _prevGliderLeft = targetLeft;
    return;
  }

  const dist = Math.abs(delta);
  const duration = 260; // 260ms silky smooth fluid spring

  // Pure GPU Compositor Keyframes (translateX, scaleX, scaleY only — 0 layout reflows)
  let keyframes: Keyframe[] = [];

  if (delta > 0) {
    // Moving Right (Home -> About)
    keyframes = [
      {
        transform: `translateX(${startLeft}px) scaleX(1) scaleY(1)`,
        easing: 'cubic-bezier(0.2, 0, 0.2, 1)'
      },
      {
        transform: `translateX(${Math.round(startLeft + dist * 0.22)}px) scaleX(1.45) scaleY(0.91)`,
        offset: 0.26,
        easing: 'cubic-bezier(0.25, 1, 0.45, 1)'
      },
      {
        transform: `translateX(${Math.round(startLeft + dist * 0.70)}px) scaleX(1.20) scaleY(0.94)`,
        offset: 0.54,
        easing: 'cubic-bezier(0.3, 1.2, 0.6, 1)'
      },
      {
        transform: `translateX(${Math.round(targetLeft + 2.5)}px) scaleX(0.95) scaleY(1.04)`,
        offset: 0.78,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      },
      {
        transform: `translateX(${Math.round(targetLeft - 0.5)}px) scaleX(1.01) scaleY(0.99)`,
        offset: 0.90,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      },
      {
        transform: `translateX(${targetLeft}px) scaleX(1) scaleY(1)`,
        offset: 1
      }
    ];
  } else {
    // Moving Left (About -> Home)
    keyframes = [
      {
        transform: `translateX(${startLeft}px) scaleX(1) scaleY(1)`,
        easing: 'cubic-bezier(0.2, 0, 0.2, 1)'
      },
      {
        transform: `translateX(${Math.round(startLeft - dist * 0.22)}px) scaleX(1.45) scaleY(0.91)`,
        offset: 0.26,
        easing: 'cubic-bezier(0.25, 1, 0.45, 1)'
      },
      {
        transform: `translateX(${Math.round(startLeft - dist * 0.70)}px) scaleX(1.20) scaleY(0.94)`,
        offset: 0.54,
        easing: 'cubic-bezier(0.3, 1.2, 0.6, 1)'
      },
      {
        transform: `translateX(${Math.round(targetLeft - 2.5)}px) scaleX(0.95) scaleY(1.04)`,
        offset: 0.78,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      },
      {
        transform: `translateX(${Math.round(targetLeft + 0.5)}px) scaleX(1.01) scaleY(0.99)`,
        offset: 0.90,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      },
      {
        transform: `translateX(${targetLeft}px) scaleX(1) scaleY(1)`,
        offset: 1
      }
    ];
  }

  glider.style.opacity = '1';
  _prevGliderLeft = targetLeft;

  _currentAnimation = glider.animate(keyframes, {
    duration,
    fill: 'forwards'
  });

  _currentAnimation.onfinish = () => {
    glider.style.transform = `translateX(${targetLeft}px) scaleX(1) scaleY(1)`;
    _currentAnimation = null;
  };
}

// Ensure lifecycle listeners are registered exactly once
if (!(window as any).__navSwitchInitialized) {
  (window as any).__navSwitchInitialized = true;

  // 1. Just before page swap: snapshot the glider's exact on-screen position (FLIP "First")
  document.addEventListener('astro:before-swap', () => {
    const navSwitch = document.getElementById('nav-switch');
    const glider = document.getElementById('nav-switch-glider');
    if (navSwitch && glider) {
      const switchRect = navSwitch.getBoundingClientRect();
      const gliderRect = glider.getBoundingClientRect();
      _prevGliderLeft = Math.round(gliderRect.left - switchRect.left);
    }
    if (_resizeListener) {
      window.removeEventListener('resize', _resizeListener);
      _resizeListener = null;
    }
  });

  // 2. Immediately after page swap: DOM is updated, browser is unconstrained (FLIP "Play")
  document.addEventListener('astro:after-swap', () => {
    syncActiveNavSwitch();
    // Smoothly spring from the previous position to the new active tab
    updateNavGlider(true);
  });

  // 3. Initial page load or browser history traversal
  document.addEventListener('astro:page-load', () => {
    syncActiveNavSwitch();

    if (!_hasInitialPlacement) {
      updateNavGlider(false);
      _hasInitialPlacement = true;
    }

    if (_resizeListener) {
      window.removeEventListener('resize', _resizeListener);
    }
    _resizeListener = () => {
      updateNavGlider(false);
    };
    window.addEventListener('resize', _resizeListener, { passive: true });
  });
}
