const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    base: ['react'],
    index: './index.js',
    main: './main.js'
  },
  output: {
    filename: '[name]_[chunkhash:8].js', // 给输出的文件名称加上 hash 值
    chunkFilename: '[name].chunk.js',
    // publicPath: './dist/',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: ['babel-loader']
        // use: [
        //   {
        //     loader: 'babel-loader',
        //     //如果有这个设置则不用在添加.babelrc
        //     options: {
        //       presets: [['es2015', {modules: true}]],
        //       plugins: ['syntax-dynamic-import']
        //     }
        //   }
        // ]
      }
    ]
  },
  plugins: [
    // vendoe 哈希值 并没有按照预想中不变
    // new webpack.NamedChunksPlugin()
    // 抽取 index mian的公共文件
    new webpack.optimize.CommonsChunkPlugin({
      chunks: ['index', 'main' ],
      name: 'common'
    }),
    // 抽取 base 和 common 的公共 -- 由于common 和 base 公共的就是base  所有common会变小 base 不变
    new webpack.optimize.CommonsChunkPlugin({
      chunks: ['common', 'base' ],
      name: 'base'
    }),
    // 抽取公共的异步 module
    // new webpack.optimize.CommonsChunkPlugin({
    //   async: 'async-common',
    //   children: true,
    //   minChunks: 2
    // })

  ]
}
