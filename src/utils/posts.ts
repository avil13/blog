
const trimSlashes = (url: string) => {
  return url.replace(/\/$/, '').replace(/^\//, '');
}

const getTitle = (post: any): string => {
  return post.frontmatter?.seo?.title || post.seo?.title || post.title;
};

const formatPost = (post: any) => {
  if (!post) {
    return null;
  }

  return {
    ...post,
    title: getTitle(post),
  };
};

export const getPosts = (allPosts: any[]) => {
  return allPosts
    .map(formatPost)
    .sort((a: any, b: any) => {
      if (!b.frontmatter?.seo?.date) {
        return 0;
      }
      return a.frontmatter?.seo?.date > b.frontmatter?.seo?.date ? -1 : 1;
    });
};


type FooterPosts = {
  prev: any | null;
  current: any | null;
  next: any | null;
}

export const getFooterPosts = (allPosts: any[], currentUrl: string): FooterPosts => {
  const res: FooterPosts = {
    prev: null,
    current: null,
    next: null,
  };

  const posts = getPosts(allPosts);

  posts.forEach((post, i) => {
    if (trimSlashes(post.url) === trimSlashes(currentUrl)) {
      res.current = formatPost(post);
      res.prev = formatPost(posts[i + 1]);
      res.next = formatPost(posts[i - 1]);
    }
  })

  return res;
};
