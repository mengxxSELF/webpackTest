/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const Compiler = require("./Compiler");
const MultiCompiler = require("./MultiCompiler");
const NodeEnvironmentPlugin = require("./node/NodeEnvironmentPlugin");
const WebpackOptionsApply = require("./WebpackOptionsApply");
const WebpackOptionsDefaulter = require("./WebpackOptionsDefaulter");
const validateSchema = require("./validateSchema");
const WebpackOptionsValidationError = require("./WebpackOptionsValidationError");
const webpackOptionsSchema = require("../schemas/webpackOptionsSchema.json");

// step 1 ------------------------- webpack 流程分析 -----------------------------------------------------------------------------------------
// webpack 函数
function webpack(options, callback) {
	const webpackOptionsValidationErrors = validateSchema(webpackOptionsSchema, options);
	if(webpackOptionsValidationErrors.length) {
		throw new WebpackOptionsValidationError(webpackOptionsValidationErrors);
	}
	let compiler;
	if(Array.isArray(options)) {
		compiler = new MultiCompiler(options.map(options => webpack(options)));
	} else if(typeof options === "object") {
		// TODO webpack 4: process returns options
		new WebpackOptionsDefaulter().process(options);

// step 2 ----创建 compiler 实例--------------------- webpack 流程分析 -----------------------------------------------------------------------------------------

		// 创建 compiler 实例  --- 点击进入查看  Compiler 类 --- 
		compiler = new Compiler();
		compiler.context = options.context;
		compiler.options = options;

// step 3 ----环境变量 传递到 webpack - compiler 中--------------------- webpack 流程分析 -----------------------------------------------------------------------------------------

		// 环境变量 传递到 webpack - compiler  中
		new NodeEnvironmentPlugin().apply(compiler);
		if(options.plugins && Array.isArray(options.plugins)) {

// step 4 ----处理插件信息 plugins --------------------- webpack 流程分析 -----------------------------------------------------------------------------------------

// 这里不好理解 可以看看v4如何处理的 其实就是依次调用 各个配合的plugin 为其传入  compiler 对象
// 			if (options.plugins && Array.isArray(options.plugins)) {
// 				for (const plugin of options.plugins) {
// 					plugin.apply(compiler);
// 				}
// 			}

			compiler.apply.apply(compiler, options.plugins);
		}
		compiler.applyPlugins("environment");
		compiler.applyPlugins("after-environment");
		compiler.options = new WebpackOptionsApply().process(options, compiler);
	} else {
		throw new Error("Invalid argument: options");
	}
	if(callback) {
		if(typeof callback !== "function") throw new Error("Invalid argument: callback");
		if(options.watch === true || (Array.isArray(options) && options.some(o => o.watch))) {
			const watchOptions = Array.isArray(options) ? options.map(o => o.watchOptions || {}) : (options.watchOptions || {});

// step 5 ----开启监听模式 --------------------- webpack 流程分析 -----------------------------------------------------------------------------------------

			// 开启监听模式
			return compiler.watch(watchOptions, callback);
		}

// step 6 --- 开始执行编译 --------------------- webpack 流程分析 -----------------------------------------------------------------------------------------

		// run 开始执行编译
		compiler.run(callback);
	}

// step 7 ---  返回 compiler 对象 --------------------- webpack 流程分析 -----------------------------------------------------------------------------------------
	return compiler;
}
exports = module.exports = webpack;

webpack.WebpackOptionsDefaulter = WebpackOptionsDefaulter;
webpack.WebpackOptionsApply = WebpackOptionsApply;
webpack.Compiler = Compiler;
webpack.MultiCompiler = MultiCompiler;
webpack.NodeEnvironmentPlugin = NodeEnvironmentPlugin;
webpack.validate = validateSchema.bind(this, webpackOptionsSchema);
webpack.validateSchema = validateSchema;
webpack.WebpackOptionsValidationError = WebpackOptionsValidationError;

function exportPlugins(obj, mappings) {
	Object.keys(mappings).forEach(name => {
		Object.defineProperty(obj, name, {
			configurable: false,
			enumerable: true,
			get: mappings[name]
		});
	});
}

