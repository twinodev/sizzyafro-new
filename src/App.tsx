"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, MapPin, Calendar, Flame, Ticket, Check, User, Instagram, Youtube, 
  Play, Heart, X, Compass, Clock, Award, Users, Zap, Info, Phone, Mail, Plus, 
  DollarSign, MessageSquare, Share2, Send, Eye, ArrowLeft, Gift, MessageCircle, Star, Search, Menu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Asset Import
import heroDanceImg from "./assets/images/hero (1).jpg";
import logoImg from "./assets/images/logo.png";

// Sub-components & Stores
import AdminPanel from "./components/AdminPanel";
import { 
  fetchAllAppData, getDefaultAppData, saveSegment, clearCache, TeamMember, EventItem, BlogPost, 
  MerchandiseItem, VideoItem, Testimonial, ContactMessage, PartnershipApplication, DonationRecord,
  NewsletterSubscription, EventRSVP
} from "./lib/firebaseStore";

export default function App() {
  const [currentView, setCurrentView] = useState<string>("home");
  const [selectedSubItem, setSelectedSubItem] = useState<string | null>(null); // Details page ID

  // Database unified state - Instant load design with fallback data pre-initialized
  const [appState, setAppState] = useState<ReturnType<typeof getDefaultAppData>>(getDefaultAppData());
  const [loading, setLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(true);

  // Interaction Modals
  const [isDonateOpen, setIsDonateOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState<boolean>(false);
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null);
  
  // Submit Forms
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", content: "" });
  const [contactSuccess, setContactSuccess] = useState<string>("");
  
  const [partnerForm, setPartnerForm] = useState({ companyName: "", contactName: "", email: "", partnerType: "Sponsor", message: "" });
  const [partnerSuccess, setPartnerSuccess] = useState<string>("");

  const [testimonialForm, setTestimonialForm] = useState({ author: "", role: "Street Dancer", content: "", rating: 5 });
  const [testimonialSuccess, setTestimonialSuccess] = useState<string>("");

  const [donationForm, setDonationForm] = useState({ donorName: "", amount: 25, project: "Ghetto Youth Sponsorship" });
  const [donationSuccess, setDonationSuccess] = useState<string>("");

  const [newsletterEmail, setNewsletterEmail] = useState<string>("");
  const [newsletterSuccess, setNewsletterSuccess] = useState<string>("");
  const [newsletterError, setNewsletterError] = useState<string>("");
  const [submittingNewsletter, setSubmittingNewsletter] = useState<boolean>(false);

  // Events filter and RSVP states
  const [eventSearchQuery, setEventSearchQuery] = useState<string>("");
  const [eventSelectedCategory, setEventSelectedCategory] = useState<string>("All");
  const [isRsvpOpen, setIsRsvpOpen] = useState<boolean>(false);
  const [rsvpSelectedEvent, setRsvpSelectedEvent] = useState<EventItem | null>(null);
  const [rsvpForm, setRsvpForm] = useState({ name: "", email: "", phone: "", role: "Competitor / Dancer" });
  const [rsvpSuccess, setRsvpSuccess] = useState<string>("");
  const [rsvpError, setRsvpError] = useState<string>("");
  const [submittingRsvp, setSubmittingRsvp] = useState<boolean>(false);

  // Blog dynamic comments state
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null); // For replying
  const [commentInput, setCommentInput] = useState<string>("");
  const [replyInput, setReplyInput] = useState<string>("");
  const [commentAuthor, setCommentAuthor] = useState<string>("");

  // Load Firestore or defaults in the background
  const syncState = async () => {
    try {
      const data = await fetchAllAppData();
      if (data) {
        setAppState(data);
      }
    } catch (err) {
      console.warn("Could not sync Firestore data. Staying with memory defaults.", err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    syncState();
  }, []);

  // Hash deep-linking router
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || "#home";
      setIsMobileMenuOpen(false);

      if (hash.startsWith("#event-detail/")) {
        const id = hash.replace("#event-detail/", "");
        setCurrentView("event-detail");
        setSelectedSubItem(id);
      } else if (hash.startsWith("#post-detail/")) {
        const id = hash.replace("#post-detail/", "");
        setCurrentView("post-detail");
        setSelectedSubItem(id);
      } else if (hash.startsWith("#merch-item/")) {
        const id = hash.replace("#merch-item/", "");
        setCurrentView("merch-item");
        setSelectedSubItem(id);
      } else {
        const view = hash.replace("#", "");
        setCurrentView(view || "home");
        setSelectedSubItem(null);
      }
      window.scrollTo(0, 0);
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Run on mount

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Newsletter Subscription Modal trigger (stayers-on-homepage for over 30 seconds)
  useEffect(() => {
    const isDismissedOrSubscribed = localStorage.getItem("sizzy_newsletter_subscribed_or_dismissed");
    if (isDismissedOrSubscribed) return;

    if (currentView === "home") {
      const timer = setTimeout(() => {
        setIsNewsletterOpen(true);
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, [currentView]);

  // SEO metadata side-effect: dynamically injects titles and page definitions
  useEffect(() => {
    if (!currentView) return;
    let title = "Dance With Sizzy Afro | Elite Street Dance Foundation";
    
    if (currentView === "team") {
      title = "Our Team | Coaches & Dance Crews - Sizzy Afro";
    } else if (currentView === "events") {
      title = "Upcoming Dance Battles, Workshops & Classes | Sizzy Afro";
    } else if (currentView === "blog") {
      title = "Articles & Community News Blog | Dance With Sizzy Afro";
    } else if (currentView === "merchandise") {
      title = "Official Streetwear and Hoodies Merchandise | Sizzy Afro";
    } else if (currentView === "videos") {
      title = "Choreography YouTube Videos & Reels | Sizzy Afro";
    } else if (currentView === "partner") {
      title = "Sponsor or Partner With Us | Sizzy Afro";
    } else if (currentView === "about") {
      title = "About Sizzy Afro | Nurturing & Transforming Youth";
    } else if (currentView === "contact") {
      title = "Contact Sizzy Afro | Classes in Mbarara Lakeside";
    } else if (currentView === "event-detail") {
      const ev = appState?.events.find(e => e.id === selectedSubItem);
      title = ev ? `${ev.title} - Detailed Event Info | Sizzy Afro` : title;
    } else if (currentView === "post-detail") {
      const post = appState?.posts.find(p => p.id === selectedSubItem);
      title = post ? `${post.title} - Read Story | Sizzy Afro` : title;
    } else if (currentView === "admin") {
      title = "Sizzy Afro HQ - System Portal [Crawl-Free]";
    }

    document.title = title;
  }, [currentView, selectedSubItem, appState]);

  // Social interactions (Liking posts)
  const handleLikePost = async (postId: string) => {
    if (!appState) return;
    const updated = appState.posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    });

    setAppState({ ...appState, posts: updated });
    await saveSegment("posts", updated);
  };

  // Create article comment
  const handleAddComment = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!appState || !commentInput.trim()) return;

    const author = commentAuthor.trim() || "Anonymous B-Boy";
    const newComment = {
      id: "comment-" + Date.now().toString(),
      authorName: author,
      content: commentInput.trim(),
      date: new Date().toLocaleDateString(),
      replies: []
    };

    const updated = appState.posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    });

    setAppState({ ...appState, posts: updated });
    setCommentInput("");
    await saveSegment("posts", updated);
  };

  // Add Comment Reply
  const handleAddReply = async (e: React.FormEvent, postId: string, commentId: string) => {
    e.preventDefault();
    if (!appState || !replyInput.trim()) return;

    const author = commentAuthor.trim() || "Anonymous Dancer";
    const newReply = {
      id: "reply-" + Date.now().toString(),
      authorName: author,
      content: replyInput.trim(),
      date: new Date().toLocaleDateString()
    };

    const updated = appState.posts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(c => {
          if (c.id === commentId) {
            return { ...c, replies: [...(c.replies || []), newReply] };
          }
          return c;
        });
        return { ...post, comments: updatedComments };
      }
      return post;
    });

    setAppState({ ...appState, posts: updated });
    setReplyInput("");
    setActiveCommentId(null);
    await saveSegment("posts", updated);
  };

  // Public Leads Form
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appState) return;
    
    const newMsg: ContactMessage = {
      ...contactForm,
      id: "msg-" + Date.now().toString(),
      date: new Date().toLocaleDateString(),
      status: "unread"
    };

    const updated = [...appState.messages, newMsg];
    setAppState({ ...appState, messages: updated });
    setContactForm({ name: "", email: "", subject: "", content: "" });
    setContactSuccess("Your message was received! Sizzy Afro will reply to your inbox.");
    
    await saveSegment("messages", updated);
    setTimeout(() => setContactSuccess(""), 4500);
  };

  // Partnership Application
  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appState) return;

    const newApp: PartnershipApplication = {
      ...partnerForm,
      id: "app-" + Date.now().toString(),
      date: new Date().toLocaleDateString()
    };

    const updated = [...appState.partnershipApplications, newApp];
    setAppState({ ...appState, partnershipApplications: updated });
    setPartnerForm({ companyName: "", contactName: "", email: "", partnerType: "Sponsor", message: "" });
    setPartnerSuccess("Partner application sent successfully! Thank you for standing with us.");

    await saveSegment("partnershipApplications", updated);
    setTimeout(() => setPartnerSuccess(""), 4500);
  };

  // Submit Testimonial
  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appState) return;

    const newTestimonial: Testimonial = {
      id: "test-" + Date.now().toString(),
      author: testimonialForm.author || "Supporter",
      role: testimonialForm.role,
      content: testimonialForm.content,
      rating: testimonialForm.rating,
      approved: false, // Must be approved by admin (though displayed locally for feedback loop)
      date: new Date().toLocaleDateString()
    };

    const updated = [...appState.testimonials, newTestimonial];
    setAppState({ ...appState, testimonials: updated });
    setTestimonialForm({ author: "", role: "Street Dancer", content: "", rating: 5 });
    setTestimonialSuccess("Review submitted! Thank you for sharing your experience.");

    await saveSegment("testimonials", updated);
    setTimeout(() => setTestimonialSuccess(""), 4500);
  };

  // Submit Donate Log
  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appState) return;

    const record: DonationRecord = {
      id: "donation-" + Date.now().toString(),
      donorName: donationForm.donorName || "Anonymous Patron",
      amount: donationForm.amount,
      currency: "USD",
      date: new Date().toLocaleDateString(),
      projectSupported: donationForm.project
    };

    const updated = [...appState.donations, record];
    setAppState({ ...appState, donations: updated });
    setDonationSuccess("Perfect! Your generous sponsorship donation was logged into our Ghetto Youth Foundation ledgers. Direct payment coordinates shared below!");
    
    await saveSegment("donations", updated);
    setTimeout(() => {
      setDonationSuccess("");
      setIsDonateOpen(false);
      setDonationForm({ donorName: "", amount: 25, project: "Ghetto Youth Sponsorship" });
    }, 8000);
  };

  // Submit Newsletter Email
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appState || !newsletterEmail.trim()) return;

    const emailStr = newsletterEmail.trim();
    if (!emailStr.includes("@") || !emailStr.includes(".")) {
      setNewsletterError("Please enter a valid email address.");
      return;
    }

    setSubmittingNewsletter(true);
    setNewsletterError("");

    try {
      const isAlreadySubbed = (appState.newsletter || []).some(
        (sub) => sub.email.toLowerCase() === emailStr.toLowerCase()
      );

      if (isAlreadySubbed) {
        setNewsletterSuccess("You are already subscribed to our newsletter!");
        localStorage.setItem("sizzy_newsletter_subscribed_or_dismissed", "true");
        setTimeout(() => {
          setIsNewsletterOpen(false);
          setNewsletterSuccess("");
          setNewsletterEmail("");
        }, 3000);
        return;
      }

      const newSub: NewsletterSubscription = {
        id: "sub-" + Date.now().toString(),
        email: emailStr,
        date: new Date().toLocaleDateString()
      };

      const updated = [...(appState.newsletter || []), newSub];
      setAppState({ ...appState, newsletter: updated });
      await saveSegment("newsletter", updated);

      setNewsletterSuccess("Thank you! You have subscribed successfully for event alerts.");
      localStorage.setItem("sizzy_newsletter_subscribed_or_dismissed", "true");

      setTimeout(() => {
        setIsNewsletterOpen(false);
        setNewsletterSuccess("");
        setNewsletterEmail("");
      }, 3500);
    } catch (err) {
      console.error(err);
      setNewsletterError("Something went wrong. Please try again.");
    } finally {
      setSubmittingNewsletter(false);
    }
  };

  // Submit Event RSVP
  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appState || !rsvpSelectedEvent) return;

    const { name, email, phone, role } = rsvpForm;
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setRsvpError("Please fill out all fields.");
      return;
    }

    setSubmittingRsvp(true);
    setRsvpError("");

    try {
      const newRsvp: EventRSVP = {
        id: "rsvp-" + Date.now().toString(),
        eventId: rsvpSelectedEvent.id,
        eventTitle: rsvpSelectedEvent.title,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: role,
        date: new Date().toLocaleDateString()
      };

      const updated = [...(appState.rsvps || []), newRsvp];
      setAppState({ ...appState, rsvps: updated });
      await saveSegment("rsvps", updated);

      setRsvpSuccess(`Awesome, ${name.trim()}! You have successfully RSVP'd for ${rsvpSelectedEvent.title}. We look forward to seeing you!`);

      setTimeout(() => {
        setIsRsvpOpen(false);
        setRsvpSuccess("");
        setRsvpForm({ name: "", email: "", phone: "", role: "Competitor / Dancer" });
        setRsvpSelectedEvent(null);
      }, 4000);
    } catch (err) {
      console.error(err);
      setRsvpError("Something went wrong saving your RSVP. Please try again.");
    } finally {
      setSubmittingRsvp(false);
    }
  };

  // Social Share Simulator
  const handleSocialShare = (postId: string, title: string) => {
    const shareText = `Check out this street dance story from Sizzy Afro: "${title}"`;
    const shareUrl = `${window.location.origin}/#/post-detail/${postId}`;
    navigator.clipboard.writeText(shareUrl);
    alert(`The shareable link was successfully copied to your clipboard:\n${shareUrl}`);
  };

  const handleEventShare = (eventId: string, title: string) => {
    const shareUrl = `${window.location.origin}/#/event-detail/${eventId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedEventId(eventId);
    setTimeout(() => {
      setCopiedEventId(null);
    }, 2000);
  };

  // Main loading check (never blocks because appState is pre-initialized with defaults)
  if (!appState) {
    return (
      <div className="min-h-screen bg-[#070a13] flex flex-col items-center justify-center text-center p-6 bg-radial-at-t from-slate-900 via-slate-950 to-black">
        <Sparkles className="text-orange-500 animate-spin mb-4" size={42} />
        <h2 className="text-xl font-display font-black text-white uppercase tracking-widest">Sizzy Afro Pulse</h2>
        <p className="text-xs text-slate-400 mt-1">Nurturing talent, building discipline, transforming lives...</p>
      </div>
    );
  }

  const currentSettings = appState.meta;
  const whatsappUrl = `https://wa.me/${currentSettings.whatsappNumber || "256700000000"}?text=Hello%20Sizzy%20Afro!%20I%20want%20to%20learn%20more%20about%20your%20youth%20dance%20programs%20and%20sponsorships.`;

  return (
    <div className="selection:bg-orange-500 selection:text-black">
      
      {/* FLOATING SOCIAL ACTIONS */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Google review request popup button */}
        <button
          onClick={() => setIsReviewOpen(true)}
          className="w-13 h-13 rounded-full bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition-all text-white flex items-center justify-center shadow-lg border border-indigo-500 cursor-pointer shadow-indigo-600/20"
        >
          <Star className="fill-current text-yellow-300" size={20} />
        </button>

        {/* Floating WhatsApp hotline */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-13 h-13 rounded-full bg-emerald-500 hover:bg-emerald-600 hover:scale-105 transition-all text-white flex items-center justify-center shadow-lg border border-emerald-400 cursor-pointer shadow-emerald-500/20"
        >
          <MessageCircle size={24} className="fill-current text-white" />
        </a>
      </div>

      {/* GLOBAL HEADER BAR */}
      <header className="sticky top-0 left-0 w-full z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900/60 shadow-lg px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3 group">
            <img 
              src={typeof logoImg === "string" ? logoImg : (logoImg as any).src || ""} 
              alt="Dance With Sizzy Afro Logo" 
              className="w-10 h-10 object-cover rounded-xl shadow-md group-hover:rotate-6 transition-all duration-300 border border-slate-800"
            />
            <div>
              <span className="block font-display font-black leading-none text-white tracking-tight uppercase group-hover:text-orange-400 transition-colors">DANCE WITH SIZZY AFRO</span>
              <span className="text-[9px] font-mono font-bold tracking-widest text-orange-500/80">Mbarara • Est 2025</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
            {[
              { id: "about", label: "About" },
              { id: "team", label: "Our Team" },
              { id: "events", label: "Events" },
              { id: "blog", label: "Blog" },
              { id: "merchandise", label: "Shop" },
              { id: "videos", label: "Videos" },
              { id: "testimonials", label: "Reviews" },
              { id: "contact", label: "Contact" },
            ].map((item) => {
              const isActive = currentView === item.id || (item.id === "events" && currentView === "event-detail") || (item.id === "blog" && currentView === "post-detail") || (item.id === "merchandise" && currentView === "merch-item");
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`hover:text-white transition-colors relative py-1 ${isActive ? "text-orange-500" : "text-slate-450"}`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span 
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]" 
                    />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Donate Trigger Button */}
            <button
              onClick={() => setIsDonateOpen(true)}
              className="px-4.5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 active:scale-95 text-black font-extrabold text-[10px] tracking-wider transition-all uppercase shadow-lg shadow-orange-500/10 cursor-pointer"
            >
              DONATE
            </button>

            {/* Admin Backstage Portal shortcut link */}
            <a
              href="#admin"
              className={`hidden sm:inline-flex items-center justify-center p-2.5 rounded-xl border transition ${
                currentView === "admin"
                  ? "bg-orange-500/10 border-orange-500/50 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.15)]"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
              title="Sizzy Studio Coordinator Portal"
            >
              <Zap size={14} />
            </a>

            {/* Responsive Menu Hamburg */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 text-slate-300 hover:text-white lg:hidden border border-slate-800 bg-slate-900/60 rounded-xl cursor-pointer transition-colors active:scale-95"
            >
              {isMobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE EXPANDED MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b border-slate-900/80 bg-slate-950 p-6 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4 text-xs font-black uppercase text-slate-350">
              {[
                { id: "about", label: "About" },
                { id: "team", label: "Our Team" },
                { id: "events", label: "Events" },
                { id: "blog", label: "Blog" },
                { id: "merchandise", label: "Shop" },
                { id: "videos", label: "Videos" },
                { id: "testimonials", label: "Reviews" },
                { id: "contact", label: "Contact" },
              ].map((item) => {
                const isActive = currentView === item.id || (item.id === "events" && currentView === "event-detail") || (item.id === "blog" && currentView === "post-detail") || (item.id === "merchandise" && currentView === "merch-item");
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`hover:text-white transition-colors ${isActive ? "text-orange-500 font-black" : "text-slate-400"}`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PARTNERS SCROLLING STRIP */}
      <div className="w-full bg-slate-950 border-y border-slate-900 overflow-hidden py-4 shrink-0">
        <div className="animate-scroll">
          {[...appState.partnerLogos, ...appState.partnerLogos, ...appState.partnerLogos].map((partner, idx) => (
            <div key={`${partner.id}-${idx}`} className="flex items-center gap-2 px-8 py-1 shrink-0 border-r border-slate-900/60">
              <img src={partner.logo_url} alt={partner.name} className="h-6 object-contain opacity-55 hover:opacity-100 transition-opacity" />
              <span className="font-mono text-[9px] text-slate-500 tracking-wider uppercase font-extrabold">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN VIEWPORT BODY */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* PAGE 1: HOME PANEL */}
        {currentView === "home" && (
          <div className="space-y-16">
            
            {/* HERO MODULE SECTION */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/40 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-slate-800/80 relative overflow-hidden">
              {/* Decorative Spotlight Radiants */}
              <div className="absolute top-0 left-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="col-span-1 lg:col-span-6 space-y-6 relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full font-mono text-[10px] tracking-widest font-black uppercase">
                  <Flame size={12} className="animate-bounce" />
                  <span>Empowering Youth through street choreography</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight leading-none text-white uppercase">
                  DANCE WITH <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 shadow-sm">SIZZY AFRO</span>
                </h1>

                <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                  A premium youth-focused dance organization in Mbarara, Uganda, dedicated to transforming street children, orphans, and beginner dancers into global artistic performers. Founded from the pure passion to foster discipline, creativity, and elite talent.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <a
                    href="#events"
                    className="w-full sm:w-auto px-7 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider text-center cursor-pointer shadow-lg hover:shadow-orange-500/20 active:scale-98 transition-all hover:scale-[1.02]"
                  >
                    REGISTER FOR WORKSHOP NOW
                  </a>
                  <a
                    href="#about"
                    className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-950/60 border border-slate-800 text-white font-extrabold text-xs uppercase tracking-wider text-center cursor-pointer hover:bg-slate-900 hover:border-slate-700 transition-all active:scale-98"
                  >
                    OUR STORY (2025)
                  </a>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/60">
                  <div>
                    <span className="block text-3xl font-display font-black text-white">450+</span>
                    <span className="text-[10px] text-slate-450 font-mono uppercase tracking-widest block font-bold mt-1">Youth Empowered</span>
                  </div>
                  <div>
                    <span className="block text-3xl font-display font-black text-white">12+</span>
                    <span className="text-[10px] text-slate-450 font-mono uppercase tracking-widest block font-bold mt-1">Dance Trophies</span>
                  </div>
                  <div>
                    <span className="block text-3xl font-display font-black text-white">Mbarara</span>
                    <span className="text-[10px] text-slate-450 font-mono uppercase tracking-widest block font-bold mt-1">Uganda Base</span>
                  </div>
                </div>
              </div>

              {/* Display Image */}
              <div className="col-span-1 lg:col-span-6 relative h-[400px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
                <img
                  src={typeof heroDanceImg === "string" ? heroDanceImg : (heroDanceImg as any).src || ""}
                  alt="Twinomujuni Emmanuel Sizzy Afro Street Choreography"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md border border-slate-800/80 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-mono text-orange-400 font-black uppercase tracking-wider">Humble Street Roots</span>
                    <span className="block text-xs font-black text-white">Twinomujuni Emmanuel (Sizzy Afro)</span>
                  </div>
                  <PinIcon text="Lakeside" />
                </div>
              </div>
            </section>

            {/* CORE ORGANIZATIONAL CORE VALUES */}
            <section className="space-y-6 bg-slate-900/10 p-8 rounded-3xl border border-slate-850/60">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs text-amber-500 font-mono uppercase font-black tracking-wider">Our Backbone</span>
                <h3 className="text-2xl font-display font-black text-white uppercase mt-1">Our Core Values</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ValueCard title="Discipline" text="Commitment, punctuality, and responsibility in life and dance." icon="🏆" />
                <ValueCard title="Integrity" text="Honesty and professional ethics in all outreach and battle matches." icon="🤝" />
                <ValueCard title="Creativity" text="Encouraging artistic innovation and traditional Afro fusion." icon="💡" />
                <ValueCard title="Teamwork" text="Building deep unity, respect, and mutual crew security." icon="👥" />
                <ValueCard title="Diversity & Inclusion" text="Welcoming all children, ages, and backgrounds unconditionally." icon="🌍" />
                <ValueCard title="Excellence" text="Striving for high standards in choreographic performance." icon="✨" />
              </div>
            </section>

            {/* QUICK FEATURED SECTIONS ROW */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box 1: Scheduled Workshops */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden group">
                <span className="text-[9px] font-mono text-orange-400 font-black tracking-wider block mb-2 uppercase">Training Schedules</span>
                <h4 className="text-xl font-display font-black text-white uppercase">Upcoming Workshops</h4>
                <p className="text-xs text-slate-400 mt-1 mb-4">View scheduled Saturdays, street clashes, and choreography programs in Mbarara.</p>
                <div className="space-y-3">
                  {appState.events.slice(0, 2).map(ev => {
                    const currentRsvps = (appState?.rsvps || []).filter((r) => r.eventId === ev.id).length;
                    const capacity = ev.capacity || 150;
                    const spotsLeft = Math.max(0, capacity - currentRsvps);
                    const isFull = currentRsvps >= capacity;
                    const isFewSpots = !isFull && spotsLeft > 0 && (spotsLeft <= 15 || currentRsvps / capacity >= 0.85);

                    return (
                      <div key={ev.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 flex items-center justify-between">
                        <div>
                          <span className="block text-xs font-bold text-white uppercase leading-tight">{ev.title}</span>
                          <span className="text-[9px] text-slate-400 font-mono">
                            {ev.date} - {ev.time} • {isFull ? (
                              <span className="text-rose-400 font-extrabold animate-pulse">FULL</span>
                            ) : isFewSpots ? (
                              <span className="text-amber-400 font-extrabold">Few Spots Left ({spotsLeft} left)</span>
                            ) : (
                              <span className="text-emerald-400 font-bold">Open</span>
                            )}
                          </span>
                        </div>
                        <a href={`#/event-detail/${ev.id}`} className="p-2 bg-orange-500 text-black text-[9px] font-black rounded-lg uppercase shrink-0 ml-2">VIEW Flyer</a>
                      </div>
                    );
                  })}
                </div>
                <a href="#events" className="inline-flex items-center gap-1 text-xs text-orange-400 hover:text-white font-bold mt-4 font-mono">
                  EXPLORE ALL SESSIONS <ArrowLeft size={12} className="rotate-180" />
                </a>
              </div>

              {/* Box 2: Latest Articles blog */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden group">
                <span className="text-[9px] font-mono text-amber-500 font-black tracking-wider block mb-2 uppercase">Inspirational stories</span>
                <h4 className="text-xl font-display font-black text-white uppercase">The Street dancer Read</h4>
                <p className="text-xs text-slate-400 mt-1 mb-4">Learn how urban dance serves as a tool for leadership, empowerment, and change.</p>
                <div className="space-y-3">
                  {appState.posts.slice(0, 2).map(post => (
                    <div key={post.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 flex items-center justify-between">
                      <div>
                        <span className="block text-xs font-bold text-white leading-tight uppercase">{post.title}</span>
                        <span className="text-[9px] text-slate-500 font-mono">By {post.author}</span>
                      </div>
                      <a href={`#post-detail/${post.id}`} className="text-xs text-amber-500 hover:text-white font-bold p-1"><Eye size={14} /></a>
                    </div>
                  ))}
                </div>
                <a href="#blog" className="inline-flex items-center gap-1 text-xs text-amber-500 hover:text-white font-bold mt-4 font-mono">
                  VIEW FULL STREET READ <ArrowLeft size={12} className="rotate-180" />
                </a>
              </div>
            </section>
          </div>
        )}

        {/* PAGE 2: ABOUT / SIZZY STORY  */}
        {currentView === "about" && (
          <section className="space-y-12 max-w-4xl mx-auto">
            <div className="text-center space-y-3">
              <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full font-mono text-[10px] tracking-widest font-black uppercase">Official Profile 2025</span>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-white uppercase">About Dance With Sizzy Afro</h2>
              <p className="text-xs text-slate-400 tracking-wide">Learn of our roots, our mission objectives, and who we welcome in Mbarara.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900/10 border border-slate-850 p-6 rounded-3xl">
              <div className="space-y-4">
                <h3 className="text-xl font-display font-black text-orange-400 uppercase">The Founders Vision</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Founded in **2025** by **Twinomujuni Emmanuel (Sizzy Afro)**, our organization is modeled around nurturing pure raw street skill, providing high-standard choreography training, and introducing critical life structures of discipline and excellence to young people, and rescue ghetto youth in Mbarara from addictions and poverty.
                </p>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 font-mono text-[11px] text-slate-400 space-y-1">
                  <div><strong>Founder:</strong> Twinomujuni Emmanuel (Sizzy Afro)</div>
                  <div><strong>Established:</strong> 2025</div>
                  <div><strong>Headquarters:</strong> Mbarara City, Uganda</div>
                </div>
              </div>
              <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-800">
                <img src="https://picsum.photos/seed/sizzyemmanuel/600/600" alt="Headshot" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Vision & Mission bento cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <Compass className="text-orange-500" size={28} />
                <h4 className="font-display font-black text-white uppercase text-base">Our Vision</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "To become Africa's leading dance community, inspiring young people through creativity, culture, education, and excellence in dance."
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <Award className="text-amber-500" size={28} />
                <h4 className="font-display font-black text-white uppercase text-base">Our Mission</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "To empower individuals through high quality dance training, performance opportunities, and creative expression while promoting cultural appreciation, personal growth, and community development."
                </p>
              </div>
            </div>

            {/* Demographics We Welcome */}
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-850">
              <h4 className="font-display font-black text-white text-sm uppercase tracking-wider mb-4 border-b border-slate-850 pb-2">We Proudly Welcome</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-2"><Check className="text-orange-500 shrink-0" size={14} /> <span>Children & Youth</span></div>
                <div className="flex items-center gap-2"><Check className="text-orange-500 shrink-0" size={14} /> <span>Beginner & Pro Dancers</span></div>
                <div className="flex items-center gap-2"><Check className="text-orange-500 shrink-0" size={14} /> <span>Schools & Institutions</span></div>
                <div className="flex items-center gap-2"><Check className="text-orange-500 shrink-0" size={14} /> <span>Dance Crews & Communities</span></div>
                <div className="flex items-center gap-2"><Check className="text-orange-500 shrink-0" size={14} /> <span>Parents of Young Talent</span></div>
                <div className="flex items-center gap-2"><Check className="text-orange-500 shrink-0" size={14} /> <span>Sponsors of Street Youth</span></div>
              </div>
            </div>
          </section>
        )}

        {/* PAGE 3: OUR TEAM LIST   */}
        {currentView === "team" && (
          <section className="space-y-10">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs text-orange-500 font-mono uppercase font-black">Coaches & Mentors</span>
              <h2 className="text-3xl font-display font-black text-white uppercase">The Sizzy Afro Choreography Crew</h2>
              <p className="text-xs text-slate-400">Our instructors are experienced dance creators trained to empower youth, build discipline, and bring excellence to live battle matches.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {appState.team.map((member) => (
                <div key={member.id} className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between overflow-hidden relative group">
                  <div className="space-y-4">
                    <div className="relative h-56 rounded-xl overflow-hidden border border-slate-800">
                      <img src={member.profile_picture} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-white text-base uppercase leading-tight">{member.name}</h3>
                      <span className="text-[11px] font-bold text-orange-400 uppercase block font-mono">{member.role}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{member.bio}</p>
                    
                    {member.achievements && (
                      <div className="pt-2.5 border-t border-slate-850/60">
                        <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-wider font-extrabold mb-1">Major Accomplishments:</span>
                        <p className="text-[10px] text-amber-500 font-medium leading-tight">{member.achievements}</p>
                      </div>
                    )}
                  </div>

                  {member.instagram && (
                    <div className="pt-4 mt-4 border-t border-slate-850/60 flex justify-end">
                      <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-950 text-slate-400 hover:text-white rounded-xl border border-slate-850 hover:border-orange-500/20 transition-all">
                        <Instagram size={14} />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PAGE 4: CLASSES & CONTESTS EVENTS LIST  */}
        {currentView === "events" && (
          <section className="space-y-8">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs text-orange-500 font-mono font-black">Calendar schedule</span>
              <h2 className="text-3xl font-display font-black text-white uppercase">Sizzy Battles, Workshops & Training</h2>
              <p className="text-xs text-slate-400">Join our local scheduled workshops, high-octane breaking battles, and community outreach training camps.</p>
            </div>

            {/* SEARCH & FILTERS CONTROLS */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl mx-auto">
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  placeholder="Search events, battles..."
                  value={eventSearchQuery}
                  onChange={(e) => setEventSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              </div>

              <div className="flex flex-wrap gap-1.5 justify-center">
                {["All", "Battle", "Workshop", "Class", "Outreach"].map((cat) => {
                  const count = (appState?.events || []).filter((e) => {
                    const c = e.category || (
                      e.title.toLowerCase().includes("battle") || e.title.toLowerCase().includes("clash") || e.title.toLowerCase().includes("contest") || e.title.toLowerCase().includes("jam") ? "Battle" :
                      e.title.toLowerCase().includes("workshop") || e.description.toLowerCase().includes("workshop") ? "Workshop" :
                      e.title.toLowerCase().includes("class") || e.title.toLowerCase().includes("training") || e.description.toLowerCase().includes("class") ? "Class" : "Outreach"
                    );
                    return cat === "All" || c.toLowerCase() === cat.toLowerCase();
                  }).length;

                  return (
                    <button
                      key={cat}
                      onClick={() => setEventSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        eventSelectedCategory === cat
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 border-transparent text-black font-extrabold"
                          : "bg-slate-950 hover:bg-slate-900 text-slate-400 border-slate-800 font-semibold"
                      }`}
                    >
                      {cat === "All" ? "All Events" : cat === "Class" ? "Classes" : cat + "s"}
                      <span className={`ml-1 font-mono text-[10px] ${eventSelectedCategory === cat ? "text-slate-900 font-extrabold" : "text-slate-500"}`}>({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* EVENT LISTING GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(() => {
                const eventsToRender = (appState?.events || []).filter((ev) => {
                  const cat = ev.category || (
                    ev.title.toLowerCase().includes("battle") || ev.title.toLowerCase().includes("clash") || ev.title.toLowerCase().includes("contest") || ev.title.toLowerCase().includes("jam") ? "Battle" :
                    ev.title.toLowerCase().includes("workshop") || ev.description.toLowerCase().includes("workshop") ? "Workshop" :
                    ev.title.toLowerCase().includes("class") || ev.title.toLowerCase().includes("training") || ev.description.toLowerCase().includes("class") ? "Class" : "Outreach"
                  );

                  const matchesCategory = eventSelectedCategory === "All" || cat.toLowerCase() === eventSelectedCategory.toLowerCase();
                  
                  const matchesSearch = ev.title.toLowerCase().includes(eventSearchQuery.toLowerCase()) || 
                                        ev.description.toLowerCase().includes(eventSearchQuery.toLowerCase()) || 
                                        ev.location.toLowerCase().includes(eventSearchQuery.toLowerCase());

                  return matchesCategory && matchesSearch;
                });

                if (eventsToRender.length === 0) {
                  return (
                    <div className="col-span-1 md:col-span-2 py-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
                      <p className="text-sm font-bold text-slate-300">No events found matching your search</p>
                      <button onClick={() => { setEventSearchQuery(""); setEventSelectedCategory("All"); }} className="px-4 py-1.5 bg-slate-950 border border-slate-850 hover:text-white rounded-xl text-xs text-slate-400 font-bold transition-all cursor-pointer">Clear filters</button>
                    </div>
                  );
                }

                return eventsToRender.map((ev) => {
                  const cat = ev.category || (
                    ev.title.toLowerCase().includes("battle") || ev.title.toLowerCase().includes("clash") || ev.title.toLowerCase().includes("contest") || ev.title.toLowerCase().includes("jam") ? "Battle" :
                    ev.title.toLowerCase().includes("workshop") || ev.description.toLowerCase().includes("workshop") ? "Workshop" :
                    ev.title.toLowerCase().includes("class") || ev.title.toLowerCase().includes("training") || ev.description.toLowerCase().includes("class") ? "Class" : "Outreach"
                  );

                  const price = ev.price || "Free Entry";
                  const capacity = ev.capacity || 150;
                  const currentRsvps = (appState?.rsvps || []).filter((r) => r.eventId === ev.id).length;
                  const spotsLeft = Math.max(0, capacity - currentRsvps);
                  const isFull = currentRsvps >= capacity;
                  const isFewSpots = !isFull && spotsLeft > 0 && (spotsLeft <= 15 || currentRsvps / capacity >= 0.85);

                  return (
                    <div key={ev.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 items-center hover:border-slate-700/60 transition-all group">
                      <div className="lg:col-span-5 h-44 rounded-xl overflow-hidden border border-slate-800 relative bg-slate-950">
                        <img src={ev.flyer_url} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        
                        {/* Dynamic Category Pill on image */}
                        <span className={`absolute top-2 left-2 px-2 py-0.5 text-[8px] font-mono font-black uppercase rounded border z-10 ${
                          cat === "Battle" ? "bg-red-500/20 border-red-500/40 text-red-400 backdrop-blur-md" :
                          cat === "Workshop" ? "bg-amber-500/20 border-amber-500/40 text-amber-400 backdrop-blur-md" :
                          cat === "Class" ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 backdrop-blur-md" :
                          "bg-sky-500/20 border-sky-500/40 text-sky-400 backdrop-blur-md"
                        }`}>
                          {cat}
                        </span>

                        {/* Dynamic Registration Full / Few Spots Badge */}
                        {isFull ? (
                          <span className="absolute top-2 right-2 px-2 py-0.5 text-[8px] font-mono font-black uppercase rounded border bg-rose-600/90 border-rose-500 text-white backdrop-blur-md animate-pulse shadow-md z-10">
                            Registration Full
                          </span>
                        ) : isFewSpots ? (
                          <span className="absolute top-2 right-2 px-2 py-0.5 text-[8px] font-mono font-black uppercase rounded border bg-amber-500/90 border-amber-400 text-black font-extrabold shadow-md z-10">
                            Few Spots Left! ({spotsLeft} left)
                          </span>
                        ) : (
                          <span className="absolute top-2 right-2 px-2 py-0.5 text-[8px] font-mono font-black uppercase rounded border bg-emerald-500/20 border-emerald-500/40 text-emerald-400 backdrop-blur-md shadow-md z-10">
                            Spots Open
                          </span>
                        )}

                        {/* Price Tag */}
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 text-[8px] font-mono font-black uppercase bg-slate-950/80 backdrop-blur-md border border-slate-800 text-white rounded">
                          {price}
                        </span>
                      </div>
                      
                      <div className="lg:col-span-7 p-1 flex flex-col justify-between h-full space-y-3">
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-[9px] font-mono font-bold text-orange-400 uppercase rounded-full">{ev.date}</span>
                          <h3 className="text-sm font-display font-black text-white uppercase leading-tight group-hover:text-orange-500 transition-colors">{ev.title}</h3>
                          <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">{ev.description}</p>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-slate-850">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <div className="flex items-center gap-1.5">
                              <Clock size={11} className="text-amber-500" />
                              <span>{ev.time}</span>
                            </div>
                            <span className={`text-[9px] font-mono ${isFull ? "text-rose-400 font-bold" : "text-slate-500"}`}>
                              {currentRsvps}/{capacity} filled ({spotsLeft} remaining)
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                            <MapPin size={11} className="text-orange-500" />
                            <span className="line-clamp-1">{ev.location}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-1">
                          {ev.cta_link === "#rsvp" ? (
                            <button
                              onClick={() => {
                                if (isFull) return;
                                setRsvpSelectedEvent(ev);
                                setIsRsvpOpen(true);
                              }}
                              disabled={isFull}
                              className={`flex-1 py-1.8 rounded-lg text-[10px] font-black uppercase text-center block transition-all ${
                                isFull
                                  ? "bg-slate-800 text-slate-500 border border-slate-700/40 cursor-not-allowed"
                                  : "bg-gradient-to-r from-orange-500 to-amber-500 text-black hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                              }`}
                            >
                              {isFull ? "REGISTRATION FULL" : ev.cta_text}
                            </button>
                          ) : (
                            <a
                              href={ev.cta_link}
                              className="flex-1 py-1.8 bg-gradient-to-r from-orange-500 to-amber-500 text-black hover:scale-[1.02] active:scale-[0.98] rounded-lg text-[10px] font-black uppercase text-center block transition-transform"
                            >
                              {ev.cta_text}
                            </a>
                          )}
                          <a
                            href={`#/event-detail/${ev.id}`}
                            className="py-1.8 px-3 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg text-[10px] font-bold text-center block"
                          >
                            Flyer Info
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </section>
        )}

        {/* EVENT DETAILS VIEW (SEO ADDRESSABLE) */}
        {currentView === "event-detail" && (
          <div className="max-w-2xl mx-auto space-y-6">
            {(() => {
              const ev = appState.events.find(e => e.id === selectedSubItem);
              if (!ev) {
                return (
                  <div className="text-center p-8 bg-slate-900 rounded-3xl">
                    <p className="text-xs text-slate-400">Event flyer not found or recently archived.</p>
                    <a href="#events" className="text-orange-400 text-xs underline font-bold mt-2 inline-block">Return to calendar</a>
                  </div>
                );
              }

              const currentRsvps = (appState?.rsvps || []).filter((r) => r.eventId === ev.id).length;
              const capacity = ev.capacity || 150;
              const spotsLeft = Math.max(0, capacity - currentRsvps);
              const isFull = currentRsvps >= capacity;
              const isFewSpots = !isFull && spotsLeft > 0 && (spotsLeft <= 15 || currentRsvps / capacity >= 0.85);
              const price = ev.price || "Free Entry";

              return (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <a href="#events" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white font-bold transition-colors">
                      <ArrowLeft size={12} />
                      <span>Back to Calendar</span>
                    </a>
                    <button
                      onClick={() => handleEventShare(ev.id, ev.title)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700/80 text-slate-200 hover:text-white text-[11px] rounded-xl font-bold border border-slate-700/50 transition-all cursor-pointer"
                    >
                      <Share2 size={12} className={copiedEventId === ev.id ? "text-emerald-400" : ""} />
                      <span>{copiedEventId === ev.id ? "Copied Link!" : "Share Event"}</span>
                    </button>
                  </div>

                  <div className="relative h-[280px] rounded-2xl overflow-hidden border border-slate-800">
                    <img src={ev.flyer_url} alt={ev.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-[9px] rounded-full uppercase tracking-wider font-extrabold">{ev.date}</span>
                      {isFull ? (
                        <span className="px-2.5 py-1 bg-rose-600/20 border border-rose-500/40 text-rose-400 font-mono text-[9px] rounded-full uppercase tracking-wider font-extrabold animate-pulse">
                          Registration Full
                        </span>
                      ) : isFewSpots ? (
                        <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono text-[9px] rounded-full uppercase tracking-wider font-extrabold">
                          Few Spots Left! ({spotsLeft} left)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[9px] rounded-full uppercase tracking-wider font-extrabold">
                          Spots Open
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-display font-black text-white uppercase">{ev.title}</h2>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">{ev.description}</p>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850/60 space-y-2">
                    <h4 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">Venue & Schedule details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                      <div><strong>Location:</strong> {ev.location}</div>
                      <div><strong>Timing:</strong> {ev.time}</div>
                      <div><strong>Ticket Price:</strong> {price}</div>
                      <div><strong>Spots Filled:</strong> {currentRsvps}/{capacity} ({spotsLeft} remaining)</div>
                    </div>
                  </div>

                  {ev.cta_link === "#rsvp" ? (
                    <button
                      onClick={() => {
                        if (isFull) return;
                        setRsvpSelectedEvent(ev);
                        setIsRsvpOpen(true);
                      }}
                      disabled={isFull}
                      className={`w-full py-3.5 text-center block rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                        isFull
                          ? "bg-slate-800 text-slate-500 border border-slate-700/40 cursor-not-allowed"
                          : "bg-gradient-to-r from-orange-500 to-amber-500 text-black hover:scale-[1.01] cursor-pointer"
                      }`}
                    >
                      {isFull ? "REGISTRATION FULL" : ev.cta_text}
                    </button>
                  ) : (
                    <a
                      href={ev.cta_link}
                      className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-black text-center block rounded-xl font-black text-xs uppercase tracking-wider"
                    >
                      {ev.cta_text}
                    </a>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* PAGE 5: STREET BLOG ROLL   */}
        {currentView === "blog" && (
          <section className="space-y-10">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs text-orange-500 font-mono font-black">Community Chronicles</span>
              <h2 className="text-3xl font-display font-black text-white uppercase">The Sizzy Afro Chronicles</h2>
              <p className="text-xs text-slate-400">Discover urban street dance culture, tutorials on Amapiano locks, and motivational letters of ghetto transformation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {appState.posts.map((post) => (
                <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between group">
                  <div>
                    <div className="relative h-52 rounded-b-2xl overflow-hidden border-b border-slate-800">
                      <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-orange-400 text-[8px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded-md uppercase">
                        {post.category}
                      </span>
                    </div>

                    <div className="p-5 space-y-3">
                      <span className="text-[9px] font-mono text-slate-500">By {post.author} • {post.date}</span>
                      <h3 className="text-base font-display font-black text-white leading-tight uppercase group-hover:text-orange-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-snug line-clamp-3">{post.excerpt}</p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-850/60 mt-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Heart size={14} className="fill-current text-rose-500" />
                        <span>{post.likes}</span>
                      </button>

                      <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                        <MessageSquare size={14} />
                        <span>{post.comments.length}</span>
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSocialShare(post.id, post.title)}
                        className="p-1.5 bg-slate-950 border border-slate-850 text-slate-400 hover:text-white rounded-lg"
                        title="Share on socials"
                      >
                        <Share2 size={13} />
                      </button>
                      <a
                        href={`#/post-detail/${post.id}`}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 text-white border border-slate-850 text-[10px] font-extrabold uppercase"
                      >
                        Read Story
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* BLOG POST DETAILS (SEO & COMMENT ENGAGEMENTS) */}
        {currentView === "post-detail" && (
          <div className="max-w-3xl mx-auto space-y-8">
            {(() => {
              const post = appState.posts.find(p => p.id === selectedSubItem);
              if (!post) {
                return (
                  <div className="text-center p-8 bg-slate-900 rounded-3xl">
                    <p className="text-xs text-slate-400">Chronicle article has been archived.</p>
                    <a href="#blog" className="text-orange-400 text-xs underline font-bold mt-2 block">Return to blog</a>
                  </div>
                );
              }

              return (
                <div className="space-y-8">
                  <a href="#blog" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-bold">
                    <ArrowLeft size={13} />
                    <span>Back to Chronicles</span>
                  </a>

                  {/* Header cover */}
                  <div className="relative h-64 sm:h-96 rounded-3xl overflow-hidden border border-slate-800">
                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                    <span className="absolute bottom-4 left-4 bg-orange-500 text-black text-[9px] font-black uppercase font-mono px-3 py-1 rounded-md">
                      {post.category}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-mono text-slate-400">Written by <strong>{post.author}</strong> on {post.date}</span>
                    <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase">{post.title}</h2>
                  </div>

                  {/* Render content safely supporting custom markdown links and styled formatting */}
                  <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-6 rounded-3xl border border-slate-850/60 whitespace-pre-line font-sans">
                    {post.content}
                  </div>

                  {/* Comment & Reply System Section */}
                  <div className="space-y-6 pt-6 border-t border-slate-850">
                    <h3 className="text-lg font-display font-black text-white uppercase flex items-center gap-2">
                      <MessageSquare size={18} className="text-orange-500" />
                      <span>Chronicle Comments ({post.comments.length})</span>
                    </h3>

                    {/* Comment Sub Form */}
                    <form onSubmit={(e) => handleAddComment(e, post.id)} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-3">
                      <h4 className="text-[10px] font-mono text-orange-400 font-extrabold uppercase uppercase">Add your comment</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Your Nickname (e.g. B-Boy Simon)"
                          value={commentAuthor}
                          onChange={(e) => setCommentAuthor(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-white shadow-inner outline-none"
                        />
                      </div>
                      <textarea
                        placeholder="Type your reaction, question, or show support for the dance movement here..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-white h-20 outline-none resize-none"
                        required
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-black rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer"
                      >
                        SUBMIT COMMENT
                      </button>
                    </form>

                    {/* Feed list */}
                    <div className="space-y-4">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="p-4 bg-slate-900/60 border border-slate-850 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-white">{comment.authorName}</span>
                            <span className="text-[9px] font-mono text-slate-500">{comment.date}</span>
                          </div>
                          <p className="text-xs text-slate-300 font-sans">{comment.content}</p>

                          {/* Render Comment Replies if any */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="pl-4 border-l border-slate-800 space-y-2 mt-2">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-extrabold text-orange-400">{reply.authorName}</span>
                                    <span className="text-[8px] font-mono text-slate-500">{reply.date}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-300 font-sans">{reply.content}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Toggle active reply box */}
                          {activeCommentId === comment.id ? (
                            <form onSubmit={(e) => handleAddReply(e, post.id, comment.id)} className="space-y-2 pt-2.5 border-t border-slate-850 mt-2.5">
                              <input
                                type="text"
                                placeholder="Your Nickname"
                                value={commentAuthor}
                                onChange={(e) => setCommentAuthor(e.target.value)}
                                className="w-full sm:max-w-xs px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-[10.5px] text-white outline-none"
                              />
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Type your reply..."
                                  value={replyInput}
                                  onChange={(e) => setReplyInput(e.target.value)}
                                  className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-[11px] text-white outline-none"
                                  required
                                />
                                <button type="submit" className="px-3 bg-orange-500 text-black rounded-md text-[9px] font-black uppercase">Send</button>
                                <button type="button" onClick={() => setActiveCommentId(null)} className="px-2 bg-slate-800 text-white rounded-md text-[9px] font-bold">Cancel</button>
                              </div>
                            </form>
                          ) : (
                            <button
                              onClick={() => {
                                setActiveCommentId(comment.id);
                                setReplyInput("");
                              }}
                              className="text-[10px] text-orange-400 hover:text-white transition-colors font-bold uppercase cursor-pointer"
                            >
                              [ REPLY ]
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* PAGE 6: MERCH GEAR   */}
        {currentView === "merchandise" && (
          <section className="space-y-10">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs text-orange-500 font-mono font-black">Support the Movement</span>
              <h2 className="text-3xl font-display font-black text-white uppercase">The Sizzy Afro Street Gear</h2>
              <p className="text-xs text-slate-400">Nurture talent and fund street food and sponsorships. 100% of profits are directly allocated to our Ghetto Youth Empowerment initiative.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appState.merchandise.map((item) => (
                <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-4 flex flex-col justify-between group h-[420px]">
                  <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-800">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
                  </div>

                  <div className="space-y-2 mt-4">
                    <h3 className="font-display font-black text-white text-sm uppercase leading-tight line-clamp-1">{item.name}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-850 flex items-center justify-between">
                    <div>
                      <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-none">Price:</span>
                      <span className="text-md font-black text-emerald-400 font-mono">${item.price.toFixed(2)}</span>
                    </div>

                    <a
                      href={`#/merch-item/${item.id}`}
                      className="px-4 py-2 rounded-xl bg-orange-500 text-black text-[10px] font-extrabold uppercase transition-all"
                    >
                      CHOOSE SIZE & CO
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MERCHANDISE ITEM DETAILED SUBVIEW */}
        {currentView === "merch-item" && (
          <div className="max-w-2xl mx-auto space-y-6">
            {(() => {
              const item = appState.merchandise.find(m => m.id === selectedSubItem);
              if (!item) {
                return (
                  <div className="text-center p-8 bg-slate-900 rounded-3xl">
                    <p className="text-xs text-slate-400">This apparel listing was recently archived.</p>
                    <a href="#merchandise" className="text-orange-400 text-xs underline font-bold mt-2 block">Return to shop</a>
                  </div>
                );
              }

              return (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-5 h-64 rounded-xl overflow-hidden border border-slate-800">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="md:col-span-7 flex flex-col justify-between h-full space-y-4">
                    <div className="space-y-2">
                      <a href="#merchandise" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white font-bold mb-1">
                        <ArrowLeft size={12} />
                        <span>Back to Shop</span>
                      </a>
                      <h2 className="text-xl font-display font-black text-white uppercase leading-snug">{item.name}</h2>
                      <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Pricing:</span>
                      <span className="text-lg font-black text-emerald-400 font-mono">${item.price.toFixed(2)}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Available Sizes:</span>
                      <div className="flex gap-2">
                        {["S", "M", "L", "XL"].map(sz => (
                          <span key={sz} className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-mono font-bold text-slate-300">
                            {sz}
                          </span>
                        ))}
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/256700000000?text=Hi%20Sizzy%20Afro!%20I%20want%20to%20order%2520the%2520${encodeURIComponent(item.name)}%2520for%2520$${item.price}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-black rounded-xl font-black text-xs uppercase tracking-wider text-center block shadow-lg cursor-pointer"
                    >
                      Instant Purchase via WhatsApp
                    </a>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* PAGE 7: VIDEO CHOREOGRAPHIES REELS     */}
        {currentView === "videos" && (
          <section className="space-y-10">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs text-orange-500 font-mono font-black">Choreography Arena</span>
              <h2 className="text-3xl font-display font-black text-white uppercase">Sizzy Videos & Reels</h2>
              <p className="text-xs text-slate-400">Watch our latest outdoor street choreographies and high-octane battle matches recorded live in Uganda.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {appState.videos.map((vid) => (
                <div key={vid.id} className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-850/60 shadow-inner bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${vid.youtube_id}`}
                      title={vid.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-white text-xs uppercase leading-tight">{vid.title}</h3>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">{vid.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PAGE 8: TESTIMONIALS & FEEDBACK   */}
        {currentView === "testimonials" && (
          <section className="space-y-10 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <span className="text-xs text-orange-500 font-mono font-black">Advocate Testimonials</span>
              <h2 className="text-3xl font-display font-black text-white uppercase">The Voice of the Kampala Community</h2>
              <p className="text-xs text-slate-400">Read inspiring words from local parents, high school administrators, and dance athletes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Submission Form */}
              <form onSubmit={handleTestimonialSubmit} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 h-fit">
                <h4 className="text-xs font-mono font-black text-orange-400 uppercase tracking-wider">Leave your feedback review</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Brenda Atwine"
                      value={testimonialForm.author}
                      onChange={(e) => setTestimonialForm({...testimonialForm, author: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-white shadow-inner"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Your Role / Relation</label>
                    <input
                      type="text"
                      placeholder="e.g. Parent / Dancer"
                      value={testimonialForm.role}
                      onChange={(e) => setTestimonialForm({...testimonialForm, role: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Star rating (1 to 5 Stars)</label>
                  <select
                    value={testimonialForm.rating}
                    onChange={(e) => setTestimonialForm({...testimonialForm, rating: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white cursor-pointer select-element"
                  >
                    {[5, 4, 3, 2, 1].map(r => (
                      <option key={r} value={r}>{"★".repeat(r)} ({r} Stars)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Content review message</label>
                  <textarea
                    placeholder="Describe how classes, battles, or Twinomujuni’s leadership was able to bring excellence, support, and transform lives..."
                    value={testimonialForm.content}
                    onChange={(e) => setTestimonialForm({...testimonialForm, content: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-white h-24 outline-none resize-none"
                    required
                  />
                </div>

                {testimonialSuccess && <p className="text-xs text-emerald-400 font-bold bg-emerald-500/10 p-2 rounded-xl text-center">{testimonialSuccess}</p>}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Publish My Review
                </button>
              </form>

              {/* Feed Grid (Always display approved) */}
              <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                {appState.testimonials.map((test) => (
                  <div key={test.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl relative space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-xs font-black text-white">{test.author}</span>
                        <span className="text-[9px] text-[#fa5216] font-mono font-bold uppercase">{test.role}</span>
                      </div>
                      <span className="font-mono text-xs text-yellow-400">{"★".repeat(test.rating)}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">"{test.content}"</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* PAGE 9: PARTNER WITH US APPLICATIONS */}
        {currentView === "partner" && (
          <section className="space-y-10 max-w-2xl mx-auto bg-slate-900/60 p-8 rounded-3xl border border-slate-850 shadow-xl">
            <div className="text-center space-y-2">
              <span className="text-xs text-orange-500 font-mono font-black uppercase">Affiliate Backing</span>
              <h2 className="text-3xl font-display font-black text-white uppercase">Partner With Us</h2>
              <p className="text-xs text-slate-400">Are you a school, local administrator, corporate sponsor, or international organization? We invite direct partnerships to back our Mbarara outreach campaigns.</p>
            </div>

            <form onSubmit={handlePartnerSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Company/Entity Name</label>
                  <input
                    type="text"
                    placeholder="Uganda Culture Council"
                    value={partnerForm.companyName}
                    onChange={(e) => setPartnerForm({...partnerForm, companyName: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Contact Name Person</label>
                  <input
                    type="text"
                    placeholder="Sarah Atwiine"
                    value={partnerForm.contactName}
                    onChange={(e) => setPartnerForm({...partnerForm, contactName: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Email Coordinates</label>
                  <input
                    type="email"
                    placeholder="partner@com.org"
                    value={partnerForm.email}
                    onChange={(e) => setPartnerForm({...partnerForm, email: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Affiliation Focus</label>
                  <select
                    value={partnerForm.partnerType}
                    onChange={(e) => setPartnerForm({...partnerForm, partnerType: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white cursor-pointer select-element"
                  >
                    <option value="Sponsor">Sponsorship Support</option>
                    <option value="School Outreach">School Organization</option>
                    <option value="International Exchange">International Exchange</option>
                    <option value="Media Partner">Media & Choreography Collaboration</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Partnership message description</label>
                <textarea
                  placeholder="Share a short summary of how your organization would like to team up with Twinomujuni Emmanuel (Sizzy Afro) to empower Ugandan youth through dance..."
                  value={partnerForm.message}
                  onChange={(e) => setPartnerForm({...partnerForm, message: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-white h-24 outline-none resize-none"
                />
              </div>

              {partnerSuccess && <p className="text-xs text-emerald-400 font-bold bg-emerald-500/10 p-2.5 rounded-xl text-center">{partnerSuccess}</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs tracking-wider uppercase cursor-pointer"
              >
                Send Partnership Request
              </button>
            </form>
          </section>
        )}

        {/* PAGE 10: CONTACT US & INQUIRIES  */}
        {currentView === "contact" && (
          <section className="space-y-12 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <span className="text-xs text-orange-500 font-mono font-black">Get In Touch</span>
              <h2 className="text-3xl font-display font-black text-white uppercase font-sans">Contact Sizzy Afro HQ</h2>
              <p className="text-xs text-slate-400">Stop by our flagship dance sessions or send a message securely here.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Form details */}
              <form onSubmit={handleContactSubmit} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                <h4 className="text-xs font-mono font-black text-orange-400 uppercase tracking-wider">Send an Instant Inquiry</h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="Emmanuel Junior"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Your Email</label>
                    <input
                      type="email"
                      placeholder="gmail@com.org"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Subject</label>
                  <input
                    type="text"
                    placeholder="S Saturday workshop query or class fees"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Content Inquiry message</label>
                  <textarea
                    placeholder="What questions can we address about classes, battles, and outreach sponsorships?"
                    value={contactForm.content}
                    onChange={(e) => setContactForm({...contactForm, content: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-white h-24 outline-none resize-none"
                    required
                  />
                </div>

                {contactSuccess && <p className="text-xs text-emerald-400 font-bold bg-emerald-500/10 p-2 rounded-xl text-center">{contactSuccess}</p>}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Send Inquiry Message
                </button>
              </form>

              {/* Physical Coordinates */}
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-mono font-black text-amber-400 uppercase tracking-wider">The Lakeside Headquarters</h4>
                  
                  <div className="space-y-3.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2.5">
                      <MapPin className="text-orange-500 shrink-0" size={14} />
                      <span>Lakeside National Gym, Mbarara City, Uganda</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone className="text-orange-500 shrink-0" size={14} />
                      <span>+256 700 000 000 (WhatsApp)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Mail className="text-orange-500 shrink-0" size={14} />
                      <span>sizzyafro@gmail.com</span>
                    </div>
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 font-mono text-[10.5px]">
                      <strong>Weekly classes schedule:</strong> Saturdays 4:00 PM CAT. Parents and supporters welcome to audiate battles!
                    </div>
                  </div>
                </div>

                {/* Live maps placeholder simulation */}
                <div className="h-40 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-15 bg-radial-at-c from-orange-500 to-transparent" />
                  <div className="text-center relative z-10 space-y-1">
                    <MapPin className="text-orange-500 animate-pulse mx-auto" size={18} />
                    <span className="block text-[11px] font-mono text-white">MBARARA, UGANDA MAP DATA</span>
                    <span className="text-[9px] text-slate-500 font-mono">Latitude: -0.6074 • Longitude: 30.6558</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* PAGE 11: ADMIN DECK OVERLAY [CRAWL FREE] */}
        {currentView === "admin" && (
          <section className="space-y-6">
            <AdminPanel
              initialData={appState}
              onSave={syncState}
              onClose={() => {
                window.location.hash = "#home";
              }}
            />
          </section>
        )}

      </main>

      {/* FOOTER BAR */}
      <footer className="w-full bg-slate-950 border-t border-slate-900 py-12 px-6 mt-16 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b border-slate-900 pb-8 mb-8">
          <div className="space-y-3">
            <a href="#home" className="flex items-center gap-2">
              <img 
                src={typeof logoImg === "string" ? logoImg : (logoImg as any).src || ""} 
                alt="Dance With Sizzy Afro Logo" 
                className="w-8 h-8 object-cover rounded-lg border border-slate-800"
              />
              <span className="font-display font-black text-white text-md uppercase">Dance With Sizzy Afro</span>
            </a>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Established in 2025. Nurturing Street dance talent, youth discipline, and cultural excellence in Mbarara Lakeside, Uganda.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="block font-mono text-[9px] text-slate-500 uppercase font-bold tracking-wider">Quick Travel</span>
              <ul className="space-y-1.5 font-medium leading-tight">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#team" className="hover:text-white transition-colors">Our Team</a></li>
                <li><a href="#events" className="hover:text-white transition-colors">Events</a></li>
                <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div className="space-y-2">
              <span className="block font-mono text-[9px] text-slate-500 uppercase font-bold tracking-wider">Support Hub</span>
              <ul className="space-y-1.5 font-medium leading-tight">
                <li><a href="#partner" className="hover:text-white transition-colors">Partner with Us</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Community Voice</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Inquiries</a></li>
                <li><button onClick={() => setIsDonateOpen(true)} className="text-orange-400 font-bold hover:text-white text-left cursor-pointer">Youth Fund</button></li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <span className="block font-mono text-[9px] text-slate-500 uppercase font-black tracking-widest uppercase">Subscribe for Battles</span>
            <div className="flex gap-2">
              <input type="email" placeholder="dancer@email.com" className="flex-1 px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white" />
              <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black text-[10px] font-black rounded-lg uppercase">JOIN</button>
            </div>
            <div className="flex gap-3 text-slate-400">
              <a href="https://instagram.com/sizzyafro" target="_blank" rel="noopener noreferrer" className="hover:text-white"><Instagram size={15} /></a>
              <a href="https://youtube.com/c/DanceWithSizzyAfro" target="_blank" rel="noopener noreferrer" className="hover:text-white"><Youtube size={15} /></a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <span>© 2026 Dance With Sizzy Afro. All Rights Reserved.</span>
          <span>Designed with Excellence • Mbarara, Uganda</span>
        </div>
      </footer>

      {/* MODAL 1: DONATE CHARITY FUND DETAILS */}
      <AnimatePresence>
        {isDonateOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 relative shadow-2xl overflow-hidden space-y-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div className="flex items-center gap-1.5">
                  <Gift className="text-orange-500" size={16} />
                  <span className="font-display font-black text-white text-base uppercase">Back Sizzy Ghetto Fund</span>
                </div>
                <button onClick={() => setIsDonateOpen(false)} className="p-1 text-slate-400 hover:text-white border border-slate-850 bg-slate-950 rounded-lg cursor-pointer">
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-normal">
                <p>
                  Help us feed children in workshops, pay back-to-school fees for street youths, buy battle costumes, and keep our regional training space active.
                </p>
                <p className="font-mono text-[10px] text-amber-500 font-bold">100% of custom gifts are managed directly under transparent Ghetto Aid ledgers.</p>
              </div>

              <form onSubmit={handleDonationSubmit} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe Org"
                      value={donationForm.donorName}
                      onChange={(e) => setDonationForm({ ...donationForm, donorName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Gift Amount (USD)</label>
                    <input
                      type="number"
                      placeholder="25"
                      value={donationForm.amount}
                      onChange={(e) => setDonationForm({ ...donationForm, amount: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Sponsoring focus</label>
                  <select
                    value={donationForm.project}
                    onChange={(e) => setDonationForm({ ...donationForm, project: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white cursor-pointer select-element"
                  >
                    <option value="Ghetto Youth Sponsorship">Outreach Food & School Fees</option>
                    <option value="Championship and Battle Fund">Uganda National battle travel</option>
                    <option value="Training Studio Rent">Masterclass Studio Upkeep</option>
                  </select>
                </div>

                {donationSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-[10.5px] text-emerald-400 rounded-xl leading-normal space-y-2">
                    <p className="font-bold">{donationSuccess}</p>
                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-850 font-mono text-[9px]">
                      <strong>UG Direct transfers:</strong> Mobile Money Account (MTN/Airtel) under: <strong>Emmanuel Twinomujuni</strong>: <strong>+256 771 234 567</strong>. Share screenshots on WhatsApp!
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Log My Sponsoring Intention
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 2: GOOGLE REVIEW REQUEST SOLICITATION */}
      <AnimatePresence>
        {isReviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 relative shadow-2xl overflow-hidden space-y-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div className="flex items-center gap-1.5 text-indigo-400">
                  <Star className="fill-current text-indigo-400" size={16} />
                  <span className="font-display font-black text-white text-base uppercase">Support Sizzy Afro Page</span>
                </div>
                <button onClick={() => setIsReviewOpen(false)} className="p-1 text-slate-400 hover:text-white border border-slate-850 bg-slate-950 rounded-lg cursor-pointer">
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-normal">
                <p>
                  Help us connect to national levels! Adding a 5 Star Google Business review ensures Google ranks Mbarara's elite dance community higher for international choreographers and sponsors.
                </p>
                <p className="font-mono text-[10px] text-amber-500 font-bold">It only takes 25 seconds of your time to place a rating.</p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <a
                  href={currentSettings.googleMapsReviewLink || "https://g.page/r/sizzyafro-mbarara/review"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider text-center block rounded-xl shadow-lg"
                >
                  GO WRITE GOOGLE REVIEW NOW ★★★★★
                </a>
                <button
                  onClick={() => setIsReviewOpen(false)}
                  className="w-full py-2 bg-slate-950 hover:bg-slate-900 text-slate-400 text-xs rounded-xl border border-slate-850 font-bold"
                >
                  I will write it later, thank you
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 3: NEWSLETTER NEWS SUBSCRIPTION TRIGGER */}
      <AnimatePresence>
        {isNewsletterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 relative shadow-2xl overflow-hidden space-y-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div className="flex items-center gap-1.5 text-orange-500">
                  <Mail className="text-orange-500" size={16} />
                  <span className="font-display font-black text-white text-base uppercase">Sizzy Afro Alert Signup</span>
                </div>
                <button 
                  onClick={() => {
                    setIsNewsletterOpen(false);
                    localStorage.setItem("sizzy_newsletter_subscribed_or_dismissed", "true");
                  }} 
                  className="p-1 text-slate-400 hover:text-white border border-slate-850 bg-slate-950 rounded-lg cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-normal">
                <p>
                  Get instant mobile alerts for upcoming international street contests, regional dance battles, free Amapiano fusion sessions, and scholarship programs in Mbarara.
                </p>
                <p className="font-mono text-[10px] text-orange-500 font-bold">Never miss outdoor clashes and showcase times. Direct to your inbox!</p>
              </div>

              <form onSubmit={handleNewsletterSubmit} className="space-y-4 pt-2">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Your Best Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="dancer@example.com"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full pl-3 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-white focus:outline-none focus:border-orange-500 transition-colors"
                      required
                    />
                    <div className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-500 pointer-events-none">
                      <Mail size={14} />
                    </div>
                  </div>
                </div>

                {newsletterError && (
                  <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 rounded-lg leading-normal font-medium">
                    {newsletterError}
                  </div>
                )}

                {newsletterSuccess && (
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 rounded-lg leading-normal font-medium">
                    {newsletterSuccess}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={submittingNewsletter}
                    className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-500 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:from-orange-400 hover:to-amber-400 transition-all shadow-md text-center"
                  >
                    {submittingNewsletter ? "Submitting..." : "Subscribe for Alerts"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewsletterOpen(false);
                      localStorage.setItem("sizzy_newsletter_subscribed_or_dismissed", "true");
                    }}
                    className="px-4 py-3 bg-slate-950 hover:bg-slate-900 text-slate-400 text-xs rounded-xl border border-slate-850 font-bold"
                  >
                    Skip
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 4: EVENT RSVP REGISTRATION */}
      <AnimatePresence>
        {isRsvpOpen && rsvpSelectedEvent && (() => {
          const currentRsvps = (appState?.rsvps || []).filter((r) => r.eventId === rsvpSelectedEvent.id).length;
          const capacity = rsvpSelectedEvent.capacity || 150;
          const isFull = currentRsvps >= capacity;
          const spotsLeft = Math.max(0, capacity - currentRsvps);

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6"
            >
              <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 relative shadow-2xl overflow-hidden space-y-4">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                  <div className="flex items-center gap-1.5 text-orange-500">
                    <Ticket className="text-orange-500 animate-pulse" size={16} />
                    <span className="font-display font-black text-white text-base uppercase">Secure Your Event Spot</span>
                  </div>
                  <button 
                    onClick={() => {
                      setIsRsvpOpen(false);
                      setRsvpSelectedEvent(null);
                      setRsvpSuccess("");
                      setRsvpError("");
                    }} 
                    className="p-1 text-slate-400 hover:text-white border border-slate-850 bg-slate-950 rounded-lg cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div>
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Registering for:</span>
                  <span className="text-xs font-bold text-orange-400 font-mono block uppercase">{rsvpSelectedEvent.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    📅 {rsvpSelectedEvent.date} • 🕒 {rsvpSelectedEvent.time} • 👥 {currentRsvps}/{capacity} spots filled
                  </span>
                </div>

                <form onSubmit={handleRsvpSubmit} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1 font-bold">Your Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. B-Boy Akram"
                      value={rsvpForm.name}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-white focus:outline-none focus:border-orange-500 transition-colors"
                      required
                      disabled={isFull}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1 font-bold">Email Address</label>
                      <input
                        type="email"
                        placeholder="dancer@example.com"
                        value={rsvpForm.email}
                        onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-white focus:outline-none focus:border-orange-500 transition-colors"
                        required
                        disabled={isFull}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1 font-bold">WhatsApp / Phone</label>
                      <input
                        type="tel"
                        placeholder="+256 701 234 567"
                        value={rsvpForm.phone}
                        onChange={(e) => setRsvpForm({ ...rsvpForm, phone: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-white focus:outline-none focus:border-orange-500 transition-colors"
                        required
                        disabled={isFull}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1 font-bold">My Role in the Event</label>
                    <select
                      value={rsvpForm.role}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, role: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white cursor-pointer select-element focus:outline-none focus:border-orange-500"
                      disabled={isFull}
                    >
                      <option value="Competitor / Dancer">Competitor / Dancer (Ready to Battle!)</option>
                      <option value="Spectator / Audience">Spectator / Audience (Coming to Watch)</option>
                      <option value="Crew Representative">Crew Representative / Team Coach</option>
                      <option value="Parent / Supporter">Parent / Supporter / Community Supporter</option>
                    </select>
                  </div>

                  {rsvpError && (
                    <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 rounded-lg leading-normal font-mono font-bold">
                      {rsvpError}
                    </div>
                  )}

                  {rsvpSuccess && (
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-[10.5px] text-emerald-400 rounded-lg leading-normal font-semibold space-y-1">
                      <p>{rsvpSuccess}</p>
                      <p className="text-[9px] text-slate-400 font-mono">Your ticket has been logged into the community registry!</p>
                    </div>
                  )}

                  {isFull && !rsvpSuccess && (
                    <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-400 rounded-lg leading-normal font-mono font-bold">
                      This event has reached its maximum registration capacity of {capacity} participants. Registrations are currently closed.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submittingRsvp || !!rsvpSuccess || isFull}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-500 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:from-orange-400 hover:to-amber-400 transition-all shadow-md text-center"
                  >
                    {submittingRsvp ? "Submitting Registration..." : rsvpSuccess ? "Spot Confirmed! ✓" : isFull ? "REGISTRATION FULL" : "CONFIRM MY FREE SPOT"}
                  </button>
                </form>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}

// Inline pure Helper Components with absolute zero overhead
function ValueCard({ title, text, icon }: { title: string; text: string; icon: string }) {
  return (
    <div className="p-5 rounded-2xl bg-slate-950/40 backdrop-blur-sm border border-slate-900 hover:border-orange-500/30 hover:shadow-[0_0_15px_rgba(249,115,22,0.06)] hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between group">
      <div>
        <span className="text-2xl block mb-3 leading-none filter drop-shadow-[0_2px_8px_rgba(249,115,22,0.15)] group-hover:scale-110 transition-transform duration-300">{icon}</span>
        <h4 className="text-xs font-display font-black text-white uppercase tracking-wider leading-snug group-hover:text-orange-400 transition-colors">{title}</h4>
        <p className="text-[10.5px] text-slate-400 mt-1.5 leading-relaxed font-sans">{text}</p>
      </div>
    </div>
  );
}

function PinIcon({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-950/90 border border-slate-800 rounded-lg shrink-0">
      <MapPin className="text-orange-500" size={11} />
      <span className="text-[9px] font-mono font-bold text-slate-350 uppercase tracking-widest">{text}</span>
    </div>
  );
}
