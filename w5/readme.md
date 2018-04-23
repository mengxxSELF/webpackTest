## 模块化

为了解决什么问题而提出的模块化

* 命名空间 -- 引用多个库 使用同一个变量名

* 项目的依赖版本

commonJS

通过require 引入 --

```
require('./a.js')

```

创建一个闭包函数并且立即执行

在node中 会对文件进行一层包装

```
(function (exports, require, module, __filename, __dirname){
  xxxx
})

```

require 用于引入外部模块

exports 对象用于导出当前模块的方法或者变量

module 对象 表示模块本身

exports 是module的一个属性





## w4

*  mode 提供零配置

```
npx webpack --mode development

```

默认 production 会进行代码压缩
