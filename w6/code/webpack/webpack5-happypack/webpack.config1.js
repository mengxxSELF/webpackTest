const webpack = require('webpack')
const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry: './index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader : 'babel-loader',
                options : {
                    presets: ['env']
                }
            }, {
                test: /\.css$/,
                use : ExtractTextPlugin.extract({
                    fallback : "style-loader",
                    use: ['css-loader']
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: `[name].css`
        }),
        new htmlWebpackPlugin({
            filename: 'index.html',
            template : './index.html'
        })
    ]
}
