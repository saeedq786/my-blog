"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditPostPage({ params }) {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch post safely
  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${params.id}`, {
          credentials: "include",
        });

        let data = {};
        try {
          data = await res.json();
        } catch {
          data = {};
        }

        if (!res.ok) {
          setError(data.message || "Post not found");
          return;
        }

        setForm({
          title: data.post?.title || "",
          content: data.post?.content || "",
        });
      } catch {
        setError("Failed to fetch post");
      }
    }

    fetchPost();
  }, [params.id]);

  // Handle update
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/posts/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok) {
        router.push(`/posts/${params.id}`);
        router.refresh();
      } else {
        setError(data.message || "Failed to update post");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-black shadow rounded">
      <h1 className="text-2xl font-bold text-center mb-4">Edit Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2 rounded"
          placeholder="Title"
          required
        />

        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full border p-2 rounded min-h-[120px]"
          placeholder="Content"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
}
