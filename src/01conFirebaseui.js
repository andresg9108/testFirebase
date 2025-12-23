import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

import {
  onAuthStateChanged,
  getAuth,
  signOut,
  GoogleAuthProvider,
  // FacebookAuthProvider,
  // TwitterAuthProvider,
  // GithubAuthProvider,
  // EmailAuthProvider,
  // PhoneAuthProvider
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

const auth = getAuth()
auth.languageCode = 'es'

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(auth)

var uiConfig = {
  callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        console.log('El usuario ha iniciado sesión:', authResult.user)
        console.log('redirectUrl:', redirectUrl)
        console.log('authResult:', authResult)
        return true;
      },
      uiShown: function() {
        console.log('FirebaseUI está listo para mostrar el formulario de inicio de sesión')
        document.getElementById('loader').style.display = 'none';
      }
  },
  signInFlow: 'popup',
  signInSuccessUrl: '<url-to-redirect-to-on-success>',
  signInOptions: [
    /*
    {
      provider: EmailAuthProvider.PROVIDER_ID,
      signInMethod: EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
      requireDisplayName: false // No solicita un nombre para usuarios existentes.
    },
    */
    GoogleAuthProvider.PROVIDER_ID,
    // FacebookAuthProvider.PROVIDER_ID,
    // TwitterAuthProvider.PROVIDER_ID,
    // GithubAuthProvider.PROVIDER_ID,
    // PhoneAuthProvider.PROVIDER_ID
  ],
  tosUrl: '<your-tos-url>',
  privacyPolicyUrl: '<your-privacy-policy-url>'
};

export default function load01conFirebaseui(){
    onAuthStateChanged(auth, (user) => {
        console.log('Usuario:', user)

        if(user){
            console.log('Usuario autenticado:', user);
            document.querySelector('#firebaseui-auth-container')
            .innerHTML = `
            <button id='logout-button'">Cerrar sesión</button>
            `;
            document.querySelector('#loader').innerHTML = '';
            document.getElementById('logout-button').addEventListener('click', () => {
            signOut(auth)
                .then(() => {
                console.log('Sesión cerrada exitosamente');
                window.location.reload();
                })
                .catch((error) => {
                console.error('Error al cerrar sesión:', error);
                });
            });
        }else{
            console.log('No hay usuario autenticado');
            ui.start('#firebaseui-auth-container', uiConfig)
        }
    })
}