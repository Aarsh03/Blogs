# Markdown Blog Site — Implementation Plan

Build a personal blog on **Astro** with pastel aesthetics, content collections, client-side search, Giscus comments, a Cloudflare Worker likes backend, and GitHub Pages auto-deploy.

---

## User Review Required

> [!IMPORTANT]
> **Giscus placeholder config** — The Giscus comment widget will be included with placeholder values (`data-repo`, `data-repo-id`, `data-category-id`). You'll need to visit [giscus.app](https://giscus.app) to generate your real values and replace them.

> [!IMPORTANT]
> **Cloudflare Worker deploy** — The likes worker code will be generated but **not deployed**. A separate `DEPLOY.md` doc will walk you through deploying it to Cloudflare Workers with KV. You'll need a free Cloudflare account.

> [!WARNING]
> **`astro.config.mjs` — `site` and `base`** — I'll use placeholder values (`https://<username>.github.io` and `/<repo-name>/`). You **must** update these before deploying to GitHub Pages, or links and Pagefind won't work correctly.

---

## Proposed Changes

### 1. Project Scaffolding

#### [NEW] Astro project initialization

```bash
npm create astro@latest . -- --template minimal --yes --install --no-git
```

This creates a minimal Astro project in the current directory (`c:\Users\suhan\Downloads\Blogs`) non-interactively. I'll keep the existing `product.md` intact.

After scaffolding, install additional dev dependencies:

```bash
npm install -D pagefind reading-time
```

- **pagefind** — build-time search indexing
- **reading-time** — calculate estimated reading time from markdown content

---

### 2. Astro Configuration

#### [MODIFY] [astro.config.mjs](file:///c:/Users/suhan/Downloads/Blogs/astro.config.mjs)

