const { SyncHook } = require("tapable")

// 当触发此事件的时候 需要传入参数 arg1
let mTap = new SyncHook(['arg1'])

mTap.tap('first', function (name){
    console.log(name, 'say your name')
})

// 触发事件 
mTap.call('mxx')


/* var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();
event.on('some_event', function () {
    console.log('some_event 事件触发');
});
setTimeout(function () {
    event.emit('some_event');
}, 1000); */