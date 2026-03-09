import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// VITE_BASE_PATH is injected by the GitHub Actions workflow.
// Locally it is not set, so dev / preview serve from root as normal.
export default defineConfig({
  plugins: [react()],
  base: "/abyss-tools/",
});