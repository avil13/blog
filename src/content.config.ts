import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    seo: z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      image: z.string().optional(),
      featured_image: z.string().optional(),
    }),
    hero: z.object({
      src: z.string(),
      alt: z.string(),
      srcset: z.string().optional(),
    }).optional(),
  }),
});

export const collections = { blog };
