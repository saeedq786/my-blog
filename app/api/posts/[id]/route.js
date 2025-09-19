import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Post from "@/models/post";
import jwt from "jsonwebtoken";
import { getTokenFromReq } from "@/lib/auth";

// 🟢 GET single post
export async function GET(_, { params }) {
  try {
    await connectToDB();
    const post = await Post.findById(params.id).populate("author", "name email");

    if (!post) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ post }); // 👈 wrap inside { post }
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// 🟢 Update post
export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const body = await req.json();
    const post = await Post.findById(params.id);

    if (!post) return NextResponse.json({ message: "Not found" }, { status: 404 });
    if (post.author.toString() !== decoded.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    post.title = body.title || post.title;
    post.content = body.content || post.content;
    post.updatedAt = Date.now();
    await post.save();

    return NextResponse.json({ post }); // 👈 keep consistent
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// 🟢 Delete post
export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const post = await Post.findById(params.id);

    if (!post) return NextResponse.json({ message: "Not found" }, { status: 404 });
    if (post.author.toString() !== decoded.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await post.deleteOne();
    return NextResponse.json({ success: true }); // 👈 consistent key
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
