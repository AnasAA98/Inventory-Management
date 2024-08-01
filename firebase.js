// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXxsqssPsLJP1MdDgI5S58kznokWHbltc",
  authDomain: "inventory-management-2c978.firebaseapp.com",
  projectId: "inventory-management-2c978",
  storageBucket: "inventory-management-2c978.appspot.com",
  messagingSenderId: "780668811212",
  appId: "1:780668811212:web:f437be4db6ee9b4300cf69",
  measurementId: "G-349SDS8V91"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
const auth = getAuth(app);

export {firestore, auth}