import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  server: {
    proxy: {
      '/api/users': "http://localhost:4000"
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // Ensure @ points to the src directory
    }
  },
  plugins: [react()],
});
