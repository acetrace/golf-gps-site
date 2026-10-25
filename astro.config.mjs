import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://golfgps.ai',
  integrations: [tailwind({ applyBaseStyles: false })],
  vite: {
    css: {
      postcss: { plugins: [] },
    },
  },
});
