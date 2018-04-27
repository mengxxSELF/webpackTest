/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const path = require("path");

// step 1 ----引入核心库 tapable --------------------- webpack 流程分析 -----------------------------------------------------------------------------------------

const Tapable = require("tapable");
const util = require("util");

const Compilation = require("./Compilation");
const Stats = require("./Stats");
const NormalModuleFactory = require("./NormalModuleFactory");
const ContextModuleFactory = require("./ContextModuleFactory");

const makePathsRelative = require("./util/identifier").makePathsRelative;

class Watching {
	constructor(compiler, watchOptions, handler) {
		this.startTime = null;
		this.invalid = false;
		this.handler = handler;
		this.callbacks = [];
		this.closed = false;
		if(typeof watchOptions === "number") {
			this.watchOptions = {
				aggregateTimeout: watchOptions
			};
		} else if(watchOptions && typeof watchOptions === "object") {
			this.watchOptions = Object.assign({}, watchOptions);
		} else {
			this.watchOptions = {};
		}
		this.watchOptions.aggregateTimeout = this.watchOptions.aggregateTimeout || 200;
		this.compiler = compiler;
		this.running = true;
		this.compiler.readRecords(err => {
			if(err) return this._done(err);

			this._go();
		});
	}

	_go() {
		this.startTime = Date.now();
		this.running = true;
		this.invalid = false;
		this.compiler.applyPluginsAsync("watch-run", this, err => {
			if(err) return this._done(err);
			const onCompiled = (err, compilation) => {
				if(err) return this._done(err);
				if(this.invalid) return this._done();

				if(this.compiler.applyPluginsBailResult("should-emit", compilation) === false) {
					return this._done(null, compilation);
				}

				this.compiler.emitAssets(compilation, err => {
					if(err) return this._done(err);
					if(this.invalid) return this._done();

					this.compiler.emitRecords(err => {
						if(err) return this._done(err);

						if(compilation.applyPluginsBailResult("need-additional-pass")) {
							compilation.needAdditionalPass = true;

							const stats = new Stats(compilation);
							stats.startTime = this.startTime;
							stats.endTime = Date.now();
							this.compiler.applyPlugins("done", stats);

							this.compiler.applyPluginsAsync("additional-pass", err => {
								if(err) return this._done(err);
								this.compiler.compile(onCompiled);
							});
							return;
						}
						return this._done(null, compilation);
					});
				});
			};
			this.compiler.compile(onCompiled);
		});
	}

	_getStats(compilation) {
		const stats = new Stats(compilation);
		stats.startTime = this.startTime;
		stats.endTime = Date.now();
		return stats;
	}

	_done(err, compilation) {
		this.running = false;
		if(this.invalid) return this._go();

		const stats = compilation ? this._getStats(compilation) : null;
		if(err) {
			this.compiler.applyPlugins("failed", err);
			this.handler(err, stats);
			return;
		}

		this.compiler.applyPlugins("done", stats);
		this.handler(null, stats);
		if(!this.closed) {
			this.watch(compilation.fileDependencies, compilation.contextDependencies, compilation.missingDependencies);
		}
		this.callbacks.forEach(cb => cb());
		this.callbacks.length = 0;
	}

	watch(files, dirs, missing) {
		this.pausedWatcher = null;
		this.watcher = this.compiler.watchFileSystem.watch(files, dirs, missing, this.startTime, this.watchOptions, (err, filesModified, contextModified, missingModified, fileTimestamps, contextTimestamps) => {
			this.pausedWatcher = this.watcher;
			this.watcher = null;
			if(err) return this.handler(err);

			this.compiler.fileTimestamps = fileTimestamps;
			this.compiler.contextTimestamps = contextTimestamps;
			this.invalidate();
		}, (fileName, changeTime) => {
			this.compiler.applyPlugins("invalid", fileName, changeTime);
		});
	}

	invalidate(callback) {
		if(callback) {
			this.callbacks.push(callback);
		}
		if(this.watcher) {
			this.pausedWatcher = this.watcher;
			this.watcher.pause();
			this.watcher = null;
		}
		if(this.running) {
			this.invalid = true;
			return false;
		} else {
			this._go();
		}
	}

