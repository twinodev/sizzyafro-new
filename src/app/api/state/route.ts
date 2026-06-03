import { NextResponse } from "next/server";
import { getDB } from "../../../../server/database";

export async function GET() {
  try {
    const db = await getDB();
    return NextResponse.json(db);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
