/** @type {import('tailwindcss').Config} */
module.exports = {
  // darkMode: "media",
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-links": "rgb(96 165 250)",
            ".prose a": { textDecoration: "none" },
            "code::before": null,
            "code::after": null,
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
