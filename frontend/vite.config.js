import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    css: false,
    env: {
      VITE_API_URL: 'http://localhost:3000/api',
      VITE_CLERK_PUBLISHABLE_KEY: 'pk_test_mock_key',
    },
  },
})
