# Theming Guide

The Blog uses a highly advanced CSS Variable-driven architecture, enabling seamless toggling between an infinite number of themes with perfect 120fps View Transitions and zero Flash of Unstyled Content (FOUC).

## Architecture

Themes are decoupled from the components. Instead of writing `[data-theme="dark"]` inside every single Astro component, components are designed to use semantic `var(--color-...)` variables. The themes themselves simply redefine these variables at the document root level.

All themes are stored individually inside `src/styles/themes/` and are automatically imported into `global.css`.

### Adding a New Theme

To add a new theme (e.g. `ocean-breeze`):

1. **Create the Theme File**
   Create `src/styles/themes/ocean-breeze.css`:
   ```css
   [data-theme="ocean-breeze"] {
     /* Backgrounds */
     --color-bg: #e0f7fa;
     --color-bg-card: #ffffff;
     --color-bg-nav: rgba(224, 247, 250, 0.80);
     --color-bg-code: #b2ebf2;
     
     /* Accents */
     --color-accent-1: #00bcd4;
     --color-accent-2: #009688;
     --color-accent-3: #4dd0e1;
     --color-accent-4: #80cbc4;
     
     /* Text */
     --color-text: #006064;
     --color-text-muted: #00838f;
     --color-text-light: #00acc1;
     
     /* Borders & Shadows */
     --color-border: #b2ebf2;
     --shadow-card: 0 4px 24px rgba(0, 150, 136, 0.08);
     --shadow-card-hover: 0 12px 48px rgba(0, 150, 136, 0.15);
     
     /* Specific Overrides */
     --color-link: var(--color-accent-2);
     --color-code-text: var(--color-accent-1);
     --color-bg-nav-links: rgba(0, 150, 136, 0.15);
     --color-nav-links-border: rgba(0, 150, 136, 0.3);
   }
   ```

2. **Import the Theme**
   Add `@import url('./themes/ocean-breeze.css');` to the top of `src/styles/global.css`.

3. **Register the Swatch in Settings**
   Open `src/components/Navbar.astro` and add the new swatch HTML to the `.theme-palette` flex container:
   ```html
   <div class="theme-swatch-wrapper">
     <button class="theme-swatch" data-theme-val="ocean-breeze" aria-label="Ocean Breeze Theme"></button>
     <span class="theme-label">Ocean</span>
   </div>
   ```
   Then, add its color definition to the Navbar CSS:
   ```css
   .theme-swatch[data-theme-val="ocean-breeze"] { background: #e0f7fa; border: 1px solid #00bcd4; }
   ```

4. **Register Dark Themes**
   If the new theme is a **dark theme**, you MUST add it to the `darkThemes` arrays in both `src/layouts/BaseLayout.astro` (the inline FOUC script) and `src/components/Navbar.astro` (the `applyTheme` script). This ensures `data-theme-mode="dark"` is correctly applied, which triggers dark mode frosted glassmorphism, dark tag styling, and dark Giscus comments.

## Required Variables Checklist

Every single theme MUST define the following variables to ensure perfect contrast and visibility across the site:

| Variable | Description |
|---|---|
| `--color-bg` | Main body background |
| `--color-bg-card` | Solid background for cards and modals |
| `--color-bg-nav` | RGBA value for the frosted glass navbar (e.g., `rgba(255,255,255,0.8)`) |
| `--color-bg-code` | Background for inline code `<code>` |
| `--color-accent-1`, `2`, `3`, `4` | Brand colors. `accent-2` is usually primary. |
| `--color-text` | Primary reading text |
| `--color-text-muted` | Subtitles, dates, meta info |
| `--color-text-light` | Placeholder text, very subtle elements |
| `--color-border` | Standard borders (hr, cards, tables) |
| `--shadow-card` | Default card shadow |
| `--shadow-card-hover` | Hovered card shadow |
| `--color-link` | Usually mapped to `var(--color-accent-2)` |
| `--color-code-text` | Text color for inline code snippets |
| `--color-bg-nav-links` | Very transparent RGBA mapped to active Nav Link pills |
| `--color-nav-links-border` | Slightly opaque RGBA mapped to active Nav Link borders |

## Component Visibility Troubleshooting

If a new theme has poor visibility in certain components (like the Search Box, Table of Contents, or Tags), it is almost always because the theme failed to define the correct contrast for its variables.

- **Tags:** Tag backgrounds are generated using `data-theme-mode="dark" | "light"`. If a specific theme requires unique tag coloring (like Midnight Black), you can override `.tag` directly in that theme's CSS file:
  ```css
  [data-theme="midnight-black"] .tag { border-color: var(--color-accent-1); }
  ```
- **Search Modal:** Uses `var(--color-bg-card)` for the panel and `var(--color-text)` for text. Ensure these have high contrast.
- **Giscus Comments:** Uses `data-theme-mode="dark"` to load `giscus-dark.css`. Ensure `var(--color-border)` is visible against `var(--color-bg)`.
