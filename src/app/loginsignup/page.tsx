// // src/app/loginsignup/page.tsx
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
// } from "firebase/auth";
// import { auth } from "@/lib/firebase";

// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";

// export default function LoginSignupPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [signupMode, setSignupMode] = useState(false);

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       alert("Signup successful! Please log in.");
//       setSignupMode(false);
//     } catch (error: any) {
//       alert("Signup failed: " + error.message);
//     }
//   };

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       await userCredential.user.getIdToken();
//       router.push("/chat");
//     } catch (error: any) {
//       alert("Login failed: " + error.message);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-white">
//       <Card className="w-full max-w-sm shadow-xl">
//         <CardHeader>
//           <CardTitle className="text-2xl text-center">
//             {signupMode ? "Sign Up" : "Login"}
//           </CardTitle>
//         </CardHeader>

//         <form onSubmit={signupMode ? handleSignup : handleLogin} className="flex flex-col gap-6 px-6 pb-6">
//           <div className="flex flex-col items-center gap-2 text-center">
//             <p className="text-muted-foreground text-sm text-balance">
//               Enter your email below to {signupMode ? "create an account" : "login to your account"}
//             </p>
//           </div>

//           <div className="grid gap-4">
//             <div className="grid gap-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="m@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="********"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           <div className="flex flex-col gap-2">
//             <Button type="submit" className="w-full">
//               {signupMode ? "Sign Up" : "Login"}
//             </Button>
//             <Button
//               type="button"
//               variant="ghost"
//               className="text-sm"
//               onClick={() => setSignupMode(!signupMode)}
//             >
//               {signupMode ? "Have an account? Log in" : "Don't have an account? Sign up"}
//             </Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// }

// src/app/loginsignup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  const router = useRouter();
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
      await userCredential.user.getIdToken();
      router.push("/chat");
    } catch (error: any) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
              onSubmit={signupMode ? handleSignup : handleLogin}
              signupMode={signupMode}
              toggleSignupMode={() => setSignupMode(!signupMode)}
            />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
