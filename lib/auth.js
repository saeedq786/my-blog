import jwt from "jsonwebtoken";
import cookie from "cookie";

const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function setTokenCookie(res, token) {
  const serialized = cookie.serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  res.setHeader("Set-Cookie", serialized);
}

export function removeTokenCookie(res) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })
  );
}

/**
 * 🔹 Fix getTokenFromReq for App Router + Vercel
 * Accepts either:
 * 1️⃣ Request object in API route (Server Component)
 * 2️⃣ Headers string manually passed
 */
export function getTokenFromReq(req) {
  let cookiesStr;

  // Case 1: API Route, req.headers.get available
  if (req?.headers?.get) {
    cookiesStr = req.headers.get("cookie") || "";
  } 
  // Case 2: headers object directly passed
  else if (req?.cookie) {
    cookiesStr = req.cookie;
  } 
  // Case 3: fallback
  else {
    cookiesStr = "";
  }

  if (!cookiesStr) return null;

  const parsed = cookie.parse(cookiesStr);
  return parsed.token || null;
}

/**
 * 🔹 Helper to decode JWT token safely
 */
export function getUserIdFromToken(token) {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.id;
  } catch (err) {
    console.error("Invalid token:", err.message);
    return null;
  }
}
