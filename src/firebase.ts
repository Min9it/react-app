import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBQ4AMqfv-OiYA9aQtVWZ8hOj7PG2DfZpw",
  authDomain: "nwitter-reloaded-f1cce.firebaseapp.com",
  projectId: "nwitter-reloaded-f1cce",
  storageBucket: "nwitter-reloaded-f1cce.appspot.com",
  messagingSenderId: "754370755651",
  appId: "1:754370755651:web:9974c00b0ae41c060d68f6",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const starage = getStorage(app);

export const db = getFirestore(app);
