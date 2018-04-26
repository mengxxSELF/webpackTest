const webpack = require('webpack')
const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HappyPack = require('happypack')

module.exports = {
    entry: './index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            // js 文件的处理 交给 id 为 babel的happypack的实例
            {
                test: /\.js$/,
                use: ['happypack/loader?id=babel']
            }, 
            // css 文件的处理 交给 id 为 css 的happypack的实例
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback : "style-loader",
                    use: ['happypack/loader?id=css']
                })
            }
        ]
    },
    plugins: [
        // 处理css
        new HappyPack({
            id: 'css',
            loaders: ['css-loader']
        }),
        // 处理 js
        new HappyPack({
            id : 'babel',
            loaders : ['babel-loader?cacheDirectory']
        }),
        new ExtractTextPlugin({
            filename: `[name].css`
        }),
        new htmlWebpackPlugin({
            filename: 'index.html',
            template : './index.html'
        })
    ]
}
