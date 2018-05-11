(function(modules) {
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
	  
__webpack_require__(1)
__webpack_require__(2)

console.log('尝试自己编译一个简易版本的webpack打包工具')

  }),
	
		(function(module, exports) {
	    console.log('我是aaaaa')

	  }),
  
		(function(module, exports) {
	    console.log('我是bbbbb')

	  }),
  
])