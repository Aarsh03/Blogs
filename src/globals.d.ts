// Ambient type declarations for global window properties
declare global {
  interface Window {
    _searchObserver?: MutationObserver | null;
    _giscusThemeObserver?: MutationObserver | null;
    _giscusIntersectObserver?: IntersectionObserver | null;
  }
}

export {};
