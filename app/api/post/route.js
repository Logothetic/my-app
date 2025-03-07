//an api endpoint to create a new Post document in the database the route is not protected by the auth middleware so anyone can create a post ,the route expects a POST request with a title,description in the request body.The boardId field is in the query parameters. The userId field is populated with the users Id if they are logged in.

import connectMongo from "@/libs/mongoose";
import Post from "@/models/Post";
import User from "@/models/User";
import { auth } from "@/auth";
import { Filter } from "bad-words";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { title, description } = await req.json();

    const { searchParams } = req.nextUrl;
    const boardId = searchParams.get("boardId");

    const badWordsFilter = new Filter();
    const saniteziedTitle = badWordsFilter.clean(title);
    const saniteziedDescription = badWordsFilter.clean(description);
    // const userId = session?.user?.id;

    if (!saniteziedTitle) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const session = await auth();
    await connectMongo();

    const post = await Post.create({
      title: saniteziedTitle,
      description: saniteziedDescription,
      boardId,
      userId: session?.user?.id,
    });

    return NextResponse.json(post);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = req.nextUrl;
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const user = await User.findById(session.user.id);
    if (!user.hasAccess) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (!user.boards.includes(post.boardId.toString())) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    await Post.deleteOne({ _id: postId });

    return NextResponse.json({ message: "Post Deleted" });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
//
