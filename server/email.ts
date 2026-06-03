/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export async function sendBrevoEmail(toEmail: string, toName: string, subject: string, htmlContent: string) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "verified-sender@example.com";
  const senderName = process.env.BREVO_SENDER_NAME || "Dance with Sizzy Afro";

  if (!apiKey || apiKey.includes("your-brevo") || apiKey === "") {
    console.log(`[Brevo Email Fallback Log]
Sender: ${senderName} <${senderEmail}>
Receiver: ${toName} <${toEmail}>
Subject: ${subject}
Content HTML Length: ${htmlContent.length} bytes
(Note: Add BREVO_API_KEY and a verified sender to .env to send real emails)`);
    return false;
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: toEmail, name: toName }],
        subject: subject,
        htmlContent: htmlContent
      })
    });
    if (response.ok) {
      console.log(`Brevo email sent to ${toEmail} successfully`);
      return true;
    } else {
      const errText = await response.text();
      console.error(`Brevo Email Error [${response.status}]: ${errText}`);
      return false;
    }
  } catch (error) {
    console.error("Failed to connect or submit to Brevo SMTP servers:", error);
    return false;
  }
}
