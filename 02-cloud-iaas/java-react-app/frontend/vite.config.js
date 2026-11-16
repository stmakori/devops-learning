import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // during development, forward API calls to the Spring Boot app
    proxy: { '/api': 'http://localhost:7071' },
  },
  build: {
    outDir: 'dist',
  },
});
