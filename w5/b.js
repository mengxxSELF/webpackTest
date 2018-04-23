let name = require('./a.js')
console.log(name)

const fs = require('fs')
function req(dir) {
    let cont = fs.readdirSync(dir, 'utf-8')
    let fn = function (exports, module, require, __dirnamee, __filename) {
        module.exports = cont
        return module.exports
    }
    let module = {
        exports: {}
    }
    return fn(module.exports, module, req, __dirname, dir)
}
