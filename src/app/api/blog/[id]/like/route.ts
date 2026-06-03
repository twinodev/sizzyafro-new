import { NextResponse, NextRequest } from "next/server";
import { getDB, saveDB } from "../../../../../../server/database";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await context.params;
    const clientIp = req.headers.get("x-forwarded-for") || "anonymous";
    const ipStr = String(clientIp);

    const db = await getDB();
    const post = db.blog.find(p => p.id === postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    if (!post.likedBy) {
      post.likedBy = [];
    }

    // Toggle like
    const ipIndex = post.likedBy.indexOf(ipStr);
    if (ipIndex > -1) {
      post.likedBy.splice(ipIndex, 1);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(ipStr);
      post.likes += 1;
    }

    await saveDB(db);
    return NextResponse.json({ success: true, likes: post.likes, liked: ipIndex === -1 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
