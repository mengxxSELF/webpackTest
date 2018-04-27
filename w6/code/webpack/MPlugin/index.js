class StartWp {
    constructor(options) {
        this.options = options
    }
    apply(compiler) {
        let {name} = this.options
        // 监听事件 这是异步的 所以要执行cb  不然会卡到这里不动了
        compiler.plugin('run', function (compilation, cb) {
            console.log('run', name)
            // 每一次重新编译的时候又会触发
            // compilation.plugin('')
            cb();
        })
        compiler.plugin('before-run', function (compilation, cb) {
            console.log('before-run', name)
            cb();
        })
        compiler.plugin('done', function (compilation) {
            console.log('done', name)
        })
    }
}

module.exports = StartWp
