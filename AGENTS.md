## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Architecture & Lifecycle Rules

- **Modular Client Scripts**: Maintain clean boundaries (`navbar.ts` for nav/mobile, `settings.ts` for settings/font/layout/comfort, `themeManager.ts` for theme switching, `customThemeBuilder.ts` for dock/picker).
- **Draggable UI & Listener Cleanups**: Clean up drag/pointer listeners, color picker listeners, and keydown handlers strictly in `astro:before-swap` to prevent memory leaks on client-side navigation.
- **Command Palette & MutationObserver**: Search modal command interceptors use `MutationObserver` on Pagefind input to avoid race conditions and must disconnect properly.
- **Dynamic Theme Style Element**: Ensure `#custom-theme-vars` persists or is re-evaluated accurately across View Transitions.

- **FOUC Prevention & Critical Theme CSS:** `BaseLayout.astro` uses a synchronous inline script (`is:inline`) in `<head>` to set `data-theme` and inject critical `#theme-icon-critical` CSS before body paint. When modifying theme toggles or layouts, ensure no async stylesheets block first paint icons and sync attributes on `astro:after-swap`.
- **Mobile Sticky Hover Prevention:** Always wrap interactive `:hover` styling in `@media (hover: hover)` to prevent sticky hover artifacts on iOS/Android touchscreen devices.
- **Glassmorphism & Backdrop Filters:** Keep `backdrop-filter` on dedicated overlay backdrop elements rather than scrollable or `overflow: hidden` content containers to avoid browser composite clipping bugs.
- **Client Scripts & View Transitions:** Client-side scripts must attach to `astro:page-load` rather than `DOMContentLoaded` because the site uses Astro `ClientRouter`.
- **Memory Leaks & Event Listeners:** Always clean up scroll listeners, observers (`IntersectionObserver`, `MutationObserver`), and global `window`/`document` listeners on `astro:before-swap` to prevent memory leaks during client-side navigation.
- **Performance:** Use `requestAnimationFrame` debouncing and `{ passive: true }` on window scroll listeners to maintain 120fps smooth scrolling.
- **Search Index:** Pagefind search index generation is required during builds (`astro build && pagefind --site dist`).
