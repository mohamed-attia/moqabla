import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Access environment variables safely handling TypeScript type definition limitations
// Cast import.meta to any because TypeScript might not have the Vite types loaded in this context
const env = (import.meta as any).env || {};

// Configuration uses environment variables for security, 
// but falls back to provided keys for immediate functionality.
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyCaQr0skV-QlYaIIxOx-FIpG6JeBzDTXOc",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "moqabala-9257a.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "moqabala-9257a",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "moqabala-9257a.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1038709573170",
  appId: env.VITE_FIREBASE_APP_ID || "1:1038709573170:web:15b220fd2e40bb719b5e2b",
  measurementId: "G-W48GY1FMT4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);