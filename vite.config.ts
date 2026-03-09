// vite.config.ts
import { defineConfig } from "vite"

export default defineConfig(({ command }) => ({
  base: command === "serve" ? "/" : "/abyss-tools/",
}))