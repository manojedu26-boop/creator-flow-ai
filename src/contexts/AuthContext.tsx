import React, { createContext, useContext, useState, useEffect } from "react";

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
  id: "u1",
  name: "Naveen Kumar",
  firstName: "Naveen",
  handle: "@naveencreates",
  email: "naveen@example.com",
  photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Naveen",
  niche: "Fitness",
  platforms: ["Instagram", "YouTube"],
  type: "Creator",
  followerCounts: { "Instagram": "120K", "YouTube": "85K" },
  onboarded: true
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("cf_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // For development/demo, we'll start with the mock user if nothing is stored
      // setUser(mockUser); 
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    // Mock login
    const newUser = { ...mockUser, email };
    setUser(newUser);
    localStorage.setItem("cf_user", JSON.stringify(newUser));
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
      type: 'Creator',
      followerCounts: {},
      onboarded: false
    };
    setUser(newUser);
    localStorage.setItem("cf_user", JSON.stringify(newUser));
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    if (data.name) {
      updatedUser.firstName = data.name.split(' ')[0];
    }
    setUser(updatedUser);
    localStorage.setItem("cf_user", JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cf_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, updateUser, logout }}>
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
