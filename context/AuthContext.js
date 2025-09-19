"use client";

import { createContext, useContext, useState, useEffect } from "react";
import jwt from "jsonwebtoken";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 🟢 Check token from cookies on mount
    const cookies = document.cookie.split("; ").find(row => row.startsWith("token="));
    if (!cookies) return;

    const token = cookies.split("=")[1];
    try {
      const decoded = jwt.decode(token); // decode without verifying
      if (decoded) {
        setUser({ _id: decoded.id, email: decoded.email });
      }
    } catch (err) {
      console.log("Invalid token", err);
      setUser(null);
    }
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => {
    document.cookie = "token=; max-age=0; path=/";
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
