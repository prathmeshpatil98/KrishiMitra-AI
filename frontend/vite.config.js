import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
/**
 * KrishiMitra AI — Vite Configuration
 * =====================================
 * - React plugin with fast-refresh
 * - Path alias: @/* → src/*
 * - Dev proxy: /api → backend:8000 (avoids CORS in development)
 */
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5173,
        strictPort: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
            },
            '/ws': {
                target: 'ws://localhost:8000',
                ws: true,
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom'],
                    'router': ['react-router-dom'],
                    'query': ['@tanstack/react-query'],
                    'motion': ['framer-motion'],
                    'charts': ['recharts'],
                },
            },
        },
    },
});
