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

- **Modular Client Scripts**: Maintain clean boundaries (`navbar.ts` for nav/mobile, `navSwitch.ts` for segmented switch and glider physics, `settings.ts` for settings/font/layout/comfort, `themeManager.ts` for theme switching, `customThemeBuilder.ts` for dock/picker).
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
- **Persisted Navbar (`transition:persist`):** `Navbar.astro` uses `transition:persist="main-navbar"` so the top navigation bar stays mounted and never blinks or reloads during View Transitions. Client scripts in `navSwitch.ts` animate the underlying glider (`.nav-switch__glider`) smoothly between routes without aborting during `astro:before-swap` or freezing during page navigation. Client scripts in `navbar.ts` handle scroll hide/show and mobile menu drawers.

## Documentation & Architecture Rules

- **Universal Documentation & Reference Synchronization**:
  - Whenever code, architecture, design systems, workflows, configurations, or document structures are added, modified, renamed, or removed, you must identify and update all affected markdown files (`product.md`, `README.md`, `THEMING_GUIDE.md`, `DEPLOY.md`, `POSTING_GUIDE.md`, `AGENTS.md`) within the same task.
  - **Self-Updating References**: If structural sections or source-of-truth references move (for example, moving the folder structure from `product.md` to a standalone tree file, or splitting posting rules), `AGENTS.md` and all cross-referencing markdown files must immediately update their internal references and file paths to match. Never leave broken or stale references.
  - **Feature-Specific Markdown Mapping**:
    - Adding or modifying themes, CSS variables, or visual pickers -> update `THEMING_GUIDE.md`, `product.md`, and `README.md`.
    - Adding, modifying, or extending posting functionalities (frontmatter schema, markdown/MDX plugins, callouts, Shiki code highlighting, image handling, series logic, content loaders) -> update `POSTING_GUIDE.md` and `product.md`.
    - Updates to Cloudflare Workers, KV, or backend endpoints -> update `DEPLOY.md`, `product.md`, and `README.md`.
    - Updates to pages, navigation, components, or layout features -> update `product.md` and `README.md`.
    - Updates to development rules, lifecycle scripts, or agent workflows -> update `AGENTS.md`.

- **Targeted Architecture Navigation & Folder Tree Maintenance**:
  - **Read First for Scope**: When planning or executing tasks, refer directly to `3. Content Model -> 3.1 Folder Structure` in `product.md` (or wherever the project folder structure is maintained) to understand the project structure and scope out what files to change, add, or delete. Do NOT guess or waste unnecessary tokens reading everything across the codebase.
  - **Maintain Folder Structure Integrity**: Whenever any file or folder is added, renamed, or removed in the project, you MUST immediately update `3.1 Folder Structure` in `product.md` (and any related tree docs) to reflect the exact current workspace state.

