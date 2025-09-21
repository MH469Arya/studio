// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8ImhRNBrHdZSLvPx-YwL1E_YBH4s6cQA",
  authDomain: "studio-6662000179-3ce9d.firebaseapp.com",
  projectId: "studio-6662000179-3ce9d",
  storageBucket: "studio-6662000179-3ce9d.appspot.com",
  messagingSenderId: "430331483213",
  appId: "1:430331483213:web:1ca2f1cfc9668bfd317804"
};

// Initialize Firebase for client-side
// We check if the app is already initialized to prevent errors during hot-reloading in development.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
