const ConcatPlugin = require('webpack-concat-plugin')

module.exports = {
  plugins: [
    new ConcatPlugin({
      fileName: 'viewar-core.js',
      filesToConcat: ['viewar-core'],
    }),
  ],
}
