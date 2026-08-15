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
| Likes & Views | Cloudflare Workers + Workers KV | Free tier, serverless, persistent |
| CI/CD | GitHub Actions (`withastro/action@v6`, Node 22) | Auto-deploy on push to `main` |
| Fonts | `@fontsource` packages | Self-hosted, no render-blocking requests |

## 3. Content Model

### 3.1 Folder structure
```
/src
  config.ts             ← global site metadata & config
  content.config.ts     ← Astro Content Collections schema
  /content
    /posts
      my-post.md        ← drop any .md file here to publish
  /pages
    index.astro         ← home / post list / tag filtering
    about.astro         ← static about page
    rss.xml.ts          ← auto-generated RSS feed
    /blog
      [...slug].astro   ← individual post template
    /open-graph
      [...route].ts     ← dynamic OG image generation
  /components
    Navbar.astro
    Footer.astro
    PostCard.astro
    TagChip.astro
    AuthorBio.astro
    LikeButton.astro
    ViewCounter.astro
    Comments.astro
    SearchModal.astro   ← Ctrl+K overlay search
    ReadingProgress.astro
    ShareButtons.astro
    TableOfContents.astro
    RelatedPosts.astro  ← algorithmic recommendations
    SeriesBox.astro     ← multi-part series navigation
    ScrollToTop.astro
  /layouts
    BaseLayout.astro
    PostLayout.astro
  /styles
    global.css
/public
  favicon.png
  og-image.png          ← fallback open graph image
  giscus-theme.css      ← custom Giscus lavender theme
  giscus-dark.css       ← custom Giscus dark theme
/workers
  likes-worker.js       ← Cloudflare Worker source (handles views & likes)
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
series: "Series Name"   # optional; groups related posts together
draft: false            # optional; true = excluded from build
---
```

Fields validated at build time via Zod schema in `src/content.config.ts`. A malformed post fails the build with a clear error.

## 4. Pages & Navigation

**Navbar:** Home · About (pill-shaped segmented control, active page highlighted in lavender, frosted glass background, mobile hamburger menu). Features auto-hiding (hides on downward scroll, reveals on upward scroll), a search icon to trigger the Quick Search Modal, and a Settings gear icon for a slide-down settings panel (Font selection, Eye Comfort mode, Dark/Light Theme toggle).

### 4.1 Home / Blog List
- Lists all non-draft posts newest-first as cards
- Interactive tag filtering pills to filter posts directly on the homepage
- Search functionality via `Ctrl+K` Quick Search Modal overlay
- Infinite scroll / pagination (`IntersectionObserver` loading 10 initial posts + 6 posts per scroll)
- Each card: title, date, estimated reading time, description, tag chips
- Hover reading-time tooltip on post cards with cubic-bezier float animation
- Empty state message when no posts exist

### 4.2 Individual Post (`/blog/[slug]`)
- Full Markdown render with Shiki syntax highlighting and language badges
- Markdown Callouts support (`> [!NOTE]`, etc.)
- Header: title, date, tags, reading time, view count (`ViewCounter.astro`)
- Table of Contents: Auto-generated from headings, collapsible, sleek frosted glass design
- Reading Progress Bar: Fixed at the top, fills as you read
- Series Navigation: `SeriesBox.astro` for multi-part posts
- Code Blocks: IDE-style language badges and mobile-visible copy buttons
- Headings: Deep link copy buttons on h2/h3 headings
- Prev/Next Post navigation at the bottom
- Author Bio card (`AuthorBio.astro`) with animated gradient avatar
- Jump-to-comments button (`.comment-btn` navigating to `#comments`)
- Related Posts: Algorithmic recommendations based on tags
- Like button → Cloudflare Worker (`https://blog-likes.aarsh-blog-likes.workers.dev`)
- Share buttons: Twitter, LinkedIn, and Copy Link to clipboard
- Comments → Lazy-loaded Giscus widget (repo: `Aarsh03/Blogs`, category: Announcements, custom themes dynamically adapt to dark/light mode)
- Image Zoom: Medium-style zoom capability
- Dynamic OG Images: Generated via `/open-graph/[slug].png`

