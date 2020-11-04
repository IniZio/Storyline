/**
 * 参考链接: https://github.com/vitejs/vite/blob/master/src/node/config.ts
 * 直接 cmd+左键 点进配置项查看即可
 */
import { join } from 'path'
import { UserConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import dotenv from 'dotenv'

dotenv.config({ path: join(__dirname, '.env') })

const src = join(__dirname, 'src')

const config: UserConfig = {
  port: +process.env.PORT,
  base: './',
  outDir: join(__dirname, 'dist/render'),
  alias: {
    '/@/': src,
  },
  rollupInputOptions: {
    external: ''
  },
  cssPreprocessOptions: {
    sass: {
      modifyVars: {
        // '$custom-success-color': '#00c13c',
        // '$custom-font-color': '#333333',
        // '$custom-info-color': '#999999',
        // '$custom-tag-color': '#f5f5f5',
        '$primary': '#ee3300',
      }
    }
  },
  plugins: [
    VitePWA({
      manifest: {
        "name": "Marblez",
        "short_name": "Marblez",
        "start_url": "./",
        "icons": [{
          "src": "/logo-192x192.webp",
          "sizes": "192x192",
          "type": "image/webp"
        }, {
          "src": "/logo-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        }, {
          "src": "/logo-384x384.webp",
          "sizes": "384x384",
          "type": "image/webp"
        }, {
          "src": "/logo-384x384.png",
          "sizes": "384x384",
          "type": "image/png"
        }, {
          "src": "/logo-512x512.webp",
          "sizes": "512x512",
          "type": "image/webp"
        }, {
          "src": "/logo-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        }],
        "theme_color": "#FFF",
        "background_color": "#FFF",
        "display": "standalone"
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        inlineWorkboxRuntime: true,
        runtimeCaching: [
          {
            urlPattern: /.*/,
            handler: 'NetworkFirst',
          },
        ],
      }
    })
  ]
}

export default config
