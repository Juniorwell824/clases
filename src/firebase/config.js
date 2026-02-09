// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAFIWKVjbQwntUIiTpGUUhU9RTr4ShPFyk",
  authDomain: "clases-adultos.firebaseapp.com",
  projectId: "clases-adultos",
  storageBucket: "clases-adultos.firebasestorage.app",
  messagingSenderId: "698596900830",
  appId: "1:698596900830:web:73708a0d51766478d3674f"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
