从输入webpack命令开始 -- 经历了什么

## bin/webpack.js

330 335

创建 compiler - run

## lib/webpack.js

51 - run 开始执行编译

  compiler.run(callback);


使用的是 Compiler 对象

## Compiler.js

run 事件会触发 compile

502 通过 run 触发 complie --

518 -- 构建 Compilation 对象


### createCompilation

创建 Compilation 对象【每一次新的构建发生 都会有一个 Compilation 对象 】

webpack/bin/Compiler.js [463] [469]

## Compilation.js

10 - 引入核心库 tapable

65 -- 将 参数 传入各种 模板文件  用于准备最后的输入 chunk

74 -  存放 入口  chunks  modules 等等信息

515 - make  -> SingleEntryDependency

387  addModuleChain - 构建模块依赖关系

496  addEntry

589  seal - -  用于整理Module和chunk 进行编译之后的 源码合并拆分等

* 	673 -- seal 中比较中要的点 --  createChunkAssets 准备进行 chunk 输出到文件系统

[按住alt可直接查看 createChunkAssets 方法 ]

* 可以看下 MainTemplate.js 文件

## MainTemplate.js  

167  --  生成模板的 render 方法

模板用来对照如何生成一个webpack打包之后的chunk文件

* 输入文件 emitAssets

在 Compiler.js  251 [按住alt可直接查看 emitAssets 方法 ]



## 到此所有的打包之后的文件被输出 ##


## SingleEntryDependency.js

32 		// 寻找入口 进行下一步模块绑定

addEntry 方法在  Compilation 的 496 行
