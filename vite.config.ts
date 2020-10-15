/**
 * 参考链接: https://github.com/vitejs/vite/blob/master/src/node/config.ts
 * 直接 cmd+左键 点进配置项查看即可
 */
import { join } from 'path'
import { UserConfig } from 'vite'
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
  }
}

export default config
