# Aarsh's Blog

Personal blog built with Astro, hosted on GitHub Pages.

🔥 **Live site:** https://aarsh03.github.io/Blogs/

---

**This blog** is a modern, highly optimized personal blogging platform built on Astro v5+. Its primary focus is delivering a frictionless, 120fps reading experience combined with a beautiful, minimal aesthetic and unparalleled customization.

**Unique Aspects:**
- ⚡ **Instant Navigation:** Leverages Astro's View Transitions and `requestAnimationFrame` debouncing for a seamless, SPA-like feel without the heavy JavaScript payload.
- 🎨 **Visual Custom Theme Engine:** Features a draggable, rotatable frosted-glass dock and a fully custom 2D HSV Color Picker canvas. Build your own theme live on the site, with `color-mix()` relative luminance algorithms ensuring perfect WCAG contrast.
- ☁️ **Serverless Interactivity:** Fully static builds hosted on GitHub Pages, enhanced with Cloudflare Workers for persistent view/like counters, and Giscus (GitHub Discussions) for comments.
- 📖 **Reader-First UX:** Includes algorithmic related posts, adjustable Eye Comfort mode, reading time estimates, hover tooltips, a multi-action Speed Dial FAB, and an instant `Ctrl+K` Quick Search Modal.

---

## Features

- **Performance:** Built with Astro v5+ (static output), native Content Collections, and View Transitions for instant page loads. Features 120fps smooth scrolling with `requestAnimationFrame` debouncing, FOUC prevention via critical inline theme CSS, and native CSS View Transition directional animations (`slide-from-right`/`slide-to-left`).
- **Design & Theming:** Ships with 12 preset themes (Light, Dark, Dracula, Rosé Pine, Solarized Light, Lavender Dark, Pastel Pink, Frost Blue, Midnight Black, Snow, Nature, Spring) and a **Live Custom Theme Builder**. Includes 4 selectable typography presets, a Narrow/Wide layout toggle, physics-animated **Elastic Toggles**, and an adjustable Eye Comfort slider (2%-25% intensity).
- **Navigation:** Auto-hiding navbar with an **Elastic Segmented Switch** for Home/About, sliding Settings panel, interactive tag filtering pills, infinite scrolling, an `IntersectionObserver` scrollspy Table of Contents, reading progress bar, a circular animated FAB speed-dial (Comments, Share, Scroll to Top), and a sleek `Ctrl+K` Quick Search Modal powered by Pagefind.
- **Content:** MDX support, algorithmic related posts, multi-part series navigation, GitHub-style Markdown callouts (`> [!NOTE]`), IDE-style language badges for code blocks, mobile-visible copy buttons, heading anchor copy buttons, image zoom capabilities, Author Bio cards, and hover reading-time tooltips. Dual-theme `shiki` syntax highlighting automatically matches your active theme.
- **Social & Engagement:** Like button & view counter (Cloudflare Workers + KV), GitHub Discussions comments via Giscus (dynamically inheriting custom themes), social share buttons.
- **SEO & Publishing:** Auto-generated RSS feed, JSON-LD schema, dynamic Open Graph images (`astro-og-canvas`), auto-generated sitemap, and automatic CI/CD deployment via GitHub Actions.

---

## Writing a New Post

Writing a new post is as simple as dropping a `.md` or `.mdx` file into `src/content/posts/` and pushing to `main`.

👉 For complete instructions on frontmatter schema, callouts, Shiki code syntax highlighting, series navigation, and image optimization, read the **[Posting Guide](./POSTING_GUIDE.md)**.

---

## Local Development

```bash
npm install
npm run dev        # 🚀 http://localhost:4321/Blogs/
```

| Command | Action |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Build + generate Pagefind index |
| `npm run preview`| Preview production build locally |

---

## Project Structure

For the complete, up-to-date repository structure and component layout, see **[3.1 Folder Structure in product.md](./product.md#31-folder-structure)**.

---

## Services

| Service | Status | Details |
|---|---|---|
| GitHub Pages | ✅ Live | Auto-deploys from `main` via GitHub Actions |
| Cloudflare Worker (Likes & Views) | ✅ Live | `https://blog-likes.aarsh-blog-likes.workers.dev` |
| Giscus (Comments) | ✅ Live | GitHub Discussions on `Aarsh03/Blogs` |

See [DEPLOY.md](./DEPLOY.md) for Cloudflare Worker details.
