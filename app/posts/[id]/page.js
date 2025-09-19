import PostDetailClient from "./PostDetailClient";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/lib/db";
import Post from "@/models/post";

export default async function PostDetailPage({ params }) {
  await connectToDB();

  // Fetch post directly from DB (safer than calling API from server component)
  const post = await Post.findById(params.id).populate("author", "name email").lean();
  if (!post) return <p>Post not found</p>;

  // Get current user ID from cookie
  let currentUserId = null;
  try {
    const token = cookies().get("token")?.value; // safe access
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      currentUserId = decoded.id;
    }
  } catch (err) {
    currentUserId = null; // token invalid or missing
  }

  return <PostDetailClient post={post} currentUserId={currentUserId} />;
}
