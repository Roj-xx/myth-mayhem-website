import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  site: 'https://myth-mayhem.vercel.app',
  fonts: [
    { provider: fontProviders.fontsource(), name: 'Marcellus', cssVariable: '--font-display', weights: [400], subsets: ['latin'], fallbacks: ['Georgia', 'serif'] },
    { provider: fontProviders.fontsource(), name: 'Manrope', cssVariable: '--font-text', weights: ['200 800'], subsets: ['latin', 'latin-ext'], fallbacks: ['system-ui', 'sans-serif'] },
  ],
});
