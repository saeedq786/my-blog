import PostDetailClient from "./PostDetailClient";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

async function getPost(id, token) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`; // send JWT to API

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}`, {
    headers,
    cache: "no-store", // always fetch fresh
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function PostDetailPage({ params }) {
  // ✅ Get JWT token from cookies
  let currentUserId = null;
  let token = null;
  try {
    token = cookies().get("token")?.value;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      currentUserId = decoded.id;
    }
  } catch {
    currentUserId = null;
    token = null;
  }

  // ✅ Fetch post data from API
  const data = await getPost(params.id, token);

  if (!data || !data.post) return <p>Post not found</p>;

  return <PostDetailClient post={data.post} currentUserId={currentUserId} />;
}
