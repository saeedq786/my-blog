"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function NewPostPage() {
  const { user } = useAuth(); // user object should include JWT token
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState(null);

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-red-500">You must be logged in to create a post.</p>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // Frontend validation
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and Content cannot be empty");
      return;
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // ✅ add token here
        },
        body: JSON.stringify(form), // ✅ stringify body
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/"); // Redirect to home after successful post
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 mb-30 rounded-lg shadow-md w-full max-w-md space-y-5"
      >
        <h1 className="text-xl text-center font-bold">New Post</h1>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full border p-2 rounded min-h-[120px]"
        />
        <button className="w-full bg-green-600 text-white p-2 rounded cursor-pointer hover:bg-green-700">
          Publish
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}
