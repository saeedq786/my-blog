"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function PostDetailClient({ post, currentUserId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ✅ Delete Post Function (safe & production-ready)
  async function handleDelete() {
    if (!post?._id) return alert("Invalid post.");
    if (!confirm("Are you sure you want to delete this post?")) return;

    setLoading(true);
    let data = {};

    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
        credentials: "include", // ✅ ensure JWT cookie is sent
      });

      // safe parsing
      try {
        data = await res.json();
      } catch (err) {
        data = {};
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete post");
      }

      // redirect after delete
      router.push("/");
      router.refresh();
    } catch (err) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!post) {
    return <p className="text-center text-red-500">⚠️ Post not found</p>;
  }

  // ✅ Compare user IDs as string to prevent errors
  const isAuthor =
    currentUserId && post.author?._id
      ? currentUserId === post.author._id.toString()
      : false;

  return (
    <article className="bg-gray-800 rounded-xl shadow-lg p-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-white mb-6">By {post.author?.name || "Unknown"}</p>
      <div className="prose max-w-none mb-8">
        <p>{post.content}</p>
      </div>

      {isAuthor && (
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
