import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import commonjs from 'vite-plugin-commonjs';
import svgr from 'vite-plugin-svgr';
import vitetsConfigPaths from 'vite-tsconfig-paths';


export default defineConfig({
  base: './reports',
  plugins: [
    react(),
  ],
  server: {
    open: true, // automatically open the app in the browser
    port: 3000,
  },
  resolve: {
    alias: {
      screens: path.resolve(__dirname, './src/screens'),
    },
  },
  build: {
    outDir: 'build',
  },
});