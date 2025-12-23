import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

import { 
    getAuth, 
    onAuthStateChanged
} from 'firebase/auth'

import {
    getFirestore,
    collection,
    query,
    addDoc,
    setDoc, // Elimina los campos que no se envian
    getDoc,
    updateDoc,
    serverTimestamp,
    onSnapshot,
    doc, // Consultas sin realtime
    writeBatch,
    // addMerge, // Tener en cuenta para agregar un nuevo campo a un documento existente
    // updateObject, // Tener en cuenta para actulizar un objeto dentro de un documento
    // deleteFieldValue, // Tenner en cuenta para eliminar un campo de un documento
    // deleteDoc, // Tener en cuenta para eliminar un documento
    // where, // Tener en cuenta para las consultas
    orderBy, // Tener en cuenta para ordenar los resultados
    // limit, // Tener en cuenta para limitar los resultados
} from 'firebase/firestore'

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

const firestore = getFirestore(app)

function createPost(event){
    event.preventDefault()

    let oFormData = new FormData(event.target);

    const postData = {
        title: oFormData.get('title'),
        description: oFormData.get('description'),
        author: oFormData.get('author'),
        categories: oFormData.get('categories'),
        dateServer: serverTimestamp(),
        date: oFormData.get('date'),
    };
    
    addDoc(collection(firestore, 'posts'), postData)
    .then(async (docRef) => {
        console.log('Documento creado con ID:', docRef.id);


        // const docRef = doc(firestore, 'posts', docRef.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const postData = docSnap.data();
            const dateServer = postData.dateServer;

            if (dateServer) {
                const unixTimestamp = dateServer.toMillis();
                console.log('Fecha en formato Unix:', unixTimestamp);

                await updateDoc(docRef, { dateServerUnix: unixTimestamp });
                console.log('dateServerUnix actualizado en el documento.');
            }
        }
    })
    .catch((error) => {
        console.error('Error al crear el documento:', error.message);
    });
}

function test1_InsertConIDPropio(){
    const postData = {
        id: 'test1',
        title: 'Test ?',
        description: 'Description ?',
        author: 'Author ?',
        categories: 'Categories ?',
        date: 'Date ?',
        dateServer: serverTimestamp()
    }

    setDoc(doc(collection(firestore, 'posts'), postData.id), postData)
}

function test2_Batch() {
    const batch = writeBatch(firestore);

    const post1Ref = doc(collection(firestore, 'posts'));
    batch.set(post1Ref, {
        title: 'Batch Post 1',
        description: 'Description for Batch Post 1',
        author: 'Author 1',
        categories: 'Category 1',
        date: '2023-01-01',
        dateServer: serverTimestamp()
    });

    const post2Ref = doc(collection(firestore, 'posts'));
    batch.set(post2Ref, {
        title: 'Batch Post 2',
        description: 'Description for Batch Post 2',
        author: 'Author 2',
        categories: 'Category 2',
        date: '2023-01-02',
        dateServer: serverTimestamp()
    });

    batch.commit()
    .then(() => {
        console.log('Batch operation completed successfully.');
    })
    .catch((error) => {
        console.error('Error in batch operation:', error.message);
    });
}

export default function load02Auth(){
    onAuthStateChanged(auth, (user) => {
        if(user){
            document.querySelector('#firebase-firestore-container')
            .innerHTML = `
            <h3>Create post:</h3>
            <form onsubmit="createPost(event)">
            <input type="text" name="title" placeholder="Title" />
            <textarea name="description" placeholder="Description"></textarea>
            <input type="text" name="author" placeholder="Author" />
            <input type="text" name="categories" placeholder="Categories" />
            <input type="date" name="date" placeholder="Date" />
            <button type="submit">Crear</button>
            </form>

            <br />
            <button onclick="test1_InsertConIDPropio()">Test Insert con ID propio</button>
            <button onclick="test2_Batch()">Test Batch</button>
            `;

            const postsQuery = query(
                collection(firestore, 'posts'),
                orderBy('title', 'asc'),
                orderBy('dateServer', 'desc')
            )
            // onSnapshot(collection(firestore, 'posts'), snapshot => {})
            onSnapshot(postsQuery, snapshot => {
                if(snapshot.empty){
                    document.querySelector('#firebase-firestore-realtime-container')
                    .innerHTML = `
                    <h3>Posts:</h3>
                    <p>No hay posts</p>
                    `
                }else{
                    document.querySelector('#firebase-firestore-realtime-container')
                    .innerHTML = `
                    <h3>Posts:</h3>
                    <ul>
                    ${snapshot.docs.map(doc => {
                        const postData = doc.data();
                        return `<li>${postData.title} - ${postData.description} - ${postData.author} - ${postData.categories} - ${postData.date}</li>`;
                    }).join('')}
                    </ul>
                    `;
                }
            })
        }else{
            document.querySelector('#firebase-firestore-container')
            .innerHTML = ``;
        }
    })
}

window.signOutUser = signOutUser
window.createPost = createPost
window.test1_InsertConIDPropio = test1_InsertConIDPropio
window.test2_Batch = test2_Batch