import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(fileURLToPath(new URL('.', import.meta.url)), 'src'),
    },
  },
  server: {
    port: 3000,
    // proxy: {
    //   // 代理 /api/v1/api-data 开头的请求
    //   '/api/v1/api-data': {
    //     target: 'http://localhost:8082',
    //     changeOrigin: true,
    //     rewrite: (path) =>
    //       path.replace(/^\/api\/v1\/api-data/, '/api/v1/api-data'),
    //   },
    // },
  },
});
