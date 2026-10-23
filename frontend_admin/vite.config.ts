import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 30011,
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:30014',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 30011,
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:30014',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ecare24/types': path.resolve(__dirname, '../packages/types/src/index.ts'),
      '@ecare24/utils': path.resolve(__dirname, '../packages/utils/src/index.ts'),
    },
  },
});