exportPlugins(exports, {
	"DefinePlugin": () => require("./DefinePlugin"),
	"NormalModuleReplacementPlugin": () => require("./NormalModuleReplacementPlugin"),
	"ContextReplacementPlugin": () => require("./ContextReplacementPlugin"),
	"ContextExclusionPlugin": () => require("./ContextExclusionPlugin"),
	"IgnorePlugin": () => require("./IgnorePlugin"),
	"WatchIgnorePlugin": () => require("./WatchIgnorePlugin"),
	"BannerPlugin": () => require("./BannerPlugin"),
	"PrefetchPlugin": () => require("./PrefetchPlugin"),
	"AutomaticPrefetchPlugin": () => require("./AutomaticPrefetchPlugin"),
	"ProvidePlugin": () => require("./ProvidePlugin"),
	"HotModuleReplacementPlugin": () => require("./HotModuleReplacementPlugin"),
	"SourceMapDevToolPlugin": () => require("./SourceMapDevToolPlugin"),
	"EvalSourceMapDevToolPlugin": () => require("./EvalSourceMapDevToolPlugin"),
	"EvalDevToolModulePlugin": () => require("./EvalDevToolModulePlugin"),
	"CachePlugin": () => require("./CachePlugin"),
	"ExtendedAPIPlugin": () => require("./ExtendedAPIPlugin"),
	"ExternalsPlugin": () => require("./ExternalsPlugin"),
	"JsonpTemplatePlugin": () => require("./JsonpTemplatePlugin"),
	"LibraryTemplatePlugin": () => require("./LibraryTemplatePlugin"),
	"LoaderTargetPlugin": () => require("./LoaderTargetPlugin"),
	"MemoryOutputFileSystem": () => require("./MemoryOutputFileSystem"),
	"ProgressPlugin": () => require("./ProgressPlugin"),
	"SetVarMainTemplatePlugin": () => require("./SetVarMainTemplatePlugin"),
	"UmdMainTemplatePlugin": () => require("./UmdMainTemplatePlugin"),
	"NoErrorsPlugin": () => require("./NoErrorsPlugin"),
	"NoEmitOnErrorsPlugin": () => require("./NoEmitOnErrorsPlugin"),
	"NewWatchingPlugin": () => require("./NewWatchingPlugin"),
	"EnvironmentPlugin": () => require("./EnvironmentPlugin"),
	"DllPlugin": () => require("./DllPlugin"),
	"DllReferencePlugin": () => require("./DllReferencePlugin"),
	"LoaderOptionsPlugin": () => require("./LoaderOptionsPlugin"),
	"NamedModulesPlugin": () => require("./NamedModulesPlugin"),
	"NamedChunksPlugin": () => require("./NamedChunksPlugin"),
	"HashedModuleIdsPlugin": () => require("./HashedModuleIdsPlugin"),
	"ModuleFilenameHelpers": () => require("./ModuleFilenameHelpers")
});
exportPlugins(exports.optimize = {}, {
	"AggressiveMergingPlugin": () => require("./optimize/AggressiveMergingPlugin"),
	"AggressiveSplittingPlugin": () => require("./optimize/AggressiveSplittingPlugin"),
	"CommonsChunkPlugin": () => require("./optimize/CommonsChunkPlugin"),
	"ChunkModuleIdRangePlugin": () => require("./optimize/ChunkModuleIdRangePlugin"),
	"DedupePlugin": () => require("./optimize/DedupePlugin"),
	"LimitChunkCountPlugin": () => require("./optimize/LimitChunkCountPlugin"),
	"MinChunkSizePlugin": () => require("./optimize/MinChunkSizePlugin"),
	"ModuleConcatenationPlugin": () => require("./optimize/ModuleConcatenationPlugin"),
	"OccurrenceOrderPlugin": () => require("./optimize/OccurrenceOrderPlugin"),
	"UglifyJsPlugin": () => require("./optimize/UglifyJsPlugin")
});
