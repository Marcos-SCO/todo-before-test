import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const baseUrl = env.VITE_BASE_URL || '/';

  return {
    base: baseUrl,
    plugins: [
      vue(),
      tailwindcss()
    ],
    server: {
      host: true,
      port: 5173,
      strictPort: true,
      hmr: {
        host: 'localhost',
        protocol: 'ws',
      },
      watch: {
        usePolling: true,
      },
    }
  }
});
