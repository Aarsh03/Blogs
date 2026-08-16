# Aarsh's Blog

Personal blog built with Astro, hosted on GitHub Pages.

🌐 **Live site:** https://aarsh03.github.io/Blogs/

---

**This blog** is a modern, highly optimized personal blogging platform built on Astro v7. Its primary focus is delivering a frictionless, 120fps reading experience combined with a beautiful, minimal aesthetic.

**Unique Aspects:**
- ⚡ **Instant Navigation:** Leverages Astro's View Transitions and `requestAnimationFrame` debouncing for a seamless, SPA-like feel without the heavy JavaScript payload.
- 🎨 **Premium Aesthetics:** Features a meticulously crafted frosted-glass UI, 12 dynamic themes (Dark/Light/Pastel/Neon), multi-layered shadows, and customizable fonts.
- 🛠️ **Serverless Interactivity:** Fully static builds hosted on GitHub Pages, enhanced with Cloudflare Workers for persistent view/like counters, and Giscus (GitHub Discussions) for comments.
- 📖 **Reader-First UX:** Includes algorithmic related posts, adjustable Eye Comfort mode, reading time estimates, hover tooltips, a multi-action Speed Dial FAB, and an instant `Ctrl+K` Quick Search Modal.

---

## Features

- **Performance:** Built with Astro v7 (static output), native Content Collections, and View Transitions for instant page loads. Features 120fps smooth scrolling with `requestAnimationFrame` debouncing, FOUC prevention via critical inline theme CSS, and native CSS View Transition directional animations (`slide-from-right`/`slide-to-left`).
- **Design & Theming:** Ships with 12 highly customizable themes (Light, Dark, Dracula, Rosé Pine, Solarized Light, Lavender Dark, Pastel Pink, Frost Blue, Midnight Black, Snow, Nature, Spring). Includes 4 selectable typography presets (Lora, DM Sans, Playfair Display, Source Serif 4), a Narrow/Wide layout toggle, and an adjustable Eye Comfort slider (2%-25% intensity).
- **Navigation:** Auto-hiding navbar with sliding Settings panel, interactive tag filtering pills, infinite scrolling, an `IntersectionObserver` scrollspy Table of Contents, reading progress bar, a circular animated FAB speed-dial (Comments, Share, Scroll to Top), and a sleek `Ctrl+K` Quick Search Modal.
- **Content:** MDX support, algorithmic related posts, multi-part series navigation, Markdown callouts (`> [!NOTE]`), IDE-style language badges for code blocks, mobile-visible copy buttons, heading anchor copy buttons, image zoom capabilities, Author Bio cards, and hover reading-time tooltips.
- **Social & Engagement:** Like button & view counter (Cloudflare Workers + KV), GitHub Discussions comments via Giscus, social share buttons.
- **SEO & Publishing:** Auto-generated RSS feed, JSON-LD schema, dynamic Open Graph images (`astro-og-canvas`), auto-generated sitemap, and automatic CI/CD deployment via GitHub Actions.

---

## Writing a New Post

1. Create a `.md` or `.mdx` file in `src/content/posts/`:

```markdown
---
title: "My Post Title"
date: 2026-08-01
tags: ["tag1", "tag2"]
description: "A short summary shown on post cards."
draft: false
series: "My Optional Series" # Optional: Links multi-part posts together
---

Your post content here...

### Image Optimization
To take advantage of Astro's automatic image optimization (WebP/AVIF generation, resizing, lazy-loading), place your images in `src/assets/` and use relative paths in your markdown:

![My Image](../../assets/my-image.jpg)
```

2. Push to `main`:
```bash
git add .
git commit -m "Add post: my-post-title"
git push
```

That's it — GitHub Actions builds and deploys automatically in ~60 seconds.

---

## Local Development

```bash
npm install
npm run dev        # → http://localhost:4321/Blogs/
```

| Command | Action |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Build + generate Pagefind index |
| `npx astro dev stop` | Stop background dev server |

---

## Project Structure

```text
src/
  config.ts             ← site metadata, author bio, social links, Giscus/API config
  content.config.ts     ← Content Collections Zod schema & glob loader
  content/posts/        ← drop .md / .mdx files here to publish
  pages/                ← routing (index, blog/[slug], about, open-graph, rss)
  components/           ← Navbar, PostCard, Comments, SearchModal, TableOfContents, etc.
  layouts/              ← BaseLayout, PostLayout
  scripts/              ← client scripts (copy-code.ts, heading-links.ts, post-filter.ts)
  styles/
    global.css          ← base styles and CSS imports
    themes/             ← 12 modular CSS theme stylesheets
  utils/                ← post queries, date formatting, reading time calculation
public/
  favicon.png
  og-image.png      ← Default SEO Open Graph image
  giscus-theme.css  ← custom Giscus light comment box theme
  giscus-dark.css   ← custom Giscus dark comment box theme
workers/
  likes-worker.js   ← Cloudflare Worker for like & view counts
  wrangler.toml
.github/workflows/
  deploy.yml        ← GitHub Actions CI/CD
```

---

## Services

| Service | Status | Details |
|---|---|---|
| GitHub Pages | ✅ Live | Auto-deploys from `main` via GitHub Actions |
| Cloudflare Worker (Likes & Views) | ✅ Live | `https://blog-likes.aarsh-blog-likes.workers.dev` |
| Giscus (Comments) | ✅ Live | GitHub Discussions on `Aarsh03/Blogs` |

See [DEPLOY.md](./DEPLOY.md) for Cloudflare Worker details.
