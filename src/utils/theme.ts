export const DARK_THEMES = [
  'obsidian',
  'rose',
  'nebula',
  'midnight-black'
] as const;

export type DarkTheme = typeof DARK_THEMES[number];

/**
 * Returns true if the given theme name is a registered dark theme.
 */
export function isDarkTheme(theme: string): boolean {
  if (theme === 'custom' && typeof window !== 'undefined') {
    try {
      const p = JSON.parse(localStorage.getItem('customTheme') || '{}');
      if (p.bg) {
        const r = parseInt(p.bg.slice(1,3), 16), g = parseInt(p.bg.slice(3,5), 16), b = parseInt(p.bg.slice(5,7), 16);
        return (0.2126 * r + 0.7152 * g + 0.0722 * b) < 128;
      }
    } catch(e) {}
    return false; // default custom is light
  }
  return DARK_THEMES.includes(theme as DarkTheme);
}
