import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        host: true,
        allowedHosts: [
            '.serveousercontent.com',
            '.loca.lt',
            '.ngrok.io',
            '.ngrok-free.dev',
            '.trycloudflare.com',
        ],
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
        },
    },
})

