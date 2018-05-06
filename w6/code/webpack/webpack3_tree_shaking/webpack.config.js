const webpack = require('webpack')
const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
// const PurifyCss = require('purifycss-webpack')
// new PurifyCss({
//   path: glob.sync([
//     path.join(__dirname, './index.html')
//   ])
// })

module.exports = {
    entry: './index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        // tree shaking -- js uglify
        new UglifyJSPlugin()
    ]
}
