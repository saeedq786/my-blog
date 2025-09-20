export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Post from "@/models/post";
import jwt from "jsonwebtoken";
import { getTokenFromReq } from "@/lib/auth";

// 🟢 Get single post
export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    const post = await Post.findById(id).populate("author", "name email");
    if (!post) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (err) {
    console.error("GET /api/posts/[id] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// 🟢 Update post
export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    const token = getTokenFromReq();
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    let body = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
    }

    const { title, content } = body || {};

    const post = await Post.findById(id);
    if (!post) return NextResponse.json({ message: "Not found" }, { status: 404 });

    if (post.author.toString() !== decoded.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (title?.trim()) post.title = title.trim();
    if (content?.trim()) post.content = content.trim();

    await post.save();

    return NextResponse.json({ post });
  } catch (err) {
    console.error("PUT /api/posts/[id] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// 🟢 Delete post
export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    const token = getTokenFromReq();
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const post = await Post.findById(id);
    if (!post) return NextResponse.json({ message: "Not found" }, { status: 404 });

    if (post.author.toString() !== decoded.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await post.deleteOne();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/posts/[id] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
