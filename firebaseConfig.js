const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc, updateDoc, collection, getDocs } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCnwSOjrqasUNSCp6UrK2moHd1OtLUMj28",
  authDomain: "wldata.firebaseapp.com",
  projectId: "wldata",
  storageBucket: "wldata.appspot.com",
  messagingSenderId: "86184173654",
  appId: "1:86184173654:web:9463c36b71d142b684dbf7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = { db, doc, getDoc, updateDoc, collection, getDocs };
