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
  console.log('index.js')
  }),
  (function(module, exports) {
    console.log(123)
  })
]);
