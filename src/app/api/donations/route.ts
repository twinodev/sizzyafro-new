import { NextResponse, NextRequest } from "next/server";
import { getDB, saveDB } from "../../../../server/database";
import { sendBrevoEmail } from "../../../../server/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { donorName, amount, currency, message, paymentMethod } = body;
    if (!amount) {
      return NextResponse.json({ error: "Amount is required." }, { status: 400 });
    }

    const db = await getDB();
    const newDonation = {
      id: "don-" + Date.now(),
      donorName: donorName || "Anonymous Supporter",
      amount: Number(amount),
      currency: currency || "USD",
      message: message || "",
      date: new Date().toISOString(),
      paymentMethod: paymentMethod || "Card"
    };

    db.donations.unshift(newDonation);
    await saveDB(db);

    // Notify Admin via Email
    const adminEmail = process.env.ADMIN_EMAIL || "sizzyafro@gmail.com";
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const emailHtml = `
      <h3>New Donation Logged!</h3>
      <p><strong>Donor Name:</strong> ${newDonation.donorName}</p>
      <p><strong>Amount:</strong> ${newDonation.currency} ${newDonation.amount}</p>
      <p><strong>Message:</strong> ${newDonation.message || "No message."}</p>
      <p><strong>Payment Method/Channel:</strong> ${newDonation.paymentMethod}</p>
      <p><em>Check the admin log history.</em></p>
    `;

    await sendBrevoEmail(adminEmail, adminUsername, `[Donation Received] ${newDonation.currency} ${newDonation.amount}`, emailHtml);

    return NextResponse.json({ success: true, donation: newDonation, message: "Thank you for supporting the Dance With Sizzy Afro community!" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
