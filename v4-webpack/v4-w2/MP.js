class MP {
    constructor(options) {
        this.options = options
    }
    apply(compiler) {
        let {name} = this.options
        // console.log(compiler.hooks)
        compiler.hooks.run.tap('MP',  function (compilation, cb) {
            console.log('run ----- ', name)
        })
        compiler.hooks.done.tap('MP-done',  function (compilation, cb) {
            console.log('done ----- ', name)
        })
    }
}
module.exports = MP
