/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { getDB, saveDB } from "./server/database";
import { BlogComment, BlogPost } from "./src/types";

// Load environment variables from .env
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Helper: Send Brevo Email
async function sendBrevoEmail(toEmail: string, toName: string, subject: string, htmlContent: string) {
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

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// 1. Get entire state (Read fallback)
app.get("/api/state", async (req, res) => {
  try {
    const db = await getDB();
    res.json(db);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Add Contact Message
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, content } = req.body;
    if (!name || !email || !subject || !content) {
      return res.status(400).json({ error: "Required fields are missing." });
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

    res.json({ success: true, message: "Your message has been received! Our support team will get in touch." });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Add Partner/Sponsor Request
app.post("/api/partner-apply", async (req, res) => {
  try {
    const { companyName, contactName, email, phone, message, partnerType } = req.body;
    if (!companyName || !contactName || !email || !phone || !message || !partnerType) {
      return res.status(400).json({ error: "Missing required partnership details." });
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

    res.json({ success: true, message: "Proposal submitted successfully! We are looking forward to collaborating." });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Like BlogPost
app.post("/api/blog/:id/like", async (req, res) => {
  try {
    const postId = req.params.id;
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "anonymous";
    const ipStr = String(clientIp);

    const db = await getDB();
    const post = db.blog.find(p => p.id === postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
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
    res.json({ success: true, likes: post.likes, liked: ipIndex === -1 });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Comment on BlogPost
app.post("/api/blog/:id/comment", async (req, res) => {
  try {
    const postId = req.params.id;
    const { author, text } = req.body;
    if (!author || !text) {
      return res.status(400).json({ error: "Comment author and content are required." });
    }

    const db = await getDB();
    const post = db.blog.find(p => p.id === postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newComment: BlogComment = {
      id: "comm-" + Date.now(),
      author,
      avatar: `https://images.unsplash.com/photo-${[
        "1535713875002-d1d0cf377fde",
        "1494790108377-be9c29b29330",
        "1507003211169-0a1dd7228f2d",
        "1438761681033-6461ffad8d80"
      ][Math.floor(Math.random() * 4)]}?w=100&auto=format&fit=crop&q=80`,
      text,
      date: new Date().toISOString(),
      replies: []
    };

    if (!post.comments) post.comments = [];
    post.comments.push(newComment);
    await saveDB(db);

    res.json({ success: true, comment: newComment });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Reply to Comment on BlogPost
app.post("/api/blog/:id/comment/:commentId/reply", async (req, res) => {
  try {
    const { id: postId, commentId } = req.params;
    const { author, text } = req.body;
    if (!author || !text) {
      return res.status(400).json({ error: "Reply author and content are required." });
    }

    const db = await getDB();
    const post = db.blog.find(p => p.id === postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const newReply = {
      id: "reply-" + Date.now(),
      author,
      avatar: `https://images.unsplash.com/photo-${[
        "1535713875002-d1d0cf377fde",
        "1494790108377-be9c29b29330",
        "1507003211169-0a1dd7228f2d",
        "1438761681033-6461ffad8d80"
      ][Math.floor(Math.random() * 4)]}?w=100&auto=format&fit=crop&q=80`,
      text,
      date: new Date().toISOString()
    };

    if (!comment.replies) comment.replies = [];
    comment.replies.push(newReply);
    await saveDB(db);

    res.json({ success: true, reply: newReply });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Submit quick testimonial
app.post("/api/testimonials", async (req, res) => {
  try {
    const { author, role, content, rating } = req.body;
    if (!author || !role || !content) {
      return res.status(400).json({ error: "Please enter name, role, and details for testimonial." });
    }

    const db = await getDB();
    const newTestimonial = {
      id: "test-" + Date.now(),
      author,
      role,
      content,
      rating: Number(rating) || 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      approved: false, // Default pending admin approval! Excellent!
      date: new Date().toISOString()
    };

    db.testimonials.unshift(newTestimonial);
    await saveDB(db);

    res.json({ success: true, message: "Thank you! Your testimonial has been submitted and is pending administrator authorization." });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Admin Authentication
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = await getDB();
    const configUser = process.env.ADMIN_USERNAME || "admin";
    const configPass = db.settings?.adminPassword || process.env.ADMIN_PASSWORD || "change-me-to-secure-password";

    if (username === configUser && password === configPass) {
      res.json({ success: true, token: "session-" + Buffer.from(username + ":" + Date.now()).toString("base64") });
    } else {
      res.status(401).json({ error: "Invalid administrator credentials." });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Admin Universal Update Section helper
app.post("/api/admin/save-section", async (req, res) => {
  try {
    const { section, data, token } = req.body;
    if (!token || !token.startsWith("session-")) {
      return res.status(403).json({ error: "Unauthorized access token." });
    }

    if (!section || !data) {
      return res.status(400).json({ error: "Missing section identifier or payload." });
    }

    const db = await getDB();
    if (section in db) {
      (db as any)[section] = data;
      await saveDB(db);
      res.json({ success: true, message: `Section '${section}' updated successfully.` });
    } else {
      res.status(400).json({ error: `Invalid section identifier: '${section}'` });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Donation visual simulation logging
app.post("/api/donations", async (req, res) => {
  try {
    const { donorName, amount, currency, message, paymentMethod } = req.body;
    if (!amount) {
      return res.status(400).json({ error: "Amount is required." });
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

    res.json({ success: true, donation: newDonation, message: "Thank you for supporting the Dance With Sizzy Afro community!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// ASSET PIPELINE & SERVICE LOOPS
// -------------------------------------------------------------

async function startServer() {
  // Vite dev or production static serving logic
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started. Ingress binds to http://0.0.0.0:${PORT}`);
  });
}

startServer();
