import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite'

const isProduction = process.env.NODE_ENV === 'production';

// https://vite.dev/config/
export default defineConfig({
  base: isProduction ? '/todo-before-test/' : '/',
  plugins: [
    vue(),
    tailwindcss()
  ],
  server: {
    host: true, // Allow access from the network
    port: 5173, // Use the port exposed in Docker app service
    strictPort: true, // Fail if the port is already in use
    hmr: {
      host: 'localhost',
      protocol: 'ws',
    },
    watch: {
      usePolling: true, // Enable polling for file changes
    },
  }
})
