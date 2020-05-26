const path = require('path');
const htmlmin = require('html-minifier');
const CleanCSS = require('clean-css');
const Terser = require('terser');
const ts = require('typescript');
const tsConfig = require('./tsconfig.json');

const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

// vars
const componentsDir = `./src/_includes/components`;
const componentList = [
  'Wrapper.js',
  'Image.js',
  'Button.js',
  'Card.js',
];



// Config
module.exports = function (eleventyConfig) {
  // Load components
  componentList.forEach(component => {
    const componentPath = path.join(__dirname, componentsDir, component);
    const componentName = path.basename(component, '.js');

    eleventyConfig.addPairedShortcode(
      componentName,
      require(componentPath)
    );
  });

  // CODE Highlite
  eleventyConfig.addPlugin(syntaxHighlight);

  // TS
  eleventyConfig.addFilter('ts', function(code) {
    const result = ts.transpileModule(code, tsConfig);
    return result.outputText;
  });

  // Minify JS
  eleventyConfig.addFilter('jsmin', function (code) {
    let minified = Terser.minify(code);
    if (minified.error) {
      console.log('Terser error: ', minified.error);
      return code;
    }

    return minified.code;
  });

  // Minify HTML output
  eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
    if (outputPath.endsWith('.html')) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  // Clean CSS Filter
  eleventyConfig.addFilter('cssmin', function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // return Config
  return {
    pathPrefix: '/',
    templateFormats: ['md', 'njk', 'html', 'liquid', 'css'],
    markdownTemplateEngine: 'liquid',
    htmlTemplateEngine: 'liquid',
    dataTemplateEngine: 'liquid',
    passthroughFileCopy: true,

    site: {
      url: 'AVIL-13',
    },

    dir: {
      output: '_site',
      input: './src/_content', // base dir
      includes: '../_includes',
      layouts: '../_includes/layouts',
      data: '../_data',
    },
  };
};
