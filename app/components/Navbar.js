"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logoutUser } = useAuth();

  return (
    <nav className="bg-black border-b shadow-sm">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        <Link href="/" className="font-bold text-red-500 text-lg">
           BlogPost
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <span className="font-semibold">{user.name}</span>
              <Link
                href="/posts/new"
                className="bg-green-600 text-white px-3 py-3 rounded cursor-pointer hover:bg-green-700 hover:underline"
              >
                New Post
              </Link>
              <button
                onClick={logoutUser}
                className="bg-red-500 text-white px-3 py-2 rounded cursor-pointer hover:bg-red-600 hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className=" rounded bg-blue-500 py-2 px-3 hover:underline">
                Login
              </Link>
              <Link href="/register" className="rounded bg-blue-500 py-2 px-3  hover:underline">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
