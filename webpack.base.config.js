const webpack = require('webpack')

const path = require('path')

module.exports = {
  context: path.join(__dirname, '/src'),
  entry: {
    app: './index',
    vendor: [
      'immutable',
      'react',
      'react-dom',
      'react-redux',
      'react-router-dom',
      'redux',
      'redux-logger',
      'redux-thunk',
      'solid-auth-client',
      'url-join',
      'uuid',
      'isomorphic-fetch',
      'valid-url'
    ]
  },
  output: {
    path: path.join(__dirname, 'public', 'build'),
    publicPath: '/build/',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      },
      {
        /* TODO: remove this once someone addresses https://github.com/anvilresearch/oidc-rp/issues/30 */
        test: /^.*\/oidc-rp\/.*\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  externals: {
    'text-encoding': 'TextEncoder',
    'urlutils': 'URL',
    '@trust/webcrypto': 'crypto'
  },
  plugins: [
    new webpack.DefinePlugin({ 'global.IS_BROWSER': true }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' })
  ]
}
