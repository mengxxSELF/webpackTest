const webpack = require('webpack')
const path = require('path')
const oldMP = require('./MP_old.js')
const newMP = require('./MP.js')

module.exports = {
    entry: './index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new oldMP({
            name: 'i am oldMP -- v4'
        }),
        new newMP({
            name: 'i am newMP -- v4'
        })
    ]
}
