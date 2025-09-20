import jwt from "jsonwebtoken";
import { cookies } from "next/headers"; // ✅ Next.js ka built-in cookies API

const JWT_SECRET = process.env.JWT_SECRET;

// 🔑 Sign JWT
export function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

// 🔑 Set cookie with token
export function setTokenCookie(token) {
  cookies().set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // prod mai secure=true
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 din
  });
}

// 🔑 Remove token cookie
export function removeTokenCookie() {
  cookies().set({
    name: "token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

// 🔑 Get token safely (no parse crash)
export function getTokenFromReq() {
  try {
    return cookies().get("token")?.value || null;
  } catch (err) {
    console.error("Error reading token from cookies:", err);
    return null;
  }
}
