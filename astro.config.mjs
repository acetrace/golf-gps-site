import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import yaml from '@rollup/plugin-yaml';

export default defineConfig({
  site: 'https://golfgps.ai',
  integrations: [tailwind({ applyBaseStyles: false })],
  vite: {
    plugins: [yaml()],
    css: {
      postcss: { plugins: [] },
    },
  },
});
