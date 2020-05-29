//#region [ CSS ]
const purify = require("purify-css")
const content = ['./_site/**/*.html'];
const css = [
  // builded styles
  './_site/assets/css/bulma.css',
  './_site/assets/css/style.css',
];
const options = {
  // Will write purified CSS to this file.
  output: './_site/assets/css/style.css',
  minify: true,
  info: true,
  whitelist: ['*-active', 'is-divider*'],
};

purify(content, css, options);
// code css
const codeCss = './_site/assets/css/code.css';
const CleanCSS = require('clean-css');
const fs = require('fs');
const sourceCodeCss = fs.readFileSync(codeCss, 'utf8');

new CleanCSS({
    returnPromise: true
  })
  .minify(sourceCodeCss)
  .then(function (output) {
    fs.writeFileSync(codeCss, output.styles)
  })
  .catch(function (error) {
    console.error(error)
  });
//#endregion


//#region [ IMAGE ]
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminSvgo = require('imagemin-svgo');
const imageminOptipng = require('imagemin-optipng');

(async () => {
  const files = await imagemin(
    [
      'src/_content/assets/images/**/*.{jpg,jpeg,png,JPG,JPEG,PNG,svg}'
    ], {
      destination: '_site/assets/images',
      plugins: [
        //
        imageminMozjpeg({
          quality: 50
        }),
        imageminOptipng(),
        imageminSvgo({
          plugins: [{
            removeViewBox: false
          }]
        })
      ]
    }
  );
  console.log('🖼️  Optimized images: ', files.length, [
    '',
    ...files.map(v => ' - ' + v.destinationPath.replace(/^_site\//, ''))
  ].join('\n'));
})();
//#endregion
