/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Sparkles,
  Heart,
  Calendar,
  Lock,
  ChevronRight,
  Info,
  Users,
  Film,
  ShoppingBag,
  MessageCircle,
  HelpCircle,
  Instagram,
  Facebook,
  Youtube,
  Music,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import { fetchAppState } from "./api";
import { EventItem, TeamMember, BlogPost, MerchandiseItem, VideoItem, PartnerLogo, TestimonialItem, AppSettings } from "./types";

// Page Imports
import Home from "./views/Home";
import About from "./views/about";
import Events from "./views/Events";
import Blog from "./views/Blog";
import Merchandise from "./views/Merchandise";
import Contact from "./views/Contact";
import AdminDashboard from "./views/AdminDashboard";

// Widgets
import SponsorStripe from "./components/SponsorStripe";
import FloatingActions from "./components/FloatingActions";
import DonateModal from "./components/DonateModal";
import SpotlightConductor from "./components/SpotlightConductor";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // App Database state cache
  const [state, setState] = useState<{
    team: TeamMember[];
    events: EventItem[];
    blog: BlogPost[];
    merchandise: MerchandiseItem[];
    videos: VideoItem[];
    partners: PartnerLogo[];
    testimonials: TestimonialItem[];
    messages: any[];
    partnerships: any[];
    donations: any[];
    settings?: AppSettings;
  } | null>(null);

  // Dynamic selected overlays/routes
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Mobile menu control
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  // Donate modal control
  const [isDonateOpen, setIsDonateOpen] = useState<boolean>(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAppState();
      setState(data);
    } catch (err: any) {
      setError(err.message || "Failed to communicate with sandbox servers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    // Reset overlays
    setSelectedEvent(null);
    setSelectedPost(null);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectEvent = (event: EventItem | null) => {
    setSelectedEvent(event);
    if (event) {
      setActiveTab("events");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSelectPost = (post: BlogPost | null) => {
    setSelectedPost(post);
    if (post) {
      setActiveTab("blog");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="font-display font-bold text-white text-lg tracking-wide uppercase">Bringing the Cypher Online</h2>
        <p className="text-slate-500 text-xs mt-1.5 max-w-xs font-mono">Synchronizing state directories with Dance With Sizzy Afro servers...</p>
      </div>
    );
  }

  if (error || !state) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-3xl max-w-sm space-y-4">
          <HelpCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="font-display font-black text-white text-lg leading-tight">Server Connectivity Offline</h2>
          <p className="text-slate-400 text-xs leading-relaxed">{error || "Direct access failed."}</p>
          <button
            onClick={loadData}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-xs transition-transform"
          >
            Retry Synchronization
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: "Home", tab: "home" },
    { label: "About Us", tab: "about" },
    { label: "Classes & Events", tab: "events" },
    { label: "Stories & Reels", tab: "blog" },
    { label: "Merchandise", tab: "merchandise" },
    { label: "Collaborate & Contact", tab: "contact" }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans selection:bg-orange-500 selection:text-white">
      {/* HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#0b0f19]/90 border-b border-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo Brand */}
          <button
            onClick={() => handleNavigate("home")}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            {state?.settings?.logoUrl ? (
              <img
                src={state.settings.logoUrl}
                alt="Dance With Sizzy Afro"
                className="w-11 h-11 object-cover rounded-2xl shadow-lg ring-2 ring-orange-500/10 group-hover:scale-105 transition-all"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-11 h-11 bg-orange-500 text-white flex items-center justify-center rounded-2xl shadow-lg ring-2 ring-orange-500/10 group-hover:scale-105 transition-all">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
            )}
            <div>
              <span className="font-display font-black text-white text-base tracking-tight block">
                Sizzy Afro
              </span>
              <span className="text-orange-500 text-[10px] uppercase font-bold tracking-widest block font-mono">
                Dance Foundation
              </span>
            </div>
          </button>

          {/* Desktop Nav Rail */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.tab}
                onClick={() => handleNavigate(item.tab)}
                className={`py-2 px-3 text-xs font-bold rounded-xl transition-all ${
                  activeTab === item.tab
                    ? "bg-orange-500/10 text-orange-500"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/45"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Sponsoring Support Action triggers */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => setIsDonateOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-full shadow-lg shadow-orange-500/15 text-xs transition-all active:scale-95 flex items-center gap-1"
              id="header-btn-sponsor"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Donate</span>
            </button>
          </div>

          {/* Mobile toggle button */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setIsDonateOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold p-2 rounded-xl text-xs flex items-center gap-1 shrink-0"
              title="Donate"
            >
              <Heart className="w-4 h-4 fill-white" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-slate-900 border border-slate-800 text-slate-300 p-2.5 rounded-xl hover:text-white transition-colors"
              title="Open Navigation"
              id="header-btn-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Sliding Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-slate-950 border-b border-slate-850 p-4 space-y-2 font-display">
            {navItems.map((item) => (
              <button
                key={item.tab}
                onClick={() => handleNavigate(item.tab)}
                className={`w-full py-3 px-4 text-xs font-bold text-left rounded-xl transition-all flex items-center justify-between ${
                  activeTab === item.tab
                    ? "bg-orange-500 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ))}
          </div>
        )}
      </header>

      {/* CORE DISPLAY ROUTER */}
      <main className="flex-grow">
        {activeTab === "home" && (
          <Home
            events={state.events}
            team={state.team}
            news={state.blog}
            videos={state.videos}
            onNavigate={handleNavigate}
            onOpenDonate={() => setIsDonateOpen(true)}
            onSelectEvent={handleSelectEvent}
            onSelectPost={handleSelectPost}
            settings={state.settings}
          />
        )}

        {activeTab === "about" && (
          <About 
            team={state.team} 
            testimonials={state.testimonials} 
            onRefreshState={loadData} 
          />
        )}

        {activeTab === "events" && (
          <Events
            events={state.events}
            selectedEvent={selectedEvent}
            onClearSelectedEvent={() => setSelectedEvent(null)}
            onSelectEvent={setSelectedEvent}
          />
        )}

        {activeTab === "blog" && (
          <Blog
            posts={state.blog}
            selectedPost={selectedPost}
            onSelectPost={setSelectedPost}
            onRefreshState={loadData}
            videos={state.videos}
          />
        )}

        {activeTab === "merchandise" && <Merchandise merch={state.merchandise} />}

        {activeTab === "contact" && <Contact />}

        {activeTab === "admin" && <AdminDashboard initialState={state} onRefresh={loadData} />}
      </main>

      {/* INFINITE SCROLLING MOVEMENT SPONSORS STRIP (Only on Home to keep clean layout boundaries) */}
      {activeTab === "home" && <SponsorStripe partners={state.partners} />}

      {/* FOOTER AREA */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span className="font-display font-black text-white text-sm">Dance With Sizzy Afro</span>
            </div>
            <p className="leading-relaxed">
              Discovering, developing, and deploying raw physical rhythm assets to build leaders among vulnerable youth in Mbarara, Western Uganda.
            </p>
            {/* Social Icons Group */}
            <div className="flex items-center gap-3.5 pt-1 text-slate-400">
              <a href="https://instagram.com/sizzyafro" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors" title="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://tiktok.com/@sizzyafro" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors" title="TikTok">
                <Music className="w-4 h-4" />
              </a>
              <a href="https://facebook.com/sizzyafro" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors" title="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://youtube.com/@sizzyafro" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors" title="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-display font-bold text-xs uppercase tracking-wider">Quick Navigation</h4>
            <div className="grid grid-cols-2 gap-2 text-slate-400 font-semibold">
              <button onClick={() => handleNavigate("home")} className="hover:text-orange-500 text-left">Home</button>
              <button onClick={() => handleNavigate("about")} className="hover:text-orange-500 text-left">About Us</button>
              <button onClick={() => handleNavigate("events")} className="hover:text-orange-500 text-left">Classes & Events</button>
              <button onClick={() => handleNavigate("blog")} className="hover:text-orange-500 text-left">Stories & Reels</button>
              <button onClick={() => handleNavigate("merchandise")} className="hover:text-orange-500 text-left">Merchandise</button>
              <button onClick={() => handleNavigate("contact")} className="hover:text-orange-500 text-left">Contact Us</button>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <h4 className="text-white font-display font-bold text-xs uppercase tracking-wider border-0 pb-0 shadow-none">Studio Inquiries</h4>
            <div className="text-slate-400 space-y-3 font-sans mt-2">
              <p className="flex items-start gap-2 text-xs leading-relaxed">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Youth Center, Lugazi, Mbarara</span>
              </p>
              <p className="flex items-center gap-2 text-xs">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span>+256 766 796585</span>
              </p>
              <p className="flex items-center gap-2 text-xs">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span>sizzyafro@gmail.com</span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-display font-bold text-xs uppercase tracking-wider">Administrator</h4>
            <p className="text-slate-500 leading-relaxed text-xs">Access the configuration center to add choreographers, edit events, blog blocks, and approve testimonials.</p>
            <button
              onClick={() => handleNavigate("admin")}
              className="inline-flex items-center gap-1 text-xs text-orange-500 hover:text-orange-400 font-extrabold focus:outline-none"
              id="footer-btn-admin-gate"
            >
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>Crawl-Free Admin Gate</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-slate-900/60 text-center flex flex-col sm:flex-row justify-between text-[11px] text-slate-600 font-mono">
          <p>© 2026 Dance With Sizzy Afro. Registered Community Organization in Western Uganda.</p>
          <div className="flex justify-center gap-4 mt-2 sm:mt-0 font-sans">
            <a href="https://wa.me/256766796585" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">WhatsApp Helpdesk</a>
            <span>•</span>
            <button onClick={() => handleNavigate("contact")} className="hover:text-orange-500">Contact Developer Desk</button>
          </div>
        </div>
      </footer>

      {/* FLOATING TRANSITIONAL ACTIONS (WHATSAPP, REVIEWS) */}
      <FloatingActions />

      {/* DYNAMIC SPONSOR DONATION OVERLAY */}
      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        onComplete={loadData}
      />

      {/* THEATRE SPOTLIGHT STAGE CONTROLS */}
      <SpotlightConductor activeTab={activeTab} />
    </div>
  );
}
