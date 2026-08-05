import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

const collectionEntries = await getCollection('posts');
const pages = Object.fromEntries(collectionEntries.map(({ id, data }) => [id, data]));

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages: pages,
  getImageOptions: (path, page) => ({
    title: page.title,
    description: page.tags.join(' • '),
    bgGradient: [[18, 18, 22], [30, 30, 36]],
    border: { color: [184, 169, 212], width: 10, side: 'inline-start' },
    padding: 60,
    font: {
      title: { color: [253, 246, 249], size: 72, weight: 'Bold' },
      description: { color: [184, 169, 212], size: 32, weight: 'Normal' },
    },
  }),
});
