
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "pikki-fd743",
  appId: "1:782747796664:web:2fe780b2fde6ef7442604d",
  storageBucket: "pikki-fd743.firebasestorage.app",
  apiKey: "AIzaSyAJBKAK2st5Ru8k905bGW76WXIBgNp7NIs",
  authDomain: "pikki-fd743.firebaseapp.com",
  messagingSenderId: "782747796664",
  measurementId: "G-WVPPXGRR59"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
