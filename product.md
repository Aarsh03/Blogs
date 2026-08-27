# Product Spec: Aarsh's Blog (GitHub Pages)

## 1. Overview

A personal blog site hosted on **GitHub Pages** at https://aarsh03.github.io/Blogs/. Blog posts are authored as Markdown (.md or .mdx) files with frontmatter metadata. Dropping a new file into `src/content/posts/` and pushing to `main` automatically builds and publishes it — no manual index editing, no local build step required.

## 2. Tech Stack (Implemented)

| Concern | Choice | Reason |
|---|---|---|
| Site generator | Astro v7 (static output) | Native Content Collections, Shiki, fast build, View Transitions, Loaders API |
| Styling | Vanilla CSS with custom properties | Full control, no framework overhead, granular modular CSS |
| Syntax highlighting | Astro built-in Shiki | Zero config, transparent & beautiful output in both light/dark themes |
| Search | Pagefind (post-build index) | Zero backend, fully static |
| Comments | Giscus (GitHub Discussions) | Free, no backend, repo: Aarsh03/Blogs |
| Likes & Views | Cloudflare Workers + Workers KV | Free tier, serverless, persistent |
| CI/CD | GitHub Actions (withastro/action@v6, Node 22) | Auto-deploy on push to main |
| Fonts | @fontsource packages | Self-hosted, no render-blocking requests |

## 3. Content Model

### 3.1 Folder Structure

```text
Blogs/
+-- src/
|   +-- config.ts                       # Global site metadata & config (SITE object)
|   +-- content.config.ts               # Astro Content Collections schema (glob loader + zod)
|   +-- content/
|   |   +-- posts/
|   |       +-- my-post.md              # Drop any .md/.mdx file here to publish
|   +-- pages/
|   |   +-- index.astro                 # Home -- post list with tag filtering & search
|   |   +-- about.astro                 # Static about page
|   |   +-- rss.xml.ts                  # Auto-generated RSS feed
|   |   +-- blog/
|   |   |   +-- [...slug].astro         # Individual post template (dynamic route)
|   |   +-- open-graph/
|   |       +-- [...route].ts           # Dynamic OG image generation (astro-og-canvas)
|   +-- components/
|   |   +-- AuthorBio.astro             # Author bio block shown at bottom of each post
|   |   +-- Comments.astro              # Lazy-loaded Giscus comments (IntersectionObserver)
|   |   +-- CustomColorPicker.astro     # HSV/RGB/HEX/CMYK color picker UI
|   |   +-- CustomThemeToolbar.astro    # Draggable theme-builder toolbar (mobile-optimized)
|   |   +-- FloatingActions.astro       # FAB speed-dial (Scroll Top, Comments, Share)
|   |   +-- Footer.astro                # Site footer
|   |   +-- Icon.astro                  # Centralized inline SVG icon component
|   |   +-- Navbar.astro                # Auto-hiding top navbar with search & settings
|   |   +-- PostActions.astro           # Like button with Cloudflare Worker integration
|   |   +-- PostCard.astro              # Card component for post listing on home page
|   |   +-- ReadingProgress.astro       # Fixed reading progress bar at top of post
|   |   +-- RelatedPosts.astro          # Algorithmic related posts (tag-overlap scoring)
|   |   +-- SearchModal.astro           # Ctrl+K Pagefind search overlay + command interceptor
|   |   +-- SeriesBox.astro             # Multi-part series navigation box
|   |   +-- ShareButtons.astro          # Share to Twitter/LinkedIn/copy link
|   |   +-- TableOfContents.astro       # Auto-generated ToC with IntersectionObserver scrollspy
|   |   +-- TagChip.astro               # Individual tag pill component
|   |   +-- TagFilterModal.astro        # Multi-select tag filter modal (AND logic)
|   |   +-- ViewCounter.astro           # Dynamic view count display (Cloudflare Worker)
|   |   +-- navbar/
|   |       +-- MobileMenu.astro        # Mobile hamburger nav drawer
|   |       +-- SettingsPanel.astro     # Settings panel: Font, Theme, Layout, Eye Comfort
|   +-- layouts/
|   |   +-- BaseLayout.astro            # Root HTML shell with FOUC-prevention inline script
|   |   +-- PostLayout.astro            # Full post layout wrapping BaseLayout
|   +-- scripts/
|   |   +-- copy-code.ts                # Copy-to-clipboard for code blocks
|   |   +-- customThemeBuilder.ts       # Custom theme builder: drag, color picker, bubble logic
|   |   +-- heading-links.ts            # Heading anchor link copy buttons
|   |   +-- navbar.ts                   # Navbar hide/show, mobile menu, scroll handling
|   |   +-- post-filter.ts              # Home page post filtering and IntersectionObserver pagination
|   |   +-- settings.ts                 # Settings panel: font, layout, eye comfort management
|   |   +-- themeManager.ts             # Theme lifecycle, dark/light switching, swatch updates
|   +-- styles/
|   |   +-- alerts.css                  # GitHub-style Markdown callout alert styling
|   |   +-- base.css                    # CSS reset, root variables, scrollbar, selection styles
|   |   +-- global.css                  # Global component styles and utility classes
|   |   +-- navbar.css                  # Navbar, settings panel, and mobile menu styles
|   |   +-- pagefind.css                # Pagefind search UI overrides and custom styling
|   |   +-- prose.css                   # Markdown/prose typography, code blocks, copy button
|   |   +-- tags.css                    # Tag chip and tag filter modal styles
|   |   +-- transitions.css             # Astro View Transition animations
|   |   +-- themes/
|   |       +-- barbie.css              # Barbie (pastel pink light) theme
|   |       +-- crimson.css             # Crimson (default warm) theme
|   |       +-- frost-blue.css          # Frost Blue (cool light) theme
|   |       +-- midnight-black.css      # Midnight Black (OLED dark) theme
|   |       +-- nature.css              # Nature (green light) theme
|   |       +-- nebula.css              # Nebula (purple dark) theme
|   |       +-- obsidian.css            # Obsidian (deep dark) theme
|   |       +-- rose.css                # Rose (dark rose) theme
|   |       +-- serenity.css            # Serenity (calm light) theme
|   |       +-- snow.css                # Snow (clean white) theme
|   |       +-- solarized-light.css     # Solarized Light theme
|   |       +-- spring.css              # Spring (warm pastel light) theme
|   +-- utils/
|       +-- posts.ts                    # Post filtering, sorting, and reading-time utilities
|       +-- theme.ts                    # isDarkTheme() helper and DARK_THEMES registry
+-- public/
|   +-- favicon.png                     # Site favicon
|   +-- giscus-dark.css                 # Custom Giscus theme for dark mode (transparent)
|   +-- giscus-theme.css                # Custom Giscus theme for light mode (transparent)
|   +-- og-image.png                    # Fallback Open Graph image
+-- workers/
|   +-- likes-worker.js                 # Cloudflare Worker: handles likes & views via KV
|   +-- wrangler.toml                   # Cloudflare Workers deployment config
+-- .github/
|   +-- workflows/
|       +-- deploy.yml                  # GitHub Actions CI/CD: build + pagefind + deploy
+-- astro.config.mjs                    # Astro config: Shiki dual-theme, MDX, sitemap
+-- product.md                          # This product specification document
+-- package.json
```

