const path = require('path')

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./webpack.dev.config')

const app = new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  contentBase: path.join(__dirname, 'public'),
  compress: true,
  hot: true,
  historyApiFallback: {
    disableDotRule: true
  }
})

app.listen(3000, 'localhost', function (err, result) {
  if (err) {
    return console.log(err)
  }

  console.log('Listening at http://localhost:3000/')
})
