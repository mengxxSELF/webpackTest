const fs = require('fs')

// 入口文件
let input = './index.js'
// 输出地址
let output = './dist/index.js'

const ejs = require('ejs')

const getIntry = fs.readFileSync(input, 'utf-8')

let template = `(function(modules) {
	function __webpack_require__(moduleId) {
		var module = {
			exports: {}
		};
		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
		return module.exports;
	}
	return __webpack_require__(0);
})
([
  (function(module, exports) {
    <%- getIntry %>
  })
])`

let result = ejs.render(template, {
  getIntry
})

// 将结果输出到 dist
fs.writeFileSync(output, result)