### 3.2 Frontmatter Schema

All posts live in `src/content/posts/` and are validated by `src/content.config.ts` using Astro's Zod schema and glob loader. The schema is as follows:

```yaml
---
title: "Euclidean Panic and the Violin-Playing Duelist of Non-Euclidean Space"
date: 2026-08-01
tags: ["math", "history", "geometry", "anecdotes"]
description: "A short summary shown on post cards, meta tags, and OG image generation."
series: "Series Name"   # optional -- groups related posts into a series navigation box
draft: false            # optional -- true excludes the post from the build entirely
---
```

**Field rules:**
- `title` — Required. Displayed as the post heading, browser tab title, and OG image title.
- `date` — Required. ISO `YYYY-MM-DD` format. Used for sorting (newest-first) and the post card timestamp.
- `tags` — Required. Array of strings. Drives the multi-select tag filter modal on the home page.
- `description` — Required. Shown on the post card, `<meta name="description">`, and OG meta tags.
- `series` — Optional. When present, a **SeriesBox** component appears at the top of the post linking all posts in the same series in chronological order.
- `draft` — Optional, defaults to `false`. When `true`, the post is completely excluded from the build and never appears publicly.

**Post body supports:**
- Full Markdown and MDX syntax
- Shiki syntax-highlighted fenced code blocks (transparent background, light & dark dual-theme)
- GitHub-style callouts via `remark-github-blockquote-alert`: `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`
- Embedded images with Astro Image optimization and click-to-zoom
- Heading anchor links (auto-generated, copyable on hover)

## 4. Pages & Navigation

**Navbar:** Home | About. Features auto-hiding (hides on downward scroll, reveals on upward scroll), a search icon to trigger the Quick Search Modal, and a Settings gear icon for a slide-down settings panel. The settings panel integrates font selection, layout toggles, eye comfort sliders, and the **Custom Theme Builder** to configure personalized palettes.

### 4.1 Home / Blog List

