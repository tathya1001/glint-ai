import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Flame Chat App",
  description: "AI chatbot with Firebase and Tailwind",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  );
}