	close(callback) {
		if(callback === undefined) callback = function() {};

		this.closed = true;
		if(this.watcher) {
			this.watcher.close();
			this.watcher = null;
		}
		if(this.pausedWatcher) {
			this.pausedWatcher.close();
			this.pausedWatcher = null;
		}
		if(this.running) {
			this.invalid = true;
			this._done = () => {
				this.compiler.applyPlugins("watch-close");
				callback();
			};
		} else {
			this.compiler.applyPlugins("watch-close");
			callback();
		}
	}
}

// step 2 ---- Compiler 类 继承自 Tapable --------------------- webpack 流程分析 -----------------------------------------------------------------------------------------


// Compiler 类 继承自 Tapable
class Compiler extends Tapable {
	constructor() {
		super();

		// 输入输出先关配置信息

		this.outputPath = "";
		this.outputFileSystem = null;
		this.inputFileSystem = null;

		this.recordsInputPath = null;
		this.recordsOutputPath = null;
		this.records = {};

		this.fileTimestamps = {};
		this.contextTimestamps = {};

		this.resolvers = {
			normal: null,
			loader: null,
			context: null
		};

		// parser 是一个 存放编译器信息的对象
		this.parser = {
			// plugin属性 事件响应
			plugin: util.deprecate(
				(hook, fn) => {
					this.plugin("compilation", (compilation, data) => {
						data.normalModuleFactory.plugin("parser", parser => {
							parser.plugin(hook, fn);
						});
					});
				},
				"webpack: Using compiler.parser is deprecated.\n" +
				"Use compiler.plugin(\"compilation\", function(compilation, data) {\n  data.normalModuleFactory.plugin(\"parser\", function(parser, options) { parser.plugin(/* ... */); });\n}); instead. "
			),
			// apply 事件监听
			apply: util.deprecate(
				() => {
					const args = arguments;
					this.plugin("compilation", (compilation, data) => {
						data.normalModuleFactory.plugin("parser", parser => {
							parser.apply.apply(parser, args);
						});
					});
				},
				"webpack: Using compiler.parser is deprecated.\n" +
				"Use compiler.plugin(\"compilation\", function(compilation, data) {\n  data.normalModuleFactory.plugin(\"parser\", function(parser, options) { parser.apply(/* ... */); });\n}); instead. "
			)
		};

		this.options = {};
	}

	watch(watchOptions, handler) {
		this.fileTimestamps = {};
		this.contextTimestamps = {};
		const watching = new Watching(this, watchOptions, handler);
		return watching;
	}

	// step 1 -----------------------------------------------------------------------
	// run -- 帮助webpack开始编译
	run(callback) {
		const startTime = Date.now();

		const onCompiled = (err, compilation) => {
			if(err) return callback(err);

			if(this.applyPluginsBailResult("should-emit", compilation) === false) {
				const stats = new Stats(compilation);
				stats.startTime = startTime;
				stats.endTime = Date.now();
				this.applyPlugins("done", stats);
				return callback(null, stats);
			}

			// 编译完毕 -- 准备输出所有资源
			this.emitAssets(compilation, err => {
				if(err) return callback(err);

				if(compilation.applyPluginsBailResult("need-additional-pass")) {
					compilation.needAdditionalPass = true;

					const stats = new Stats(compilation);
					stats.startTime = startTime;
					stats.endTime = Date.now();
					this.applyPlugins("done", stats);

					this.applyPluginsAsync("additional-pass", err => {
						if(err) return callback(err);
						this.compile(onCompiled);
					});
					return;
				}

				this.emitRecords(err => {
					if(err) return callback(err);

					const stats = new Stats(compilation);
					stats.startTime = startTime;
					stats.endTime = Date.now();
					this.applyPlugins("done", stats);
					return callback(null, stats);
				});
			});
		};

		this.applyPluginsAsync("before-run", this, err => {
			if(err) return callback(err);

			this.applyPluginsAsync("run", this, err => {
				if(err) return callback(err);

				this.readRecords(err => {
					if(err) return callback(err);

					this.compile(onCompiled);
				});
			});
		});
	}

