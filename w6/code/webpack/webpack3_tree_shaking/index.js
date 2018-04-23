import {name} from './utils'
console.log('index', name)

import {concat} from 'lodash'

var array = [1];
var other = concat(array, 2, [3], [[4]]);

console.log(other, 'other')


