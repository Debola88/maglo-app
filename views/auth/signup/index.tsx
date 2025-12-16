/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_LINKS } from "@/constants/app-links";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import bgImage from "@/assets/image/Auth_image.png";
import logo from "@/assets/image/Logo.svg";
import curve from "@/assets/image/curve.png";
import { account } from "@/lib/appwrite.config";
import { ID } from "appwrite";
import { toast } from "sonner";

export default function SignUpView() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 8) {
      const errorMessage = "Password must be at least 8 characters";
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    setLoading(true);

    try {
      const user = await account.create(
        ID.unique(),
        formData.email,
        formData.password,
        formData.username
      );

      console.log("User created:", user);

      await account.createEmailPasswordSession(
        formData.email,
        formData.password
      );

      toast.success("Account created successfully!");

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error("Signup error:", error);

      let errorMessage = "Something went wrong";

      if (error.code === 409) {
        errorMessage = "An account with this email already exists";
      } else if (error.code === 400) {
        errorMessage = "Please check your input and try again";
      } else if (error.message?.includes("password")) {
        errorMessage = "Password must be at least 8 characters";
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
      <div className="md:m-20 max-md:p-5 grid place-items-center flex-1">
        <div className="md:w-3/4 xl:mt-0 mb-5">
          <Image src={logo} alt="" className="" width={150} height={150} />
        </div>
        <div className="md:w-3/4 h-full">
          <h1 className="text-black md:text-2xl text-xl font-bold pb-5">
            Create new account
          </h1>
          <div className="text-sm max-md:text-xs text-[#202224]/80 md:w-3/4">
            Welcome! Please enter your details to get started
          </div>
          {/* {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4 md:w-3/4">
            {error}
          </div>
        )} */}
          <div className="p-0 mt-2">
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <div className="space-y-2 text-[#202224]/80">
                <Label>Username</Label>
                <Input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Badejo Adebola"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2 text-[#202224]/80">
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2 text-[#202224]/80">
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="●●●●●●●●"
                  required
                  minLength={8}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 md:mt-2">
                  Must be at least 8 characters
                </p>
              </div>
              <div className="mt-10 text-center">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#C8EE44] w-full hover:bg-[#C8EE44]/70"
                >
                  {loading ? "Creating Account..." : "Sign up"}
                </Button>
                <div className="flex justify-center mt-2 md:text-sm text-xs font-medium items-start">
                  <p>Already have an account?</p>
                  <div className="-mt-2">
                    <Button
                      variant="link"
                      type="button"
                      className="text-[#5A8CFF] cursor-pointer"
                      onClick={() => router.push(APP_LINKS.LOGIN)}
                    >
                      Sign in
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
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="flex-1 relative w-full h-full max-md:hidden">
        <Image
          src={bgImage}
          alt=""
          width={700}
          height={400}
          className="object-cover w-full h-screen"
        />
      </div>
    </div>
  );
}
