import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Post from "@/models/post";
import jwt from "jsonwebtoken";
import { getTokenFromReq } from "@/lib/auth";
import mongoose from "mongoose";

// ✅ Convert Mongoose document to plain JS object with string IDs
function serializePost(post) {
  return {
    ...post.toObject(),
    _id: post._id.toString(),
    author: post.author
      ? { ...post.author.toObject(), _id: post.author._id.toString() }
      : null,
    createdAt: post.createdAt?.toISOString() || null,
    updatedAt: post.updatedAt?.toISOString() || null,
  };
}

// 🟢 GET single post
export async function GET(_, { params }) {
  try {
    if (!params.id || !mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: "Invalid post ID" }, { status: 400 });
    }

    await connectToDB();
    const post = await Post.findById(params.id).populate("author", "name email");

    if (!post) return NextResponse.json({ message: "Not found" }, { status: 404 });

    return NextResponse.json({ post: serializePost(post) });
  } catch (err) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

// 🟢 Update post
export async function PUT(req, { params }) {
  try {
    if (!params.id || !mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: "Invalid post ID" }, { status: 400 });
    }

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

    return NextResponse.json({ post: serializePost(post) });
  } catch (err) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

// 🟢 Delete post
export async function DELETE(req, { params }) {
  try {
    if (!params.id || !mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: "Invalid post ID" }, { status: 400 });
    }

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
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
