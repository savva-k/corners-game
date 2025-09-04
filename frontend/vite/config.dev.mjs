import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    server: {
        port: 3000,
        allowedHosts: ['.localhost', 'a5b95d67873c.ngrok-free.app']
    }
})
