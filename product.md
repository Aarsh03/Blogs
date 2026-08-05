# Product Spec: Aarsh's Blog (GitHub Pages)

## 1. Overview
A personal blog site hosted on **GitHub Pages** at `https://aarsh03.github.io/Blogs/`. Blog posts are authored as Markdown (`.md`) files with frontmatter metadata. Dropping a new `.md` file into `src/content/posts/` and pushing to `main` automatically builds and publishes it — no manual index editing, no local build step required.

## 2. Tech Stack (Implemented)
| Concern | Choice | Reason |
|---|---|---|
| Site generator | Astro v7 (static output) | Native Content Collections, Shiki, fast build, View Transitions |
| Styling | Vanilla CSS with custom properties | Full control, no framework overhead |
| Syntax highlighting | Astro built-in Shiki | Zero config, beautiful output in both themes |
| Search | Pagefind (post-build index) | Zero backend, fully static |
| Comments | Giscus (GitHub Discussions) | Free, no backend, repo: `Aarsh03/Blogs` |
| Likes | Cloudflare Workers + Workers KV | Free tier, serverless, persistent |
| CI/CD | GitHub Actions (`withastro/action@v6`, Node 22) | Auto-deploy on push to `main` |
| Fonts | `@fontsource` packages | Self-hosted, no render-blocking requests |

## 3. Content Model

### 3.1 Folder structure
```
/src
  /content
    /posts
      my-post.md        ← drop any .md file here to publish
  /pages
    index.astro         ← home / post list
    about.astro         ← static about page
    search.astro        ← Pagefind search UI
    /blog
      [...slug].astro   ← individual post template
    /tags
      index.astro       ← tag cloud
      [tag].astro       ← filtered post list
  /components
    Navbar.astro
    Footer.astro
    PostCard.astro
    TagChip.astro
    LikeButton.astro
    Comments.astro
    Search.astro
    ReadingProgress.astro
    ShareButtons.astro
    TableOfContents.astro
  /layouts
    BaseLayout.astro
    PostLayout.astro
  /styles
    global.css
/public
  favicon.png
  giscus-theme.css      ← custom Giscus lavender theme
/workers
  likes-worker.js       ← Cloudflare Worker source
  wrangler.toml         ← Cloudflare deployment config
/.github/workflows
  deploy.yml            ← GitHub Actions CI/CD
```

### 3.2 Frontmatter schema (required at top of every `.md` file)
```yaml
---
title: "My Post Title"
date: 2026-07-31
tags: ["tag1", "tag2"]
description: "A short summary shown on post cards and meta tags."
slug: "my-post-title"   # optional; auto-generated from filename if omitted
draft: false            # optional; true = excluded from build
---
```

Fields validated at build time via Zod schema in `src/content.config.ts`. A malformed post fails the build with a clear error.

## 4. Pages & Navigation

**Navbar:** Home · Tags · Search · About (pill-shaped segmented control, active page highlighted in lavender, frosted glass background, mobile hamburger menu)

### 4.1 Home / Blog List
- Lists all non-draft posts newest-first as cards
- Each card: title, date, estimated reading time, description, tag chips
- Empty state message when no posts exist

### 4.2 Individual Post (`/blog/[slug]`)
- Full Markdown render with Shiki syntax highlighting
- Header: title, date, tags, reading time
- Table of Contents: Auto-generated from headings, collapsible, sleek frosted glass design
- Reading Progress Bar: Fixed at the top, fills as you read
- Prev/Next Post navigation at the bottom
- Like button → Cloudflare Worker (`https://blog-likes.aarsh-blog-likes.workers.dev`)
- Share buttons: Twitter, LinkedIn, and Copy Link to clipboard
- Comments → Lazy-loaded Giscus widget (repo: `Aarsh03/Blogs`, category: Announcements, custom themes dynamically adapt to dark/light mode)

### 4.3 Tags
- `/tags` → cloud of all tags, colour-coded by position (pink/lavender/mint/peach cycle)
- `/tags/[tag]` → filtered post list for that tag

### 4.4 Search (`/search`)
- Pagefind UI, index built at end of every build (`astro build && pagefind --site dist`)
- Styled via Pagefind CSS variables to match pastel theme

### 4.5 About (`/about`)
- Static page with bio, what I write about, contact buttons (Email, GitHub, LinkedIn)

