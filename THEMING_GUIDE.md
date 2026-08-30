# Theming & UI Development Guide

This guide is the single source of truth for creating and maintaining themes in this blog. The Blog uses a highly advanced CSS Variable-driven architecture, enabling seamless toggling between an infinite number of themes with perfect 120fps View Transitions and zero Flash of Unstyled Content (FOUC).

## 1. Architecture

Themes are decoupled from the components. Instead of writing `[data-theme="dark"]` inside every single Astro component, components are designed to use semantic `var(--color-...)` variables. The themes themselves simply redefine these variables at the document root level.

All themes are stored individually inside `src/styles/themes/` and are automatically imported into `global.css`.

## 2. Adding a New Theme

To add a new theme (e.g. `ocean-breeze`):

### 1. Create the Theme File
Create `src/styles/themes/ocean-breeze.css` with the required variables (see the Required Variables Checklist below).

### 2. Import the Theme
Add `@import url('./themes/ocean-breeze.css');` to the top of `src/styles/global.css`.

### 3. Register the Swatch in Settings
Open `src/components/navbar/SettingsPanel.astro` and add the new swatch HTML to the `.theme-palette` flex container:
```html
<div class="theme-swatch-wrapper">
  <button class="theme-swatch" data-theme-val="ocean-breeze" aria-label="Ocean Breeze Theme"></button>
  <span class="theme-label">Ocean</span>
</div>
```
Then, add its color definition to `src/styles/navbar.css`:
```css
.theme-swatch[data-theme-val="ocean-breeze"] { background: #e0f7fa; border: 1px solid #00bcd4; }
```

### 4. Register Dark Themes
If the new theme is a **dark theme**, you MUST add it to the `isDarkTheme` function array in `src/utils/theme.ts`, AND the inline critical FOUC script array in `src/layouts/BaseLayout.astro`. This ensures `data-theme-mode="dark"` is correctly applied, which triggers dark mode frosted glassmorphism, dark tag styling, and dark Giscus comments.

---

## 3. Required Variables Checklist

Every new theme file MUST contain **all** of the following variables in its `[data-theme="your-theme"]` block:

### Backgrounds
- `--color-bg`: Main body background.
- `--color-bg-card`: For cards (e.g., post cards, search modal, `.empty-state`). Should be slightly lighter than `--color-bg` (dark mode) or slightly darker (light mode) to provide depth.
- `--color-bg-nav`: RGBA value for the frosted glass navbar/TOC (e.g., `rgba(255,255,255,0.8)`). Must contrast well with the body.
- `--color-bg-nav-links`: Very transparent RGBA mapped to active Nav Link pills and subtle hover highlights.
- `--color-bg-code`: Background for `<kbd>`, inline `<code>`, and code blocks.

### Typography & Lines
- `--color-text`: The primary text color (headers, paragraphs). Ensure WCAG contrast > 4.5:1 against `--color-bg`.
- `--color-text-muted`: Secondary text (dates, metadata).
- `--color-text-light`: Placeholder text, very subtle elements.
- `--color-border`: Standard border color used across the app (navbar line, card strokes).

### Accents & Interactions
- `--color-accent-1`, `--color-accent-3`, `--color-accent-4`: Brand colors.
- `--color-accent-2`: Secondary brand/interactive color (primary for buttons, hover states, links).
- `--color-link`: Usually mapped to `var(--color-accent-2)`.
- `--color-code-text`: Used for inline code text and the "like" heart animation.
- `--color-success`: Success state color (e.g., `#10b981` green).
- `--color-nav-links-border`: Slightly opaque RGBA mapped to active Nav Link borders.

### Overlays & Shadows
- `--shadow-card`: The default shadow for elevated elements.
- `--shadow-card-hover`: The elevated hover state shadow.

---

## 4. Best Practices for Colors & Contrast

1. **Avoid Hardcoded Colors**: 
   - Never use static hex codes or `rgba` directly in `.astro` components for UI states.
   - Use `color-mix(in srgb, var(--color-accent-2) 10%, transparent)` to create dynamic, theme-aware translucent layers.
