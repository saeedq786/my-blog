"use client";

import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <div className="bg-gray-800 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          {post.title}
        </h2>
        <p className="text-white line-clamp-3 mb-4">{post.content}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-white">
            By {post.author?.name || "Unknown"}
          </span>
          <Link
            href={`/posts/${post._id}`}
            className="px-4 py-2 mt-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
}
