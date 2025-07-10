// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdihBaJMMhNkvGn-nntU6F53kMSiifE4c",
  authDomain: "naijacare-82f5c.firebaseapp.com",
  projectId: "naijacare-82f5c",
  storageBucket: "naijacare-82f5c.firebasestorage.app",
  messagingSenderId: "363542755165",
  appId: "1:363542755165:web:5c6cf63c1b7db67644dab4",
  measurementId: "G-GG1SNQL0L1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getFirestore(app);

export { app, auth, provider, database };
