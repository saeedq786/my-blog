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

export function getTokenFromReq(req) {
  const cookies = req.headers.get("cookie");
  if (!cookies) return null;
  const parsed = cookie.parse(cookies || "");
  return parsed.token || null;
}
