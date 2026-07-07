import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    base: '/',
    server: {
      host: '0.0.0.0',
      port: 5173,
    },
    preview: {
      host: '0.0.0.0',
      port: 5173,
    },
    plugins: [
      react(),
      tsconfigPaths()
    ],
    build: {
      outDir: 'dist',
      ...(isProduction && {
        rollupOptions: {
          output: {
            manualChunks: undefined,
          },
        },
      }),
    },
  };
})
