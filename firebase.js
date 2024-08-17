// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwrjGGq5nO6dAz8dcSAthUpr3OpBXfheg",
  authDomain: "flashcards-2959c.firebaseapp.com",
  projectId: "flashcards-2959c",
  storageBucket: "flashcards-2959c.appspot.com",
  messagingSenderId: "1054027517229",
  appId: "1:1054027517229:web:fdac46f57cd647cfab97a4",
  measurementId: "G-XK4VS88H4B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db}