const fs = require('fs')
const mergeConfig = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const {srcPath, buildPath, modulePath} = require('./paths')

const devConfig = require('./webpack.config.dev')
const devCoreConfig = require('./webpack.config.core')

const {appId, appVersion} = JSON.parse(fs.readFileSync(`${__dirname}/../.viewar-config`, 'utf8'))

const baseConfig = {
  optimization: {
    minimize: false,
  },
  output: {
    path: buildPath,
    filename: '[name].js',
  },
  entry: {
    polyfills: ['babel-polyfill', path.join(srcPath, 'polyfills.js')],
    index: [path.join(srcPath, 'index.js')],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'index.html'),
      inject: true,
      bundleIdentifier: appId,
      bundleVersion: appVersion,
    }),
  ],
  resolve: {
    modules: [
      modulePath,
    ],
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        include: srcPath,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              'react',
            ],
            plugins: [
              ['transform-object-rest-spread', {'useBuiltIns': true}],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {importLoaders: 1, modules: true, localIdentName: '[folder]--[local]'},
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: (loader) => [
                require('postcss-import')({ root: loader.resourcePath }),
                require('postcss-cssnext')(),
              ]
            }
          }
        ],
      },
      {
        test: /\.(eot|ttf|otf|woff2?)(\?v=\d+\.\d+\.\d+)?|png|jpe?g|svg|gif|ico$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          },
        },
      },
    ],
  },
}

module.exports = (env, args) => {
  switch (env) {
    case 'prod':
      return mergeConfig(baseConfig)
    case 'dev-core':
      return mergeConfig(baseConfig, devConfig, devCoreConfig)
    case 'dev-mock':
      return mergeConfig(baseConfig, devConfig)
    default:
      throw new Error(`ViewAR boilerplate: Error! Unrecognized mode ${JSON.stringify(env)}!`)
  }
}
