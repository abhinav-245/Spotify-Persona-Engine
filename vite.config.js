import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',     // expose to LAN
    port: 5173,          // default vite port
    strictPort: true,    // optional
    proxy: {
      '/api': 'http://127.0.0.1:3000',
      '/login': 'http://127.0.0.1:3000',
      '/callback': 'http://127.0.0.1:3000'
    }
  }
})
