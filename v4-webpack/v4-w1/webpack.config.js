let path = require('path')
let webpack = require('webpack')

module.exports = {
  // entry: './index.js',
  entry: {
    index: './index.js',
    main: './main.js'
  },
  // mode: 'development',
  // mode: 'production',
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist')
  },
  optimization:{
      splitChunks:{
        chunks: 'all',
        name: 'common',
        // cacheGroups:{
        //   vendor:{ // 抽离第三插件
        //     test: /node_modules/,
        //     chunks: 'initial',
        //     // chunks: "all",
        //     name: 'vendor',
        //     priority:10
        //   },
        //   commons:{
        //     chunks: 'initial',
        //     name: 'commons',
        //     minSize: 0 // 只要超出0字节就生产新的包
        //   }
        // }
      },
      runtimeChunk: {
        name: 'runtime',
      }
    }
}
