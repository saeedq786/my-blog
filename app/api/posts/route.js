import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Post from "@/models/post";
import jwt from "jsonwebtoken";
import { getTokenFromReq } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDB();
    const posts = await Post.find().populate("author", "name email");
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDB();

    const token = getTokenFromReq(req);
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const body = await req.json().catch(() => ({}));
    const { title, content } = body;

    if (!title || typeof title !== "string" || !content || typeof content !== "string") {
      return NextResponse.json({ message: "Title and content are required" }, { status: 400 });
    }

    const newPost = await Post.create({
      title,
      content,
      author: decoded.id,
    });

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
