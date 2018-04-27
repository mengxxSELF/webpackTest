const webpack = require('webpack')
const path = require('path')
const StartWp = require('../MPlugin/index.js')

module.exports = {
    entry: './index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new StartWp({
            name: 'v3 - plugin '
        })
    ]
}
