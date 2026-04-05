import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/sportlife/',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://172.16.1.106:5010',
        changeOrigin: true,
      }
    }
  }
})
