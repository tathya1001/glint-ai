// src/app/chat/page.tsx
"use client";

import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";
import ChatUI from "@/components/Chat/ChatUI";
import LoginSignupForm from "@/components/Auth/AuthForm";

const firebaseConfig = {
  apiKey: "AIzaSyAOf-0nbpYtln11UPSrv-k7JL52QABPEn0",
  authDomain: "flame-0.firebaseapp.com",
  projectId: "flame-0",
  storageBucket: "flame-0.appspot.com",
  messagingSenderId: "686246521553",
  appId: "1:686246521553:web:6d3e822a13f6dd6fe473f0",
};

// Prevent re-initializing Firebase
if (getApps().length === 0) initializeApp(firebaseConfig);
const auth = getAuth();

export default function ChatPage() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        setUser(firebaseUser);
        setToken(idToken);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <LoginSignupForm
        onLoginSuccess={async (firebaseUser, token) => {
          setUser(firebaseUser);
          setToken(token);
        }}
      />
    );
  }

  return <ChatUI user={user} token={token} />;
}
