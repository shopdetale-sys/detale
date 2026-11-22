"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";

export interface UserProfile {
  uid: string;
  phone: string;
  name?: string;
  email?: string;
  role: "customer" | "admin";
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  loginPreviewUser: (phone: string, role?: "customer" | "admin") => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  loginPreviewUser: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check localStorage for persisted preview / demo user if Firebase is not fully hooked up
    const stored = typeof window !== "undefined" ? localStorage.getItem("detale_user") : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProfile(parsed);
        setIsAdmin(parsed.role === "admin");
      } catch (err) {
        console.error(err);
      }
    }

    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const token = await u.getIdTokenResult();
          const adminRole = token.claims.role === "admin";
          setIsAdmin(adminRole);
          setProfile({
            uid: u.uid,
            phone: u.phoneNumber?.replace("+", "") || "9876543210",
            role: adminRole ? "admin" : "customer",
          });
        } catch {
          setIsAdmin(false);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginPreviewUser = (phone: string, role: "customer" | "admin" = "customer") => {
    const userProfile: UserProfile = {
      uid: `usr_${phone.slice(-6)}`,
      phone,
      name: role === "admin" ? "Admin User" : `Customer +91 ${phone}`,
      role,
    };
    setProfile(userProfile);
    setIsAdmin(role === "admin");
    if (typeof window !== "undefined") {
      localStorage.setItem("detale_user", JSON.stringify(userProfile));
    }
  };

  const logout = async () => {
    if (auth) {
      try {
        await auth.signOut();
      } catch (e) {
        console.error(e);
      }
    }
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("detale_user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, loginPreviewUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
