// 事件广播 sayname
compiler.apply('sayname', sendParams)

// 事件监听 sayname
compiler.plugin('sayname', function (getParams) {
  console.log(getParams)
})
