const webpack = require('webpack')
const path = require('path')
const WebWebpackPlugin = require('web-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    index: './index.js'
  },
  output: {
    filename: '[name].[chunkhash:4].js',
    path: path.resolve(__dirname, 'public')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html'
    })
  ]
}
