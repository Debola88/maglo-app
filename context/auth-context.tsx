// ============================================
// FILE 6: auth-context.tsx (FIXED)
// PATH: context/auth-context.tsx
// ============================================
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { account } from "@/lib/appwrite.config";
import { useRouter } from "next/navigation";

interface User {
  $id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await account.get();
      console.log('Auth context - user found:', currentUser);
      setUser(currentUser as User);
    } catch (error) {
      console.log('Auth context - no user found');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    await checkUser();
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}