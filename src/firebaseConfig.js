import { initializeApp } from "firebase/app";
import { getAuth,setPersistence,browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDsmXcT_kwa01SdhNOCIRuIMdPQsUcxzhs",
  authDomain: "room-rent-app-281d2.firebaseapp.com",
  projectId:  "room-rent-app-281d2",
  storageBucket: "room-rent-app-281d2.firebasestorage.app",
  messagingSenderId: "211183994184",
  appId: "1:211183994184:web:75ec0f635982611f39df7d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
setPersistence(auth, browserLocalPersistence);
export const storage = getStorage(app);
