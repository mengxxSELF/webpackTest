let lan = 'en'

if (lan === 'en') {
  import(/* webpackchunkname: m1 */ './module1.js' )
} else {
  import(/* webpackchunkname: m2 */ './module2.js' )
}

// import(/* webpackchunkname: lan */ './module2.js')

import './commonModule.js'
import react from 'react'
