import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 自适应 base：
// - Netlify 构建时（process.env.NETLIFY === 'true'）→ 根路径 /
// - GitHub Pages 构建时（process.env.GITHUB_ACTIONS）→ /natal-os/
// - 本地 npm run dev → 根路径
export default defineConfig(() => {
  let base = '/';
  if (process.env.GITHUB_ACTIONS && !process.env.NETLIFY) {
    base = '/natal-os/';
  }
  return {
    plugins: [react()],
    base,
    server: {
      host: '0.0.0.0',
      port: 5180,
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    },
  };
});
