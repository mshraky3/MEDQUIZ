import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// ANALYZE=1 npm run build to get stats.html — previously ran (and wrote a
// 649KB stats.html into the repo) on every single production build.
const analyze = process.env.ANALYZE === '1'

export default defineConfig({
  plugins: [
    react(),
    ...(analyze ? [visualizer()] : [])
  ],
  build: {
    target: 'es2022',
    minify: 'terser',
    terserOptions: {
      compress: {
        // console.error must survive — utils/errorTracking.js's whole job is
        // reporting real production errors, and drop_console strips it along
        // with the debug console.log calls it was actually meant to remove.
        pure_funcs: ['console.log', 'console.debug', 'console.info'],
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        // Was one chunk PER node_modules package — 89 JS files, 20 of them
        // under 2KB (a 1-byte react-router-dom chunk, a 68-byte
        // tiny-invariant, a 116-byte cookie), each its own request and its
        // own <link rel=modulepreload>. Explicit groups instead: a handful of
        // vendor chunks along real usage boundaries, everything else left to
        // Rollup's own bundling.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react-vendor';
          if (/node_modules\/(react-router|react-router-dom|cookie|set-cookie-parser|turbo-stream)\//.test(id)) return 'router-vendor';
          // recharts deliberately NOT grouped here — it's a documented Vite/
          // Rollup gotcha that a named manualChunks group can end up in every
          // route's <link rel=modulepreload> dependency manifest (including
          // the landing page's), even when nothing on that route imports it,
          // because Vite can't always prove which lazy entry points need a
          // string-named chunk and preloads it conservatively. Left to
          // Rollup's automatic chunking, recharts (already only imported by
          // the lazy Admin/Growth routes) correctly stays out of the eager
          // graph — this was verified by diffing index.html's preload list.
          return undefined;
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})