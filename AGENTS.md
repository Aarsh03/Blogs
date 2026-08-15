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

- **Client Scripts & View Transitions:** Client-side scripts must attach to `astro:page-load` rather than `DOMContentLoaded` because the site uses Astro `ClientRouter`.
- **Memory Leaks & Event Listeners:** Always clean up scroll listeners, observers (`IntersectionObserver`, `MutationObserver`), and global `window`/`document` listeners on `astro:before-swap` to prevent memory leaks during client-side navigation.
- **Performance:** Use `requestAnimationFrame` debouncing and `{ passive: true }` on window scroll listeners to maintain 120fps smooth scrolling.
- **Search Index:** Pagefind search index generation is required during builds (`astro build && pagefind --site dist`).
