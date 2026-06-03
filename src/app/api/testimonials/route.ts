import { NextResponse, NextRequest } from "next/server";
import { getDB, saveDB } from "../../../../server/database";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { author, role, content, rating } = body;
    if (!author || !role || !content) {
      return NextResponse.json({ error: "Please enter name, role, and details for testimonial." }, { status: 400 });
    }

    const db = await getDB();
    const newTestimonial = {
      id: "test-" + Date.now(),
      author,
      role,
      content,
      rating: Number(rating) || 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      approved: false, // Default pending admin approval
      date: new Date().toISOString()
    };

    db.testimonials.unshift(newTestimonial);
    await saveDB(db);

    return NextResponse.json({ success: true, message: "Thank you! Your testimonial has been submitted and is pending administrator authorization." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
