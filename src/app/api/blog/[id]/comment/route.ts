import { NextResponse, NextRequest } from "next/server";
import { getDB, saveDB } from "../../../../../../server/database";
import { BlogComment } from "../../../../../types";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await context.params;
    const body = await req.json();
    const { author, text } = body;
    if (!author || !text) {
      return NextResponse.json({ error: "Comment author and content are required." }, { status: 400 });
    }

    const db = await getDB();
    const post = db.blog.find(p => p.id === postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const newComment: BlogComment = {
      id: "comm-" + Date.now(),
      author,
      avatar: `https://images.unsplash.com/photo-${[
        "1535713875002-d1d0cf377fde",
        "1494790108377-be9c29b29330",
        "1507003211169-0a1dd7228f2d",
        "1438761681033-6461ffad8d80"
      ][Math.floor(Math.random() * 4)]}?w=100&auto=format&fit=crop&q=80`,
      text,
      date: new Date().toISOString(),
      replies: []
    };

    if (!post.comments) post.comments = [];
    post.comments.push(newComment);
    await saveDB(db);

    return NextResponse.json({ success: true, comment: newComment });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
