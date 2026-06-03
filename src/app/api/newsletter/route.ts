import { NextResponse, NextRequest } from "next/server";
import { getDB, saveDB } from "../../../../server/database";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const db = await getDB();
    if (!db.newsletter) {
      db.newsletter = [];
    }

    // Check if email already subscribed
    const alreadySubscribed = db.newsletter.some((sub) => sub.email.toLowerCase() === email.toLowerCase());
    if (alreadySubscribed) {
      return NextResponse.json({ success: true, message: "This email is already subscribed to our newsletter!" });
    }

    const newSubscription = {
      id: "sub-" + Date.now(),
      email: email.trim(),
      date: new Date().toISOString(),
    };

    db.newsletter.unshift(newSubscription);
    await saveDB(db);

    return NextResponse.json({
      success: true,
      message: "Thank you! You've successfully subscribed to our community newsletter."
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
