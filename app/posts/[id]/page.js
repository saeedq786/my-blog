import PostDetailClient from "./PostDetailClient";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/lib/db";
import Post from "@/models/post";
import mongoose from "mongoose";

export default async function PostDetailPage({ params }) {
  try {
    if (!params.id || !mongoose.Types.ObjectId.isValid(params.id)) {
      return <p>Invalid post ID</p>;
    }

    await connectToDB();

    const postDoc = await Post.findById(params.id)
      .populate({ path: "author", select: "name email" })
      .lean();

    if (!postDoc) return <p>Post not found</p>;

    // ✅ Convert to plain JSON-safe object
    const post = {
      ...postDoc,
      _id: postDoc._id.toString(),
      author: postDoc.author
        ? { ...postDoc.author, _id: postDoc.author._id.toString() }
        : null,
      createdAt: postDoc.createdAt?.toISOString() || null,
      updatedAt: postDoc.updatedAt?.toISOString() || null,
    };

    let currentUserId = null;
    try {
      const token = cookies().get("token")?.value;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        currentUserId = decoded.id;
      }
    } catch {
      currentUserId = null;
    }

    return <PostDetailClient post={post} currentUserId={currentUserId} />;
  } catch (err) {
    console.error("PostDetailPage error:", err.message);
    return <p className="text-center text-red-500">⚠️ Failed to load post</p>;
  }
}
