import { navigate } from 'astro:transitions/client';

// Segmented Home / About nav-switch controller with pure GPU compositor spring physics
let _navSwitchResizeListener: EventListener | null = null;
let _hasInitialPlacement = false;
let _lastLeft = -1;
let _currentAnimation: Animation | null = null;
let _navigatingHref: string | null = null;
let _navTimeout: number | null = null;

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

/**
 * Prefetch target route into browser cache so View Transitions swap in <10ms
 */
function prefetchNavLinks() {
  const navSwitch = document.getElementById('nav-switch');
  if (!navSwitch) return;
  const links = navSwitch.querySelectorAll('.navbar__link');
  links.forEach(link => {
    const href = (link as HTMLAnchorElement).getAttribute('href');
    if (!href) return;
    const prefetchTag = document.querySelector(`link[rel="prefetch"][href="${href}"]`);
    if (!prefetchTag) {
      const p = document.createElement('link');
      p.rel = 'prefetch';
      p.href = href;
      document.head.appendChild(p);
    }
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

  // Set width once on the DOM layout (layout reflow happens only once, not per frame)
  glider.style.width = `${targetWidth}px`;

  // Already resting at target position
  if (Math.abs(targetLeft - _lastLeft) < 1 && glider.style.opacity === '1' && !_currentAnimation) {
    return;
  }

  if (!animate) {
    if (_currentAnimation) {
      _currentAnimation.cancel();
      _currentAnimation = null;
    }
    glider.style.transform = `translateX(${targetLeft}px) scaleX(1) scaleY(1)`;
    glider.style.opacity = '1';
    _lastLeft = targetLeft;
    return;
  }

  let startLeft = _lastLeft >= 0 ? _lastLeft : targetLeft;

  // If an animation is currently in-flight, smoothly catch its live visual coordinates
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
    _lastLeft = targetLeft;
    return;
  }

  const dist = Math.abs(delta);
  // Snappy, silky 220ms spring duration
  const duration = 220;

  // Pure GPU Compositor Keyframes (translateX, scaleX, scaleY only — 0 layout reflows!)
  let keyframes: Keyframe[] = [];

  if (delta > 0) {
    // Moving Right (Home -> About)
    keyframes = [
      {
        transform: `translateX(${startLeft}px) scaleX(1) scaleY(1)`,
        easing: 'cubic-bezier(0.2, 0, 0.2, 1)'
      },
      {
        transform: `translateX(${Math.round(startLeft + dist * 0.22)}px) scaleX(1.48) scaleY(0.91)`,
        offset: 0.26,
        easing: 'cubic-bezier(0.25, 1, 0.45, 1)'
      },
      {
        transform: `translateX(${Math.round(startLeft + dist * 0.70)}px) scaleX(1.22) scaleY(0.94)`,
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
        transform: `translateX(${Math.round(startLeft - dist * 0.22)}px) scaleX(1.48) scaleY(0.91)`,
        offset: 0.26,
        easing: 'cubic-bezier(0.25, 1, 0.45, 1)'
      },
      {
        transform: `translateX(${Math.round(startLeft - dist * 0.70)}px) scaleX(1.22) scaleY(0.94)`,
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
  _lastLeft = targetLeft;

  _currentAnimation = glider.animate(keyframes, {
    duration,
    fill: 'forwards'
  });

  _currentAnimation.onfinish = () => {
    glider.style.transform = `translateX(${targetLeft}px) scaleX(1) scaleY(1)`;
    _currentAnimation = null;
    _navigatingHref = null;
  };
}

// Single delegated click listener for persisted nav-switch links
document.addEventListener('click', (e) => {
  const link = (e.target as HTMLElement)?.closest('.navbar__nav-switch .navbar__link') as HTMLAnchorElement | null;
  if (!link) return;
  const navSwitch = document.getElementById('nav-switch');
  if (!navSwitch) return;

  const href = link.getAttribute('href');
  if (!href) return;

  // Let browser handle new tab or modifier clicks (Ctrl/Cmd/Shift + Click)
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (e as MouseEvent).button !== 0) {
    return;
  }

  // If clicking currently active link or an already pending navigation, ignore
  if (link.classList.contains('active') || _navigatingHref === href) {
    e.preventDefault();
    return;
  }

  // Intercept navigation to coordinate fluid visual transit
  e.preventDefault();
  _navigatingHref = href;

  if (_navTimeout) {
    clearTimeout(_navTimeout);
    _navTimeout = null;
  }

  // 1. Immediately toggle active classes on the switch tabs
  const navLinks = navSwitch.querySelectorAll('.navbar__link');
  navLinks.forEach(l => l.classList.remove('active'));
  link.classList.add('active');

  // 2. Launch fluid GPU spring animation immediately (0 layout reflows)
  updateNavGlider(true);

  // 3. Landing-Coordinated Navigation:
  // Trigger navigate() at 180ms when the glider has ALREADY crossed the track
  // and is soft-settling into the target tab.
  // Because the glider is already at the destination, the subsequent View Transition
  // snapshot NEVER freezes the glider in the middle of transit!
  _navTimeout = window.setTimeout(() => {
    _navTimeout = null;
    navigate(href);
  }, 180);
});

// Prefetch route on hover to ensure instant sub-5ms HTML load
document.addEventListener('pointerenter', (e) => {
  const link = (e.target as HTMLElement)?.closest('.navbar__nav-switch .navbar__link') as HTMLAnchorElement | null;
  if (!link) return;
  const href = link.getAttribute('href');
  if (href) {
    const prefetchTag = document.querySelector(`link[rel="prefetch"][href="${href}"]`);
    if (!prefetchTag) {
      const p = document.createElement('link');
      p.rel = 'prefetch';
      p.href = href;
      document.head.appendChild(p);
    }
  }
}, true);

document.addEventListener('astro:before-swap', () => {
  // CRITICAL: DO NOT call _currentAnimation.finish() or cancel()!
  // Because the navbar has transition:persist="main-navbar", the #nav-switch-glider
  // DOM element remains alive and mounted.
  if (_navSwitchResizeListener) {
    window.removeEventListener('resize', _navSwitchResizeListener);
    _navSwitchResizeListener = null;
  }
});

document.addEventListener('astro:page-load', () => {
  syncActiveNavSwitch();
  prefetchNavLinks();

  // If an elastic animation is in-flight across the view transition,
  // do not snap or reset styles. Let onfinish lock the resting state.
  if (!_currentAnimation || _currentAnimation.playState !== 'running') {
    updateNavGlider(_hasInitialPlacement);
  }
  _hasInitialPlacement = true;

  if (_navSwitchResizeListener) {
    window.removeEventListener('resize', _navSwitchResizeListener);
  }
  _navSwitchResizeListener = () => {
    if (!_currentAnimation || _currentAnimation.playState !== 'running') {
      updateNavGlider(false);
    }
  };
  window.addEventListener('resize', _navSwitchResizeListener, { passive: true });
});
