import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Same dev port Create React App used
    port: 3000,
    // Forward API calls to the Node/Express server (replaces "proxy" in package.json)
    proxy: {
      '/api': 'http://localhost:3080',
    },
  },
  build: {
    // Keep the CRA output folder so api/server.js and the Dockerfile still find it
    outDir: 'build',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
});
