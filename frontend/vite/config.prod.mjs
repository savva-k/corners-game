import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    logLevel: 'warning',
    build: {
        rollupOptions: {
            input: ['src/main.tsx', './index.html'],
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        },
        outDir: "build",
        minify: 'terser',
        terserOptions: {
            compress: {
                passes: 2
            },
            mangle: true,
            format: {
                comments: false
            }
        }
    }
});
