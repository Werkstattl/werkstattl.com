import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://werkstattl.com',

  // The app was renamed from Englisay to NativeVoice; the old URLs are still
  // referenced by the Play Store listing.
  redirects: {
    '/legal/englisay-privacy': '/legal/nativevoice-privacy/',
    '/legal/englisay-terms-of-use': '/legal/nativevoice-terms-of-use/',
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/legal/englisay-'),
    }),
  ],
});