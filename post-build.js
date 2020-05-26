const purify = require("purify-css")

const content = ['./_site/**/*.html'];
const css = ['./_site/assets/css/bulma.css'];
const options = {
  // Will write purified CSS to this file.
  output: './_site/assets/css/bulma.css',
  minify: true,
  info: true,
  whitelist: ['*-active'],
};

purify(content, css, options);
