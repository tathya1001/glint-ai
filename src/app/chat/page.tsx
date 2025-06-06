// src/app/chat/page.tsx
"use client";

import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";
import ChatUI from "@/components/Chat/ChatUI";
import LoginSignupForm from "@/components/Auth/AuthForm";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
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
