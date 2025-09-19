"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditPostPage({ params }) {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${params.id}`, {
          credentials: "include", // ✅ send JWT cookie
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Post not found");
          return;
        }
        setForm({ title: data.post?.title || "", content: data.post?.content || "" });
      } catch (err) {
        setError("Failed to fetch post");
      }
    }
    fetchPost();
  }, [params.id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`/api/posts/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include", // ✅ send JWT cookie for auth
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/posts/${params.id}`);
        router.refresh();
      } else {
        setError(data.message || "Failed to update post");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  }

  return (
    <div className="w-full mx-auto p-6 bg-black shadow rounded">
      <h1 className="text-2xl font-bold text-center mb-4">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full border p-2 rounded min-h-[120px]"
        />
        <button className="w-full bg-blue-600 text-white p-2 cursor-pointer rounded hover:bg-blue-700">
          Save Changes
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}
