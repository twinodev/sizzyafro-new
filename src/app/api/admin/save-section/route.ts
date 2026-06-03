import { NextResponse, NextRequest } from "next/server";
import { getDB, saveDB } from "../../../../../server/database";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { section, data, token } = body;
    if (!token || !token.startsWith("session-")) {
      return NextResponse.json({ error: "Unauthorized access token." }, { status: 403 });
    }

    if (!section || !data) {
      return NextResponse.json({ error: "Missing section identifier or payload." }, { status: 400 });
    }

    const db = await getDB();
    if (section in db) {
      (db as any)[section] = data;
      await saveDB(db);
      return NextResponse.json({ success: true, message: `Section '${section}' updated successfully.` });
    } else {
      return NextResponse.json({ error: `Invalid section identifier: '${section}'` }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