### 4.3 About (`/about`)
- Static page with bio, what I write about, contact buttons (Email, GitHub, LinkedIn)

## 5. Design System
- **Aesthetic:** Minimal, clean, generous whitespace — pastel accent theme
- **Color palette** (defined in `src/styles/global.css` as CSS custom properties):
  - `--color-accent-1`: `#e8b4cb` (soft pink)
  - `--color-accent-2`: `#b8a9d4` (lavender)
  - `--color-accent-3`: `#a7d5d2` (mint)
  - `--color-accent-4`: `#f2c4a0` (peach)
  - `--color-bg`: `#fdf6f9`
- **Typography:** Self-hosted via `@fontsource` — DM Sans (UI), Playfair Display (headings), Lora and Source Serif 4 (selectable body fonts), JetBrains Mono (code)
- **Dark mode:** Fully implemented. Users can toggle themes via the Navbar. Code blocks, Giscus comments, and Pagefind search adapt dynamically. Features specific dark mode tag colors, frosted glass UI, and subtle glow effects.
- **Frosted Glass UI:** Applied via `backdrop-filter: blur(...)` across the Navbar, Settings Panel, Mobile Drawer, Table of Contents, and Search Modal.
- **Performance (120fps):** Uses `requestAnimationFrame` debouncing and `{ passive: true }` listeners for scroll handlers. View Transitions manage memory with strict `astro:before-swap` cleanups.
- **Responsive:** Fully responsive — mobile hamburger menu, fluid typography, responsive cards and footer

## 6. Infrastructure

### 6.1 Comments (Giscus) — ✅ Live
- Repo: `Aarsh03/Blogs`
- Repo ID: `R_kgDOTgdeGA`
- Category: Announcements
- Category ID: `DIC_kwDOTgdeGM4DCaJT`
- Theme: `giscus-theme.css` and `giscus-dark.css` dynamically swapped when switching modes.

### 6.2 Likes & Views (Cloudflare Worker) — ✅ Live
- Worker URL: `https://blog-likes.aarsh-blog-likes.workers.dev`
- KV Namespace ID: `0560a131bd22403b9b8053b57db6606a`
- Routes: `GET /likes/:slug`, `POST /likes/:slug`, `GET /views/:slug`, `POST /views/:slug`
- Anti-spam: 1 like per browser via `localStorage`, session storage for views, IP throttling on worker

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
- [x] Pill-shaped navbar with active-state highlight & auto-hiding on scroll
- [x] View Transitions (smooth page loads without hard refreshes)
- [x] Mobile responsive (hamburger menu, fluid layout)
- [x] Tag cloud + tag-filtered post lists directly on homepage
- [x] `Ctrl+K` / `Cmd+K` Quick Search Modal overlay via Pagefind
- [x] Shiki syntax highlighting with IDE-style Language Badges
- [x] Reading time estimate on posts and cards
- [x] Table of Contents & Reading progress bar
- [x] Prev/Next post navigation & Social share buttons
- [x] Like button & Page View Counter (Cloudflare Worker + KV)
- [x] Lazy-loaded Giscus comments (Dual light/dark theme switching)
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
- [x] Scroll-to-Top Floating Action Menu (FAB with multi-action Speed Dial, Share Toast, and Comments Jump)
- [x] Reading time hover tooltips on post cards
- [x] Author Bio component on post pages
- [x] Heading anchor link copy buttons
- [x] 120fps performance optimizations (rAF throttled scroll, passive listeners)
- [x] Frosted glass UI styling across navigation and modals
- [x] Algorithmic "Related Posts" (via tag intersection)
- [x] Multi-part "Series" Support (auto-linking parts)
- [x] Infinite Scroll (Continuous Feed) on the homepage
- [x] Markdown Callouts (`> [!NOTE]`, etc.)
- [x] Mobile-visible Copy Button
- [x] Jump to comments button

## 9. Out of Scope / Declined
- Manual post listing/config file
- Backend database for posts (strictly static markdown)
