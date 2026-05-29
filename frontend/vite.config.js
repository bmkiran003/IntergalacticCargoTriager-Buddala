import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forwards any requests starting with /api to your Node server
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})