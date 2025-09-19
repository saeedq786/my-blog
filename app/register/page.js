"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function RegisterPage() {
  const { registerUser } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const { ok, data } = await registerUser(form);
    if (ok) router.push("/");
    else setError(data.message);
  }

  return (
    <div className="flex mt-25 items-center justify-center ">
      <form
        onSubmit={handleSubmit}
        className="bg-black p-6 rounded-lg shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl text-center font-bold">Register to Next Blog</h1>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2 rounded"
        />
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
        <button className="w-full bg-blue-600 text-white p-2 cursor-pointer  rounded hover:bg-blue-700">
          Register
        </button>

        <span className="ml-10 ">
         Already have an account?
          <Link
            href="/login"
            className="text-blue-600 px-1 hover:underline"
          >
            Login
          </Link>
        </span>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}
