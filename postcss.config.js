module.exports = (ctx) => ({
  map: { inline: true },
  plugins: [
    require('postcss-modules')({
      getJSON: ctx.extractModules || (() => { }),
      generateScopedName: '[local]_[hash:base64:5]',
    }),
    require('autoprefixer')({
      browsers: ['last 2 versions']
    }),
    require("css-mqpacker")(),
    require('cssnano')({
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
      }]
    })
  ],
});