2. **Tag and Alert Visibility**:
   - Tags and alerts (`tags.css`, `alerts.css`) use `color-mix()` against `--color-text` and `--color-accent-2` to guarantee contrast on both dark and light modes.
   - Ensure the theme's `--color-bg` isn't completely pitch black (`#000000`) if you intend to use subtle dark grays for borders.
3. **Glassmorphism Considerations**:
   - The `--color-bg-nav` must have a reliable solid baseline color before `backdrop-filter: blur(24px)` is applied by the global CSS. Do not make it fully transparent.

---

## 5. UI/UX and Mobile Considerations

- **No Sticky Hovers on Mobile**: 
  - Every single `:hover` state must be wrapped in `@media (hover: hover)`. This prevents touch devices from locking elements into an active hover state after a tap.
- **Backdrop Filter Clipping Bugs**:
  - Never put `backdrop-filter` on a container that also has `overflow: hidden` or `overflow: auto`. It will clip the blur in Chromium/WebKit. Always apply the filter to an absolute pseudo-element (`::before`) or a dedicated `.bg-layer`.
- **View Transitions**:
  - Be mindful that all client-side JavaScript must listen to `astro:page-load` instead of `DOMContentLoaded` because the site utilizes native View Transitions.
  - Event listeners must be cleaned up in `astro:before-swap` to prevent memory leaks and duplicate triggers.

---

## 6. Eye Comfort Mode

The site features an adjustable Eye Comfort mode that overlays a warm sepia tint on the page. It is controlled via the `--eye-comfort-intensity` CSS variable in `src/scripts/settings.ts`, which scales from `0.02` to `0.25`. This variable multiplies the opacity of a fixed `pointer-events: none` overlay div in `BaseLayout.astro`.

---

## 7. Audit Process

After adding a new theme or modifying UI, run:
```bash
node scratch/theme_audit.cjs
```
This script ensures all required variables are present across all themes and flags missing fallback styles.


## 7. Custom Theme Builder & Engine
The blog includes a powerful runtime custom theme engine.
- **Dock Toolbar (`CustomThemeToolbar.astro`)**: A draggable, rotatable, frosted-glass interface to pick colors.
- **Visual Color Picker (`CustomColorPicker.astro`)**: A fully custom 2D canvas with HSV Saturation/Value, Hue slider, and synchronized HEX/RGB/HSL/CMYK text inputs.
- **Dynamic CSS**: 7 Custom Theme properties (`bg`, `card`, `text`, `accent1`, `accent2`, `accent3`, `accent4`) are saved to `localStorage`. The engine automatically computes derived variables (`--color-text-muted`, `--color-border`, etc.) using `color-mix()` and injects them into `<style id="custom-theme-vars">`.
- **Giscus Transparency**: Custom themes dynamically calculate relative luminance. If dark, Giscus loads `giscus-dark.css` (inheriting `transparent_dark.css`). Both custom light and dark modes pass a transparent background to Giscus, seamlessly blending the comment box with your custom palette.

---

## 8. Known Gotchas & Notorious Bugs

### The "Custom Theme Mode" Overwrite Bug
**Symptom:** Giscus comment boxes (and potentially other elements) would load the dark mode variant on a light theme (like `serenity`), or the light mode variant on a dark theme (like `obsidian`). However, if the user actually switched to their "Custom" theme, the comment box would be correct.

**Root Cause:** The script `customThemeBuilder.ts` initialized on *every* `astro:page-load` to set up the color picker. It would load the saved custom theme variables from `localStorage` and calculate the relative luminance of the custom background color. It would then *blindly* execute:
```javascript
document.documentElement.setAttribute('data-theme-mode', luma < 128 ? 'dark' : 'light');
```
This obliterated the correct `data-theme-mode` that had just been set by `BaseLayout` for the active theme, causing the page to adopt the dark/light state of the *inactive* custom theme. 

**The Fix:** Always verify that the active theme is actually "custom" before overriding global state attributes:
```javascript
if (document.documentElement.getAttribute('data-theme') === 'custom') {
  document.documentElement.setAttribute('data-theme-mode', luma < 128 ? 'dark' : 'light');
}
```
