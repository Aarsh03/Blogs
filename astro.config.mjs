// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://aarsh03.github.io',
  base: '/Blogs/',
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark-dimmed',
      },
      wrap: true,
      defaultColor: false,
    },
  },
});
