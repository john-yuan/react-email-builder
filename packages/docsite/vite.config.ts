import url from 'node:url'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import firedocs from '@firedocs/vite-plugin'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [firedocs(), react()],
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), 'src')
    }
  }
})
