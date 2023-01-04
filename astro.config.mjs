import { defineConfig } from "astro/config";
import { cacheSwAstroPlugin } from "./xxx/cache-sw-astro-plugin.ts";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://avil13.com",
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    sitemap(),
    cacheSwAstroPlugin(),
  ],
  markdown: {
    syntaxHighlight: "prism",
    // remarkPlugins: [remarkImagePlugin],
  },
});
