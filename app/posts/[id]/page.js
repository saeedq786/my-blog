import PostDetailClient from "./PostDetailClient";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

async function getPost(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}`, {
    cache: "no-store",
     credentials: "include",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function PostDetailPage({ params }) {
  const data = await getPost(params.id);
  if (!data || !data.post) return <p>Post not found</p>;

  // ✅ Current logged-in user ka ID decode karna
  let currentUserId = null;
  try {
    const token = cookies().get("token")?.value;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      currentUserId = decoded.id;
    }
  } catch (err) {
    currentUserId = null;
  }

  // 🟢 yahan sirf data.post bhejna hai
  return <PostDetailClient post={data.post} currentUserId={currentUserId} />;
}
