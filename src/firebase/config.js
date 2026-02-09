// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAfjusN1GXPwcl0mXw2RqVCl-tn4VwsgZM",
  authDomain: "clases-b4bc0.firebaseapp.com",
  projectId: "clases-b4bc0",
  storageBucket: "clases-b4bc0.firebasestorage.app",
  messagingSenderId: "434203839015",
  appId: "1:434203839015:web:f6d9ea80b5ba2dfd4c1c02"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
