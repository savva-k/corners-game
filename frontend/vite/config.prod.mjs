import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    logLevel: 'warning',
    build: {
        rollupOptions: {
            input: ['src/main.ts', './index.html'],
        },
        outDir: "build",
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
