import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Post from "@/models/post";
import jwt from "jsonwebtoken";
import { getTokenFromReq } from "@/lib/auth";

// Helper to get ID from URL
const getIdFromReq = (req) => new URL(req.url).pathname.split("/").pop();

export async function GET(req) {
  try {
    await connectToDB();
    const id = getIdFromReq(req);

    const post = await Post.findById(id).populate("author", "name email");
    if (!post) return NextResponse.json({ message: "Not found" }, { status: 404 });

    return NextResponse.json({ post });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectToDB();
    const id = getIdFromReq(req);

    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ message: "Invalid Token" }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
    }

    const post = await Post.findById(id);
    if (!post) return NextResponse.json({ message: "Not found" }, { status: 404 });

    if (post.author.toString() !== decoded.id)
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    if (body.title) post.title = body.title;
    if (body.content) post.content = body.content;
    post.updatedAt = Date.now();

    await post.save();
    return NextResponse.json({ post });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectToDB();
    const id = getIdFromReq(req);

    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ message: "Invalid Token" }, { status: 401 });
    }

    const post = await Post.findById(id);
    if (!post) return NextResponse.json({ message: "Not found" }, { status: 404 });
    if (post.author.toString() !== decoded.id)
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    await post.deleteOne();
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
