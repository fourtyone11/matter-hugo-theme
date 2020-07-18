module.exports = {
  plugins: [
    require('postcss-import')({
      path: ["../matter-hugo-theme/assets/css"]
    }),
    require('postcss-nested'),
    require('postcss-custom-media'),
    require('autoprefixer')({
      overrideBrowserslist: ['>1%']
    }),
  ],
}
