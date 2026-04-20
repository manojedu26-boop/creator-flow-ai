import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { db } from "../lib/db";
import { supabase } from "../lib/supabase";

export interface User {
  id: string;
  name: string;
  firstName: string;
  handle: string;
  email: string;
  photo: string | null;
  niche: string;
  platforms: string[];
  type: 'Creator' | 'Brand' | null;
  role_assigned: boolean;
  followerCounts: Record<string, string>;
  onboarded: boolean;
  brandName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => void;
  register: (name: string, email: string) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
  triggerSessionExpiry: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const mockUser: User = {
  id: "u1",
  name: "Naveen Kumar",
  firstName: "Naveen",
  handle: "@naveenfitlife",
  email: "naveen@example.com",
  photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Naveen",
  niche: "Fitness & Lifestyle",
  platforms: ["Instagram", "YouTube", "TikTok"],
  type: "Creator",
  role_assigned: true,
  followerCounts: { "Instagram": "48.2K", "YouTube": "12.8K", "TikTok": "31.5K" },
  onboarded: true
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Initial local profile load
    const users = db.getAll<User>('users');
    if (users.length > 0) {
      setUser(users[0]);
    }

    // 2. Supabase Session Listener
    let subscription: any = null;
    
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { user: sbUser } = session;
          
          const name = sbUser.user_metadata.full_name || sbUser.email?.split('@')[0] || "Operative";
          const type = sbUser.user_metadata.account_type || null;
          
          const existingProfile = db.getAll<User>('users').find(u => u.id === sbUser.id || u.email === sbUser.email);
          
          if (existingProfile) {
            const updatedProfile = { 
              ...existingProfile, 
              name, 
              type: existingProfile.type || type, 
              role_assigned: !!(existingProfile.type || type),
              photo: sbUser.user_metadata.avatar_url || existingProfile.photo 
            };
            db.update<User>('users', existingProfile.id, updatedProfile);
            setUser(updatedProfile);
          } else {
            const newUser: User = {
              id: sbUser.id,
              name: name,
              firstName: name.split(' ')[0],
              handle: `@${name.toLowerCase().replace(/\s+/g, '')}_${Math.random().toString(36).substr(2, 4)}`,
              email: sbUser.email!,
              photo: sbUser.user_metadata.avatar_url || null,
              niche: "", 
              platforms: [],
              type: type as any,
              role_assigned: !!type,
              followerCounts: { "Instagram": "0" },
              onboarded: false
            };
            db.insert('users', newUser);
            setUser(newUser);
          }
          
          if (event === 'SIGNED_IN') {
            toast.success("Identity Verified", { description: "Secure session initialized." });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setIsLoading(false);
      });
      subscription = data.subscription;
    } else {
      setIsLoading(false);
    }

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const login = (email: string, _password: string) => {
    const users = db.getAll<User & { password?: string }>('users');
    let found = users.find(u => u.email === email);
    if (found) {
      const { password, ...safeUser } = found as any;
      setUser(safeUser);
    } else {
      const newUser = { ...mockUser, email };
      setUser(newUser);
      db.update<User>('users', mockUser.id, { email });
    }
  };

  const register = (name: string, email: string) => {
    const firstName = name.split(' ')[0];
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      firstName,
      handle: `@${name.toLowerCase().replace(/\s+/g, '')}`,
      email,
      photo: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
      niche: "",
      platforms: [],
      type: null,
      role_assigned: false,
      followerCounts: { "Instagram": "0" },
      onboarded: false
    };
    setUser(newUser);
    db.insert('users', newUser);
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    if (data.name) {
      updatedUser.firstName = data.name.split(' ')[0];
    }
    setUser(updatedUser);
    db.update('users', user.id, data);

    if (supabase && (data.type || data.brandName)) {
      supabase.auth.updateUser({
        data: { 
          account_type: data.type || user.type,
          brand_name: data.brandName || user.brandName
        }
      });
    }
  };

  const logout = () => {
    if (supabase) supabase.auth.signOut();
    setUser(null);
  };

  const triggerSessionExpiry = () => {
    logout();
    toast.error("Session Expired", {
      description: "Your session expired. Please log in again.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, updateUser, logout, triggerSessionExpiry }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
