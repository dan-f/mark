const webpack = require('webpack')

const path = require('path')

module.exports = {
  context: path.join(__dirname, '/src'),
  entry: {
    app: './index',
    vendor: [
      'immutable',
      'lodash',
      'modelld',
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux',
      'redux-logger',
      'redux-solid-auth',
      'redux-thunk',
      'url-join',
      'uuid',
      'valid-url'
    ]
  },
  output: {
    path: path.join(__dirname, '/build'),
    publicPath: '/build/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel'
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  externals: {
    xhr2: 'XMLHttpRequest',
    xmlhttprequest: 'XMLHttpRequest'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')
  ]
}
