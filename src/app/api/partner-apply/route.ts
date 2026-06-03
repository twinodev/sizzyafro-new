import { NextResponse, NextRequest } from "next/server";
import { getDB, saveDB } from "../../../../server/database";
import { sendBrevoEmail } from "../../../../server/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, contactName, email, phone, message, partnerType } = body;
    if (!companyName || !contactName || !email || !phone || !message || !partnerType) {
      return NextResponse.json({ error: "Missing required partnership details." }, { status: 400 });
    }

    const db = await getDB();
    const newApplication = {
      id: "part-" + Date.now(),
      companyName,
      contactName,
      email,
      phone,
      message,
      partnerType,
      date: new Date().toISOString(),
      status: "pending" as const
    };

    db.partnerships.unshift(newApplication);
    await saveDB(db);

    // Send email to Admin
    const adminEmail = process.env.ADMIN_EMAIL || "sizzyafro@gmail.com";
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const emailHtml = `
      <h3>New Partnership Application</h3>
      <p><strong>Company/Institution:</strong> ${companyName}</p>
      <p><strong>Contact Person:</strong> ${contactName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Proposed Type:</strong> ${partnerType}</p>
      <div style="padding: 10px; background: #f5f5f5; border-left: 4px solid #f97316; margin: 10px 0;">
        ${message.replace(/\n/g, "<br>")}
      </div>
      <p><em>Review this and take action in your Admin Panel.</em></p>
    `;

    await sendBrevoEmail(adminEmail, adminUsername, `[Partner Proposal] ${companyName}`, emailHtml);

    return NextResponse.json({ success: true, message: "Proposal submitted successfully! We are looking forward to collaborating." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
