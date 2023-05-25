// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARMStnBv8V3ysS_i8dYp3o0ethVgeMSEc",
  authDomain: "cenmo-firebase.firebaseapp.com",
  // databaseURL: "https://cenmo-firebase-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cenmo-firebase",
  storageBucket: "cenmo-firebase.appspot.com",
  messagingSenderId: "103019259848",
  appId: "1:103019259848:web:52340e49e67a0785fa02fd",
  measurementId: "G-4SKVDX397F"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);
const db = getFirestore(app);
export { storage, database, db };