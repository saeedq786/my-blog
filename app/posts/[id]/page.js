import PostDetailClient from "./PostDetailClient";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/lib/db";
import Post from "@/models/post";
import mongoose from "mongoose";

export default async function PostDetailPage({ params }) {
  try {
    const postId = params.id;
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      console.error("Invalid post ID:", postId);
      return <p>Invalid post ID</p>;
    }

    // Attempt DB connection
    await connectToDB().catch((err) => {
      console.error("MongoDB connection failed:", err);
      throw err;
    });

    const postDoc = await Post.findById(postId)
      .populate({ path: "author", select: "name email" })
      .lean();

    if (!postDoc) {
      console.error("Post not found:", postId);
      return <p>Post not found</p>;
    }

    // Convert to plain object
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
    } catch (err) {
      console.warn("JWT verify failed:", err.message);
      currentUserId = null;
    }

    return <PostDetailClient post={post} currentUserId={currentUserId} />;
  } catch (err) {
    console.error("PostDetailPage error:", err);
    return (
      <p className="text-center text-red-500">
        ⚠️ Failed to load post. Please check your server logs.
      </p>
    );
  }
}
