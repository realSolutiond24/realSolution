// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
    apiKey: "AIzaSyCKUn24_Dtpc8DCG5d0KjdyuXMlz-Y7je4",
    authDomain: "realsolution-33055.firebaseapp.com",
    projectId: "realsolution-33055",
    storageBucket: "realsolution-33055.firebasestorage.app",
    messagingSenderId: "513642320133",
    appId: "1:513642320133:web:0ebc934185883c356ca76c",
    measurementId: "G-XLSTJNHW6M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
