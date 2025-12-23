import './style.css'
import javascriptLogo from './javascript.svg'

import load01conFirebaseui from './01conFirebaseui'
import load02Auth from './02Auth'
import load03Firestore from './03Firestore'

document.querySelector('#app').innerHTML = `
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
  <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
</a>
<h1>Hello Firebase!</h1>

<br /><hr /><br />
<h3>01conFirebaseui.js</h3>
<div id="firebaseui-auth-container"></div>
<div id="loader">Loading...</div>

<br /><hr /><br />
<h2>02Auth.js</h2>
<div id="firebase-auth-container"></div>

<br /><hr /><br />
<h2>03Firestore.js</h2>
<div id="firebase-firestore-container"></div>
<div id="firebase-firestore-realtime-container"></div>
`

load01conFirebaseui()
load02Auth()
load03Firestore()