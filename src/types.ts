/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  achievements: string[];
  profile_picture: string;
  socials: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    twitter?: string;
  };
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  flyer_url: string;
  cta_label: string;
  cta_link: string;
  category: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
}

export type BlogBlock =
  | { type: "paragraph"; value: string }
  | { type: "heading"; value: string; level: number }
  | { type: "image"; value: string; alt: string }
  | { type: "button"; value: string; url: string }
  | { type: "link"; value: string; url: string };

export interface BlogComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  date: string;
  replies?: BlogComment[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  image_url: string;
  blocks: BlogBlock[];
  likes: number;
  likedBy?: string[]; // Array of session IPs or clientIDs
  comments: BlogComment[];
  seo_title: string;
  seo_description: string;
}

export interface MerchandiseItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  sizes: string[];
  stock: number;
  link?: string; // external buy link like WhatsApp or payment gateway
  seo_title: string;
  seo_description: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  youtube_id: string;
  date: string;
}

export interface PartnerLogo {
  id: string;
  name: string;
  logo_url: string;
  link?: string;
}

export interface TestimonialItem {
  id: string;
  author: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
  approved: boolean;
  date: string;
}

export interface MessageItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
}

export interface PartnerApplication {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  message: string;
  partnerType: string;
  date: string;
  status: "pending" | "approved" | "declined";
}

export interface DonateLog {
  id: string;
  donorName: string;
  amount: number;
  currency: string;
  message?: string;
  date: string;
  paymentMethod: string;
}

export interface AppSettings {
  adminPassword?: string;
  logoUrl?: string;
  heroBgUrl?: string;
}

