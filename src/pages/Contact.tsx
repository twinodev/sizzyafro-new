/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Globe, 
  Send, 
  MessageSquare, 
  Star, 
  Sparkles, 
  CheckSquare, 
  Facebook, 
  Youtube, 
  Music,
  Handshake,
  Check,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { submitContact, submitPartnerApplication } from "../api";
import SEO from "../components/SEO";

export default function Contact() {
  // Navigation inside the Contacts Hub
  const [formType, setFormType] = useState<"inquiry" | "partner">("inquiry");

  // General Inquiry form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("Enrollment Query");
  const [content, setContent] = useState("");
  const [isInquirySubmitting, setIsInquirySubmitting] = useState(false);
  const [inquiryFeedback, setInquiryFeedback] = useState<string | null>(null);

  // Partnership form state
  const [companyName, setCompanyName] = useState("");
  const [partnerContactName, setPartnerContactName] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [partnerPhone, setPartnerPhone] = useState("");
  const [partnerType, setPartnerType] = useState("Sponsor");
  const [partnerMessage, setPartnerMessage] = useState("");
  const [isPartnerSubmitting, setIsPartnerSubmitting] = useState(false);
  const [partnerFeedback, setPartnerFeedback] = useState<string | null>(null);

  const programs = [
    {
      title: "School Outreach & Educational Dance",
      desc: "Introducing structured physical education classes, rhythm workshops, and dance assemblies directly into basic schools across the Western Region of Uganda."
    },
    {
      title: "Corporate Sponsorship & Collaborations",
      desc: "Sponsoring community showcases or battle championships. Expand your brand presence among highly active youth, digital creators, and regional artistic networks."
    },
    {
      title: "Cultural Exchange Programs",
      desc: "Linking international contemporary choreographers and traditional dance teachers with local breaking/hip-hop youth in Mbarara."
    }
  ];

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !content) return;

    setIsInquirySubmitting(true);
    setInquiryFeedback(null);
    try {
      const response = await submitContact({
        name,
        email,
        phone,
        subject,
        content
      });
      setInquiryFeedback(response.message || "Message logged successfully!");
      setName("");
      setEmail("");
      setPhone("");
      setContent("");
    } catch (err: any) {
      alert(err.message || "Message submission error.");
    } finally {
      setIsInquirySubmitting(false);
    }
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !partnerContactName || !partnerEmail || !partnerPhone || !partnerMessage) return;

    setIsPartnerSubmitting(true);
    setPartnerFeedback(null);
    try {
      const response = await submitPartnerApplication({
        companyName,
        contactName: partnerContactName,
        email: partnerEmail,
        phone: partnerPhone,
        message: partnerMessage,
        partnerType
      });
      setPartnerFeedback(response.message || "Proposal logged successfully!");
      setCompanyName("");
      setPartnerContactName("");
      setPartnerEmail("");
      setPartnerPhone("");
      setPartnerMessage("");
    } catch (err: any) {
      alert(err.message || "Proposal submission error.");
    } finally {
      setIsPartnerSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-16 font-sans">
      <SEO
        title="Contact Us & Partner Programs | Dance With Sizzy Afro"
        description="Get in touch with Dance With Sizzy Afro, locate our street-dance studio in Mbarara, Uganda, or submit outreach partnership and sponsorship proposals."
        keywords="contact phone, school outreaches, physical studio mbarara, sponsor arts uganda, partner proposals"
      />

      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-orange-500 font-display text-xs tracking-widest uppercase font-bold">
          GET INVOLVED
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
          Locate, Write or Partner
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Questions about classes, merchandise options, or structured sponsorships? Choose from our inquiries channels or send a formal proposal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
        {/* Left Information Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Studio Specific Details */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h3 className="font-display font-bold text-xs text-slate-400 border-b border-slate-850 pb-3 uppercase tracking-wider">
              Direct Channels
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-500 font-bold block text-[9px] uppercase tracking-wide">Direct Hotline & WhatsApp</p>
                  <a href="tel:+256766796585" className="hover:text-orange-500 font-mono font-bold text-sm block mt-0.5">
                    +256 766 796585
                  </a>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-500 font-bold block text-[9px] uppercase tracking-wide">Email Enquiries</p>
                  <a href="mailto:sizzyafro@gmail.com" className="hover:text-orange-500 font-mono font-bold text-sm block mt-0.5 text-slate-350">
                    sizzyafro@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-500 font-bold block text-[9px] uppercase tracking-wide">Physical Studio Location</p>
                  <p className="font-semibold block mt-0.5 text-[13px]">
                    Youth Center, Lugazi, Mbarara, Uganda
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social connections */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="font-display font-bold text-white uppercase tracking-wider text-xs border-b border-slate-850 pb-3">
              Follow Us @sizzyafro
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Join our online community! Catch real-time session footage, dance battles, tutorials, and youth updates.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="https://instagram.com/sizzyafro"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-slate-950 border border-slate-855 hover:border-orange-500 p-2.5 rounded-xl text-xs transition-colors"
              >
                <Instagram className="w-4 h-4 text-pink-500 shrink-0" />
                <div className="overflow-hidden">
                  <span className="font-bold block text-white text-[11px]">Instagram</span>
                  <span className="text-[9px] text-slate-500 block truncate">@sizzyafro</span>
                </div>
              </a>
              <a
                href="https://tiktok.com/@sizzyafro"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-slate-950 border border-slate-855 hover:border-orange-500 p-2.5 rounded-xl text-xs transition-colors"
              >
                <Music className="w-4 h-4 text-cyan-400 shrink-0" />
                <div className="overflow-hidden">
                  <span className="font-bold block text-white text-[11px]">TikTok</span>
                  <span className="text-[9px] text-slate-500 block truncate">@sizzyafro</span>
                </div>
              </a>
              <a
                href="https://facebook.com/sizzyafro"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-slate-950 border border-slate-855 hover:border-orange-500 p-2.5 rounded-xl text-xs transition-colors"
              >
                <Facebook className="w-4 h-4 text-blue-500 shrink-0" />
                <div className="overflow-hidden">
                  <span className="font-bold block text-white text-[11px]">Facebook</span>
                  <span className="text-[9px] text-slate-500 block truncate">@sizzyafro</span>
                </div>
              </a>
              <a
                href="https://youtube.com/@sizzyafro"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-slate-950 border border-slate-855 hover:border-orange-500 p-2.5 rounded-xl text-xs transition-colors"
              >
                <Youtube className="w-4 h-4 text-red-500 shrink-0" />
                <div className="overflow-hidden">
                  <span className="font-bold block text-white text-[11px]">YouTube</span>
                  <span className="text-[9px] text-slate-500 block truncate">@sizzyafro</span>
                </div>
              </a>
            </div>
          </div>

          {/* rating anchors */}
          <div className="bg-slate-900/15 border border-slate-850 p-6 rounded-2xl text-center space-y-4">
            <h4 className="text-white font-display font-bold text-xs uppercase text-slate-500 tracking-wider">Leave Public Feedback</h4>
            <div className="flex items-center gap-1 justify-center text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4.5 h-4.5 fill-amber-500 text-amber-500 animate-pulse" />
              ))}
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm mx-auto">
              Sizzy Afro values standard google transparency review logs. Tap below to write a public review.
            </p>
            <a
              href="https://g.page/r/CVGVGRuS4-rNEBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-5 py-2 rounded-full text-xs hover:scale-105 transition-transform"
            >
              <span>Write Google Business Review</span>
            </a>
          </div>
        </div>

        {/* Right Tab Form area */}
        <div className="lg:col-span-7 space-y-6">
          {/* switcher tabs */}
          <div className="flex items-center justify-center gap-3 border-b border-slate-900/60 pb-3 max-w-sm mr-auto">
            <button
              onClick={() => setFormType("inquiry")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
                formType === "inquiry"
                  ? "bg-slate-900 text-white border-orange-500/20 shadow-sm"
                  : "bg-[#0b0f19] text-slate-500 border-transparent hover:text-white"
              }`}
            >
              Inquiries & Message
            </button>
            <button
              onClick={() => setFormType("partner")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
                formType === "partner"
                  ? "bg-slate-900 text-white border-orange-500/20 shadow-sm"
                  : "bg-[#0b0f19] text-slate-500 border-transparent hover:text-white"
              }`}
            >
              Sponsorship & Sponsor Form
            </button>
          </div>

          {/* FORM 1: GENERAL INQUIRIES */}
          {formType === "inquiry" && (
            <div className="bg-slate-900/30 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6">
              <div className="space-y-1">
                <h3 className="font-display font-extrabold text-white text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-orange-500" />
                  <span>Shoot Us a Quick Message</span>
                </h3>
                <p className="text-slate-500 text-xs">For classes details, schedules, sizes, or custom requests.</p>
              </div>

              <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1.5">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Atwooki Kenneth"
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500 placeholder-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g., atwooki@gmail.com"
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500 placeholder-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1.5">Contact Phone (Optional)</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g., +256 700 000 000"
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500 placeholder-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1.5">Subject Category</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500 font-semibold"
                    >
                      <option value="Enrollment Query">Enrollment / Joining Classes</option>
                      <option value="Merchandise Question">Merchandise Order Inquiry</option>
                      <option value="Outreach Event">School Outreach Booking</option>
                      <option value="General Support">General Support Questions</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1.5">Message Content</label>
                  <textarea
                    required
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter details of your inquiries here..."
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500 placeholder-slate-700"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isInquirySubmitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl shadow-md text-xs flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isInquirySubmitting ? "Sending Securely..." : "Send Message"}</span>
                </button>
              </form>

              <AnimatePresence>
                {inquiryFeedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-green-500/10 border border-green-500 p-4 rounded-xl flex flex-col items-center justify-center text-center gap-1 text-green-400"
                  >
                    <Sparkles className="w-5 h-5" />
                    <p className="font-bold text-xs">{inquiryFeedback}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* FORM 2: PARTNERSHIPS AND OUTREACHES */}
          {formType === "partner" && (
            <div className="space-y-8">
              {/* Outreach Programs details */}
              <div className="space-y-4 bg-slate-900/10 border border-slate-900 p-5 rounded-2xl">
                <h4 className="font-display font-extrabold text-sm text-white tracking-tight uppercase tracking-wider text-slate-400 text-xs">
                  Active Community Outreaches
                </h4>
                <div className="space-y-3">
                  {programs.map((prog, idx) => (
                    <div key={idx} className="flex gap-3 items-start border-b border-slate-950 pb-3 last:border-0 last:pb-0">
                      <div className="w-6 h-6 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h5 className="font-display font-bold text-white text-xs">{prog.title}</h5>
                        <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">{prog.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proposal form */}
              <div className="bg-slate-900/30 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full blur-2xl -z-10" />

                <div className="space-y-1">
                  <h3 className="font-display font-extrabold text-white text-base flex items-center gap-2">
                    <Handshake className="w-5 h-5 text-orange-500" />
                    <span>Submit Partnership Proposal</span>
                  </h3>
                  <p className="text-slate-500 text-[11px]">Let us co-design or co-sponsor cultural fusions.</p>
                </div>

                <form onSubmit={handlePartnerSubmit} className="space-y-4 text-xs font-sans">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1.5">Company / Agency Name</label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g., Mbarara Arts Council"
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500 placeholder-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1.5">Contact Person Name</label>
                      <input
                        type="text"
                        required
                        value={partnerContactName}
                        onChange={(e) => setPartnerContactName(e.target.value)}
                        placeholder="e.g., Twinomujuni Emmanuel"
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500 placeholder-slate-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1.5">Partner Email Address</label>
                      <input
                        type="email"
                        required
                        value={partnerEmail}
                        onChange={(e) => setPartnerEmail(e.target.value)}
                        placeholder="e.g., corporate@partner.org"
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500 placeholder-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1.5">Partner Phone Number</label>
                      <input
                        type="text"
                        required
                        value={partnerPhone}
                        onChange={(e) => setPartnerPhone(e.target.value)}
                        placeholder="e.g., +256 700 000 000"
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500 placeholder-slate-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 font-semibold block mb-1.5">Partnership Category</label>
                    <select
                      value={partnerType}
                      onChange={(e) => setPartnerType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500 font-semibold"
                    >
                      <option value="Sponsor">Sponsor (Financial Outreaches / Battles)</option>
                      <option value="School Partner">School Partner (Educational Assemblage)</option>
                      <option value="Grant Provider">Grant Provider & Foundations</option>
                      <option value="Exchange Artist">Visiting Choreographer & Exchanges</option>
                      <option value="Individual Patron">Individual Support Patron</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 font-semibold block mb-1.5">Proposal Brief & Direct Goals</label>
                    <textarea
                      required
                      rows={4}
                      value={partnerMessage}
                      onChange={(e) => setPartnerMessage(e.target.value)}
                      placeholder="Share details of your proposed program collaboration, grant outlines, or corporate showcase budgets here..."
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500 placeholder-slate-700 leading-relaxed font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPartnerSubmitting}
                    className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-550 hover:to-amber-450 text-white font-bold py-3.5 rounded-xl shadow-md text-xs flex items-center justify-center gap-2"
                  >
                    <Handshake className="w-4 h-4" />
                    <span>{isPartnerSubmitting ? "Submitting Proposal..." : "Submit Partnership Proposal"}</span>
                  </button>
                </form>

                <AnimatePresence>
                  {partnerFeedback && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-green-500/10 border border-green-500 p-4 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 text-green-400"
                    >
                      <Sparkles className="w-5 h-5" />
                      <p className="font-bold text-xs">{partnerFeedback}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
