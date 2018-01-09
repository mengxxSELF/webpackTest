const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './index.js',
  output: {
    filename: '[name].[chunkhash:3].js',
    chunkFilename: '[name].[chunkhash:5].js',
    path: path.resolve(__dirname, 'public')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: '[name].bundle.js'
    })
  ]
}
