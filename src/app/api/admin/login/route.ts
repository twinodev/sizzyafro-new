import { NextResponse, NextRequest } from "next/server";
import { getDB } from "../../../../../server/database";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;
    const db = await getDB();
    const configUser = process.env.ADMIN_USERNAME || "admin";
    const configPass = db.settings?.adminPassword || process.env.ADMIN_PASSWORD || "change-me-to-secure-password";

    if (username === configUser && password === configPass) {
      return NextResponse.json({ success: true, token: "session-" + Buffer.from(username + ":" + Date.now()).toString("base64") });
    } else {
      return NextResponse.json({ error: "Invalid administrator credentials." }, { status: 401 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
