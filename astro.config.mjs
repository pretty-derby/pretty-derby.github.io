import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { realpathSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const astroReactPath = realpathSync(resolve(__dirname, "node_modules/@astrojs/react"));

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      fs: {
        allow: [__dirname, astroReactPath],
      },
    },
    resolve: {
      alias: {
        "@/": resolve(__dirname, "src") + "/",
        "zod/v4/core": resolve(__dirname, "node_modules/zod/v4/core/index.js"),
      },
    },
  },
});
