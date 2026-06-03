import { NextResponse, NextRequest } from "next/server";
import { getDB, saveDB } from "../../../../server/database";
import { sendBrevoEmail } from "../../../../server/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, content } = body;
    if (!name || !email || !subject || !content) {
      return NextResponse.json({ error: "Required fields are missing." }, { status: 400 });
    }

    const db = await getDB();
    const newMessage = {
      id: "msg-" + Date.now(),
      name,
      email,
      phone,
      subject,
      content,
      date: new Date().toISOString(),
      read: false
    };

    db.messages.unshift(newMessage);
    await saveDB(db);

    // Send notification email to Admin (if configured)
    const adminEmail = process.env.ADMIN_EMAIL || "sizzyafro@gmail.com";
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const emailHtml = `
      <h3>New Contact Message Received</h3>
      <p><strong>From:</strong> ${name} (&lt;${email}&gt;)</p>
      <p><strong>Phone:</strong> ${phone || "N/A"}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <div style="padding: 10px; background: #f5f5f5; border-left: 4px solid #f97316; margin: 10px 0;">
        ${content.replace(/\n/g, "<br>")}
      </div>
      <p><em>Check the crawl-free admin dashboard to reply to this lead.</em></p>
    `;

    await sendBrevoEmail(adminEmail, adminUsername, `[Contact Form] ${subject}`, emailHtml);

    return NextResponse.json({ success: true, message: "Your message has been received! Our support team will get in touch." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
