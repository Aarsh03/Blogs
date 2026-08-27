# Product Spec: Aarsh's Blog (GitHub Pages)



## 1. Overview

A personal blog site hosted on **GitHub Pages** at https://aarsh03.github.io/Blogs/. Blog posts are authored as Markdown (.md or .mdx) files with frontmatter metadata. Dropping a new file into src/content/posts/ and pushing to main automatically builds and publishes it � no manual index editing, no local build step required.



## 2. Tech Stack (Implemented)

| Concern | Choice | Reason |

|---|---|---|

| Site generator | Astro v7 (static output) | Native Content Collections, Shiki, fast build, View Transitions, Loaders API |

| Styling | Vanilla CSS with custom properties | Full control, no framework overhead, granular modular CSS |

| Syntax highlighting | Astro built-in Shiki | Zero config, beautiful output in both themes |

| Search | Pagefind (post-build index) | Zero backend, fully static |

| Comments | Giscus (GitHub Discussions) | Free, no backend, repo: Aarsh03/Blogs |

| Likes & Views | Cloudflare Workers + Workers KV | Free tier, serverless, persistent |

| CI/CD | GitHub Actions (withastro/action@v6, Node 22) | Auto-deploy on push to main |

| Fonts | @fontsource packages | Self-hosted, no render-blocking requests |



## 3. Content Model



### 3.1 Folder structure

`	ext

/src

  config.ts               ? global site metadata & config

  content.config.ts       - Astro Content Collections schema (using glob loader)

  /content

    /posts

      my-post.md          - drop any .md/.mdx file here to publish

  /pages

    index.astro           - home / post list / tag filtering

    about.astro           - static about page

    rss.xml.ts            - auto-generated RSS feed

    /blog

      [...slug].astro     - individual post template

    /open-graph

      [...route].ts       - dynamic OG image generation

  /components

    AuthorBio.astro

    Comments.astro

    CustomColorPicker.astro - UI for creating custom theme colors

    CustomThemeToolbar.astro- Toolbar for customizing themes

    FloatingActions.astro - speed dial (Top, Comments, Share)

    Footer.astro

    Icon.astro            - centralized SVG icon component

    Navbar.astro

    PostActions.astro     - like logic

    PostCard.astro

    ReadingProgress.astro

    RelatedPosts.astro    - algorithmic recommendations

    SearchModal.astro     - Ctrl+K overlay search

    SeriesBox.astro       - multi-part series navigation

    ShareButtons.astro

    TableOfContents.astro

    TagChip.astro

    TagFilterModal.astro  - modal for multi-select tag filtering

    ViewCounter.astro     - dynamic view count display

    /navbar

      SettingsPanel.astro - Font, Theme, Layout, Eye Comfort settings

      MobileMenu.astro

  /layouts

    BaseLayout.astro

    PostLayout.astro

  /scripts

    copy-code.ts

    customThemeBuilder.ts - dynamic custom theme builder logic

    heading-links.ts

    navbar.ts

    post-filter.ts

    settings.ts           - manages settings panel functionality

    themeManager.ts       - theme lifecycle and dark/light switching logic

  /styles

    alerts.css

    base.css

    global.css

    navbar.css

    pagefind.css

    prose.css

    tags.css

    transitions.css

    /themes               - modular CSS theme stylesheets

  /utils

    posts.ts              - post filtering and sorting utils

    theme.ts              - dark/light mode detection helper

/public

  favicon.png

  og-image.png            - fallback open graph image

  giscus-theme.css        - custom Giscus light theme

  giscus-dark.css         - custom Giscus dark theme

/workers

  likes-worker.js         - Cloudflare Worker source (handles views & likes)

  wrangler.toml           - Cloudflare deployment config

/.github/workflows

  deploy.yml              - GitHub Actions CI/CD

`



### 3.2 Frontmatter schema

