(function(modules) { // webpackBootstrap
	function __webpack_require__(moduleId) {
		var module = {
			exports: {}
		};
		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
		return module.exports;
	}
	return __webpack_require__(0);
})
/************************************************************************/
([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

let a = __webpack_require__(1)
console.log('123')

/***/ }),
/* 1 */
/***/ (function(module, exports) {

console.log(123)

/***/ })
]);