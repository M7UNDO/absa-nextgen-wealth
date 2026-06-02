import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr' 

// https://vite.dev/config/
export default defineConfig({
  base: "/absa-nextgen-wealth/",
  plugins: [react(), svgr()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          minSize: 30000, 
          maxSize: 150000, 
          groups: [
            {
              name: 'recharts-vendor',
              test: /[\\/]node_modules[\\/](recharts|d3-.+)[\\/]/,
              priority: 30,
            },
            {
              name: 'app-vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
})
