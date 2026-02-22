import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// You get these values from: Firebase Settings > General > Your Apps (Add Web App)
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);