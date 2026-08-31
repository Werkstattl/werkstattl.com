import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://werkstattl.com',
  vite: {
    plugins: [tailwindcss()],
  },
});
