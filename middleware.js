import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/login", "/register", "/"];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // public pages allowed
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // check auth token
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/posts/:path*"], // protect posts routes
};
