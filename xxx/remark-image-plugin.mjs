import {visit} from 'unist-util-visit'
/**
 * @typedef {import('mdast').Root} Root
 *
 * @typedef Options
 *   Configuration (optional).
 * @property {boolean} [someField]
 *   Some option.
 */

// To type options and that the it works with `mdast`:
/** @type {import('unified').Plugin<[Options?], Root>} */
export function remarkImagePlugin(options) {
  // `options` is `Options?`.
  return function (tree, file) {
    // `tree` is `Root`.
    // if (file.history[0] === '/Users/avil/git/pet-projects/blog-2/src/pages/blog/2022/07-home-pi-server.md') {
    //   console.log("=>", { tree, file });
    //   console.log('=>', JSON.stringify(tree, null, 2));
    // }
    visit(tree, 'image', (node) => {
      if (!node.url) {
        return;
      }
      node.type = 'html';
      node.value = `<img src="${node.url}" alt="${node.alt}" title="${node.title}" loading="lazy" height="400" fetchpriority="low" />`;
    });
  };
}
