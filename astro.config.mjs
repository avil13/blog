import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { cacheSwAstroPlugin } from "./xxx/cache-sw-astro-plugin.ts";

// https://astro.build/config
export default defineConfig({
  site: "https://avil13.com",
  integrations: [sitemap(), cacheSwAstroPlugin()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    syntaxHighlight: "prism",
    // remarkPlugins: [remarkImagePlugin],
  },
});
