const fs = require('fs')
const path = require('path')

// 入口文件
let input = './index.js'
// 输出地址
let output = './dist/index.js'

const ejs = require('ejs')

const getIntry = fs.readFileSync(input, 'utf-8')

// 将getIntry 中的 require 进行处理
// require('./a.js')
const contAry = []
let dealIntry = getIntry.replace(/(require)\(['"](.+?)['"]\)/g, ($1, $2, $3, $4) => {
  // console.log($1, $2, $3, $4)
	// let filePath = path.join(__resolve, $2)
	let cont = fs.readFileSync($3, 'utf-8')
	// console.log(cont)
	contAry.push(cont)
	return $2 = `__webpack_require__(${contAry.length})`
})

// console.log(contAry)

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
  (function(module, exports, __webpack_require__) {
	  <%- dealIntry %>
  }),
	<% for(var i=0;i <= contAry.length; i++){ %>
		(function(module, exports) {
	    <%- contAry[i] %>
	  }),
  <%}%>
])`

let result = ejs.render(template, {
  dealIntry,
	contAry
})

// 将结果输出到 dist
fs.writeFileSync(output, result)
