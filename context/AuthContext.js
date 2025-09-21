"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include", // ✅ send cookies
        });
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, []);

  async function registerUser({ name, email, password }) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ✅ send cookies
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (res.ok) setUser(data.user);
    return { ok: res.ok, data };
  }

  async function loginUser({ email, password }) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ✅ send cookies
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) setUser(data.user);
    return { ok: res.ok, data };
  }

  async function logoutUser() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include", // ✅ send cookies
    });
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, registerUser, loginUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}