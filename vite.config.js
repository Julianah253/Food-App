import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Shorthand for routing local fetch requests to Node.js
      '/api': 'http://localhost:3000', 
    },
  },
})
