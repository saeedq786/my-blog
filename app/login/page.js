"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const { loginUser } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const { ok, data } = await loginUser(form);
    if (ok) router.push("/");
    else setError(data.message);
  }

  return (
    <div className="flex mt-25 items-center justify-center ">
      <form
        onSubmit={handleSubmit}
        className="bg-black p-6 rounded-lg shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl text-center font-bold">Login to Next Blog</h1>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded cursor-pointer hover:bg-blue-700">
          Login
        </button>

        <span className="ml-10 mr-0">
          Dont have an account?
          <Link
            href="/register"
            className=" px-1 text-blue-600 hover:underline"
          >
            Register
          </Link>
        </span>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}
