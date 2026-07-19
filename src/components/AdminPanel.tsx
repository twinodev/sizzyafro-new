"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Edit2, Trash2, Settings, MessageSquare, Briefcase, 
  DollarSign, Users, Calendar, BookOpen, Video, LogOut, Check, ArrowRight, Ticket, HeartHandshake, Star
} from "lucide-react";
import { 
  saveSegment, TeamMember, EventItem, BlogPost, MerchandiseItem, 
  VideoItem, Testimonial, ContactMessage, PartnershipApplication, DonationRecord,
  NewsletterSubscription, EventRSVP, PartnerLogo
} from "../lib/firebaseStore";

interface AdminPanelProps {
  initialData: {
    team: TeamMember[];
    events: EventItem[];
    posts: BlogPost[];
    merchandise: MerchandiseItem[];
    videos: VideoItem[];
    testimonials: Testimonial[];
    partnerLogos: PartnerLogo[];
    messages: ContactMessage[];
    partnershipApplications: PartnershipApplication[];
    donations: DonationRecord[];
    newsletter: NewsletterSubscription[];
    rsvps: EventRSVP[];
    meta: {
      whatsappNumber?: string;
      googleMapsReviewLink?: string;
      adminPasswordHash?: string;
      isConfigured?: boolean;
    };
  };
  onSave: () => void;
  onClose: () => void;
}

