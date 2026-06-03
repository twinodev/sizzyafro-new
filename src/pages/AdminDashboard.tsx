/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
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
  DonateLog,
  BlogBlock,
  AppSettings
} from "../types";
import {
  Lock,
  Unlock,
  Plus,
  Trash,
  Edit,
  Save,
  Check,
  X,
  FileText,
  Users,
  Calendar,
  Gift,
  Film,
  MessageSquare,
  Sparkles,
  Heart,
  Database,
  Grid,
  Menu,
  Eye,
  Settings,
  CornerDownRight,
  TrendingUp,
  Image as ImageIcon,
  Key as KeyIcon,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { saveAdminSection } from "../api";
import SEO from "../components/SEO";

interface AdminProps {
  initialState: {
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
    settings?: AppSettings;
  };
  onRefresh: () => void;
}

export default function AdminDashboard({ initialState, onRefresh }: AdminProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [activeMenu, setActiveMenu] = useState<
    "stats" | "team" | "events" | "blog" | "merchandise" | "videos" | "partners" | "testimonials" | "messages" | "partnerships" | "donations" | "settings" | "raw"
  >("stats");

  // Authentication logic
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        setIsAuthenticated(true);
      } else {
        const errorData = await res.json();
        setErrorMsg(errorData.error || "Incorrect credentials");
      }
    } catch (err) {
      setErrorMsg("Network connection error.");
    }
  };

  // State sections cache
  const [team, setTeam] = useState<TeamMember[]>(initialState.team);
  const [events, setEvents] = useState<EventItem[]>(initialState.events);
  const [blog, setBlog] = useState<BlogPost[]>(initialState.blog);
  const [merchandise, setMerchandise] = useState<MerchandiseItem[]>(initialState.merchandise);
  const [videos, setVideos] = useState<VideoItem[]>(initialState.videos);
  const [partners, setPartners] = useState<PartnerLogo[]>(initialState.partners);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialState.testimonials);
  const [messages, setMessages] = useState<MessageItem[]>(initialState.messages);
  const [partnerships, setPartnerships] = useState<PartnerApplication[]>(initialState.partnerships);
  const [donations, setDonations] = useState<DonateLog[]>(initialState.donations);
  const [settings, setSettings] = useState<AppSettings>(initialState.settings || { adminPassword: "", logoUrl: "", heroBgUrl: "" });

  const [jsonText, setJsonText] = useState(JSON.stringify(initialState, null, 2));

  // Settings & Logo states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [logoInputUrl, setLogoInputUrl] = useState("");
  const [heroBgInputUrl, setHeroBgInputUrl] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [logoSuccess, setLogoSuccess] = useState("");
  const [heroBgSuccess, setHeroBgSuccess] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  React.useEffect(() => {
    if (settings && settings.logoUrl !== undefined) {
      setLogoInputUrl(settings.logoUrl || "");
    }
    if (settings && settings.heroBgUrl !== undefined) {
      setHeroBgInputUrl(settings.heroBgUrl || "");
    }
  }, [settings]);

  // Edit states variables
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Sync caches when updated outside
  const syncStateCache = (section: string, updatedData: any) => {
    if (section === "team") setTeam(updatedData);
    if (section === "events") setEvents(updatedData);
    if (section === "blog") setBlog(updatedData);
    if (section === "merchandise") setMerchandise(updatedData);
    if (section === "videos") setVideos(updatedData);
    if (section === "partners") setPartners(updatedData);
    if (section === "testimonials") setTestimonials(updatedData);
    if (section === "messages") setMessages(updatedData);
    if (section === "partnerships") setPartnerships(updatedData);
    if (section === "donations") setDonations(updatedData);
    if (section === "settings") setSettings(updatedData);
  };

  const handleSaveSection = async (section: any, updatedData: any) => {
    setSaveStatus(null);
    try {
      await saveAdminSection(section, updatedData, token);
      syncStateCache(section, updatedData);
      setSaveStatus(`Successfully saved '${section}' configurations.`);
      setTimeout(() => setSaveStatus(null), 3000);
      onRefresh();
    } catch (err: any) {
      alert(err.message || "Failed to sync update.");
    }
  };

  // Generic item creation and delete utilities
  const handleDeleteItem = (section: any, id: string, currentList: any[]) => {
    const updated = currentList.filter((item) => item.id !== id);
    handleSaveSection(section, updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans text-sm min-h-[80vh]">
      <SEO
        title="Admin Control Center"
        description="Private crawl-free admin operations manager for Dance With Sizzy Afro configurations."
      />

      {!isAuthenticated ? (
        <div className="max-w-md mx-auto py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-2xl relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -z-10" />

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-orange-500/15 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Lock className="w-5 h-5" />
              </div>
              <h1 className="font-display font-extrabold text-2xl text-white">Sizzy Afro Admin Center</h1>
              <p className="text-slate-500 text-xs uppercase tracking-wider">Secure Crawl-Free Stage</p>
            </div>

            {/* Sandbox Credentials Helper banner */}
            <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 p-4 rounded-2xl text-xs flex flex-col gap-2">
              <div className="flex items-center gap-1.5 font-bold">
                <Unlock className="w-3.5 h-3.5" />
                <span>Sandbox Testing Admin Credentials</span>
              </div>
              <div className="space-y-1 text-slate-300">
                <p>Use these credentials to easily log in and test your settings during development:</p>
                <p className="pt-1">
                  • Admin Username: <code className="bg-slate-950 px-1.5 py-0.5 rounded text-orange-400 font-mono text-[11px] font-bold">admin</code>
                </p>
                <p>
                  • Security Password: <code className="bg-slate-950 px-1.5 py-0.5 rounded text-orange-400 font-mono text-[11px] font-bold">change-me-to-secure-password</code>
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-slate-400 font-bold block mb-1 text-xs">Admin Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g., admin"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-orange-500 text-xs"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1 text-xs">Security Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secret credentials"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-orange-500 text-xs placeholder-slate-700 font-mono"
                />
              </div>

              {errorMsg && (
                <div className="bg-red-500/15 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs font-bold text-center">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold py-3 rounded-xl shadow-xl hover:shadow-orange-500/15 transition-all text-xs flex items-center justify-center gap-1.5"
              >
                <Unlock className="w-4 h-4" />
                <span>Verify & Unlock Portal</span>
              </button>
            </form>
          </motion.div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Side navigation rail */}
          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 p-4 rounded-3xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-9 h-9 bg-orange-500/10 text-orange-500 rounded-lg flex items-center justify-center shrink-0">
                <Settings className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-white text-sm">Control Console</h2>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Authorized Logged-in</p>
              </div>
            </div>

            <nav className="flex flex-col gap-1 text-xs">
              <button
                onClick={() => setActiveMenu("stats")}
                className={`py-2 px-3 rounded-xl font-semibold text-left transition-all flex items-center gap-2 ${
                  activeMenu === "stats" ? "bg-orange-500 text-white" : "text-slate-400 hover:bg-slate-950 hover:text-white"
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>Executive Stats</span>
              </button>

              <button
                onClick={() => setActiveMenu("team")}
                className={`py-2 px-3 rounded-xl font-semibold text-left transition-all flex items-center gap-2 ${
                  activeMenu === "team" ? "bg-orange-500 text-white" : "text-slate-400 hover:bg-slate-950 hover:text-white"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Team Choreographers</span>
              </button>

              <button
                onClick={() => setActiveMenu("events")}
                className={`py-2 px-3 rounded-xl font-semibold text-left transition-all flex items-center gap-2 ${
                  activeMenu === "events" ? "bg-orange-500 text-white" : "text-slate-400 hover:bg-slate-950 hover:text-white"
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Configure Events</span>
              </button>

              <button
                onClick={() => setActiveMenu("blog")}
                className={`py-2 px-3 rounded-xl font-semibold text-left transition-all flex items-center gap-2 ${
                  activeMenu === "blog" ? "bg-orange-500 text-white" : "text-slate-400 hover:bg-slate-950 hover:text-white"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Blog Articles</span>
              </button>

              <button
                onClick={() => setActiveMenu("merchandise")}
                className={`py-2 px-3 rounded-xl font-semibold text-left transition-all flex items-center gap-2 ${
                  activeMenu === "merchandise" ? "bg-orange-500 text-white" : "text-slate-400 hover:bg-slate-950 hover:text-white"
                }`}
              >
                <Gift className="w-4 h-4" />
                <span>Merchandise</span>
              </button>

              <button
                onClick={() => setActiveMenu("videos")}
                className={`py-2 px-3 rounded-xl font-semibold text-left transition-all flex items-center gap-2 ${
                  activeMenu === "videos" ? "bg-orange-500 text-white" : "text-slate-400 hover:bg-slate-950 hover:text-white"
                }`}
              >
                <Film className="w-4 h-4" />
                <span>YouTube Media</span>
              </button>

              <button
                onClick={() => setActiveMenu("partners")}
                className={`py-2 px-3 rounded-xl font-semibold text-left transition-all flex items-center gap-2 ${
                  activeMenu === "partners" ? "bg-orange-500 text-white" : "text-slate-400 hover:bg-slate-950 hover:text-white"
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Sponsors / Partners</span>
              </button>

              <button
                onClick={() => setActiveMenu("testimonials")}
                className={`py-2 px-3 rounded-xl font-semibold text-left transition-all flex items-center gap-2 ${
                  activeMenu === "testimonials" ? "bg-orange-500 text-white" : "text-slate-400 hover:bg-slate-950 hover:text-white"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Public Testimonials</span>
              </button>

              <button
                onClick={() => setActiveMenu("messages")}
                className={`py-2 px-3 rounded-xl font-semibold text-left transition-all flex items-center gap-2 relative ${
                  activeMenu === "messages" ? "bg-orange-500 text-white" : "text-slate-400 hover:bg-slate-950 hover:text-white"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Received Enquiries</span>
                {messages.length > 0 && (
                  <span className="absolute right-3 bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                    {messages.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveMenu("partnerships")}
                className={`py-2 px-3 rounded-xl font-semibold text-left transition-all flex items-center gap-2 relative ${
                  activeMenu === "partnerships" ? "bg-orange-500 text-white" : "text-slate-400 hover:bg-slate-950 hover:text-white"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Partners Proposals</span>
                {partnerships.filter(p => p.status === "pending").length > 0 && (
                  <span className="absolute right-3 bg-orange-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                    {partnerships.filter(p => p.status === "pending").length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveMenu("donations")}
                className={`py-2 px-3 rounded-xl font-semibold text-left transition-all flex items-center gap-2 ${
                  activeMenu === "donations" ? "bg-orange-500 text-white" : "text-slate-400 hover:bg-slate-950 hover:text-white"
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Donation Ledger</span>
              </button>

              <button
                onClick={() => setActiveMenu("settings")}
                className={`py-2 px-3 rounded-xl font-semibold text-left transition-all flex items-center gap-2 ${
                  activeMenu === "settings" ? "bg-orange-500 text-white" : "text-slate-400 hover:bg-slate-950 hover:text-white"
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings & Logo</span>
              </button>

              <button
                onClick={() => setActiveMenu("raw")}
                className={`py-2 px-3 border-t border-slate-850 mt-2 rounded-xl font-mono text-slate-400 text-left transition-all flex items-center gap-2 hover:bg-slate-950 hover:text-white`}
              >
                <Database className="w-3.5 h-3.5 text-orange-500" />
                <span>Raw Database Control</span>
              </button>
            </nav>
          </div>

          {/* Main workspace section */}
          <div className="lg:col-span-9 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl min-h-[60vh] space-y-6 relative">
            {saveStatus && (
              <div className="bg-emerald-555 border border-emerald-500 bg-emerald-500/10 text-emerald-400 text-xs p-3 rounded-xl font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>{saveStatus}</span>
              </div>
            )}

            {/* 1. Executive stats */}
            {activeMenu === "stats" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <h3 className="font-display font-extrabold text-xl text-white">Sizzy Afro Metrics Dashboard</h3>
                  <span className="text-[10px] font-mono font-bold bg-orange-500/15 text-orange-400 px-3 py-1 rounded">System Live</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <p className="text-slate-500 uppercase text-[9px] tracking-wider font-bold">Choreographers</p>
                    <p className="font-display font-black text-2xl text-white mt-1">{team.length}</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <p className="text-slate-500 uppercase text-[9px] tracking-wider font-bold">Planned Events</p>
                    <p className="font-display font-black text-2xl text-white mt-1">{events.length}</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <p className="text-slate-500 uppercase text-[9px] tracking-wider font-bold">Journal Entries</p>
                    <p className="font-display font-black text-2xl text-white mt-1">{blog.length}</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <p className="text-slate-500 uppercase text-[9px] tracking-wider font-bold">Total Donations</p>
                    <p className="font-display font-black text-2xl text-orange-500 mt-1">
                      {donations.length > 0 ? donations.reduce((sum, curr) => sum + Number(curr.amount), 0).toLocaleString() : "0"} 
                      <span className="text-xs text-slate-400 font-sans block">Simulated UGX equivalent</span>
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/40 p-6 border border-slate-850 rounded-2xl space-y-4">
                  <h4 className="font-display font-bold text-white text-sm">System Integrations Indicator Channels</h4>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 bg-green-500/10 p-2.5 rounded-xl border border-green-500/20 text-green-400 text-xs">
                      <Check className="w-4 h-4" />
                      <span>SMTP Mail: Brevo Handler Configured</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20 text-blue-400 text-xs shadow-md">
                      <Database className="w-4 h-4" />
                      <span>Database: Cloud-Scale JSON Persistent Engine</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Team section */}
            {activeMenu === "team" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <h3 className="font-display font-extrabold text-white text-lg">Manage Team Choreographers</h3>
                  <button
                    onClick={() => {
                      const newMem: TeamMember = {
                        id: "team-" + Date.now(),
                        name: "New Coach",
                        role: "Instructor",
                        bio: "Short professional choreographer biography details.",
                        achievements: ["Sizzy Afro Certified Instructor"],
                        profile_picture: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600",
                        socials: { instagram: "https://instagram.com" }
                      };
                      const updated = [...team, newMem];
                      handleSaveSection("team", updated);
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1.5 px-4 rounded-xl text-xs flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Choreographer</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {team.map((mem) => (
                    <div key={mem.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col md:flex-row gap-4 justify-between items-start">
                      <div className="flex gap-3 items-center">
                        <img src={mem.profile_picture} alt="team" className="w-12 h-12 object-cover rounded-full border border-slate-850" referrerPolicy="no-referrer" />
                        <div>
                          <input
                            type="text"
                            value={mem.name}
                            onChange={(e) => {
                              const updated = team.map((item) => (item.id === mem.id ? { ...item, name: e.target.value } : item));
                              setTeam(updated);
                            }}
                            className="bg-slate-900 border border-slate-800 text-white font-bold text-xs py-1 px-2.5 rounded focus:outline-none focus:border-orange-500"
                          />
                          <input
                            type="text"
                            value={mem.role}
                            onChange={(e) => {
                              const updated = team.map((item) => (item.id === mem.id ? { ...item, role: e.target.value } : item));
                              setTeam(updated);
                            }}
                            className="bg-slate-900 border border-slate-800 text-orange-500 font-bold text-[10px] py-1 px-2.5 rounded focus:outline-none focus:border-orange-500 block mt-1"
                          />
                        </div>
                      </div>

                      <div className="flex-1 w-full md:px-4 space-y-2">
                        <p className="text-[10px] uppercase font-black text-slate-500">Mentorship Bio Details</p>
                        <textarea
                          rows={2}
                          value={mem.bio}
                          onChange={(e) => {
                            const updated = team.map((item) => (item.id === mem.id ? { ...item, bio: e.target.value } : item));
                            setTeam(updated);
                          }}
                          className="w-full bg-slate-900 border border-slate-820 text-slate-300 text-xs py-1.5 px-2.5 rounded focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="flex gap-2 self-end">
                        <button
                          onClick={() => handleSaveSection("team", team)}
                          className="p-1 px-3 bg-green-600 hover:bg-green-500 text-white text-xs rounded-lg font-bold flex items-center gap-1"
                          title="Save adjustments"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={() => handleDeleteItem("team", mem.id, team)}
                          className="p-2 bg-red-600/10 hover:bg-red-600 hover:text-white text-red-500 rounded-lg"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Configure Events */}
            {activeMenu === "events" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <h3 className="font-display font-extrabold text-white text-lg">Manage Classes & Battles</h3>
                  <button
                    onClick={() => {
                      const newEv: EventItem = {
                        id: "ev-" + Date.now(),
                        title: "New Dance Workshop",
                        description: "Full description of training or battle categories...",
                        date: "2026-08-01",
                        time: "4:00 PM",
                        location: "Dance Studio, Mbarara",
                        flyer_url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200",
                        cta_label: "Register via WhatsApp",
                        cta_link: "https://whatsapp.com",
                        category: "classes",
                        seo_title: "Class Title Meta",
                        seo_description: "Class Description Meta",
                        seo_keywords: "class, dance, mbarara"
                      };
                      const updated = [...events, newEv];
                      handleSaveSection("events", updated);
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1.5 px-4 rounded-xl text-xs flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Schedule Item</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {events.map((ev) => (
                    <div key={ev.id} className="bg-slate-950 p-6 rounded-xl border border-slate-850 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-slate-500 font-bold block mb-1 text-[10px] uppercase">Title</label>
                          <input
                            type="text"
                            value={ev.title}
                            onChange={(e) => {
                              const updated = events.map((item) => (item.id === ev.id ? { ...item, title: e.target.value } : item));
                              setEvents(updated);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 text-white font-bold py-1.5 px-2.5 rounded focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 font-bold block mb-1 text-[10px] uppercase">Location</label>
                          <input
                            type="text"
                            value={ev.location}
                            onChange={(e) => {
                              const updated = events.map((item) => (item.id === ev.id ? { ...item, location: e.target.value } : item));
                              setEvents(updated);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 text-white py-1.5 px-2.5 rounded"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 font-bold block mb-1 text-[10px] uppercase">Date & Theme</label>
                          <input
                            type="text"
                            value={ev.date}
                            onChange={(e) => {
                              const updated = events.map((item) => (item.id === ev.id ? { ...item, date: e.target.value } : item));
                              setEvents(updated);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 text-white py-1.5 px-2.5 rounded"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-500 font-bold block mb-1 text-[10px] uppercase">Description</label>
                        <textarea
                          rows={2}
                          value={ev.description}
                          onChange={(e) => {
                            const updated = events.map((item) => (item.id === ev.id ? { ...item, description: e.target.value } : item));
                            setEvents(updated);
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-300 text-xs py-1.5 px-2.5 rounded focus:outline-none"
                        />
                      </div>

                      {/* CTA & SEO fields */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded bg-slate-900/40 border border-slate-850">
                        <div>
                          <label className="text-slate-500 font-bold block mb-1 text-[9px] uppercase">CTA Label</label>
                          <input
                            type="text"
                            value={ev.cta_label}
                            onChange={(e) => {
                              const updated = events.map((item) => (item.id === ev.id ? { ...item, cta_label: e.target.value } : item));
                              setEvents(updated);
                            }}
                            className="w-full bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 font-bold block mb-1 text-[9px] uppercase">CTA Link</label>
                          <input
                            type="text"
                            value={ev.cta_link}
                            onChange={(e) => {
                              const updated = events.map((item) => (item.id === ev.id ? { ...item, cta_link: e.target.value } : item));
                              setEvents(updated);
                            }}
                            className="w-full bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 font-bold block mb-1 text-[9px] uppercase">SEO Title</label>
                          <input
                            type="text"
                            value={ev.seo_title}
                            onChange={(e) => {
                              const updated = events.map((item) => (item.id === ev.id ? { ...item, seo_title: e.target.value } : item));
                              setEvents(updated);
                            }}
                            className="w-full bg-slate-950 border border-slate-800 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 font-bold block mb-1 text-[9px] uppercase">Flyer Link</label>
                          <input
                            type="text"
                            value={ev.flyer_url}
                            onChange={(e) => {
                              const updated = events.map((item) => (item.id === ev.id ? { ...item, flyer_url: e.target.value } : item));
                              setEvents(updated);
                            }}
                            className="w-full bg-slate-950 border border-slate-800 text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-2 border-t border-slate-850/60">
                        <button
                          onClick={() => handleSaveSection("events", events)}
                          className="bg-green-600 hover:bg-green-500 text-white font-bold py-1 px-4 rounded text-xs flex items-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Event configuration</span>
                        </button>
                        <button
                          onClick={() => handleDeleteItem("events", ev.id, events)}
                          className="bg-red-600/10 hover:bg-red-600 hover:text-white text-red-500 py-1.5 px-3 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Blog section */}
            {activeMenu === "blog" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <h3 className="font-display font-extrabold text-white text-lg">Manage Blog Posts & Rich Content</h3>
                  <button
                    onClick={() => {
                      const newP: BlogPost = {
                        id: "post-" + Date.now(),
                        slug: "new-breakthrough-dance",
                        title: "Unveiling Afro Rhythm Mastery",
                        excerpt: "Excerpt preview details which appear on listings...",
                        category: "Education",
                        author: "Twinomujuni Emmanuel",
                        date: new Date().toISOString().split("T")[0],
                        image_url: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=800",
                        blocks: [{ type: "paragraph", value: "Start writing content blocks here..." }],
                        likes: 0,
                        comments: [],
                        seo_title: "SEO Title configuration",
                        seo_description: "SEO Description configuration"
                      };
                      const updated = [...blog, newP];
                      handleSaveSection("blog", updated);
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1.5 px-4 rounded-xl text-xs flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Blog Post</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {blog.map((post) => (
                    <div key={post.id} className="bg-slate-950 p-6 rounded-xl border border-slate-850 space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-slate-500 font-bold block mb-1 text-[10px] uppercase">Title</label>
                          <input
                            type="text"
                            value={post.title}
                            onChange={(e) => {
                              const updated = blog.map((item) => (item.id === post.id ? { ...item, title: e.target.value } : item));
                              setBlog(updated);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 font-bold block mb-1 text-[10px] uppercase">Category</label>
                          <input
                            type="text"
                            value={post.category}
                            onChange={(e) => {
                              const updated = blog.map((item) => (item.id === post.id ? { ...item, category: e.target.value } : item));
                              setBlog(updated);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 font-bold block mb-1 text-[10px] uppercase">Slug</label>
                          <input
                            type="text"
                            value={post.slug}
                            onChange={(e) => {
                              const updated = blog.map((item) => (item.id === post.id ? { ...item, slug: e.target.value } : item));
                              setBlog(updated);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 text-xs"
                          />
                        </div>
                      </div>

                      {/* Custom Rich block editor overview */}
                      <div className="space-y-2.5">
                        <p className="text-slate-500 uppercase text-[9px] tracking-wider font-bold">Rich Content Blocks</p>
                        {post.blocks && post.blocks.map((block, bIdx) => (
                          <div key={bIdx} className="flex gap-2 items-center bg-slate-900/50 p-2 border border-slate-850 rounded">
                            <span className="text-[9px] uppercase font-bold text-orange-500 shrink-0 w-16">{block.type}:</span>
                            <input
                              type="text"
                              value={block.value}
                              onChange={(e) => {
                                const newBlocks = [...post.blocks];
                                newBlocks[bIdx] = { ...newBlocks[bIdx], value: e.target.value } as any;
                                const updated = blog.map((item) => (item.id === post.id ? { ...item, blocks: newBlocks } : item));
                                setBlog(updated);
                              }}
                              className="flex-1 bg-slate-950 border border-slate-800 text-slate-350 text-xs py-1 px-2.5 rounded focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                const newBlocks = post.blocks.filter((_, idx) => idx !== bIdx);
                                const updated = blog.map((item) => (item.id === post.id ? { ...item, blocks: newBlocks } : item));
                                setBlog(updated);
                              }}
                              className="text-red-500 text-xs font-bold font-mono px-2"
                              title="Delete block"
                            >
                              X
                            </button>
                          </div>
                        ))}
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const newBlocks = [...post.blocks, { type: "paragraph", value: "New paragraph block..." } as BlogBlock];
                              const updated = blog.map((item) => (item.id === post.id ? { ...item, blocks: newBlocks } : item));
                              setBlog(updated);
                            }}
                            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 py-1 px-3 text-[10px] rounded"
                          >
                            + Paragraph Block
                          </button>
                          <button
                            onClick={() => {
                              const newBlocks = [...post.blocks, { type: "heading", value: "New heading block...", level: 2 } as BlogBlock];
                              const updated = blog.map((item) => (item.id === post.id ? { ...item, blocks: newBlocks } : item));
                              setBlog(updated);
                            }}
                            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 py-1 px-3 text-[10px] rounded"
                          >
                            + Heading Block
                          </button>
                          <button
                            onClick={() => {
                              const newBlocks = [...post.blocks, { type: "button", value: "Button Label", url: "/events" } as BlogBlock];
                              const updated = blog.map((item) => (item.id === post.id ? { ...item, blocks: newBlocks } : item));
                              setBlog(updated);
                            }}
                            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 py-1 px-3 text-[10px] rounded"
                          >
                            + Button Link
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end border-t border-slate-850/60 pt-4">
                        <button
                          onClick={() => handleSaveSection("blog", blog)}
                          className="bg-green-600 hover:bg-green-500 text-white font-bold py-1 px-4 text-xs rounded"
                        >
                          Save Blog Post
                        </button>
                        <button
                          onClick={() => handleDeleteItem("blog", post.id, blog)}
                          className="bg-red-650/15 py-1 px-3 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded"
                        >
                          Remove Post
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Merchandise section */}
            {activeMenu === "merchandise" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <h3 className="font-display font-extrabold text-white text-lg">Manage Merchandise Store</h3>
                  <button
                    onClick={() => {
                      const newM: MerchandiseItem = {
                        id: "m-" + Date.now(),
                        name: "Custom Sizzy Cap",
                        price: 35000,
                        description: "High quality curved-bill cap styled perfectly for urban battling setups.",
                        image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500",
                        sizes: ["S", "M", "L"],
                        stock: 25,
                        seo_title: "Street Cap Meta",
                        seo_description: "Buy street cap"
                      };
                      const updated = [...merchandise, newM];
                      handleSaveSection("merchandise", updated);
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1.5 px-4 rounded-xl text-xs flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Merchandise</span>
                  </button>
                </div>

                <div className="space-y-6 animate-fade-in">
                  {merchandise.map((item) => (
                    <div key={item.id} className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-slate-500 font-bold block text-[10px] uppercase">Item Name</label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                              const updated = merchandise.map((m) => (m.id === item.id ? { ...m, name: e.target.value } : m));
                              setMerchandise(updated);
                            }}
                            className="w-full bg-slate-940 border border-slate-800 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 font-bold block text-[10px] uppercase">Price (UGX)</label>
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => {
                              const updated = merchandise.map((m) => (m.id === item.id ? { ...m, price: Number(e.target.value) } : m));
                              setMerchandise(updated);
                            }}
                            className="w-full bg-slate-945 border border-slate-800 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 font-bold block text-[10px] uppercase">Stock</label>
                          <input
                            type="number"
                            value={item.stock}
                            onChange={(e) => {
                              const updated = merchandise.map((m) => (m.id === item.id ? { ...m, stock: Number(e.target.value) } : m));
                              setMerchandise(updated);
                            }}
                            className="w-full bg-slate-950 border border-slate-800 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 font-bold block text-[10px] uppercase">Photos Link</label>
                          <input
                            type="text"
                            value={item.image_url}
                            onChange={(e) => {
                              const updated = merchandise.map((m) => (m.id === item.id ? { ...m, image_url: e.target.value } : m));
                              setMerchandise(updated);
                            }}
                            className="w-full bg-slate-950 border border-slate-800 text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end border-t border-slate-850/60 pt-4">
                        <button
                          onClick={() => handleSaveSection("merchandise", merchandise)}
                          className="bg-green-650 py-1.5 px-4 bg-green-600 hover:bg-green-500 text-white font-bold text-xs rounded"
                        >
                          Save Items
                        </button>
                        <button
                          onClick={() => handleDeleteItem("merchandise", item.id, merchandise)}
                          className="bg-red-500/10 text-red-500 hover:bg-red-650 hover:text-white rounded py-1.5 px-3"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Videos section */}
            {activeMenu === "videos" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <h3 className="font-display font-extrabold text-white text-lg">Manage YouTube Videos</h3>
                  <button
                    onClick={() => {
                      const newV: VideoItem = {
                        id: "vid-" + Date.now(),
                        title: "Dynamic Sizzy Move Breakbeat",
                        description: "New performance reel uploaded directly.",
                        youtube_id: "eS9_V3R3_Cg",
                        date: new Date().toISOString().split("T")[0]
                      };
                      const updated = [...videos, newV];
                      handleSaveSection("videos", updated);
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1.5 px-4 rounded-xl text-xs flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Video</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {videos.map((vid) => (
                    <div key={vid.id} className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-slate-500 font-bold block text-xs">Title</label>
                          <input
                            type="text"
                            value={vid.title}
                            onChange={(e) => {
                              const updated = videos.map((v) => (v.id === vid.id ? { ...v, title: e.target.value } : v));
                              setVideos(updated);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 text-xs text-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 font-bold block text-xs">YouTube ID</label>
                          <input
                            type="text"
                            value={vid.youtube_id}
                            onChange={(e) => {
                              const updated = videos.map((v) => (v.id === vid.id ? { ...v, youtube_id: e.target.value } : v));
                              setVideos(updated);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 text-xs text-orange-400 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 font-bold block text-xs">Description</label>
                          <input
                            type="text"
                            value={vid.description}
                            onChange={(e) => {
                              const updated = videos.map((v) => (v.id === vid.id ? { ...v, description: e.target.value } : v));
                              setVideos(updated);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-300"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 text-xs">
                        <button
                          onClick={() => handleSaveSection("videos", videos)}
                          className="bg-green-600 hover:bg-green-500 text-white font-bold py-1 px-3 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleDeleteItem("videos", vid.id, videos)}
                          className="bg-red-600/10 text-red-500 hover:bg-red-650 hover:text-white py-1 px-3 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. Partners section */}
            {activeMenu === "partners" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <h3 className="font-display font-extrabold text-white text-lg">Manage Partner Logos</h3>
                  <button
                    onClick={() => {
                      const newP: PartnerLogo = {
                        id: "p-" + Date.now(),
                        name: "New Partner Name",
                        logo_url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=100"
                      };
                      const updated = [...partners, newP];
                      handleSaveSection("partners", updated);
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1.5 px-4 rounded-xl text-xs flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Partner Link</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {partners.map((partner) => (
                    <div key={partner.id} className="bg-slate-940 p-3 border border-slate-850 rounded-xl flex items-center justify-between gap-4">
                      <div className="flex gap-3 items-center flex-1">
                        <img src={partner.logo_url} alt="logo" className="w-10 h-10 object-cover rounded-full border border-slate-800" referrerPolicy="no-referrer" />
                        <input
                          type="text"
                          value={partner.name}
                          onChange={(e) => {
                            const updated = partners.map((p) => (p.id === partner.id ? { ...p, name: e.target.value } : p));
                            setPartners(updated);
                          }}
                          className="bg-slate-900 border border-slate-800 text-slate-200 text-xs py-1 px-2 rounded flex-1"
                        />
                        <input
                          type="text"
                          value={partner.logo_url}
                          placeholder="Logo link URL"
                          onChange={(e) => {
                            const updated = partners.map((p) => (p.id === partner.id ? { ...p, logo_url: e.target.value } : p));
                            setPartners(updated);
                          }}
                          className="bg-slate-900 border border-slate-800 text-slate-400 text-xs py-1 px-2 rounded flex-1"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveSection("partners", partners)}
                          className="bg-green-600 hover:bg-green-500 text-white font-bold py-1 px-3 rounded text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleDeleteItem("partners", partner.id, partners)}
                          className="bg-red-650/10 text-red-500 hover:bg-red-600 hover:text-white py-1 px-3 rounded text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. Testimonials section */}
            {activeMenu === "testimonials" && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="font-display font-extrabold text-white text-lg">Approve or Authorize Public Testimonials</h3>
                </div>

                <div className="space-y-4">
                  {testimonials.map((test) => (
                    <div key={test.id} className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-3">
                      <div className="flex gap-3 justify-between items-start">
                        <div className="flex gap-2.5 items-center">
                          <img src={test.avatar} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                          <div>
                            <h4 className="font-bold text-white text-xs">{test.author} ({test.role})</h4>
                            <p className="text-[10px] text-slate-500">Rating Rating: {test.rating} Stars / Received: {new Date(test.date).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {/* Approved Badge Status trigger */}
                        <button
                          onClick={() => {
                            const updated = testimonials.map((t) => (t.id === test.id ? { ...t, approved: !t.approved } : t));
                            setTestimonials(updated);
                            handleSaveSection("testimonials", updated);
                          }}
                          className={`text-[10px] leading-none font-bold py-1.5 px-3 rounded-full border ${
                            test.approved
                              ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                              : "bg-orange-500/10 border-orange-500 text-orange-400"
                          }`}
                        >
                          {test.approved ? "● AUTHORIZED ACTIVE" : "● PENDING APPROVAL"}
                        </button>
                      </div>

                      <p className="text-slate-300 text-xs leading-relaxed italic">&ldquo;{test.content}&rdquo;</p>

                      <div className="flex justify-end gap-2 text-xs">
                        <button
                          onClick={() => handleDeleteItem("testimonials", test.id, testimonials)}
                          className="bg-red-650/10 text-red-500 hover:bg-red-600 hover:text-white py-1 px-3 rounded"
                        >
                          Delete Permanent
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. Received Messages logs */}
            {activeMenu === "messages" && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="font-display font-extrabold text-white text-lg">Contact Form Inquiry Center</h3>
                </div>

                {messages.length === 0 ? (
                  <p className="text-center text-slate-500 italic py-10 text-xs">Your contact log database is empty.</p>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-orange-500 text-xs">{msg.subject}</h4>
                            <p className="text-[11px] text-slate-400 block mt-0.5">
                              From: <strong>{msg.name}</strong> (&lt;{msg.email}&gt;) {msg.phone ? `| Tel: ${msg.phone}` : ""}
                            </p>
                          </div>

                          <span className="text-[9px] font-mono text-slate-500">{new Date(msg.date).toLocaleString()}</span>
                        </div>

                        <p className="bg-slate-900 p-3 rounded-lg text-slate-300 text-xs leading-relaxed">{msg.content}</p>

                        <div className="flex justify-end gap-2 text-xs">
                          <button
                            onClick={() => handleDeleteItem("messages", msg.id, messages)}
                            className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white py-1 px-3 rounded"
                          >
                            Discard Lead
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 10. Received Partner Applications */}
            {activeMenu === "partnerships" && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="font-display font-extrabold text-white text-lg">Analyze Partner & Outreach Proposals</h3>
                </div>

                {partnerships.length === 0 ? (
                  <p className="text-center text-slate-500 italic py-10 text-xs">No collaborations submission proposals logged yet.</p>
                ) : (
                  <div className="space-y-4">
                    {partnerships.map((app) => (
                      <div key={app.id} className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-white text-sm">
                              {app.companyName} <span className="text-slate-500 font-sans font-normal">({app.partnerType})</span>
                            </h4>
                            <p className="text-[11px] text-slate-400 block mt-0.5">
                              Contact Spokesperson: <strong>{app.contactName}</strong> (&lt;{app.email}&gt;) | Tel: {app.phone}
                            </p>
                          </div>

                          {/* Status toggle selector */}
                          <div className="flex gap-1.5 shrink-0">
                            {["pending", "approved", "declined"].map((st) => (
                              <button
                                key={st}
                                onClick={() => {
                                  const updated = partnerships.map((item) => (item.id === app.id ? { ...item, status: st as any } : item));
                                  setPartnerships(updated);
                                  handleSaveSection("partnerships", updated);
                                }}
                                className={`text-[9px] uppercase font-black px-2 py-0.5 rounded transition-colors ${
                                  app.status === st
                                    ? st === "approved"
                                      ? "bg-green-500 text-white"
                                      : st === "declined"
                                      ? "bg-red-500 text-white"
                                      : "bg-amber-500 text-slate-950"
                                    : "bg-slate-900 text-slate-500 hover:text-white"
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>

                        <p className="bg-slate-900 p-3 rounded-lg text-slate-300 text-xs leading-relaxed italic">
                          &ldquo;{app.message}&rdquo;
                        </p>

                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                          <span>Received: {new Date(app.date).toLocaleString()}</span>
                          <button
                            onClick={() => handleDeleteItem("partnerships", app.id, partnerships)}
                            className="text-red-500 hover:underline"
                          >
                            Discard proposal
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 11. Donation list logs */}
            {activeMenu === "donations" && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
                  <h3 className="font-display font-extrabold text-white text-lg">Secure Donation Ledger Records</h3>
                  <span className="text-[10px] bg-orange-500/15 text-orange-400 px-3 py-1 font-bold rounded">Pledge Trace logs</span>
                </div>

                {donations.length === 0 ? (
                  <p className="text-center text-slate-500 italic py-10 text-xs">Secure donation log accounts are clear.</p>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {donations.map((don) => (
                      <div key={don.id} className="bg-slate-950 p-4 border border-slate-850 rounded-xl flex justify-between items-center text-xs font-mono">
                        <div>
                          <p className="text-white font-sans font-bold text-sm">{don.donorName}</p>
                          <p className="text-slate-500 mt-0.5">Channel used: {don.paymentMethod} | {new Date(don.date).toLocaleString()}</p>
                          {don.message && <p className="text-slate-400 font-sans italic mt-1">&ldquo;{don.message}&rdquo;</p>}
                        </div>
                        <span className="text-orange-500 font-bold text-base">{don.currency} {don.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 11.5 Settings & Brand Controls */}
            {activeMenu === "settings" && (
              <div className="space-y-8 animate-fade-in text-slate-300">
                <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-display font-extrabold text-white text-lg">System Settings & Brand Controls</h3>
                    <p className="text-xs text-slate-500 mt-1">Configure administrator security credentials and customize dynamic branding layers.</p>
                  </div>
                  <span className="text-[10px] bg-orange-500/15 text-orange-400 px-3 py-1 font-bold rounded uppercase flex items-center gap-1">
                    <Settings className="w-3.5 h-3.5" />
                    <span>Configuration</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Brand Logo Section */}
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 space-y-4">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <ImageIcon className="w-4 h-4 text-orange-500" />
                      <span>Custom Brand Logo</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Customize the branding logo displayed in the main website header navigation. Enter an image URL path (supports standard PNGs, JPEGs, or web SVGs).
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="text-slate-500 font-bold block mb-1 text-[10px] uppercase">Logo Image URL</label>
                        <input
                          type="text"
                          placeholder="e.g. https://images.unsplash.com/... or /assets/logo.png"
                          value={logoInputUrl}
                          onChange={(e) => setLogoInputUrl(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                        />
                      </div>

                      {logoSuccess && (
                        <p className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                          <Check className="w-3.5 h-3.5" />
                          <span>{logoSuccess}</span>
                        </p>
                      )}

                      {/* Preview Card */}
                      <div className="p-4 rounded-xl border border-slate-850 bg-slate-900/40 flex items-center gap-4">
                        <div className="shrink-0">
                          {logoInputUrl ? (
                            <img
                              src={logoInputUrl}
                              alt="Brand Preview"
                              className="w-12 h-12 object-cover rounded-2xl shadow-lg ring-2 ring-orange-500/10"
                              onError={(e) => {
                                (e.target as any).src = "https://images.unsplash.com/photo-1547153760-18fc86324498?w=100";
                              }}
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-orange-500 text-white flex items-center justify-center rounded-2xl shadow-lg ring-2 ring-orange-500/10">
                              <Sparkles className="w-6 h-6 animate-pulse" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-black text-white">Live Logo Preview</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {logoInputUrl ? "Custom Image Logo Active" : "Fallback Sparkles Active"}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={async () => {
                            setLogoSuccess("");
                            const updated = { ...settings, logoUrl: logoInputUrl };
                            try {
                              await handleSaveSection("settings", updated);
                              setLogoSuccess("Logo configurations updated successfully.");
                              setTimeout(() => setLogoSuccess(""), 3000);
                            } catch (e: any) {
                              alert("Failed to save logo: " + e.message);
                            }
                          }}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Brand Logo</span>
                        </button>
                        <button
                          onClick={async () => {
                            setLogoInputUrl("");
                            const updated = { ...settings, logoUrl: "" };
                            try {
                              await handleSaveSection("settings", updated);
                              setLogoSuccess("Logo reset to standard fallback.");
                              setTimeout(() => setLogoSuccess(""), 3000);
                            } catch (e: any) {
                              alert("Failed to reset logo: " + e.message);
                            }
                          }}
                          className="bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-400 py-2.5 px-3 rounded-xl text-xs transition-colors"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Hero Custom Background Section */}
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 space-y-4">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <ImageIcon className="w-4 h-4 text-orange-500" />
                      <span>Hero Custom Background</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Enter a custom background image link for the home hero showcase. Supports standard high-resolution JPEG, PNG or WebP images.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="text-slate-500 font-bold block mb-1 text-[10px] uppercase">Background Image URL</label>
                        <input
                          type="text"
                          placeholder="e.g. https://images.unsplash.com/... or /assets/bg.jpg"
                          value={heroBgInputUrl}
                          onChange={(e) => setHeroBgInputUrl(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                        />
                      </div>

                      {heroBgSuccess && (
                        <p className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                          <Check className="w-3.5 h-3.5" />
                          <span>{heroBgSuccess}</span>
                        </p>
                      )}

                      {/* Preview Card */}
                      <div className="p-4 rounded-xl border border-slate-850 bg-slate-900/40 flex items-center gap-4">
                        <div className="shrink-0 w-12 h-12 rounded-lg bg-cover bg-center overflow-hidden border border-slate-800"
                          style={{
                            backgroundImage: `url(${heroBgInputUrl || "https://images.unsplash.com/photo-1547153760-18fc86324498?w=300"})`
                          }}
                        />
                        <div>
                          <p className="text-xs font-black text-white">Live Hero BG Preview</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {heroBgInputUrl ? "Custom Hero Image Active" : "Standard Fallback Active"}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={async () => {
                            setHeroBgSuccess("");
                            const updated = { ...settings, heroBgUrl: heroBgInputUrl };
                            try {
                              await handleSaveSection("settings", updated);
                              setHeroBgSuccess("Hero background image updated successfully.");
                              setTimeout(() => setHeroBgSuccess(""), 3000);
                            } catch (e: any) {
                              alert("Failed to save background image: " + e.message);
                            }
                          }}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Background</span>
                        </button>
                        <button
                          onClick={async () => {
                            setHeroBgInputUrl("");
                            const updated = { ...settings, heroBgUrl: "" };
                            try {
                              await handleSaveSection("settings", updated);
                              setHeroBgSuccess("Background reset to standard fallback.");
                              setTimeout(() => setHeroBgSuccess(""), 3000);
                            } catch (e: any) {
                              alert("Failed to reset background image: " + e.message);
                            }
                          }}
                          className="bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-400 py-2.5 px-3 rounded-xl text-xs transition-colors"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Security Password Section */}
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 space-y-4">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <KeyIcon className="w-4 h-4 text-orange-500" />
                      <span>Security Password Modifier</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Update the authorization password used to access this crawler-free control console. Your new password will persist across all sessions securely.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="text-slate-500 font-bold block mb-1 text-[10px] uppercase">New Password</label>
                        <div className="relative">
                          <input
                            type={showPwd ? "text" : "password"}
                            placeholder="Enter robust password"
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                              setPasswordError("");
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 pr-10 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPwd(!showPwd)}
                            className="absolute right-3 top-3 text-slate-500 hover:text-white"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-500 font-bold block mb-1 text-[10px] uppercase">Confirm Password</label>
                        <input
                          type={showPwd ? "text" : "password"}
                          placeholder="Re-enter password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setPasswordError("");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                        />
                      </div>

                      {passwordError && (
                        <p className="text-rose-400 text-xs font-semibold flex items-center gap-1.5 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                          <X className="w-3.5 h-3.5" />
                          <span>{passwordError}</span>
                        </p>
                      )}

                      {passwordSuccess && (
                        <p className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                          <Check className="w-3.5 h-3.5" />
                          <span>{passwordSuccess}</span>
                        </p>
                      )}

                      <button
                        onClick={async () => {
                          setPasswordSuccess("");
                          setPasswordError("");
                          if (!newPassword) {
                            setPasswordError("Password cannot be blank.");
                            return;
                          }
                          if (newPassword.length < 6) {
                            setPasswordError("Password must be at least 6 characters.");
                            return;
                          }
                          if (newPassword !== confirmPassword) {
                            setPasswordError("Passwords do not match.");
                            return;
                          }

                          const updated = { ...settings, adminPassword: newPassword };
                          try {
                            await handleSaveSection("settings", updated);
                            setPasswordSuccess("Master security password modified successfully.");
                            setNewPassword("");
                            setConfirmPassword("");
                            setTimeout(() => setPasswordSuccess(""), 4000);
                          } catch (e: any) {
                            setPasswordError(e.message || "Failed to update security password.");
                          }
                        }}
                        className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold py-3 px-4 rounded-xl text-xs transition-transform flex items-center justify-center gap-1.5 mt-4 shadow-xl active:scale-95 cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Save Security Password</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 12. Raw DB state control */}
            {activeMenu === "raw" && (
              <div className="space-y-6 font-mono text-xs">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="font-display font-extrabold text-white text-base">Direct Database System (JSON Code)</h3>
                </div>

                <div className="space-y-3">
                  <textarea
                    rows={12}
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-orange-500 rounded p-4 text-slate-300 font-mono text-xs leading-normal"
                  />

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        try {
                          const parsed = JSON.parse(jsonText);
                          // Sync each section
                          Object.keys(parsed).forEach((sect) => {
                            handleSaveSection(sect as any, parsed[sect]);
                          });
                          alert("Database imported and fully synchronized successfully!");
                        } catch (err: any) {
                          alert("JSON Compilation error: " + err.message);
                        }
                      }}
                      className="bg-orange-500 text-white font-bold py-2 px-6 rounded-xl text-xs font-sans transition-colors shrink-0"
                    >
                      Import & Sync Database State
                    </button>
                    <button
                      onClick={() => {
                        setJsonText(JSON.stringify({
                          team, events, blog, merchandise, videos, partners, testimonials, messages, partnerships, donations
                        }, null, 2));
                      }}
                      className="bg-slate-800 text-slate-200 py-2 px-4 rounded-xl font-sans text-xs transition-colors"
                    >
                      Export Sandbox State
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