Requires exactly the following fields (defined and validated in src/content.config.ts using Astro's z schema and glob loader):

`yaml

---

title: "My Post Title"

date: 2026-07-31

tags: ["tag1", "tag2"]

description: "A short summary shown on post cards and meta tags."

series: "Series Name"   # optional; groups related posts together

draft: false            # optional; true = excluded from build, defaults to false

---

`



## 4. Pages & Navigation



**Navbar:** Home -> About. Features auto-hiding (hides on downward scroll, reveals on upward scroll), a search icon to trigger the Quick Search Modal, and a Settings gear icon for a slide-down settings panel. The settings panel integrates font selection, layout toggles, eye comfort sliders, and the **Custom Theme Builder** to configure personalized palettes.



### 4.1 Home / Blog List

- Lists all non-draft posts newest-first as cards.

- **Tag Filter Modal (TagFilterModal.astro):** Allows users to filter posts by multiple tags using AND logic. Active filters appear as removable chips.

- **Glassmorphism Search Modal (SearchModal.astro):** Features full keyboard navigation (Ctrl+K/Cmd+K) and an integrated Command Interceptor (>dark, >light, >theme <name>, >home, >about, >rss, >github) accessible via the tooltip.

- Infinite scroll / pagination (IntersectionObserver loading logic).

- Hover reading-time tooltip on post cards.



### 4.2 Individual Post (/blog/[slug])

- Full Markdown render with Shiki syntax highlighting, language badges, and prose.css styling.

- Markdown Callouts support (alerts.css).

- View counter integrated via ViewCounter.astro.

- Table of Contents (TableOfContents.astro): Auto-generated, collapsible, with IntersectionObserver scrollspy.

- Reading Progress Bar (ReadingProgress.astro): Fixed at the top.

- Code Blocks: IDE-style badges and mobile-visible copy buttons.

- Related Posts (RelatedPosts.astro), Series Box (SeriesBox.astro), and Author Bio (AuthorBio.astro).

- Like button & Share buttons.

- Giscus Comments (Comments.astro).

- Image Zoom capabilities.

- Dynamic OG Images generated via astro-og-canvas.



### 4.3 Circular Animated FAB (FloatingActions.astro)

- Fixed bottom-right speed-dial menu (Top, Comments, Share). Includes strict click-outside dismissal and cleanup on astro:before-swap.



## 5. Design System

- **Custom Theme Builder:** Users can build and switch themes dynamically. Features responsive mobile grids (2x5 horizontal, 1x10 vertical), bounded rotation, and touch-optimized draggable color pickers.

- **Granular Styling:** CSS is modularized (base.css, 

avbar.css, prose.css, pagefind.css, 	ags.css, 	ransitions.css, alerts.css).

- **Typography:** Self-hosted via @fontsource.

- **FOUC Prevention:** BaseLayout.astro uses a synchronous inline script in <head> to set attributes, preventing flash of unstyled content during View Transitions. 	hemeManager.ts strictly coordinates updates.

- **Mobile Touch Protection:** Interactive :hover styling is wrapped in @media (hover: hover).



## 6. Infrastructure



### 6.1 Comments (Giscus)

- Repo: Aarsh03/Blogs

- Category: Announcements

- Adapts dynamically to dark/light modes.



### 6.2 Likes & Views

- Worker URL: https://blog-likes.aarsh-blog-likes.workers.dev

- Routes: GET /likes/:slug, POST /likes/:slug, GET /views/:slug, POST /views/:slug



## 7. Build & Deploy Pipeline

- Runs on Node 22 via GitHub Actions.

- astro build && pagefind --site dist generates the static site and search index.



## 8. Feature Checklist

- [x] Astro v7 Content Collections with Loaders (glob)

- [x] Granular modular CSS and dynamic Custom Theme Builder

- [x] View Transitions and 120fps performance optimizations

- [x] Multi-Select Tag Filter Modal & Ctrl+K Search Modal

- [x] Markdown Callouts & Shiki highlighting

- [x] Floating Action Menu & Reading Time Tooltips

- [x] Giscus comments & Cloudflare Views/Likes

- [x] SEO, Sitemap, RSS Feed, dynamic OG Images

- [x] Image zoom & Astro Image Optimization

- [x] Frosted glass UI styling



## 9. Out of Scope / Declined

- Backend database for posts (strictly static markdown)

