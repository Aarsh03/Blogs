export const DARK_THEMES = [
  'dark',
  'crimson',
  'rose-pine',
  'lavender-dark',
  'midnight-black'
] as const;

export type DarkTheme = typeof DARK_THEMES[number];

/**
 * Returns true if the given theme name is a registered dark theme.
 */
export function isDarkTheme(theme: string): boolean {
  return DARK_THEMES.includes(theme as DarkTheme);
}
