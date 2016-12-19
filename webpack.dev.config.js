const webpack = require('webpack')

const config = require('./webpack.base.config')

config.entry.vendor = [
  ...config.entry.vendor,
  'react-hot-loader/patch',
  'webpack-dev-server/client?http://0.0.0.0:3000',
  'webpack/hot/only-dev-server'
]
config.plugins = [
  ...config.plugins,
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development')
  }),
  new webpack.HotModuleReplacementPlugin()
]
config.devtool = 'inline-source-map'

module.exports = config
