import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzzpI3iComh_jwyCS96rLLOB-164wcBuc",
  authDomain: "practica-web-d619d.firebaseapp.com",
  projectId: "practica-web-d619d",
  storageBucket: "practica-web-d619d.appspot.com",
  messagingSenderId: "558741109735",
  appId: "1:558741109735:web:66b2e3d26ddd5db2fedb42",
  measurementId: "G-H653GDJ2QE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
