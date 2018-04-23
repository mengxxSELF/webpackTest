class StartWp {
    constructor(options) {
        console.log(options, 'options')
        this.options = options
    }
    apply(compiler) {
        console.log('run apply ---- ')
        // 监听事件 这是异步的 所以要执行cb  不然会卡到这里不动了
        compiler.plugin('run', function (compilation, cb) {
            console.log('runrunrunrun')
            // 每一次重新编译的时候又会触发
            compilation.plugin('')

            cb();
        })
        compiler.plugin('before-run', function (compilation, cb) {
            console.log('before-run before-run before-run')
            cb();
        })
        // emit
        compiler.plugin('emit', function (compilation, cb) {
            console.log('emit emit emit', compilation.chunks.length)
            cb();
        })
    }
}

module.exports = StartWp