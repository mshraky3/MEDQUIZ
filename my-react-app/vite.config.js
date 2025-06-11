import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022', // Modern JS support
    minify: 'terser', // Better minification than esbuild
    terserOptions: {
      compress: {
        drop_console: true, // Optional: remove console logs
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].replace('.js', '')
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom'] 
  }
})
