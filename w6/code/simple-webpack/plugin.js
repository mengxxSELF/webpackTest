class MPlugin {
    // 这里获取用户为插件传入的配置参数
    constructor (options) {

    }
    // webpack 会调用 MPlugin 实例的apply方法 为插件实例传入 compiler 对象
    apply (compiler) {
        compiler.plugin('compilation', function (compilation) {

        })
    }
}

module.exports = MPlugin;


// 如何使用

//  -- webpack.config.js -- 
const MPlugin = require('./MPlugin.js')
module.exports = {
    plugins: [
        new MPlugin({
            chunks: ['a'],
            // path
        })
    ]
}

