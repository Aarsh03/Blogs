# Posting Guide

This guide is the complete, single source of truth for authoring and publishing blog posts on this blog.

---

## 1. Quick Start

Creating and publishing a new post takes less than 60 seconds:

1. Create a `.md` or `.mdx` file in `src/content/posts/` (e.g., `src/content/posts/my-new-post.md`).
2. Add the required frontmatter metadata at the top of the file.
3. Write your post using Markdown or MDX.
4. Commit and push to `main`:

```bash
git add src/content/posts/my-new-post.md
git commit -m "Add post: my-new-post"
git push
```

GitHub Actions will automatically build the site, index it with Pagefind, and deploy it to GitHub Pages in ~60 seconds.

---

## 2. Frontmatter Schema

All posts live in `src/content/posts/` and are validated by `src/content.config.ts` using Astro's Content Collections Zod schema and glob loader.

For the canonical technical schema and field rules, refer to **[3.2 Frontmatter Schema in product.md](./product.md#32-frontmatter-schema)**.

### Example Frontmatter

```yaml
---
title: "My Post Title"
date: 2026-08-01
tags: ["engineering", "astro", "webdev"]
description: "A concise summary shown on post cards, search results, and Open Graph SEO metadata."
series: "Building a Modern Blog"   # Optional: groups related articles with a series navigation box
draft: false                       # Optional: true excludes the post from production builds
---
```

### Field Breakdown

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | **Yes** | Post title displayed in headers, browser tab, and dynamic Open Graph image. |
| `date` | `YYYY-MM-DD` | **Yes** | Publication date used for chronological sorting (newest-first) and timestamps. |
| `tags` | `string[]` | **Yes** | Array of lowercase tags. Drives the home page multi-select tag filter modal. |
| `description` | `string` | **Yes** | Summary for post cards, `<meta name="description">`, and OG meta tags. |
| `series` | `string` | No | If specified, a `SeriesBox` appears at the top linking all posts in the series. |
| `draft` | `boolean` | No | Defaults to `false`. Set to `true` to keep a draft excluded from production builds. |

---

## 3. Markdown Formatting & Features

### Alerts / Callouts

The blog natively renders GitHub-style markdown blockquote callouts via `remark-github-blockquote-alert`:

```markdown
> [!NOTE]
> Helpful information and background notes render with a blue accent and icon.

> [!TIP]
> Helpful tips and performance suggestions render with a green accent and icon.

> [!IMPORTANT]
> Key takeaways and essential requirements render with a purple accent and icon.

> [!WARNING]
> Warnings and potential gotchas render with an amber accent and icon.

> [!CAUTION]
> High-risk actions or destructive operations render with a red accent and icon.
```

### Syntax Highlighting (Shiki)

Fenced code blocks are styled using Astro's built-in Shiki syntax highlighter:
- **Dual-Theme Support**: Automatically switches between `github-light` and `github-dark-dimmed` based on the user's active theme or custom theme luminance.
- **IDE Badges & Copy Buttons**: Renders IDE-style language badges and hover-revealed (mobile-accessible) one-click copy buttons.

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}
console.log(greet("Aarsh"));
```

### Image Optimization

To take full advantage of Astro's image optimization (automatic WebP/AVIF generation, responsive resizing, lazy loading, and click-to-zoom):
1. Place your images in `src/assets/`.
2. Reference them in markdown using relative paths:

```markdown
![Architecture Diagram](../../assets/architecture.png)
```

### Heading Anchors & Table of Contents

- All headings (`h2`, `h3`, `h4`) automatically receive anchor link IDs and copy buttons on hover.
- Headings are dynamically parsed into the sticky **Table of Contents** (`TableOfContents.astro`) with live `IntersectionObserver` scrollspy tracking.

---

## 4. What Happens Automatically

When you publish a post, you don't need to manually update any indices or configurations. Everything below is generated **completely automatically**:

- 🖼️ **Dynamic Open Graph Images**: Generated via `astro-og-canvas` using your title and description.
- 🧭 **Table of Contents**: Auto-generated with smooth scroll navigation and active heading highlighting.
- 👁️ **Page Views & Likes**: Integrated with Cloudflare Worker and Workers KV for live counts.
- 🔗 **Algorithmic Related Posts**: Evaluated based on tag-overlap scoring.
- 💬 **Giscus Comments**: GitHub Discussions thread connected to your post URL.
- 📡 **RSS Feed & Sitemap**: Updated in `rss.xml` and `sitemap-index.xml`.
- 🔍 **Full-Text Search**: Indexed by Pagefind during the build for instant `Ctrl+K` modal search.
