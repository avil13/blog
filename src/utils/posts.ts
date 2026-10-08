import type { CollectionEntry } from "astro:content";

type BlogPost = CollectionEntry<"blog">;
type FormattedPost = BlogPost & {
  title: string;
  date: string;
  url: string;
};

type FooterPosts = {
  prev: FormattedPost | null;
  current: FormattedPost | null;
  next: FormattedPost | null;
};

const trimSlashes = (url: string) => {
  return url.replace(/\/$/, "").replace(/^\//, "");
};

const getPostUrl = (post: BlogPost): string => {
  return `/blog/${post.id}/`;
};

const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getUTCDate()}`.padStart(2, "0");

  return `${y}.${m}.${d}`;
};

const formatPost = (post: BlogPost | undefined): FormattedPost | null => {
  if (!post) {
    return null;
  }

  return {
    ...post,
    title: post.data.seo.title,
    date: formatDate(post.data.seo.date),
    url: getPostUrl(post),
  };
};

export const getPosts = (allPosts: BlogPost[]): FormattedPost[] => {
  return allPosts
    .map(formatPost)
    .filter((post): post is FormattedPost => Boolean(post))
    .sort((a, b) => b.data.seo.date.getTime() - a.data.seo.date.getTime());
};

export const getFooterPosts = (allPosts: BlogPost[], currentUrl: string): FooterPosts => {
  const res: FooterPosts = {
    prev: null,
    current: null,
    next: null,
  };

  const posts = getPosts(allPosts);

  posts.forEach((post, i) => {
    if (trimSlashes(post.url) === trimSlashes(currentUrl)) {
      res.current = post;
      res.prev = posts[i + 1] ?? null;
      res.next = posts[i - 1] ?? null;
    }
  });

  return res;
};
