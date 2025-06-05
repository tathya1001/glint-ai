// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAOf-0nbpYtln11UPSrv-k7JL52QABPEn0",
  authDomain: "flame-0.firebaseapp.com",
  projectId: "flame-0",
  storageBucket: "flame-0.appspot.com",
  messagingSenderId: "686246521553",
  appId: "1:686246521553:web:6d3e822a13f6dd6fe473f0",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
