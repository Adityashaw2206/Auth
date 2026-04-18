import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBsVb7KnRjFjiM1TrvTrdWcdtQ5cvoPVHY",
  authDomain: "auth-system-b11a7.firebaseapp.com",
  projectId: "auth-system-b11a7",
  storageBucket: "auth-system-b11a7.firebasestorage.app",
  messagingSenderId: "1098378557623",
  appId: "1:1098378557623:web:20d153004b3896fa6c3532",
  measurementId: "G-D8T0T21RGF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();