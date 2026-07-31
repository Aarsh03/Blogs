# Product Spec: Markdown Blog Site (GitHub Pages)

## 1. Overview
A personal blog site hosted on **GitHub Pages**. Blog posts are authored as Markdown (`.md`) files with frontmatter metadata. Dropping a new `.md` file into a designated folder and pushing to GitHub should automatically build and publish it as a new blog post — no manual index editing, no local build step required.

## 2. Tech Stack (recommended)
- **Site generator:** [Astro](https://astro.build) — static site generator with native Markdown/MDX + frontmatter support, fast output, easy content collections API. Chosen over Jekyll (Ruby toolchain, clunkier plugin ecosystem) and over raw HTML/JS (would require reinventing routing/templating).
- **Styling:** Plain CSS (or Tailwind, optional) — no heavy UI framework needed.
- **Syntax highlighting:** Astro's built-in Shiki integration (zero extra config).
- **Search:** Client-side search using a prebuilt JSON index (e.g. Pagefind or a simple custom Fuse.js index) generated at build time — no backend needed for search.
- **Comments:** [Giscus](https://giscus.app) (GitHub Discussions-backed, free, no backend to maintain) recommended as the default. If a fully custom look is wanted instead, fallback is a small serverless API (see §6).
- **Likes:** Small serverless backend (see §6), since GitHub Pages is static and can't persist like-counts on its own.
- **CI/CD:** GitHub Actions workflow — builds the Astro site and deploys to GitHub Pages automatically on every push to `main`.

## 3. Content Model

### 3.1 Folder structure
```
/src
  /content
    /posts
      my-first-post.md
      another-post.md
  /pages
  /components
/public
astro.config.mjs
```
New posts = drop a `.md` file into `/src/content/posts/`. Astro's Content Collections auto-detect every file in that folder at build time — no manual registration.

### 3.2 Frontmatter schema (required at top of every `.md` file)
```yaml
---
title: "My First Post"
date: 2026-07-31
tags: ["life", "coding"]
description: "A short one-line summary shown on the blog list/preview cards."
slug: "my-first-post"       # optional; auto-generated from filename if omitted
draft: false                 # optional; true = excluded from build
---
```
- `title` (string, required)
- `date` (ISO date, required) — used for sorting posts newest-first
- `tags` (array of strings, required — can be empty array)
- `description` (string, required) — used in list view and meta tags
- `slug` (string, optional)
- `draft` (boolean, optional, default `false`)

Astro Content Collections should define a **Zod schema** to validate this frontmatter at build time, so a malformed post fails the build with a clear error instead of silently breaking the site.

## 4. Pages & Navigation

**Navbar (present on every page):**
- Home / Blog list
- Tags
- Search
- About

### 4.1 Home / Blog List page
- Lists all posts, newest first, as cards: title, date, description, tags, estimated read time.
- Pagination or "load more" if post count grows large.

### 4.2 Individual Post page
- Renders full markdown content with syntax-highlighted code blocks.
- Shows title, date, tags, reading time at top.
- **Likes**: a like button + count, persisted via backend (§6).
- **Comments**: embedded Giscus widget at the bottom.
- Tag chips are clickable → go to filtered tag view.

### 4.3 Tags / Filter page
- Shows all tags as a cloud/list.
- Clicking a tag filters the post list to just that tag.

### 4.4 Search
- Search bar (in navbar or dedicated page) that filters posts client-side by title/description/tags/content using a prebuilt search index generated at build time.

### 4.5 About page
- Static page, manually written content (bio, links, contact info, etc.) — not sourced from the posts folder.

## 5. Design / Visual Style
- **Aesthetic:** Minimal and clean — generous whitespace, simple readable typography, uncluttered layout.
- **Color palette:** Soft pastel tones (pinks, lavenders, light blues/mints) used subtly — pastel accents on a mostly white/light background, not bold or saturated colors. Keep it tasteful and understated; do not label or reference the palette's inspiration anywhere in the code, copy, or comments — just implement it as "pastel accent theme."
- **Typography:** Clean sans-serif for UI, comfortable serif or sans-serif for post body — favor readability.
- **Dark mode:** Not required (declined in scoping).
- **Responsive:** Should work well on mobile and desktop.

## 6. Likes & Comments Backend

Since GitHub Pages only serves static files, likes/comments need external persistence.

### 6.1 Comments
- Use **Giscus** (GitHub Discussions-backed comment widget). Free, no custom backend needed, just requires enabling Discussions on the repo and adding the Giscus script/config to the post template.

### 6.2 Likes
- Small serverless backend, e.g.:
  - **Cloudflare Workers + Workers KV (or D1)** — free tier is generous, simple key-value increment per post slug.
  - Endpoints needed:
    - `GET /likes/:slug` → returns current like count
    - `POST /likes/:slug` → increments like count (consider basic rate-limiting/anti-spam, e.g. 1 like per browser via localStorage flag + IP-based throttling on the worker)
  - Frontend calls this API from the post page to display/update the count.
- This is the only piece of infrastructure outside of GitHub Pages + GitHub Actions.

## 7. Build & Deploy Pipeline
- **GitHub Actions workflow** (`.github/workflows/deploy.yml`):
  1. Trigger on push to `main`.
  2. Install dependencies, run `astro build`.
  3. Build step auto-discovers all `.md` files in `/src/content/posts/`, validates frontmatter, generates the search index, and outputs static HTML.
  4. Deploy the build output to GitHub Pages (via `actions/deploy-pages` or `peaceiris/actions-gh-pages`).
- No local build step required — pushing a new `.md` file to the repo is the entire publishing workflow.

## 8. Feature Checklist Summary
- [x] Auto-detect new `.md` posts on build (no manual index)
- [x] Frontmatter metadata (title, date, tags, description, slug, draft)
- [x] Minimal, clean design with subtle pastel accent theme
- [x] Tag-based filtering
- [x] Client-side search bar
- [x] Syntax highlighting for code blocks
- [x] Likes per post (serverless backend)
- [x] Comments per post (Giscus)
- [x] About page accessible from navbar
- [x] Reading time estimate on posts
- [x] GitHub Actions auto-build & deploy on push

## 9. Out of Scope / Explicitly Declined
- Dark/light mode toggle — not requested.
- RSS feed — not requested.
- Manual post listing/config file — auto-detection chosen instead.

## 10. Open Implementation Notes for the Building LLM
- Use Astro Content Collections (`src/content/config.ts`) with a Zod schema matching §3.2.
- Reading time: compute at build time from word count (e.g. `reading-time` npm package or a simple word-count/200wpm calculation) and inject into post frontmatter/props.
- Search index: generate a JSON file at build time containing `{ slug, title, description, tags }` for all posts; load and filter client-side with vanilla JS or Fuse.js.
- Keep the likes backend minimal — a single Cloudflare Worker file with two routes is sufficient; document the deploy steps for it separately from the main GitHub Pages site since it deploys to Cloudflare, not GitHub Pages.
- Store the pastel color palette as CSS custom properties (`--color-accent-1`, `--color-bg`, etc.) in a single theme file for easy tweaking, with no naming or comments referencing its inspiration.
