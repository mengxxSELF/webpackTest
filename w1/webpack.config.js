const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: {
    index: './index.js',
    // vender: ['react', 'react-dom']
  },
  output: {
    // filename: '[name].[hash:6].js',
    filename: '[name].[chunkhash:6].js',
    // chunkFilename: '[name].[chunkhash:2].js',
    path: path.resolve(__dirname, 'public'),
  },
  watch: true,
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html'
    }),
    // 清除旧文件
    new CleanWebpackPlugin([path.resolve(__dirname, 'public/*')],{

    }),
    // chunk文件
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'common',
    //   filename: '[name].[hash:3].js',
    //   minChunks: Infinity,
    // })
  ]
}
