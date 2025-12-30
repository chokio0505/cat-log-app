import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'CatLog',
        short_name: 'CatLog',
        description: '我が家の猫管理アプリ',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png', // publicフォルダに画像を置く必要あり
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})