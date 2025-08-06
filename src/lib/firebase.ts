
// This file is being created to centralize Firebase initialization and exports.
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration is already in a separate component.
// This config is just for server-side or to be consistent.
const firebaseConfig = {
  apiKey: "AIzaSyB9OGa_I5vg1vsjPLQQMiUC6xU2TFmrfm0",
  authDomain: "pixar-educational-consultancy.firebaseapp.com",
  projectId: "pixar-educational-consultancy",
  storageBucket: "pixar-educational-consultancy.firebasestorage.app",
  messagingSenderId: "286970299360",
  appId: "1:286970299360:web:3d0f098ee47b6dd282a185",
  measurementId: "G-8W0E04NQFZ"
};

// Initialize Firebase App (Singleton Pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
// Connect to the default firestore database
const db = getFirestore(app);

export { app, auth, db };
