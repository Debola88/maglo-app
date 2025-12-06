/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { APP_LINKS } from "@/constants/app-links";
import Image from "next/image";
import bgImage from "@/assets/image/Auth_image.png";
import logo from "@/assets/image/Logo.svg";
import curve from "@/assets/image/curve.png";
import { account } from "@/lib/appwrite.config";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

export default function LoginView() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Delete any existing session first
      try {
        await account.deleteSession('current');
      } catch (error) {
        // No active session, that's fine
      }

      // Create new session with Appwrite
      const session = await account.createEmailPasswordSession(email, password);
      
      console.log('Session created:', session);
      
      // Get user details
      const user = await account.get();
      
      console.log('User logged in:', user);
      
      // Refresh the auth context
      await refreshUser();
      
      toast.success("Login successful!");
      
      // Small delay to ensure auth context updates
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 100);
      
    } catch (error: any) {
      console.error("Login error:", error);
      
      let errorMessage = "Something went wrong";
      
      // Handle specific Appwrite errors
      if (error.code === 401) {
        errorMessage = "Invalid email or password";
      } else if (error.code === 429) {
        errorMessage = "Too many attempts. Please try again later";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex max-md:flex-col h-screen">
      <div className="md:m-20 p-5 grid place-items-center flex-1">
        <div className="md:w-3/4 -mt-25">
          <Image src={logo} alt="" className="" width={150} height={150} />
        </div>
        <h1 className="text-black md:text-2xl text-xl font-bold md:w-3/4">
          Welcome back
        </h1>
        <div className="text-sm max-md:text-xs text-[#202224]/80 md:w-3/4 -mt-5">
          Welcome back! Please enter your details
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4 md:w-3/4">
            {error}
          </div>
        )}
        <div className="md:w-3/4 p-0 mt-2">
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="space-y-2 text-[#202224]/80">
              <Label>Email</Label>
              <Input
                className="bg-white"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                type="email"
                value={email}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2 text-[#202224]/80">
              <Label>Password</Label>
              <Input
                type="password"
                className="bg-white"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="●●●●●●"
                value={password}
                required
                disabled={loading}
              />
              <div className="flex gap-2 mt-2 md:text-sm text-xs items-center">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                  disabled={loading}
                />
                <Label>Remember Password for 30 Days</Label>
                <Link
                  href="#"
                  className="md:text-sm text-xs ml-auto font-semibold"
                >
                  Forget Password?
                </Link>
              </div>
            </div>
            <div className="mt-10 text-center">
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#C8EE44] w-full hover:bg-[#C8EE44]/70"
              >
                {loading ? "Loading..." : "Sign in"}
              </Button>
              <div className="flex justify-center mt-2 md:text-sm text-xs font-medium items-start">
                <p>Don&apos;t have an account?</p>
                <div className="-mt-2">
                  <Button
                    variant="link"
                    type="button"
                    className="text-[#5A8CFF] cursor-pointer"
                    onClick={() => router.push(APP_LINKS.SIGNUP_HOME)}
                  >
                    Sign up for free
                  </Button>
                  <Image
                    src={curve}
                    alt=""
                    width={100}
                    height={100}
                    className="mx-auto"
                  />
                </div>
              </div>
              <div className="w-full"></div>
            </div>
          </form>
        </div>
      </div>
      <div className="flex-1 relative w-full h-full max-md:hidden">
        <Image
          src={bgImage}
          alt=""
          width={700}
          height={400}
          className="object-cover"
        />
      </div>
    </div>
  );
}