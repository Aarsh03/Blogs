# Aarsh's Blog

Personal blog built with Astro, hosted on GitHub Pages.

🌐 **Live site:** https://aarsh03.github.io/Blogs/

---

## Features

- **Performance:** Built with Astro v7 (static output), native Content Collections, and View Transitions for instant page loads.
- **Design:** Modern minimal design with pastel accent themes, frosted glass UI, multi-layered shadows, dynamic fonts, Eye Comfort mode, and a complete Dark/Light mode implementation (with dynamic Giscus comment themes).
- **Navigation:** Auto-hiding navbar with sliding Settings panel, interactive tag filtering pills, infinite scrolling, table of contents, reading progress bar, scroll-to-top FAB, and a sleek `Ctrl+K` Quick Search Modal overlay via Pagefind.
- **Content:** MDX support, algorithmic related posts, multi-part series navigation, Markdown callouts (`> [!NOTE]`), IDE-style language badges for code blocks, mobile-visible copy buttons, image zoom capabilities, and reading time estimation.
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
  content/posts/    ← drop .md files here to publish
  pages/            ← routing (index, blog/[slug], about, open-graph, rss)
  components/       ← Navbar, PostCard, Comments, SearchModal, RelatedPosts, SeriesBox, ScrollToTop, ViewCounter, etc.
  layouts/          ← BaseLayout, PostLayout
  styles/           ← global.css (design tokens, typography, utilities)
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
