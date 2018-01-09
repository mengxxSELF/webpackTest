require.ensure(["./two.js"], function(require) {
    var a = require("./main");
    console.log('那花草香', a, 'a')
}, 'tips');
