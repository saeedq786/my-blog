// app/page.js
import PostCard from "./components/PostCard";
import { connectToDB } from "@/lib/db";
import Post from "@/models/post";
import "@/models/user"; // ensure User schema load ho jaye

export const dynamic = "force-dynamic"; // hamesha fresh data fetch

export default async function HomePage() {
  // 🟢 DB connect
  await connectToDB();

  // 🟢 direct database se posts fetch with author
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("author", "name email") // author ka name aur email fetch
    .lean();

  return (
    <main className="max-w-6xl mx-auto px-6 py-1">
      <h1 className="text-4xl font-bold text-center mb-10">
        Latest Blog Posts
      </h1>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post._id} post={JSON.parse(JSON.stringify(post))} />
          ))}
        </div>
      )}
    </main>
  );
}
