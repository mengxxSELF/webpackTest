class MP {
    constructor(options) {
        this.options = options
    }
    apply(compiler) {
        let {name} = this.options
        compiler.plugin('run', function (compilation, cb) {
            console.log('run ----- ', name)
            cb();
        })
    }
}
module.exports = MP
