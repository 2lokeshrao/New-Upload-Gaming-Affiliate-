import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      minify: 'terser' as const,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          passes: 2,
        },
        format: {
          comments: false,
        }
      },
      target: 'es2022',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-ui': ['lucide-react']
            // 'react-markdown', 'rehype-sanitize', '@uiw/react-md-editor', and 'recharts'
            // are intentionally NOT grouped into named manual chunks. Every one of
            // their call sites (BrandArticlePage, AiArticleView, CustomPageView,
            // AdminPanel/AiArticleManagerTab/CustomPageManagerTab, AdminDashboardTab)
            // sits behind a React.lazy() boundary. Naming a manual chunk that's ONLY
            // ever reached via lazy() can make Vite/Rollup treat it as part of the
            // eager "vendor tier" and inject a blocking <link> for its CSS/JS straight
            // into <head> on every page — which is exactly what was happening here
            // (a 7.1 KiB vendor-markdown.css was loading render-blocking on the
            // homepage, which never uses the markdown editor). Leaving these
            // dependencies unnamed lets Rollup's automatic per-dynamic-import
            // chunking isolate them correctly, so they only ever download when a
            // route that actually needs them is visited.
            //
            // canvas-confetti is excluded for the same reason: every call site
            // (TopThreeCarousel, OfferGrid, ExitIntentModal) already loads it via a
            // dynamic import() inside a click handler, so it must stay out of any
            // manual chunk to keep downloading only on click.
          }
        }
      },
      chunkSizeWarningLimit: 1500
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
