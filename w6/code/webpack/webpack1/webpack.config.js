const webpack = require('webpack')
const path = require('path')
const StartWp = require('../MPlugin/index_copy.js')
const StartWp2 = require('../MPlugin/index_copy2.js')

module.exports = {
    entry: './index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    // plugins: [
    //     new StartWp({
    //         name: 'v3 - plugin '
    //     }),
    //     new StartWp2()
    // ]
}
