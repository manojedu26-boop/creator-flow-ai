import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { db } from "../lib/db";

export interface User {
  id: string;
  name: string;
  firstName: string;
  handle: string;
  email: string;
  photo: string | null;
  niche: string;
  platforms: string[];
  type: 'Creator' | 'Brand';
  followerCounts: Record<string, string>;
  onboarded: boolean;
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
  followerCounts: { "Instagram": "48.2K", "YouTube": "12.8K", "TikTok": "31.5K" },
  onboarded: true
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const users = db.getAll<User>('users');
    if (users.length > 0) {
      setUser(users[0]);
    } else {
      db.seed('users', [mockUser]);
      setUser(mockUser);
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    const newUser = { ...mockUser, email };
    setUser(newUser);
    db.update<User>('users', mockUser.id, { email });
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
      niche: "Fitness & Lifestyle", // Default for demo
      platforms: ["Instagram", "YouTube", "TikTok"],
      type: 'Creator',
      followerCounts: { "Instagram": "12.5K", "YouTube": "1.2K", "TikTok": "5.4K" },
      onboarded: true
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
  };

  const logout = () => {
    setUser(null);
    db.reset(); // Clear DB on logout for demo purposes, or just remove session
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
