module.exports = {
  plugins: [
    require('postcss-import')({
      path: ["../assets/css", "themes/matter/assets/css"]
    }),
    require('postcss-nested'),
    require('postcss-custom-media'),
    require('autoprefixer')({
      overrideBrowserslist: ['>1%']
    }),
  ],
}
