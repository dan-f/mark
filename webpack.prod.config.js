const webpack = require('webpack')

const config = require('./webpack.base.config')

config.plugins = [
  ...config.plugins,
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  new webpack.optimize.UglifyJsPlugin(),
  new webpack.optimize.OccurrenceOrderPlugin()
]

module.exports = config
