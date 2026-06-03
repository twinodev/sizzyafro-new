/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  TeamMember,
  EventItem,
  BlogPost,
  MerchandiseItem,
  VideoItem,
  PartnerLogo,
  TestimonialItem,
  MessageItem,
  PartnerApplication,
  DonateLog
} from "./types";

export interface DBState {
  team: TeamMember[];
  events: EventItem[];
  blog: BlogPost[];
  merchandise: MerchandiseItem[];
  videos: VideoItem[];
  partners: PartnerLogo[];
  testimonials: TestimonialItem[];
  messages: MessageItem[];
  partnerships: PartnerApplication[];
  donations: DonateLog[];
}

export async function fetchAppState(): Promise<DBState> {
  const res = await fetch("/api/state");
  if (!res.ok) throw new Error("Failed to fetch state from server.");
  return res.json();
}

export async function submitContact(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  content: string;
}) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to submit message.");
  }
  return res.json();
}

export async function submitPartnerApplication(data: {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  message: string;
  partnerType: string;
}) {
  const res = await fetch("/api/partner-apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to submit partner application.");
  }
  return res.json();
}

export async function togglePostLike(postId: string) {
  const res = await fetch(`/api/blog/${postId}/like`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to toggle like.");
  return res.json();
}

export async function commentOnPost(postId: string, author: string, text: string) {
  const res = await fetch(`/api/blog/${postId}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ author, text })
  });
  if (!res.ok) throw new Error("Failed to submit comment.");
  return res.json();
}

export async function replyToComment(postId: string, commentId: string, author: string, text: string) {
  const res = await fetch(`/api/blog/${postId}/comment/${commentId}/reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ author, text })
  });
  if (!res.ok) throw new Error("Failed to submit reply.");
  return res.json();
}

export async function submitTestimonial(data: {
  author: string;
  role: string;
  content: string;
  rating: number;
}) {
  const res = await fetch("/api/testimonials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to submit testimonial.");
  return res.json();
}

export async function submitDonation(data: {
  donorName?: string;
  amount: number;
  currency: string;
  message?: string;
  paymentMethod: string;
}) {
  const res = await fetch("/api/donations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to submit donation.");
  return res.json();
}

export async function saveAdminSection(section: keyof DBState, data: any, token: string) {
  const res = await fetch("/api/admin/save-section", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ section, data, token })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update directory segment.");
  }
  return res.json();
}
