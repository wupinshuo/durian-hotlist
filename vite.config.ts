import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';
import { fileURLToPath, URL } from 'url';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    vue(),
    svgr({
      svgrOptions: {
        icon: true,
        svgProps: {
          fill: 'currentColor',
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(fileURLToPath(new URL('.', import.meta.url)), 'src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      // 代理 /api/v1开头的请求
      '/api/v1': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, '/api/v1/api-data'),
      },
    },
  },
  // 配置SVG raw导入
  optimizeDeps: {
    exclude: [], // 需要排除的依赖
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '',
      },
    },
  },
});
