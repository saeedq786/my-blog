import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/login", "/register", "/", "/api/posts"];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Public pages allowed
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check token
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

// ✅ Sirf dashboard, profile aur post create/edit secure
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/posts/new",
    "/posts/edit/:path*",
  ],
};