- Set `site` and `base` (placeholders for GitHub Pages)
- Configure Shiki syntax highlighting with `github-light` theme (no dark mode)
- Enable word wrap on code blocks

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://<username>.github.io',
  base: '/<repo-name>/',
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
```

---

### 3. Content Collections

#### [NEW] [content.config.ts](file:///c:/Users/suhan/Downloads/Blogs/src/content.config.ts)

Defines the `posts` collection using Astro 5+ `glob` loader and Zod schema matching the frontmatter spec from §3.2:

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | `string` | ✅ | Post title |
| `date` | `coerce.date()` | ✅ | ISO date, used for sorting |
| `tags` | `array(string)` | ✅ | Can be empty `[]` |
| `description` | `string` | ✅ | One-line summary |
| `slug` | `string` | ❌ | Auto-generated from filename if omitted |
| `draft` | `boolean` | ❌ | Default `false`; `true` = excluded |

#### [NEW] [hello-world.md](file:///c:/Users/suhan/Downloads/Blogs/src/content/posts/hello-world.md)

One sample blog post with valid frontmatter, a few paragraphs of content, and a code block to demonstrate syntax highlighting.

---

### 4. Design System — CSS Custom Properties

#### [NEW] [global.css](file:///c:/Users/suhan/Downloads/Blogs/src/styles/global.css)

All colors stored as CSS custom properties on `:root` for easy tweaking. The palette:

```css
:root {
  /* Backgrounds */
  --color-bg:           #fdf6f9;      /* warm off-white with pink tint */
  --color-bg-card:      #ffffff;
  --color-bg-nav:       rgba(255, 255, 255, 0.85);

  /* Pastel accents */
  --color-accent-1:     #e8b4cb;      /* soft pink */
  --color-accent-2:     #b8a9d4;      /* lavender */
  --color-accent-3:     #a7d5d2;      /* mint */
  --color-accent-4:     #f2c4a0;      /* peach */

  /* Text */
  --color-text:         #2d2d2d;
  --color-text-muted:   #6b6b6b;
  --color-text-light:   #999999;

  /* Borders & shadows */
  --color-border:       #ede4e8;
  --shadow-card:        0 2px 16px rgba(0, 0, 0, 0.04);
  --shadow-card-hover:  0 6px 24px rgba(0, 0, 0, 0.08);

  /* Typography */
  --font-ui:            'Inter', system-ui, -apple-system, sans-serif;
  --font-body:          'Lora', Georgia, serif;
  --font-mono:          'JetBrains Mono', 'Fira Code', monospace;

  /* Sizing */
  --max-width:          720px;
  --max-width-wide:     960px;
  --nav-height:         64px;
  --radius:             12px;
  --radius-sm:          8px;
}
```

Google Fonts loaded: **Inter** (UI/headings), **Lora** (post body), **JetBrains Mono** (code). This gives a clean, readable, premium feel.

The CSS file will include:
- Reset / normalize
- Base typography
- Card styles with hover lift animation
- Tag chip styles (pastel-colored pills)
- Responsive breakpoints
- Smooth transitions on interactive elements
- Navbar with backdrop blur (glassmorphism)
- Code block styling overrides

---

### 5. Layouts

#### [NEW] [BaseLayout.astro](file:///c:/Users/suhan/Downloads/Blogs/src/layouts/BaseLayout.astro)

Shared shell for all pages:
- `<head>` with SEO meta tags (title, description, Open Graph)
- Google Fonts import
- Global CSS import
- Navbar component
- Footer
- `<slot />` for page content

#### [NEW] [PostLayout.astro](file:///c:/Users/suhan/Downloads/Blogs/src/layouts/PostLayout.astro)

Used by individual post pages:
- Extends `BaseLayout`
- Renders post header (title, date, tags, reading time)
- `data-pagefind-body` on the content area
- Like button + count
- Giscus comments widget at bottom

---

### 6. Components

| Component | File | Purpose |
|---|---|---|
| **Navbar** | `src/components/Navbar.astro` | Fixed top nav with links: Home, Tags, Search, About. Backdrop blur glass effect. Active link highlight. |
| **PostCard** | `src/components/PostCard.astro` | Card for blog list — title, date, description, tags, reading time. Hover lift animation. |
| **TagChip** | `src/components/TagChip.astro` | Clickable pastel-colored tag pill. Links to `/tags/<tag>`. |
| **LikeButton** | `src/components/LikeButton.astro` | Heart icon + count. Client-side JS calls the Cloudflare Worker API. localStorage to prevent double-likes. |
| **Comments** | `src/components/Comments.astro` | Giscus script embed with placeholder config values. |
| **Search** | `src/components/Search.astro` | Pagefind UI wrapper with custom CSS to match pastel theme. |
| **Footer** | `src/components/Footer.astro` | Simple footer with copyright and social links. |

---

### 7. Pages

#### [NEW] [index.astro](file:///c:/Users/suhan/Downloads/Blogs/src/pages/index.astro) — Home / Blog List

- Fetches all non-draft posts via `getCollection('posts')`, sorted newest first
- Computes reading time for each post
- Renders `PostCard` for each
- Pagination: initially show all; add "Load More" button if > 10 posts (client-side JS)

#### [NEW] [[...slug].astro](file:///c:/Users/suhan/Downloads/Blogs/src/pages/blog/[...slug].astro) — Individual Post

- `getStaticPaths()` generates a page per post
- Renders full markdown via `<Content />`
- Includes post header, like button, Giscus comments
- Tag chips link to `/tags/<tag>`

#### [NEW] [tags/index.astro](file:///c:/Users/suhan/Downloads/Blogs/src/pages/tags/index.astro) — Tag Cloud

- Collects all unique tags across posts
- Displays as a cloud of `TagChip` components with post count per tag

#### [NEW] [[tag].astro](file:///c:/Users/suhan/Downloads/Blogs/src/pages/tags/[tag].astro) — Filtered by Tag

- `getStaticPaths()` generates a page per unique tag
- Shows filtered post list (same `PostCard` layout as home)

#### [NEW] [search.astro](file:///c:/Users/suhan/Downloads/Blogs/src/pages/search.astro) — Search Page

- Embeds the Pagefind UI search component
- Custom CSS to match the pastel theme

#### [NEW] [about.astro](file:///c:/Users/suhan/Downloads/Blogs/src/pages/about.astro) — About Page

- Static content page with placeholder bio, links, contact info
- Uses `BaseLayout`

---

### 8. Build Script (Pagefind)

#### [MODIFY] [package.json](file:///c:/Users/suhan/Downloads/Blogs/package.json)

Update the `build` script to chain Pagefind indexing after Astro build:

```json
"build": "astro build && pagefind --site dist"
```

This ensures the search index is generated from the built HTML.

---

### 9. Likes Backend (Cloudflare Worker)

#### [NEW] `workers/likes-worker.js`

A single-file Cloudflare Worker with two routes:

| Method | Route | Behavior |
|---|---|---|
| `GET` | `/likes/:slug` | Returns `{ slug, count }` from KV |
| `POST` | `/likes/:slug` | Increments count in KV, returns new count |

Anti-spam: IP-based throttling (1 like per IP per slug per 24h via KV with TTL).

CORS headers configured for the GitHub Pages domain.

#### [NEW] `workers/wrangler.toml`

Wrangler configuration for deploying the worker with KV namespace binding.

#### [NEW] [DEPLOY.md](file:///c:/Users/suhan/Downloads/Blogs/DEPLOY.md)

Step-by-step guide for:
1. Creating a Cloudflare account
2. Creating a KV namespace
3. Deploying the worker with `wrangler`
4. Updating the frontend `LIKES_API_URL` constant

---

### 10. GitHub Actions — Auto Deploy

#### [NEW] [deploy.yml](file:///c:/Users/suhan/Downloads/Blogs/.github/workflows/deploy.yml)

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v6

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

The `withastro/action@v6` handles Node setup, dependency install, `astro build`, **and** will run the Pagefind step via the `build` script in `package.json`.

---

## File Tree Summary

```
Blogs/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   └── favicon.svg
├── src/
│   ├── content.config.ts              # Collection schema
│   ├── content/
│   │   └── posts/
│   │       └── hello-world.md         # Sample post
│   ├── components/
│   │   ├── Navbar.astro
│   │   ├── PostCard.astro
│   │   ├── TagChip.astro
│   │   ├── LikeButton.astro
│   │   ├── Comments.astro
│   │   ├── Search.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── PostLayout.astro
│   ├── pages/
│   │   ├── index.astro                # Blog list (home)
│   │   ├── about.astro
│   │   ├── search.astro
│   │   ├── blog/
│   │   │   └── [...slug].astro        # Individual post
│   │   └── tags/
│   │       ├── index.astro            # Tag cloud
│   │       └── [tag].astro            # Posts filtered by tag
│   └── styles/
│       └── global.css                 # Design system
├── workers/
│   ├── likes-worker.js
│   └── wrangler.toml
├── DEPLOY.md                          # Likes backend deploy guide
├── astro.config.mjs
├── package.json
└── product.md                         # (existing)
```

---

## Verification Plan

### Automated
```bash
npm run build     # Validates frontmatter schema, builds static HTML, generates Pagefind index
```
Build must succeed with zero errors. A malformed frontmatter should fail the build.

### Manual Verification
1. **`npm run dev`** — Start dev server, visually verify:
   - Home page renders post cards with correct data
   - Individual post page renders markdown with syntax highlighting
   - Tags page shows tag cloud, clicking a tag filters posts
   - Search page loads Pagefind UI (note: Pagefind only works after a full build, so `npm run build && npm run preview` for search testing)
   - About page renders static content
   - Navbar links work, active state highlights correctly
   - Responsive layout on mobile viewport
   - Like button UI renders (API calls will fail until worker is deployed)
   - Giscus widget loads placeholder (will show "config error" until real values set)
2. **`npm run build && npm run preview`** — Verify Pagefind search works end-to-end
