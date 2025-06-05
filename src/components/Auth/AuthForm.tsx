"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase"; // ✅ Use this one

type Props = {
  onLoginSuccess: (user: any, token: string) => void;
};

export default function AuthForm({ onLoginSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupMode, setSignupMode] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup successful! Please log in.");
      setSignupMode(false);
    } catch (error: any) {
      alert("Signup failed: " + error.message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();
      onLoginSuccess(firebaseUser, token);
    } catch (error: any) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="w-80 max-w-full mx-auto mt-24 p-5 border border-gray-300 rounded-md">
      <h2 className="text-2xl font-semibold mb-4">
        {signupMode ? "Sign Up" : "Login"}
      </h2>
      <form onSubmit={signupMode ? handleSignup : handleLogin} className="space-y-4">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {signupMode ? "Sign Up" : "Login"}
        </button>
      </form>
      <button
        onClick={() => setSignupMode(!signupMode)}
        className="mt-4 w-full text-center text-sm text-blue-600 hover:underline"
      >
        {signupMode
          ? "Have an account? Log in"
          : "Don't have an account? Sign up"}
      </button>
    </div>
  );
}
