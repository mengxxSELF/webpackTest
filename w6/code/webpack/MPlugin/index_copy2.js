class StartWp {
    constructor(options) {
        this.options = options
    }
    apply(compiler) {
        compiler.plugin('webpack-end', function (params) {
            console.log('webpack-end webpack-end webpack-end webpack-end', params.length)
        })
    }
}

module.exports = StartWp
