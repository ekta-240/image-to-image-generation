import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_U0d8YdOhfZfO5pT_Qe5JD5j2oX58fqA",
  authDomain: "homelytics-ec8cf.firebaseapp.com",
  projectId: "homelytics-ec8cf",
  storageBucket: "homelytics-ec8cf.firebasestorage.app",
  messagingSenderId: "975665038861",
  appId: "1:975665038861:web:56b016a6a64981c9cb7744",
  measurementId: "G-VW3L15PS42"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);