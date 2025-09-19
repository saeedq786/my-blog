"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function PostDetailClient({ post, currentUserId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ✅ Delete Post Function
  async function handleDelete() {
    if (!post?._id) return alert("Invalid post.");
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",

        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete post");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!post) {
    return <p className="text-center text-red-500">⚠️ Post not found</p>;
  }

  return (
    <article className="bg-gray-800 rounded-xl shadow-lg p-8">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

      {/* Author */}
      <p className="text-white mb-6">By {post.author?.name || "Unknown"}</p>

      {/* Content */}
      <div className="prose max-w-none mb-8">
        <p>{post.content}</p>
      </div>

      {/* 🟢 Show buttons only if current user is the author */}
      {currentUserId && currentUserId === post.author?._id && (
        <div className="flex space-x-4">
          <Link
            href={`/posts/${post._id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition"
          >
            ✏️ Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Deleting..." : "🗑️ Delete"}
          </button>
        </div>
      )}
    </article>
  );
}
