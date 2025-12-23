import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

import {
    onAuthStateChanged,
    getAuth,
    updateProfile,
    sendEmailVerification,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    GoogleAuthProvider,
    FacebookAuthProvider
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

function registerUser(event){
    event.preventDefault()

    let oFormData = new FormData(event.target);
    
    let name = oFormData.get('name');
    let email = oFormData.get('email');
    let password = oFormData.get('password');

    createUserWithEmailAndPassword(auth, email, password)
    .then((result) => {
        updateProfile(result.user, {
            displayName: name
        })
        console.log('Usuario registrado:', result.user);

        const emailConfig = {
            url: 'http://localhost:5173/',
            // handleCodeInApp: true
        };

        sendEmailVerification(result.user, emailConfig)
        .then(() => {
            console.log('Email de verificación enviado a:', email);
        })
        .catch((error) => {
            console.error('Error al enviar email de verificación:', error.message);
        });

        // Para evitar que el usuario quede logueado después de registrarse
        signOut(auth)
    })
    .catch((error) => {
        console.error('Error al registrar usuario:', error.message);
    });
}

function signInUser(event){
    event.preventDefault()

    let oFormData = new FormData(event.target);
    
    let email = oFormData.get('email');
    let password = oFormData.get('password');

    signInWithEmailAndPassword(auth, email, password)
    .then((result) => {
        if(!result.user.emailVerified){
            console.log('El email no ha sido verificado');
            signOut(auth)
            return
        }

        console.log('Usuario logueado:', result.user);
    })
    .catch((error) => {
        console.error('Error al loguear usuario:', error.message);
    });
}

function signInWithGoogle(){
    const provider = new GoogleAuthProvider()

    // signInWithRedirect(auth, provider)
    signInWithPopup(auth, provider)
    .then((result) => {
        console.log('Usuario logueado con Google:', result.user)
        console.log(result.user.photoURL)
    })
    .catch((error) => {
        console.error('Error al loguear usuario con Google:', error.message)
    })
}

function signInWithFacebook(){
    const provider = new FacebookAuthProvider()

    signInWithPopup(auth, provider)
    .then((result) => {
        console.log('Usuario logueado con Facebook:', result.user)
        console.log(result.user.photoURL)
    })
    .catch((error) => {
        console.error('Error al loguear usuario con Facebook:', error.message)
    })
}

function signOutUser(){
    signOut(auth)
    .then(() => {
        console.log('Sesión cerrada exitosamente');
        // window.location.reload();
    })
    .catch((error) => {
        console.error('Error al cerrar sesión:', error.message);
    });
}

export default function load02Auth(){
    onAuthStateChanged(auth, (user) => {
        if(user){
            document.querySelector('#firebase-auth-container')
            .innerHTML = `
            <button onclick="signOutUser()">Cerrar sesión</button>
            <h3>Usuario logueado:</h3>
            <p>${user.displayName}</p>
            <p>${user.email}</p>
            `;
        }else{
            document.querySelector('#firebase-auth-container')
            .innerHTML = `
            <h3>Registrar usuario:</h3>
            <form onsubmit="registerUser(event)">
            <input type="text" name="name" placeholder="Name" />
            <input type="email" name="email" placeholder="Email" />
            <input type="password" name="password" placeholder="Password" />
            <button type="submit">Register</button>
            </form>

            <h3>Iniciar sesión:</h3>
            <form onsubmit="signInUser(event)">
            <input type="email" name="email" placeholder="Email" />
            <input type="password" name="password" placeholder="Password" />
            <button type="submit">Iniciar sesión</button>
            </form>

            <br />
            <button onclick="signInWithGoogle()">Iniciar sesión con Google</button>
            `;
        }
    })
}

window.registerUser = registerUser
window.signInUser = signInUser
window.signOutUser = signOutUser
window.signInWithGoogle = signInWithGoogle