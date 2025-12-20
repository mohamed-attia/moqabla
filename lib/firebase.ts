
// Modular Firebase (v11.1.0) initialization
// Fix: Use namespace import for FirebaseApp to bypass named export resolution issues
import * as FirebaseApp from "firebase/app";
const { initializeApp, getApps, getApp } = FirebaseApp as any;
import { getFirestore } from "firebase/firestore";
// Fix: Use namespace import for FirebaseAuth to bypass named export resolution issues
import * as FirebaseAuth from "firebase/auth";
const { getAuth, GoogleAuthProvider } = FirebaseAuth as any;

// Access environment variables safely
const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyCaQr0skV-QlYaIIxOx-FIpG6JeBzDTXOc",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "moqabala-9257a.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "moqabala-9257a",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "moqabala-9257a.appspot.com",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1038709573170",
  appId: env.VITE_FIREBASE_APP_ID || "1:1038709573170:web:15b220fd2e40bb719b5e2b",
  measurementId: "G-W48GY1FMT4"
};

// Singleton pattern to ensure only one Firebase app is initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize and export services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
