// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';

import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';
import { remarkAlert } from 'remark-github-blockquote-alert';

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
    processor: unified({
      remarkPlugins: [remarkAlert],
    }),
  },

  integrations: [sitemap(), mdx()],
});