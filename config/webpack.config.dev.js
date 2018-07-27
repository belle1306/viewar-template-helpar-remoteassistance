const ip = require('ip').address()

module.exports = {
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    stats: 'errors-only',
    public: ip ? `${ip}:${process.env.PORT || '8080'}` : undefined,
    host: process.env.HOST || '0.0.0.0', // Defaults to `localhost`
    port: process.env.PORT, // Defaults to 8080
    overlay: {
      errors: true,
      warnings: true,
    },
  },
  output: {
    devtoolModuleFilenameTemplate: 'source:///[absolute-resource-path]',
  },
}
