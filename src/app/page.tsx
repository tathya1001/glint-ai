// src/app/page.tsx
"use client";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-6">Welcome to Glint Chat</h1>
      <button
        onClick={() => router.push("/loginsignup")}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Get Started
      </button>
    </div>
  );
}
