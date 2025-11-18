import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/eugene-oregon/PublicRecords/EPD-2025-2981_GrantContractCommunication/email-browser/',
})