	runAsChild(callback) {
		this.compile((err, compilation) => {
			if(err) return callback(err);

			this.parentCompilation.children.push(compilation);
			Object.keys(compilation.assets).forEach(name => {
				this.parentCompilation.assets[name] = compilation.assets[name];
			});

			const entries = Object.keys(compilation.entrypoints).map(name => {
				return compilation.entrypoints[name].chunks;
			}).reduce((array, chunks) => {
				return array.concat(chunks);
			}, []);

			return callback(null, entries, compilation);
		});
	}

	purgeInputFileSystem() {
		if(this.inputFileSystem && this.inputFileSystem.purge)
			this.inputFileSystem.purge();
	}

	// emitAssets 方法 输出所有的资源 
	emitAssets(compilation, callback) {
		let outputPath;

		const emitFiles = (err) => {
			if(err) return callback(err);

			// 输出所有文件
			require("async").forEach(Object.keys(compilation.assets), (file, callback) => {

				let targetFile = file;
				const queryStringIdx = targetFile.indexOf("?");
				if(queryStringIdx >= 0) {
					targetFile = targetFile.substr(0, queryStringIdx);
				}

				const writeOut = (err) => {
					if(err) return callback(err);
					const targetPath = this.outputFileSystem.join(outputPath, targetFile);
					const source = compilation.assets[file];
					if(source.existsAt === targetPath) {
						source.emitted = false;
						return callback();
					}
					let content = source.source();

					if(!Buffer.isBuffer(content)) {
						content = new Buffer(content, "utf8"); // eslint-disable-line
					}

					source.existsAt = targetPath;
					source.emitted = true;
					this.outputFileSystem.writeFile(targetPath, content, callback);
				};

				if(targetFile.match(/\/|\\/)) {
					const dir = path.dirname(targetFile);
					this.outputFileSystem.mkdirp(this.outputFileSystem.join(outputPath, dir), writeOut);
				} else writeOut();

			}, err => {
				if(err) return callback(err);

				afterEmit.call(this);
			});
		};

		this.applyPluginsAsync("emit", compilation, err => {
			if(err) return callback(err);
			outputPath = compilation.getPath(this.outputPath);
			this.outputFileSystem.mkdirp(outputPath, emitFiles);
		});

		function afterEmit() {
			this.applyPluginsAsyncSeries1("after-emit", compilation, err => {
				if(err) return callback(err);

				return callback();
			});
		}

	}

	emitRecords(callback) {
		if(!this.recordsOutputPath) return callback();
		const idx1 = this.recordsOutputPath.lastIndexOf("/");
		const idx2 = this.recordsOutputPath.lastIndexOf("\\");
		let recordsOutputPathDirectory = null;
		if(idx1 > idx2) recordsOutputPathDirectory = this.recordsOutputPath.substr(0, idx1);
		if(idx1 < idx2) recordsOutputPathDirectory = this.recordsOutputPath.substr(0, idx2);
		if(!recordsOutputPathDirectory) return writeFile.call(this);
		this.outputFileSystem.mkdirp(recordsOutputPathDirectory, err => {
			if(err) return callback(err);
			writeFile.call(this);
		});

		function writeFile() {
			this.outputFileSystem.writeFile(this.recordsOutputPath, JSON.stringify(this.records, undefined, 2), callback);
		}
	}

	readRecords(callback) {
		if(!this.recordsInputPath) {
			this.records = {};
			return callback();
		}
		this.inputFileSystem.stat(this.recordsInputPath, err => {
			// It doesn't exist
			// We can ignore this.
			if(err) return callback();

			this.inputFileSystem.readFile(this.recordsInputPath, (err, content) => {
				if(err) return callback(err);

				try {
					this.records = JSON.parse(content.toString("utf-8"));
				} catch(e) {
					e.message = "Cannot parse records: " + e.message;
					return callback(e);
				}

				return callback();
			});
		});
	}

