import { navigate } from 'astro:transitions/client';

// Segmented Home / About nav-switch controller with uninterrupted WAAPI spring physics
let _navSwitchResizeListener: EventListener | null = null;
let _hasInitialPlacement = false;
let _lastLeft = -1;
let _currentAnimation: Animation | null = null;
let _navigatingHref: string | null = null;

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

  // Hidden on mobile or detached
  if (targetWidth === 0) {
    return;
  }

  // Already resting at target position
  if (Math.abs(targetLeft - _lastLeft) < 1 && glider.style.opacity === '1' && !_currentAnimation) {
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

  let startLeft = _lastLeft >= 0 ? _lastLeft : targetLeft;
  let startWidth = parseFloat(glider.style.width) || targetWidth;

  // If an animation is currently running, seamlessly catch its live in-flight coordinates
  if (_currentAnimation && _currentAnimation.playState === 'running') {
    const currentGliderRect = glider.getBoundingClientRect();
    startLeft = Math.round(currentGliderRect.left - switchRect.left);
    startWidth = Math.round(currentGliderRect.width);
    _currentAnimation.cancel();
    _currentAnimation = null;
  }

  const delta = targetLeft - startLeft;

  if (Math.abs(delta) < 2) {
    glider.style.transform = `translateX(${targetLeft}px)`;
    glider.style.width = `${targetWidth}px`;
    glider.style.opacity = '1';
    _lastLeft = targetLeft;
    return;
  }

  const dist = Math.abs(delta);
  const duration = 340; // 340ms natural spring timeline

  let keyframes: Keyframe[] = [];

  if (delta > 0) {
    // Moving Right (Home -> About)
    // Continuous liquid leading-edge stretch and trailing-edge snap
    keyframes = [
      {
        transform: `translateX(${startLeft}px) scaleY(1)`,
        width: `${startWidth}px`,
        easing: 'cubic-bezier(0.2, 0, 0.25, 1)'
      },
      {
        transform: `translateX(${startLeft}px) scaleY(0.92)`,
        width: `${Math.round(startWidth + delta * 0.68)}px`,
        offset: 0.22,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      },
      {
        transform: `translateX(${Math.round(startLeft + delta * 0.32)}px) scaleY(0.90)`,
        width: `${Math.round(startWidth + delta * 0.72)}px`,
        offset: 0.50,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      },
      {
        transform: `translateX(${Math.round(targetLeft - 3)}px) scaleY(0.96)`,
        width: `${Math.round(targetWidth + 5)}px`,
        offset: 0.72,
        easing: 'cubic-bezier(0.34, 1.25, 0.64, 1)'
      },
      {
        transform: `translateX(${Math.round(targetLeft + 2)}px) scaleY(1.04)`,
        width: `${Math.round(targetWidth - 2)}px`,
        offset: 0.86,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      },
      {
        transform: `translateX(${Math.round(targetLeft - 0.5)}px) scaleY(0.99)`,
        width: `${Math.round(targetWidth + 0.5)}px`,
        offset: 0.95,
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
    // Continuous liquid leading-edge stretch and trailing-edge snap
    keyframes = [
      {
        transform: `translateX(${startLeft}px) scaleY(1)`,
        width: `${startWidth}px`,
        easing: 'cubic-bezier(0.2, 0, 0.25, 1)'
      },
      {
        transform: `translateX(${Math.round(startLeft - dist * 0.68)}px) scaleY(0.92)`,
        width: `${Math.round(startWidth + dist * 0.68)}px`,
        offset: 0.22,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      },
      {
        transform: `translateX(${targetLeft}px) scaleY(0.90)`,
        width: `${Math.round(startWidth + dist * 0.72)}px`,
        offset: 0.50,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      },
      {
        transform: `translateX(${Math.round(targetLeft - 2)}px) scaleY(0.96)`,
        width: `${Math.round(targetWidth + 5)}px`,
        offset: 0.72,
        easing: 'cubic-bezier(0.34, 1.25, 0.64, 1)'
      },
      {
        transform: `translateX(${Math.round(targetLeft - 2)}px) scaleY(1.04)`,
        width: `${Math.round(targetWidth - 2)}px`,
        offset: 0.86,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      },
      {
        transform: `translateX(${Math.round(targetLeft + 0.5)}px) scaleY(0.99)`,
        width: `${Math.round(targetWidth + 0.5)}px`,
        offset: 0.95,
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
    _navigatingHref = null;
  };
}

// Single event delegation for persisted nav-switch links
document.addEventListener('click', (e) => {
  const link = (e.target as HTMLElement)?.closest('.navbar__nav-switch .navbar__link') as HTMLAnchorElement | null;
  if (!link) return;
  const navSwitch = document.getElementById('nav-switch');
  if (!navSwitch) return;

  const href = link.getAttribute('href');
  if (!href) return;

  // Let browser handle new tab or modifier clicks
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (e as MouseEvent).button !== 0) {
    return;
  }

  // If clicking currently active link or an in-flight navigation, ignore
  if (link.classList.contains('active') || _navigatingHref === href) {
    e.preventDefault();
    return;
  }

  // Intercept navigation to coordinate fluid visual transition
  e.preventDefault();
  _navigatingHref = href;

  // 1. Immediately update active state in switch
  const navLinks = navSwitch.querySelectorAll('.navbar__link');
  navLinks.forEach(l => l.classList.remove('active'));
  link.classList.add('active');

  // 2. Launch fluid WAAPI spring animation on the compositor
  updateNavGlider(true);

  // 3. Initiate programmatic page swap with Astro View Transitions after a short lead time (~100ms)
  // The persisted navbar keeps running the animation smoothly across the swap
  setTimeout(() => {
    navigate(href);
  }, 100);
});

document.addEventListener('astro:before-swap', () => {
  // CRITICAL: DO NOT call _currentAnimation.finish() or cancel()!
  // Because the navbar has transition:persist="main-navbar", the #nav-switch-glider
  // DOM element remains alive and mounted. Calling .finish() forces the animation
  // to instantly teleport to 100% on frame 1, which causes jitter.
  // Letting the WAAPI animation run keeps the 60-120fps motion unbroken.
  if (_navSwitchResizeListener) {
    window.removeEventListener('resize', _navSwitchResizeListener);
    _navSwitchResizeListener = null;
  }
});

document.addEventListener('astro:page-load', () => {
  syncActiveNavSwitch();

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
