const webpack = require('webpack')
const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    target: 'web', // <=== 默认是 'web'，可省略
    entry: './index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        // tree shaking -- js uglify new UglifyJSPlugin()
    ],
    resolve: {
        // 当 target 属性设置为 webworker, web 或者没有指定，默认值为 ["browser", "module", "main"]
        // mainFields : ["browser", "module", "main"], 
        // 对于其他任意的 target（包括 node），默认值为：
        mainFields: ["module", "main"]
    }
}
