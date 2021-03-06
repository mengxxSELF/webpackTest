const webpack = require('webpack')
const path = require('path')

module.exports = {
    entry: './index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
      // scope hoisting
      new webpack.optimize.ModuleConcatenationPlugin()
    ]
}
