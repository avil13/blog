import { defineConfig } from "astro/config";
// import { remarkImagePlugin } from "./xxx/remark-image-plugin.mjs";

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
  ],
  markdown: {
    syntaxHighlight: "prism",
    // remarkPlugins: [remarkImagePlugin],
  },
});