- Lists all non-draft posts newest-first as cards.
- **Tag Filter Modal (TagFilterModal.astro):** Allows users to filter posts by multiple tags using AND logic. Active filters appear as removable chips.
- **Glassmorphism Search Modal (SearchModal.astro):** Features full keyboard navigation (Ctrl+K/Cmd+K) and an integrated Command Interceptor (`>dark`, `>light`, `>theme <name>`, `>home`, `>about`, `>rss`, `>github`) accessible via the `i` info button tooltip.
- Infinite scroll / pagination (IntersectionObserver loading logic).
- Hover reading-time tooltip on post cards.

### 4.2 Individual Post (/blog/[slug])

- Full Markdown render with Shiki syntax highlighting (transparent code blocks, dual light/dark theme), language badges, and prose.css styling.
- Markdown Callouts support (alerts.css).
- View counter integrated via ViewCounter.astro.
- Table of Contents (TableOfContents.astro): Auto-generated, collapsible, with IntersectionObserver scrollspy.
- Reading Progress Bar (ReadingProgress.astro): Fixed at the top.
- Code Blocks: IDE-style language badges and mobile-visible copy buttons.
- Related Posts (RelatedPosts.astro), Series Box (SeriesBox.astro), and Author Bio (AuthorBio.astro).
- Like button & Share buttons.
- Giscus Comments (Comments.astro): Lazy-loaded via IntersectionObserver, theme-aware.
- Image Zoom capabilities.
- Dynamic OG Images generated via astro-og-canvas.

### 4.3 Circular Animated FAB (FloatingActions.astro)

- Fixed bottom-right speed-dial menu (Scroll to Top, Comments, Share). Includes strict click-outside dismissal and cleanup on `astro:before-swap`.

## 5. Design System

- **Custom Theme Builder:** Users can build and switch themes dynamically. Features responsive mobile grids (2x5 horizontal, 1x10 vertical), bounded rotation (toolbar never leaves screen), and a touch-optimized fixed color picker that blocks background scroll.
- **Granular Styling:** CSS is fully modularized -- `base.css`, `navbar.css`, `prose.css`, `pagefind.css`, `tags.css`, `transitions.css`, `alerts.css`, and per-theme files under `styles/themes/`.
- **Typography:** Self-hosted via @fontsource (no external render-blocking requests).
- **FOUC Prevention:** `BaseLayout.astro` uses a synchronous `is:inline` script in `<head>` to set `data-theme`, `data-theme-mode`, `data-font`, `data-layout`, and `data-eye-comfort` before body paint. `themeManager.ts` strictly coordinates updates after navigation.
- **Mobile Touch Protection:** All interactive `:hover` states are wrapped in `@media (hover: hover)` to prevent sticky hover artifacts on iOS/Android.
- **View Transitions:** Astro `ClientRouter` powers smooth page transitions. All event listeners and observers are cleaned up on `astro:before-swap` to prevent memory leaks.

## 6. Infrastructure

### 6.1 Comments (Giscus)

- Repo: Aarsh03/Blogs
- Category: Announcements
- Adapts dynamically to dark/light modes via `postMessage` to the Giscus iframe.
- Custom theme CSS (`giscus-theme.css`, `giscus-dark.css`) override Giscus defaults for transparent backgrounds and correct text colors regardless of OS-level dark mode preference.

### 6.2 Likes & Views

- Worker URL: https://blog-likes.aarsh-blog-likes.workers.dev
- Routes: `GET /likes/:slug`, `POST /likes/:slug`, `GET /views/:slug`, `POST /views/:slug`

## 7. Build & Deploy Pipeline

- Runs on Node 22 via GitHub Actions (`.github/workflows/deploy.yml`).
- `astro build && pagefind --site dist` generates the static site and the Pagefind full-text search index.
- Deployed to GitHub Pages automatically on every push to `main`.

## 8. Feature Checklist

- [x] Astro v7 Content Collections with Loaders (glob) and Zod validation
- [x] Granular modular CSS and dynamic Custom Theme Builder (12 themes + custom)
- [x] View Transitions and 120fps performance optimizations
- [x] Multi-Select Tag Filter Modal & Ctrl+K Search Modal with command interceptor
- [x] Markdown Callouts & transparent Shiki highlighting (dual light/dark)
- [x] Floating Action Menu & Reading Time Tooltips
- [x] Giscus comments & Cloudflare Views/Likes
- [x] SEO, Sitemap, RSS Feed, dynamic OG Images
- [x] Image zoom & Astro Image Optimization
- [x] Frosted glass UI styling throughout
- [x] Mobile-optimized custom theme toolbar with touch-safe color picker
- [x] FOUC prevention with synchronous inline theme script

## 9. Out of Scope / Declined

- Backend database for posts (strictly static markdown)
