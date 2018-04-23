 (function(modules) {
 	function __webpack_require__(moduleId) {
 		var module = installedModules[moduleId] = {
 			exports: {}
 		};
 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
 		return module.exports;
 	}
 	return __webpack_require__("./src/index.js");
 })
 ({
   "./src/index.js":
   (function(module, exports) {
      eval("console.log('monn')\n\n\n//# sourceURL=webpack:///./src/index.js?");
   })
 });
