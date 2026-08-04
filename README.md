# Aarsh's Blog

Personal blog built with Astro, hosted on GitHub Pages.

🌐 **Live site:** https://aarsh03.github.io/Blogs/

---

## Writing a New Post

1. Create a `.md` file in `src/content/posts/`:

```yaml
---
title: "My Post Title"
date: 2026-08-01
tags: ["tag1", "tag2"]
description: "A short summary shown on post cards."
draft: false
---

Your post content here...
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

```
src/
  content/posts/    ← drop .md files here to publish
  pages/            ← routing (index, blog/[slug], tags, search, about)
  components/       ← Navbar, Footer, PostCard, LikeButton, Comments, Search, TagChip, ReadingProgress, ShareButtons, TableOfContents
  layouts/          ← BaseLayout, PostLayout
  styles/           ← global.css (design tokens, typography, utilities)
public/
  favicon.png
  og-image.png      ← Default SEO Open Graph image
  giscus-theme.css  ← custom Giscus comment box theme
workers/
  likes-worker.js   ← Cloudflare Worker for like counts
  wrangler.toml
.github/workflows/
  deploy.yml        ← GitHub Actions CI/CD
```

---

## Services

| Service | Status | Details |
|---|---|---|
| GitHub Pages | ✅ Live | Auto-deploys from `main` via GitHub Actions |
| Cloudflare Worker (Likes) | ✅ Live | `https://blog-likes.aarsh-blog-likes.workers.dev` |
| Giscus (Comments) | ✅ Live | GitHub Discussions on `Aarsh03/Blogs` |

See [DEPLOY.md](./DEPLOY.md) for Cloudflare Worker details.
