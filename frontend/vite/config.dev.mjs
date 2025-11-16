import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    logLevel: 'warning',
    server: {
        port: 3000,
        allowedHosts: ['.localhost', 'test-fe.playcorners.ru']
    }
})
