import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const { VITE_SITE_URL } = loadEnv(mode, process.cwd(), 'VITE_');
  let origin = '';
  if (VITE_SITE_URL) {
    const url = new URL(VITE_SITE_URL);
    if (url.protocol !== 'https:') throw new Error('VITE_SITE_URL must use HTTPS.');
    origin = url.origin;
  }
  return {
    server: { watch: { ignored: ['**/tmp/**', '**/tests/**'] } },
    optimizeDeps: { entries: ['index.html'] },
    plugins: [tailwindcss(), react(), {
      name: 'portfolio-production-metadata',
      transformIndexHtml(html) {
        if (!origin) return html;
        return { html: html.replaceAll('content="/og-image.png"', `content="${origin}/og-image.png"`), tags: [
          { tag: 'link', attrs: { rel: 'canonical', href: `${origin}/` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:url', content: `${origin}/` }, injectTo: 'head' },
        ] };
      },
      generateBundle() {
        if (!origin) return;
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>` });
        this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n` });
      },
    }],
  };
});