## 5. Design System
- **Aesthetic:** Minimal, clean, generous whitespace — pastel accent theme
- **Color palette** (defined in `src/styles/global.css` as CSS custom properties):
  - `--color-accent-1`: `#e8b4cb` (soft pink)
  - `--color-accent-2`: `#b8a9d4` (lavender)
  - `--color-accent-3`: `#a7d5d2` (mint)
  - `--color-accent-4`: `#f2c4a0` (peach)
  - `--color-bg`: `#fdf6f9`
- **Typography:** Self-hosted via `@fontsource` — DM Sans (UI), Playfair Display (headings), DM Serif Display (body), JetBrains Mono (code)
- **Dark mode:** Fully implemented. Users can toggle themes via the Navbar. Code blocks, Giscus comments, and Pagefind search adapt dynamically.
- **Responsive:** Fully responsive — mobile hamburger menu, fluid typography, responsive cards and footer

## 6. Infrastructure

### 6.1 Comments (Giscus) — ✅ Live
- Repo: `Aarsh03/Blogs`
- Repo ID: `R_kgDOTgdeGA`
- Category: Announcements
- Category ID: `DIC_kwDOTgdeGM4DCaJT`
- Theme: `https://aarsh03.github.io/Blogs/giscus-theme.css` (lavender button override)

### 6.2 Likes (Cloudflare Worker) — ✅ Live
- Worker URL: `https://blog-likes.aarsh-blog-likes.workers.dev`
- KV Namespace ID: `0560a131bd22403b9b8053b57db6606a`
- Routes: `GET /likes/:slug` · `POST /likes/:slug`
- Anti-spam: 1 like per browser via `localStorage`, IP throttling on worker

## 7. Build & Deploy Pipeline

### GitHub Actions (`deploy.yml`)
- Trigger: push to `main` or manual `workflow_dispatch`
- Node: 22 (explicitly set via `withastro/action@v6 with: node-version: 22`)
- Steps: checkout → install → `astro build && pagefind --site dist` → upload artifact → deploy to GitHub Pages
- Source in Pages settings: **GitHub Actions** (not "Deploy from a branch")

### Publishing a new post
1. Create `src/content/posts/my-new-post.md` with valid frontmatter
2. `git add . && git commit -m "Add post: my-new-post" && git push`
3. GitHub Actions builds and deploys automatically (~60s)
4. Live at `https://aarsh03.github.io/Blogs/blog/my-new-post`

## 8. Feature Checklist
- [x] Auto-detect new `.md` and `.mdx` posts on build
- [x] Frontmatter schema validated with Zod
- [x] Minimal design with pastel accent theme
- [x] Dark/light mode toggle with dynamic theme sync
- [x] Pill-shaped navbar with active-state highlight
- [x] View Transitions (smooth page loads without hard refreshes)
- [x] Mobile responsive (hamburger menu, fluid layout)
- [x] Tag cloud + tag-filtered post lists
- [x] Client-side Pagefind search
- [x] Shiki syntax highlighting (adapts to light/dark mode)
- [x] Reading time estimate on posts and cards
- [x] Table of Contents & Reading progress bar
- [x] Prev/Next post navigation & Social share buttons
- [x] Like button & Page View Counter (Cloudflare Worker + KV)
- [x] Lazy-loaded Giscus comments (GitHub Discussions)
- [x] Full SEO (JSON-LD, dynamic OG tags via `astro-og-canvas`, canonical URLs, Twitter Cards)
- [x] Auto-generated Sitemap (`sitemap-index.xml`) and RSS Feed (`rss.xml`)
- [x] Favicon (custom anime character icon)
- [x] GitHub Actions auto-build & deploy on push
- [x] Self-hosted fonts (zero render-blocking requests)
- [x] BASE_URL prefix throughout for `/Blogs/` subpath
- [x] MDX integration for rendering components inside posts
- [x] Image zoom capabilities with `medium-zoom`
- [x] Astro Image Optimization enabled
- [x] Skip-to-Content button for accessibility
- [x] Scroll-to-Top Floating Action Button (FAB)
- [x] Algorithmic "Related Posts" (via tag intersection)
- [x] Multi-part "Series" Support (auto-linking parts)
- [x] Infinite Scroll (Continuous Feed) on the homepage

## 9. Out of Scope / Declined
- Manual post listing/config file
- Backend database for posts (strictly static markdown)