	createChildCompiler(compilation, compilerName, compilerIndex, outputOptions, plugins) {
		const childCompiler = new Compiler();
		if(Array.isArray(plugins)) {
			plugins.forEach(plugin => childCompiler.apply(plugin));
		}
		for(const name in this._plugins) {
			if(["make", "compile", "emit", "after-emit", "invalid", "done", "this-compilation"].indexOf(name) < 0)
				childCompiler._plugins[name] = this._plugins[name].slice();
		}
		childCompiler.name = compilerName;
		childCompiler.outputPath = this.outputPath;
		childCompiler.inputFileSystem = this.inputFileSystem;
		childCompiler.outputFileSystem = null;
		childCompiler.resolvers = this.resolvers;
		childCompiler.fileTimestamps = this.fileTimestamps;
		childCompiler.contextTimestamps = this.contextTimestamps;

		const relativeCompilerName = makePathsRelative(this.context, compilerName);
		if(!this.records[relativeCompilerName]) this.records[relativeCompilerName] = [];
		if(this.records[relativeCompilerName][compilerIndex])
			childCompiler.records = this.records[relativeCompilerName][compilerIndex];
		else
			this.records[relativeCompilerName].push(childCompiler.records = {});

		childCompiler.options = Object.create(this.options);
		childCompiler.options.output = Object.create(childCompiler.options.output);
		for(const name in outputOptions) {
			childCompiler.options.output[name] = outputOptions[name];
		}
		childCompiler.parentCompilation = compilation;

		compilation.applyPlugins("child-compiler", childCompiler, compilerName, compilerIndex);

		return childCompiler;
	}

	isChild() {
		return !!this.parentCompilation;
	}

  // 创建 Compilation 对象【每一次新的构建发生 都会有一个 Compilation 对象 】
	createCompilation() {
		return new Compilation(this);
	}

	newCompilation(params) {
		// 新一次的构建发生 -- 新建一个  compilation 
		const compilation = this.createCompilation();
		compilation.fileTimestamps = this.fileTimestamps;
		compilation.contextTimestamps = this.contextTimestamps;
		compilation.name = this.name;
		compilation.records = this.records;
		compilation.compilationDependencies = params.compilationDependencies;

		// 这里可以看一下  在注册监听事件的时候 有传入 compilation 对象

		this.applyPlugins("this-compilation", compilation, params);
		this.applyPlugins("compilation", compilation, params);
		return compilation;
	}

	createNormalModuleFactory() {
		const normalModuleFactory = new NormalModuleFactory(this.options.context, this.resolvers, this.options.module || {});
		this.applyPlugins("normal-module-factory", normalModuleFactory);
		return normalModuleFactory;
	}

	createContextModuleFactory() {
		const contextModuleFactory = new ContextModuleFactory(this.resolvers, this.inputFileSystem);
		this.applyPlugins("context-module-factory", contextModuleFactory);
		return contextModuleFactory;
	}

	newCompilationParams() {
		const params = {
			normalModuleFactory: this.createNormalModuleFactory(),
			contextModuleFactory: this.createContextModuleFactory(),
			compilationDependencies: []
		};
		return params;
	}

	// step 2 --------------------------------------------------------------------------------------------
  // compile  编译
	compile(callback) {
		const params = this.newCompilationParams();
		this.applyPluginsAsync("before-compile", params, err => {
			if(err) return callback(err);

			this.applyPlugins("compile", params);

			// 构建新的编译对象 
			const compilation = this.newCompilation(params);

			// 监听到 make 的广播 执行此方法 -- make 由 SingleEntryDependency 模块中发出
			this.applyPluginsParallel("make", compilation, err => {
				if(err) return callback(err);

				compilation.finish();

				//  这里编译完成 使用seal方法对每个Module和chunk进行整理 生成编译后的源码， 合并 拆分等  --------
				// 具体实现请看  compilation.js 的 seal方法
				compilation.seal(err => {
					if(err) return callback(err);

					this.applyPluginsAsync("after-compile", compilation, err => {
						if(err) return callback(err);

						return callback(null, compilation);
					});
				});
			});
		});
	}
}

Compiler.Watching = Watching;
module.exports = Compiler;
