class StartWp {
    constructor(options) {
        this.options = options
    }
    apply(compiler) {
        let {name} = this.options
        // 自己去广播事件
        // compiler.parser.apply('webpack-end', 'end')
        compiler.plugin("compilation", function (compilation, data) {
            data.normalModuleFactory.plugin("parser", function (parser, options) { 
                // parser.apply(/* ... */); 
                parser.apply('webpack-end')
            });
        });
        // 监听事件 这是异步的 所以要执行cb  不然会卡到这里不动了
        // compiler.plugin('run', function (compilation, cb) {
        //     console.log('run', name)
        //     cb();
        // })
        // compiler.plugin('done', function (compilation) {
        //     console.log('done', name)
        // })
        // compiler.plugin('webpack-end', function (params) {
        //     console.log('webpack-end webpack-end webpack-end webpack-end', params.length)
        // })
    }
}

module.exports = StartWp
