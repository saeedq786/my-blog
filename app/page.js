import PostCard from "./components/PostCard";

async function getPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data.posts || [];
}

export default async function HomePage() {
  const posts = await getPosts();

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
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}