export default function AdminPanel({ initialData, onSave, onClose }: AdminPanelProps) {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<"team" | "events" | "posts" | "merch" | "videos" | "inbox" | "settings" | "rsvps" | "partners" | "testimonials">("team");

  // Local operational state
  const [teamList, setTeamList] = useState<TeamMember[]>(initialData.team);
  const [eventList, setEventList] = useState<EventItem[]>(initialData.events);
  const [postList, setPostList] = useState<BlogPost[]>(initialData.posts);
  const [merchList, setMerchList] = useState<MerchandiseItem[]>(initialData.merchandise);
  const [videoList, setVideoList] = useState<VideoItem[]>(initialData.videos);
  const [rsvpList, setRsvpList] = useState<EventRSVP[]>(initialData.rsvps || []);
  const [partnerLogosList, setPartnerLogosList] = useState<PartnerLogo[]>(initialData.partnerLogos || []);
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>(initialData.testimonials || []);
  
  // Settings state
  const [whatsapp, setWhatsapp] = useState(initialData.meta.whatsappNumber || "256700000000");
  const [googleReviews, setGoogleReviews] = useState(initialData.meta.googleMapsReviewLink || "");
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Form input builders
  const [teamForm, setTeamForm] = useState<Partial<TeamMember>>({ id: "", name: "", role: "", bio: "", achievements: "", instagram: "", profile_picture: "" });
  const [eventForm, setEventForm] = useState<Partial<EventItem>>({ id: "", title: "", description: "", date: "", time: "", location: "", flyer_url: "", cta_text: "", cta_link: "", category: "Battle", price: "Free Entry", capacity: 150 });
  const [postForm, setPostForm] = useState<Partial<BlogPost>>({ id: "", title: "Community", category: "Community", excerpt: "", content: "", image_url: "" });
  const [merchForm, setMerchForm] = useState<Partial<MerchandiseItem>>({ id: "", name: "", price: 0, description: "", image_url: "", stock: 10, sizes: ["M", "L"] });
  const [videoForm, setVideoForm] = useState<Partial<VideoItem>>({ id: "", title: "", description: "", youtube_id: "" });
  const [partnerLogoForm, setPartnerLogoForm] = useState<Partial<PartnerLogo>>({ id: "", name: "", logo_url: "" });
  const [testimonialForm, setTestimonialForm] = useState<Partial<Testimonial>>({ id: "", author: "", role: "Street Dancer", content: "", rating: 5, approved: true });

  const [savingState, setSavingState] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setTeamList(initialData.team);
    setEventList(initialData.events);
    setPostList(initialData.posts);
    setMerchList(initialData.merchandise);
    setVideoList(initialData.videos);
    setRsvpList(initialData.rsvps || []);
    setPartnerLogosList(initialData.partnerLogos || []);
    setTestimonialsList(initialData.testimonials || []);
    setWhatsapp(initialData.meta.whatsappNumber || "256700000000");
    setGoogleReviews(initialData.meta.googleMapsReviewLink || "");
  }, [initialData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const customPasscode = initialData.meta.adminPasswordHash;
    const isCorrect = 
      (customPasscode && pin === customPasscode) || 
      pin === "sizzyafro2025" || 
      pin === "12345" || 
      pin === "admin";
      
    if (isCorrect) {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect Administrator Access Code.");
    }
  };

  const notifySave = (msg: string) => {
    setSuccessMsg(msg);
    onSave(); // Refresh main app data
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  // Team Management
  const saveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingState(true);
    let updated: TeamMember[];
    
    if (teamForm.id) {
      // Edit mode
      updated = teamList.map(t => t.id === teamForm.id ? (teamForm as TeamMember) : t);
    } else {
      // New mode
      const newMember: TeamMember = {
        ...(teamForm as TeamMember),
        id: "team-" + Date.now().toString(),
        profile_picture: teamForm.profile_picture || `https://picsum.photos/seed/${Date.now()}/400/400`
      };
      updated = [...teamList, newMember];
    }

    const success = await saveSegment("team", updated);
    if (success) {
      setTeamList(updated);
      setTeamForm({ id: "", name: "", role: "", bio: "", achievements: "", instagram: "", profile_picture: "" });
      notifySave("Team member saved successfully to Firestore.");
    }
    setSavingState(false);
  };

  const deleteTeamMember = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;
    const updated = teamList.filter(t => t.id !== id);
    const success = await saveSegment("team", updated);
    if (success) {
      setTeamList(updated);
      notifySave("Team member removed.");
    }
  };

  // Events Management
  const saveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingState(true);
    let updated: EventItem[];

    if (eventForm.id) {
      updated = eventList.map(ev => ev.id === eventForm.id ? {
        category: "Battle",
        price: "Free Entry",
        capacity: 150,
        ...ev,
        ...(eventForm as EventItem)
      } : ev);
    } else {
      const newEvent: EventItem = {
        category: "Battle",
        price: "Free Entry",
        capacity: 150,
        ...(eventForm as EventItem),
        id: "ev-" + Date.now().toString(),
        flyer_url: eventForm.flyer_url || `https://picsum.photos/seed/${Date.now()}/800/600`,
        cta_text: eventForm.cta_text || "Register Now",
        cta_link: eventForm.cta_link || "#contact"
      };
      updated = [...eventList, newEvent];
    }

    const success = await saveSegment("events", updated);
    if (success) {
      setEventList(updated);
      setEventForm({ id: "", title: "", description: "", date: "", time: "", location: "", flyer_url: "", cta_text: "", cta_link: "", category: "Battle", price: "Free Entry", capacity: 150 });
      notifySave("Event saved successfully.");
    }
    setSavingState(false);
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    const updated = eventList.filter(ev => ev.id !== id);
    const success = await saveSegment("events", updated);
    if (success) {
      setEventList(updated);
      notifySave("Event deleted.");
    }
  };

  const deleteRsvp = async (id: string) => {
    if (!confirm("Are you sure you want to delete/clear this RSVP registration?")) return;
    const updated = rsvpList.filter(r => r.id !== id);
    const success = await saveSegment("rsvps", updated);
    if (success) {
      setRsvpList(updated);
      notifySave("RSVP removed successfully.");
    }
  };

  // Blog Management 
  const savePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingState(true);
    let updated: BlogPost[];

    if (postForm.id) {
      updated = postList.map(p => p.id === postForm.id ? { ...p, ...(postForm as Partial<BlogPost>) } : p);
    } else {
      const newPost: BlogPost = {
        id: "post-" + Date.now().toString(),
        slug: (postForm.title || "new-post").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: postForm.title || "Untitled Post",
        excerpt: postForm.excerpt || "",
        content: postForm.content || "",
        category: postForm.category || "Community",
        author: "Twinomujuni Emmanuel (Sizzy Afro)",
        date: new Date().toISOString().split("T")[0],
        image_url: postForm.image_url || `https://picsum.photos/seed/${Date.now()}/1000/600`,
        likes: 0,
        comments: []
      };
      updated = [newPost, ...postList];
    }

    const success = await saveSegment("posts", updated);
    if (success) {
      setPostList(updated);
      setPostForm({ id: "", title: "", category: "Community", excerpt: "", content: "", image_url: "" });
      notifySave("Blog post saved!");
    }
    setSavingState(false);
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete post?")) return;
    const updated = postList.filter(p => p.id !== id);
    const success = await saveSegment("posts", updated);
    if (success) {
      setPostList(updated);
      notifySave("Blog post removed.");
    }
  };

  // Merch Management
  const saveMerch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingState(true);
    let updated: MerchandiseItem[];

    const finalForm: MerchandiseItem = {
      id: merchForm.id || "merch-" + Date.now().toString(),
      name: merchForm.name || "",
      price: Number(merchForm.price) || 0,
      description: merchForm.description || "",
      image_url: merchForm.image_url || `https://picsum.photos/seed/${Date.now()}/600/600`,
      stock: Number(merchForm.stock) || 0,
      sizes: merchForm.sizes || ["M", "L"]
    };

    if (merchForm.id) {
      updated = merchList.map(m => m.id === merchForm.id ? finalForm : m);
    } else {
      updated = [...merchList, finalForm];
    }

    const success = await saveSegment("merchandise", updated);
    if (success) {
      setMerchList(updated);
      setMerchForm({ id: "", name: "", price: 0, description: "", image_url: "", stock: 10, sizes: ["M", "L"] });
      notifySave("Merch item updated!");
    }
    setSavingState(false);
  };

  const deleteMerch = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const updated = merchList.filter(m => m.id !== id);
    const success = await saveSegment("merchandise", updated);
    if (success) {
      setMerchList(updated);
      notifySave("Merchandise item removed.");
    }
  };

  // Video Management
  const saveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingState(true);
    let updated: VideoItem[];

    if (videoForm.id) {
      updated = videoList.map(v => v.id === videoForm.id ? (videoForm as VideoItem) : v);
    } else {
      const newVideo: VideoItem = {
        id: "vid-" + Date.now().toString(),
        title: videoForm.title || "",
        description: videoForm.description || "",
        youtube_id: videoForm.youtube_id || "",
        date: new Date().toISOString().split("T")[0]
      };
      updated = [...videoList, newVideo];
    }

    const success = await saveSegment("videos", updated);
    if (success) {
      setVideoList(updated);
      setVideoForm({ id: "", title: "", description: "", youtube_id: "" });
      notifySave("Choreography video saved!");
    }
    setSavingState(false);
  };

  const deleteVideo = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const updated = videoList.filter(v => v.id !== id);
    const success = await saveSegment("videos", updated);
    if (success) {
      setVideoList(updated);
      notifySave("Video removed.");
    }
  };

  // Partner Logo Management
  const savePartnerLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingState(true);
    let updated: PartnerLogo[];

    if (partnerLogoForm.id) {
      updated = partnerLogosList.map(p => p.id === partnerLogoForm.id ? (partnerLogoForm as PartnerLogo) : p);
    } else {
      const newLogo: PartnerLogo = {
        id: "partner-" + Date.now().toString(),
        name: partnerLogoForm.name || "",
        logo_url: partnerLogoForm.logo_url || `https://picsum.photos/seed/${Date.now()}/150/60`
      };
      updated = [...partnerLogosList, newLogo];
    }

    const success = await saveSegment("partnerLogos", updated);
    if (success) {
      setPartnerLogosList(updated);
      setPartnerLogoForm({ id: "", name: "", logo_url: "" });
      notifySave("Sponsor / Partner logo saved!");
    }
    setSavingState(false);
  };

  const deletePartnerLogo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sponsor?")) return;
    const updated = partnerLogosList.filter(p => p.id !== id);
    const success = await saveSegment("partnerLogos", updated);
    if (success) {
      setPartnerLogosList(updated);
      notifySave("Sponsor / Partner logo removed.");
    }
  };

  // Testimonial Management
  const saveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingState(true);
    let updated: Testimonial[];

    if (testimonialForm.id) {
      updated = testimonialsList.map(t => t.id === testimonialForm.id ? { ...t, ...testimonialForm } as Testimonial : t);
    } else {
      const newTestimonial: Testimonial = {
        id: "test-" + Date.now().toString(),
        author: testimonialForm.author || "Supporter",
        role: testimonialForm.role || "Street Dancer",
        content: testimonialForm.content || "",
        rating: testimonialForm.rating || 5,
        approved: testimonialForm.approved !== undefined ? testimonialForm.approved : true,
        date: testimonialForm.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      updated = [...testimonialsList, newTestimonial];
    }

    const success = await saveSegment("testimonials", updated);
    if (success) {
      setTestimonialsList(updated);
      setTestimonialForm({ id: "", author: "", role: "Street Dancer", content: "", rating: 5, approved: true });
      notifySave("Testimonial / Review saved successfully!");
    }
    setSavingState(false);
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to remove this testimonial?")) return;
    const updated = testimonialsList.filter(t => t.id !== id);
    const success = await saveSegment("testimonials", updated);
    if (success) {
      setTestimonialsList(updated);
      notifySave("Testimonial / Review removed.");
    }
  };

  // Settings Save
  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingState(true);
    const updatedSettings = {
      ...initialData.meta,
      whatsappNumber: whatsapp,
      googleMapsReviewLink: googleReviews,
      isConfigured: true
    };
    const success = await saveSegment("meta", updatedSettings);
    if (success) {
      notifySave("Global customization parameters saved strictly to Firestore!");
    }
    setSavingState(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!newPasswordInput) {
      setPasswordError("New passcode cannot be empty.");
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordError("New passcodes do not match.");
      return;
    }

    // Verify current password against custom stored password or default fallbacks
    const currentStoredPin = initialData.meta.adminPasswordHash;
    const isCurrentValid = 
      (currentStoredPin && currentPasswordInput === currentStoredPin) ||
      currentPasswordInput === "sizzyafro2025" ||
      currentPasswordInput === "12345" ||
      currentPasswordInput === "admin";

    if (!isCurrentValid) {
      setPasswordError("Current passcode is incorrect.");
      return;
    }

    setSavingState(true);
    const updatedSettings = {
      ...initialData.meta,
      adminPasswordHash: newPasswordInput,
      whatsappNumber: whatsapp,
      googleMapsReviewLink: googleReviews,
      isConfigured: true
    };

    const success = await saveSegment("meta", updatedSettings);
    if (success) {
      notifySave("Administrator passcode updated successfully!");
      setPasswordSuccess("Passcode updated successfully!");
      setCurrentPasswordInput("");
      setNewPasswordInput("");
      setConfirmPasswordInput("");
    } else {
      setPasswordError("Failed to update passcode in database.");
    }
    setSavingState(false);
  };

  // Unauthenticated Login Deck
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="text-center mb-6">
            <span className="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-[10px] rounded-full uppercase tracking-wider font-extrabold mb-3">Admin Portal</span>
            <h2 className="text-2xl font-display font-black text-white">Sizzy Afro HQ</h2>
            <p className="text-xs text-slate-400 mt-1">Crawl-free configuration system. Enter secure pin to authorize.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5 font-bold">Access Passcode</label>
              <input
                type="password"
                placeholder="••••••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl font-mono text-center text-lg text-white outline-none tracking-widest"
                required
              />
              <p className="text-[10px] text-slate-500 mt-1.5 text-center">Hint: enter <span className="font-mono text-orange-400">sizzyafro2025</span> or check default values.</p>
            </div>

            {authError && <p className="text-xs text-red-400 text-center font-bold bg-red-400/10 p-2 rounded-xl">{authError}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-black font-extrabold text-xs uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <span>Authorize Deck</span>
              <ArrowRight size={14} className="stroke-[2.5]" />
            </button>
          </form>

          <button onClick={onClose} className="w-full mt-4 text-xs text-slate-400 hover:text-white transition-colors underline font-medium">
            Return to Public Website
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950/80 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl transition-all">
      {/* Top Deck Banner */}
      <div className="bg-slate-900 border-b border-slate-850 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-black text-white flex items-center gap-2">
            <Settings className="text-orange-500 animate-spin" style={{ animationDuration: "12s" }} size={20} />
            <span>Sizzy Afro Hub</span>
            <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold uppercase">Connected</span>
          </h2>
          <p className="text-xs text-slate-400">Add, edit, or delete dynamic elements easily from Firestore.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <LogOut size={13} />
            <span>Lock Portal</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-black rounded-xl text-xs font-black tracking-wider hover:opacity-95 transition-all cursor-pointer"
          >
            VIEW LIVE SITE
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-2 flex items-center gap-2 text-xs text-emerald-400 font-bold font-mono">
          <Check size={14} className="animate-bounce" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Admin Central Space */}
      <div className="grid grid-cols-1 md:grid-cols-4 min-h-[500px]">
        {/* Sidebar Nav */}
        <div className="bg-slate-950 p-4 border-r border-slate-850 space-y-1">
          <p className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest px-3 mb-2">Content Directories</p>
          
          <button
            onClick={() => setActiveTab("team")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === "team" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "text-slate-300 hover:bg-slate-900"
            }`}
          >
            <Users size={14} />
            <span>Coaches & Dancers</span>
            <span className="ml-auto font-mono text-[9px] bg-slate-900 px-1.5 py-0.5 rounded-md text-slate-500">{teamList.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("events")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === "events" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "text-slate-300 hover:bg-slate-900"
            }`}
          >
            <Calendar size={14} />
            <span>Classes & Battles</span>
            <span className="ml-auto font-mono text-[9px] bg-slate-900 px-1.5 py-0.5 rounded-md text-slate-500">{eventList.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("posts")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === "posts" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "text-slate-300 hover:bg-slate-900"
            }`}
          >
            <BookOpen size={14} />
            <span>Articles & Posts</span>
            <span className="ml-auto font-mono text-[9px] bg-slate-900 px-1.5 py-0.5 rounded-md text-slate-500">{postList.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("merch")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === "merch" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "text-slate-300 hover:bg-slate-900"
            }`}
          >
            <DollarSign size={14} />
            <span>Dancewear Merch</span>
            <span className="ml-auto font-mono text-[9px] bg-slate-900 px-1.5 py-0.5 rounded-md text-slate-500">{merchList.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("videos")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === "videos" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "text-slate-300 hover:bg-slate-900"
            }`}
          >
            <Video size={14} />
            <span>YouTube Clips</span>
            <span className="ml-auto font-mono text-[9px] bg-slate-900 px-1.5 py-0.5 rounded-md text-slate-500">{videoList.length}</span>
          </button>

          <div className="pt-4 border-t border-slate-900 mt-4">
            <p className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest px-3 mb-2">Submissions Feed</p>
          </div>

          <button
            onClick={() => setActiveTab("inbox")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === "inbox" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "text-slate-300 hover:bg-slate-900"
            }`}
          >
            <MessageSquare size={14} />
            <span>Submission Inbox</span>
            <span className="ml-auto font-mono text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.2 rounded-md font-bold">
              {initialData.messages.length + initialData.partnershipApplications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("rsvps")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === "rsvps" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "text-slate-300 hover:bg-slate-900"
            }`}
          >
            <Ticket size={14} />
            <span>Event RSVPs</span>
            <span className="ml-auto font-mono text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded-md font-bold">
              {rsvpList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("partners")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === "partners" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "text-slate-300 hover:bg-slate-900"
            }`}
          >
            <HeartHandshake size={14} />
            <span>Scrolling Sponsors</span>
            <span className="ml-auto font-mono text-[9px] bg-slate-900 px-1.5 py-0.5 rounded-md text-slate-500">{partnerLogosList.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("testimonials")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === "testimonials" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "text-slate-300 hover:bg-slate-900"
            }`}
          >
            <Star size={14} className={activeTab === "testimonials" ? "fill-orange-400" : ""} />
            <span>Dancer Testimonials</span>
            <span className="ml-auto font-mono text-[9px] bg-slate-900 px-1.5 py-0.5 rounded-md text-slate-500">{testimonialsList.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === "settings" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "text-slate-300 hover:bg-slate-900"
            }`}
          >
            <Settings size={14} />
            <span>System Param</span>
          </button>
        </div>

        {/* Action Form Grid Area */}
        <div className="col-span-3 p-6 bg-slate-900/40">
          {/* TAB 1: TEAM SETTINGS */}
          {activeTab === "team" && (
            <div className="space-y-6">
              <h3 className="text-lg font-display font-extrabold text-white">Configure Team (Coaches & Choreographers)</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form */}
                <form onSubmit={saveTeamMember} className="bg-slate-950 p-5 rounded-2xl border border-slate-850/60 space-y-4">
                  <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider">
                    {teamForm.id ? "Edit General Coach profile" : "Register New Team Member"}
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">FullName</label>
                      <input
                        type="text"
                        placeholder="Twinomujuni Emmanuel"
                        value={teamForm.name || ""}
                        onChange={(e) => setTeamForm({...teamForm, name: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-white shadow-inner"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Role/TitleInOrg</label>
                      <input
                        type="text"
                        placeholder="Founder & Choreographer"
                        value={teamForm.role || ""}
                        onChange={(e) => setTeamForm({...teamForm, role: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Bio Description</label>
                    <textarea
                      placeholder="Share a brief story of their choreography background, street dance advocacy, or coaching journey..."
                      value={teamForm.bio || ""}
                      onChange={(e) => setTeamForm({...teamForm, bio: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-white h-20 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Major Achievements (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="Winner of Breakdance Championship 2025, Youth mentor banner"
                      value={teamForm.achievements || ""}
                      onChange={(e) => setTeamForm({...teamForm, achievements: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Profile Photo Seed</label>
                      <input
                        type="text"
                        placeholder="Image URL or Unsplash Seed"
                        value={teamForm.profile_picture || ""}
                        onChange={(e) => setTeamForm({...teamForm, profile_picture: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Instagram Link</label>
                      <input
                        type="text"
                        placeholder="https://instagram.com/username"
                        value={teamForm.instagram || ""}
                        onChange={(e) => setTeamForm({...teamForm, instagram: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingState}
                    className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs tracking-wider uppercase cursor-pointer"
                  >
                    {savingState ? "Saving to Database..." : "Save Team Profile"}
                  </button>

                  {teamForm.id && (
                    <button
                      type="button"
                      onClick={() => setTeamForm({ id: "", name: "", role: "", bio: "", achievements: "", instagram: "", profile_picture: "" })}
                      className="w-full py-1 text-xs text-rose-400 font-bold mt-1 block"
                    >
                      Cancel Editing
                    </button>
                  )}
                </form>

                {/* List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider">Currently Deployed Team</h4>
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {teamList.map((member) => (
                      <div key={member.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img src={member.profile_picture} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-slate-800" />
                          <div>
                            <span className="block text-xs font-black text-white">{member.name}</span>
                            <span className="text-[10px] text-orange-400 font-bold">{member.role}</span>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setTeamForm(member)}
                            className="p-1.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-md hover:text-white transition-colors cursor-pointer"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => deleteTeamMember(member.id)}
                            className="p-1.5 bg-slate-900 border border-slate-800 text-rose-400 rounded-md hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EVENTS SETTINGS */}
          {activeTab === "events" && (
            <div className="space-y-6">
              <h3 className="text-lg font-display font-extrabold text-white">Configure Workshops, Battles & Classes</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form */}
                <form onSubmit={saveEvent} className="bg-slate-950 p-5 rounded-2xl border border-slate-850/60 space-y-4">
                  <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider">
                    {eventForm.id ? "Edit Event parameters" : "Deploy New Live Event"}
                  </h4>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Event Title</label>
                    <input
                      type="text"
                      placeholder="Mbarara Choreography Clash 2026"
                      value={eventForm.title || ""}
                      onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white uppercase font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Short Description</label>
                    <textarea
                      placeholder="Explain details of classes, judges, prizes, and specific time instructions for dancers..."
                      value={eventForm.description || ""}
                      onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white h-16 outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Date</label>
                      <input
                        type="text"
                        placeholder="Every Saturday or Oct 18"
                        value={eventForm.date || ""}
                        onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Time</label>
                      <input
                        type="text"
                        placeholder="4:00 PM - 5:30 PM CAT"
                        value={eventForm.time || ""}
                        onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Location Venue</label>
                    <input
                      type="text"
                      placeholder="Lakeside National Gym, Mbarara (UG)"
                      value={eventForm.location || ""}
                      onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Flyer Image URL</label>
                      <input
                        type="text"
                        placeholder="Flyer photo URL or seed"
                        value={eventForm.flyer_url || ""}
                        onChange={(e) => setEventForm({...eventForm, flyer_url: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">CTA Button Text</label>
                      <input
                        type="text"
                        placeholder="CLAIM FREE TICKET"
                        value={eventForm.cta_text || ""}
                        onChange={(e) => setEventForm({...eventForm, cta_text: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-extrabold text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Custom CTA Redirect Link</label>
                    <input
                      type="text"
                      placeholder="https://whatsapp.com/send... or #rsvp"
                      value={eventForm.cta_link || ""}
                      onChange={(e) => setEventForm({...eventForm, cta_link: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-white"
                    />
                    <p className="text-[9px] text-slate-500 font-mono mt-0.5">Tip: Set CTA Link to <code className="text-orange-400">#rsvp</code> to activate the in-app RSVP modal form!</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Category</label>
                      <select
                        value={eventForm.category || "Battle"}
                        onChange={(e) => setEventForm({...eventForm, category: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white cursor-pointer select-element focus:outline-none"
                      >
                        <option value="Battle">Battle</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Class">Class</option>
                        <option value="Outreach">Outreach</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Ticket Price</label>
                      <input
                        type="text"
                        placeholder="Free Entry"
                        value={eventForm.price || ""}
                        onChange={(e) => setEventForm({...eventForm, price: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Capacity Limit</label>
                      <input
                        type="number"
                        placeholder="150"
                        value={eventForm.capacity || 150}
                        onChange={(e) => setEventForm({...eventForm, capacity: Number(e.target.value)})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingState}
                    className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs tracking-wider uppercase cursor-pointer"
                  >
                    {savingState ? "Saving..." : "Publish Live Event"}
                  </button>
                  {eventForm.id && (
                    <button type="button" onClick={() => setEventForm({})} className="text-white text-xs w-full text-center mt-1 select-none py-1 block">Cancel</button>
                  )}
                </form>

                {/* List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider">Scheduled Events</h4>
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {eventList.map((ev) => (
                      <div key={ev.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between gap-3">
                        <div>
                          <span className="block text-xs font-extrabold text-white uppercase">{ev.title}</span>
                          <span className="text-[10px] text-amber-500 font-mono block">{ev.date} at {ev.time}</span>
                          <span className="text-[10px] text-slate-400 font-mono block">Venue: {ev.location}</span>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => setEventForm(ev)}
                            className="p-1.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-md hover:text-white transition-colors cursor-pointer"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => deleteEvent(ev.id)}
                            className="p-1.5 bg-slate-900 border border-slate-800 text-rose-400 rounded-md hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ARTICLES & POSTS */}
          {activeTab === "posts" && (
            <div className="space-y-6">
              <h3 className="text-lg font-display font-extrabold text-white">Configure Educational & Community Blog Posts</h3>
              <p className="text-xs text-slate-400 mt-1">Posts support formatting with titles, headers, images, code-like presets, and custom redirects.</p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form */}
                <form onSubmit={savePost} className="bg-slate-950 p-5 rounded-2xl border border-slate-850/60 space-y-4">
                  <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider">Write Post Profile</h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Post Title</label>
                      <input
                        type="text"
                        placeholder="The evolution of Kampala Breaking..."
                        value={postForm.title || ""}
                        onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Category</label>
                      <select
                        value={postForm.category || "Community"}
                        onChange={(e) => setPostForm({...postForm, category: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white appearance-none h-8 font-medium cursor-pointer"
                      >
                        <option value="Community">Community Advocacy</option>
                        <option value="Tutorial">Groove Tutorial</option>
                        <option value="Event Update">Event Update</option>
                        <option value="Sponsorship">Sponsorships & Ghetto Youth</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Short Excerpt</label>
                    <input
                      type="text"
                      placeholder="Brief one-line summary displayed on the blog roll..."
                      value={postForm.excerpt || ""}
                      onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Story Content (Supports markdown style)</label>
                    <textarea
                      placeholder="### Complete headers \nWrite text here... \n[Anchor Link](#hash) or [Button](#)"
                      value={postForm.content || ""}
                      onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-white h-24 outline-none resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Cover Image URL</label>
                    <input
                      type="text"
                      placeholder="Unsplash seed or online photo URL"
                      value={postForm.image_url || ""}
                      onChange={(e) => setPostForm({...postForm, image_url: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingState}
                    className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs tracking-wider uppercase cursor-pointer"
                  >
                    {savingState ? "Saving..." : "Publish Blog Article"}
                  </button>
                  {postForm.id && (
                    <button type="button" onClick={() => setPostForm({})} className="text-white text-xs w-full text-center mt-1 select-none py-1 block">Cancel</button>
                  )}
                </form>

                {/* List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider">Existing Articles</h4>
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {postList.map((post) => (
                      <div key={post.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between gap-3">
                        <div>
                          <span className="inline-block px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-[8px] font-mono font-bold text-orange-400 mb-1">{post.category}</span>
                          <span className="block text-xs font-bold text-white">{post.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono block">By {post.author} on {post.date}</span>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => setPostForm(post)}
                            className="p-1.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-md hover:text-white transition-colors cursor-pointer"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => deletePost(post.id)}
                            className="p-1.5 bg-slate-900 border border-slate-800 text-rose-400 rounded-md hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: APPAREL MERCH */}
          {activeTab === "merch" && (
            <div className="space-y-6">
              <h3 className="text-lg font-display font-extrabold text-white">Configure Apparel & Street Dance Merchandise</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form */}
                <form onSubmit={saveMerch} className="bg-slate-950 p-5 rounded-2xl border border-slate-850/60 space-y-4">
                  <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider">
                    {merchForm.id ? "Edit Apparel Item" : "Introduce New Merch Series"}
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Item Name</label>
                      <input
                        type="text"
                        placeholder="Sizzy Gold Peak Hoodie"
                        value={merchForm.name || ""}
                        onChange={(e) => setMerchForm({...merchForm, name: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Price (USD)</label>
                      <input
                        type="number"
                        placeholder="35"
                        value={merchForm.price || 0}
                        onChange={(e) => setMerchForm({...merchForm, price: Number(e.target.value)})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Description & Material Specs</label>
                    <textarea
                      placeholder="Heavy weight material, 100% Cotton, Ghetto Fund charity proceeds..."
                      value={merchForm.description || ""}
                      onChange={(e) => setMerchForm({...merchForm, description: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white h-16 outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Stock Level Ready</label>
                      <input
                        type="number"
                        placeholder="25"
                        value={merchForm.stock || 0}
                        onChange={(e) => setMerchForm({...merchForm, stock: Number(e.target.value)})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Display Image (URL or seed)</label>
                      <input
                        type="text"
                        placeholder="Apparel catalog photo seed"
                        value={merchForm.image_url || ""}
                        onChange={(e) => setMerchForm({...merchForm, image_url: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingState}
                    className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs tracking-wider uppercase cursor-pointer"
                  >
                    {savingState ? "Updating..." : "Save Merchandise Item"}
                  </button>
                  {merchForm.id && (
                    <button type="button" onClick={() => setMerchForm({})} className="text-white text-xs w-full text-center mt-1 select-none py-1 block">Cancel</button>
                  )}
                </form>

                {/* List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider">Catalog Listings</h4>
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {merchList.map((item) => (
                      <div key={item.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img src={item.image_url} alt={item.name} className="w-10 h-10 rounded object-cover border border-slate-800" />
                          <div>
                            <span className="block text-xs font-bold text-white">{item.name}</span>
                            <span className="text-[10px] text-emerald-400 font-mono font-bold">${item.price.toFixed(2)} — In Stock: {item.stock}</span>
                          </div>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => setMerchForm(item)}
                            className="p-1.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-md hover:text-white transition-colors cursor-pointer"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => deleteMerch(item.id)}
                            className="p-1.5 bg-slate-900 border border-slate-800 text-rose-400 rounded-md hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: YOUTUBE CLIPS */}
          {activeTab === "videos" && (
            <div className="space-y-6">
              <h3 className="text-lg font-display font-extrabold text-white">Configure YouTube Choreographies & Battles</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form */}
                <form onSubmit={saveVideo} className="bg-slate-950 p-5 rounded-2xl border border-slate-850/60 space-y-4">
                  <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider">Link Video Reel</h4>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Video Title</label>
                    <input
                      type="text"
                      placeholder="Dance Outreach 2025 Highlights"
                      value={videoForm.title || ""}
                      onChange={(e) => setVideoForm({...videoForm, title: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-white uppercase"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">YouTube Video ID (11 characters)</label>
                    <input
                      type="text"
                      placeholder="z6-eLzOfx5E"
                      value={videoForm.youtube_id || ""}
                      onChange={(e) => setVideoForm({...videoForm, youtube_id: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-white text-center"
                      required
                    />
                    <p className="text-[9px] text-slate-500 mt-1">E.g., for `youtube.com/watch?v=SMRgN_yU8Zg`, use <span className="font-mono text-orange-400">SMRgN_yU8Zg</span>.</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Video Description</label>
                    <input
                      type="text"
                      placeholder="Brief caption describing the class style..."
                      value={videoForm.description || ""}
                      onChange={(e) => setVideoForm({...videoForm, description: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingState}
                    className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs tracking-wider uppercase cursor-pointer"
                  >
                    {savingState ? "Saving..." : "Save Youtube Video Item"}
                  </button>
                </form>

                {/* List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider">Linked Video Feed</h4>
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {videoList.map((vid) => (
                      <div key={vid.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between gap-3">
                        <div>
                          <span className="block text-xs font-extrabold text-white uppercase">{vid.title}</span>
                          <span className="text-[10px] text-amber-500 font-mono font-bold">ID: {vid.youtube_id}</span>
                        </div>
                        <button
                          onClick={() => deleteVideo(vid.id)}
                          className="p-1.5 bg-slate-900 border border-slate-800 text-rose-400 rounded-md hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: INBOX LEADS SUBMISSIONS */}
          {activeTab === "inbox" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-display font-extrabold text-white">Leads, Partnership Applications & Donations</h3>
                  <p className="text-xs text-slate-400">Review messages entered by public users on the website.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Messages */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare size={13} className="text-orange-500" />
                    <span>Inquiry Messages ({initialData.messages.length})</span>
                  </h4>

                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {initialData.messages.length === 0 ? (
                      <p className="p-4 bg-slate-950 rounded-2xl text-xs text-slate-400 text-center border border-slate-850">Inbox is empty. No messages yet.</p>
                    ) : (
                      initialData.messages.map((msg) => (
                        <div key={msg.id} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-white">{msg.name}</span>
                            <span className="text-[9px] font-mono text-slate-500">{msg.date}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block font-mono">Email: {msg.email} | Subject: {msg.subject}</span>
                          <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-850">{msg.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Partnership Applications */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Briefcase size={13} className="text-amber-500" />
                    <span>Partner Requests ({initialData.partnershipApplications.length})</span>
                  </h4>

                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {initialData.partnershipApplications.length === 0 ? (
                      <p className="p-4 bg-slate-950 rounded-2xl text-xs text-slate-400 text-center border border-slate-850">No affiliate sponsor requests yet.</p>
                    ) : (
                      initialData.partnershipApplications.map((app) => (
                        <div key={app.id} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-white">{app.companyName}</span>
                            <span className="text-[9px] font-mono text-slate-500">{app.date}</span>
                          </div>
                          <span className="text-[10px] text-amber-500 block font-bold font-mono">Contact: {app.contactName} ({app.email}) | Type: {app.partnerType}</span>
                          <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-850">{app.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Logged Donations */}
              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-xs font-mono font-black text-amber-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <DollarSign size={13} />
                  <span>Sponsorship & Donator Logs ({initialData.donations.length})</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 overflow-y-auto max-h-[220px]">
                  {initialData.donations.map((gift) => (
                    <div key={gift.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl relative">
                      <div className="text-[10px] font-mono text-slate-500">{gift.date}</div>
                      <span className="block text-xs font-bold text-white mt-1">{gift.donorName}</span>
                      <span className="text-xs font-black text-emerald-400 font-mono">${gift.amount.toFixed(2)} {gift.currency}</span>
                      <span className="block text-[9px] text-slate-400 font-mono mt-1">Sponsoring: {gift.projectSupported}</span>
                    </div>
                  ))}
                  {initialData.donations.length === 0 && (
                    <p className="col-span-3 text-xs p-4 text-center text-slate-400 bg-slate-950 rounded-xl border border-slate-850/60">No custom donators logged yet.</p>
                  )}
                </div>
              </div>

              {/* Newsletter Subscriptions */}
              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-xs font-mono font-black text-orange-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span>Newsletter Subscriptions ({initialData.newsletter?.length || 0})</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 overflow-y-auto max-h-[220px]">
                  {(initialData.newsletter || []).map((sub) => (
                    <div key={sub.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between gap-1.5 label-container">
                      <div className="min-w-0 flex-1">
                        <span className="block text-xs font-bold text-white leading-tight font-mono truncate" title={sub.email}>{sub.email}</span>
                        <span className="text-[9px] font-mono text-slate-500 block mt-1">Joined: {sub.date}</span>
                      </div>
                      <button 
                        onClick={async () => {
                          if (!confirm(`Remove subscriber ${sub.email}?`)) return;
                          const updated = (initialData.newsletter || []).filter(item => item.id !== sub.id);
                          const success = await saveSegment("newsletter", updated);
                          if (success) {
                            notifySave("Subscriber removed successfully.");
                          }
                        }}
                        className="p-1 px-1.5 bg-slate-900 border border-slate-800 text-rose-400 text-[10px] font-mono hover:bg-rose-500/10 hover:text-rose-400 rounded-lg transition-all cursor-pointer shrink-0"
                      >
                        REMOVE
                      </button>
                    </div>
                  ))}
                  {(initialData.newsletter || []).length === 0 && (
                    <p className="col-span-3 text-xs p-4 text-center text-slate-400 bg-slate-950 rounded-xl border border-slate-850/60">No newsletter subscriptions logged yet.</p>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 9: SCROLLING SPONSORS */}
          {activeTab === "partners" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-display font-extrabold text-white uppercase">Scrolling Sponsors & Partners</h3>
                  <p className="text-xs text-slate-400 mt-1">Configure and manage sponsors displayed in the moving banner on the website.</p>
                </div>
                <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono font-bold rounded-full">
                  Count: {partnerLogosList.length}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form to Create/Edit Sponsor */}
                <form onSubmit={savePartnerLogo} className="bg-slate-950 p-6 rounded-2xl border border-slate-850/80 space-y-4 lg:col-span-1 h-fit">
                  <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider">
                    {partnerLogoForm.id ? "Edit Sponsor" : "Add Sponsor"}
                  </h4>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5 font-black">Sponsor Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Uganda DanceSport Federation"
                      value={partnerLogoForm.name || ""}
                      onChange={(e) => setPartnerLogoForm({ ...partnerLogoForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5 font-black">Logo Image URL</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={partnerLogoForm.logo_url || ""}
                      onChange={(e) => setPartnerLogoForm({ ...partnerLogoForm, logo_url: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
                    />
                    <p className="text-[10px] text-slate-500 mt-1.5">
                      Leave empty to automatically seed a beautiful placeholder logo.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={savingState}
                      className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-black text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      {savingState ? "Saving..." : partnerLogoForm.id ? "Apply Changes" : "Create Sponsor"}
                    </button>
                    {partnerLogoForm.id && (
                      <button
                        type="button"
                        onClick={() => setPartnerLogoForm({ id: "", name: "", logo_url: "" })}
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-bold rounded-xl"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                {/* List of Existing Sponsors */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider">Active Sponsors</h4>
                  {partnerLogosList.length === 0 ? (
                    <div className="p-8 text-center bg-slate-950 border border-slate-850 rounded-2xl">
                      <p className="text-xs text-slate-400">No active sponsors found. Add a sponsor to populate the scrolling ribbon.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {partnerLogosList.map((logo) => (
                        <div key={logo.id} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-16 h-10 bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden border border-slate-800/80 p-1 shrink-0">
                              <img
                                src={logo.logo_url}
                                alt={logo.name}
                                className="max-w-full max-h-full object-contain filter brightness-90 contrast-125"
                                onError={(e) => {
                                  // Fallback for broken images
                                  e.currentTarget.src = `https://picsum.photos/seed/${logo.id}/150/60`;
                                }}
                              />
                            </div>
                            <div className="min-w-0">
                              <h5 className="text-xs font-bold text-white truncate" title={logo.name}>
                                {logo.name}
                              </h5>
                              <span className="text-[9px] font-mono text-slate-500 block mt-0.5 truncate max-w-[150px]">
                                ID: {logo.id}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => setPartnerLogoForm(logo)}
                              className="p-1.5 bg-slate-900 border border-slate-850 hover:bg-slate-800 hover:text-white text-slate-400 rounded-lg transition-colors cursor-pointer"
                              title="Edit Sponsor"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => deletePartnerLogo(logo.id)}
                              className="p-1.5 bg-slate-900 border border-slate-850 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-400 text-slate-400 rounded-lg transition-colors cursor-pointer"
                              title="Delete Sponsor"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: DANCER TESTIMONIALS & REVIEWS */}
          {activeTab === "testimonials" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-display font-extrabold text-white uppercase">Dancer Testimonials & Reviews</h3>
                  <p className="text-xs text-slate-400 mt-1">Manage, moderate, and manually register community reviews & street stories.</p>
                </div>
                <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono font-bold rounded-full">
                  Count: {testimonialsList.length}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form to Create/Edit Testimonial */}
                <form onSubmit={saveTestimonial} className="bg-slate-950 p-6 rounded-2xl border border-slate-850/80 space-y-4 lg:col-span-1 h-fit">
                  <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider">
                    {testimonialForm.id ? "Edit Review" : "Add Direct Review"}
                  </h4>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5 font-black">Author Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Akram Lubega"
                      value={testimonialForm.author || ""}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, author: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5 font-black">Role / Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Street Dancer / Ghetto Youth Student"
                      value={testimonialForm.role || ""}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5 font-black">Rating (Stars)</label>
                    <select
                      value={testimonialForm.rating || 5}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                      <option value="3">⭐⭐⭐ (3 Stars)</option>
                      <option value="2">⭐⭐ (2 Stars)</option>
                      <option value="1">⭐ (1 Star)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5 font-black">Review Content</label>
                    <textarea
                      placeholder="Share their testimony or review text..."
                      value={testimonialForm.content || ""}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white resize-none"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      id="testimonial-approved-cb"
                      checked={testimonialForm.approved !== false}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, approved: e.target.checked })}
                      className="w-4 h-4 text-orange-500 bg-slate-900 border-slate-800 rounded focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="testimonial-approved-cb" className="text-xs text-slate-300 font-mono select-none cursor-pointer">
                      Approved & Live on Site
                    </label>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={savingState}
                      className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-black text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      {savingState ? "Saving..." : testimonialForm.id ? "Apply Changes" : "Submit Review"}
                    </button>
                    {testimonialForm.id && (
                      <button
                        type="button"
                        onClick={() => setTestimonialForm({ id: "", author: "", role: "Street Dancer", content: "", rating: 5, approved: true })}
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-bold rounded-xl"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                {/* List of Testimonials */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider">Dancer Voices & Reviews List</h4>
                  {testimonialsList.length === 0 ? (
                    <div className="p-8 text-center bg-slate-950 border border-slate-850 rounded-2xl">
                      <p className="text-xs text-slate-400">No testimonials or reviews submitted yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {testimonialsList.map((test) => (
                        <div key={test.id} className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="text-sm font-black text-white">{test.author}</h5>
                                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                                  test.approved !== false 
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                }`}>
                                  {test.approved !== false ? "Approved" : "Pending Moderation"}
                                </span>
                              </div>
                              <span className="text-xs text-slate-400 block font-mono">{test.role}</span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setTestimonialForm(test)}
                                className="p-1.5 bg-slate-900 border border-slate-850 hover:bg-slate-800 hover:text-white text-slate-400 rounded-lg transition-colors cursor-pointer"
                                title="Edit Review"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => deleteTestimonial(test.id)}
                                className="p-1.5 bg-slate-900 border border-slate-850 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-400 text-slate-400 rounded-lg transition-colors cursor-pointer"
                                title="Delete Review"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star
                                key={index}
                                size={12}
                                className={index < test.rating ? "fill-orange-500 text-orange-500" : "text-slate-700"}
                              />
                            ))}
                            <span className="text-[10px] font-mono text-slate-500 ml-1.5">Rating: {test.rating}/5</span>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed italic">
                            "{test.content}"
                          </p>

                          <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                            <span>ID: {test.id}</span>
                            <span>Date: {test.date || "N/A"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: GLOBAL SYSTEM SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h3 className="text-lg font-display font-extrabold text-white">Global Configuration & Security</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Global Parameters Form */}
                <form onSubmit={saveSettings} className="bg-slate-950 p-6 rounded-2xl border border-slate-850/80 space-y-4">
                  <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider">System Parameters</h4>
                  
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5 font-black">Support Hotline (Floating WhatsApp Number)</label>
                    <input
                      type="text"
                      placeholder="256700000000"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white"
                    />
                    <p className="text-[10px] text-slate-500 mt-1.5">Enter direct dialect with country prefix (e.g., <span className="font-mono text-orange-400">256...</span> for Uganda). Avoid any spaces, pluses, or dashes.</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5 font-black">Google Maps Business Review solicitation link</label>
                    <input
                      type="text"
                      placeholder="https://g.page/r/sizzyafro-mbarara/review"
                      value={googleReviews}
                      onChange={(e) => setGoogleReviews(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingState}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-black text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    {savingState ? "Saving to Firestore..." : "Write System Global Parameters"}
                  </button>
                </form>

                {/* Administrator Security Form */}
                <form onSubmit={handlePasswordChange} className="bg-slate-950 p-6 rounded-2xl border border-slate-850/80 space-y-4">
                  <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider">Administrator Security</h4>
                  
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5 font-black">Current Access Passcode</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={currentPasswordInput}
                      onChange={(e) => setCurrentPasswordInput(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5 font-black">New Access Passcode</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5 font-black">Confirm New Passcode</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                      required
                    />
                  </div>

                  {passwordError && (
                    <p className="text-xs text-red-400 font-bold bg-red-400/10 p-2.5 rounded-xl">{passwordError}</p>
                  )}

                  {passwordSuccess && (
                    <p className="text-xs text-emerald-400 font-bold bg-emerald-500/10 p-2.5 rounded-xl">{passwordSuccess}</p>
                  )}

                  <button
                    type="submit"
                    disabled={savingState}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-black text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    {savingState ? "Saving to Firestore..." : "Update Passcode"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 8: EVENT RSVPS REGISTRATIONS */}
          {activeTab === "rsvps" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-display font-extrabold text-white uppercase">Event Registrations & RSVP Records</h3>
                  <p className="text-xs text-slate-400 mt-1">Dancers, competitors, and spectators who signed up for workshops and battle alerts.</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-bold rounded-full">
                  Total Registrants: {rsvpList.length}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {rsvpList.length === 0 ? (
                  <div className="p-12 text-center bg-slate-950 border border-slate-850 rounded-2xl space-y-2">
                    <p className="text-sm font-bold text-slate-300">No RSVP registrations logged yet</p>
                    <p className="text-xs text-slate-500">When users select "RSVP" on live events, their tickets will display here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto bg-slate-950 border border-slate-850/60 rounded-2xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-850 text-slate-400 text-[10px] font-mono uppercase bg-slate-900/60">
                          <th className="p-3.5 pl-4 font-black">Registrant</th>
                          <th className="p-3.5 font-black">Contact Info</th>
                          <th className="p-3.5 font-black">Registered Event</th>
                          <th className="p-3.5 font-black">Participant Role</th>
                          <th className="p-3.5 font-black">Sign-up Date</th>
                          <th className="p-3.5 pr-4 text-right font-black">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850/50 text-slate-300 text-xs font-medium">
                        {rsvpList.map((rsvp) => (
                          <tr key={rsvp.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="p-3.5 pl-4 font-bold text-white uppercase">{rsvp.name}</td>
                            <td className="p-3.5">
                              <span className="block font-mono text-[11px] text-slate-200">{rsvp.phone}</span>
                              <span className="block text-[10px] text-slate-400 mt-0.5">{rsvp.email}</span>
                            </td>
                            <td className="p-3.5 text-xs text-orange-400 uppercase font-bold max-w-xs truncate" title={rsvp.eventTitle}>
                              {rsvp.eventTitle}
                            </td>
                            <td className="p-3.5">
                              <span className={`inline-block px-2 py-0.5 text-[9px] font-bold rounded-full ${
                                rsvp.role === "Competitor / Dancer" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                                rsvp.role === "Spectator / Audience" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                                rsvp.role === "Crew Representative" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                                "bg-slate-850 text-slate-400 border border-slate-800"
                              }`}>
                                {rsvp.role}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono text-[10px] text-slate-500">{rsvp.date}</td>
                            <td className="p-3.5 pr-4 text-right">
                              <button
                                onClick={() => deleteRsvp(rsvp.id)}
                                className="p-1.5 bg-slate-900 border border-slate-850 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-400 text-slate-400 rounded-lg transition-colors cursor-pointer"
                                title="Clear registrant"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
