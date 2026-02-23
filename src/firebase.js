import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDoIrdFg6YpvOq4dYzMNSI_HAaZuKEZsFY",
  authDomain: "authentication-f21e9.firebaseapp.com",
  databaseURL: "https://authentication-f21e9-default-rtdb.firebaseio.com",
  projectId: "authentication-f21e9",
  storageBucket: "authentication-f21e9.firebasestorage.app",
  messagingSenderId: "49004121774",
  appId: "1:49004121774:web:c5d8f5e43155180d52e73f",
  measurementId: "G-C093MCEPPK"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
