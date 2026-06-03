/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EventItem, TeamMember, BlogPost, VideoItem, AppSettings } from "../types";
import { Play, Calendar, Users, Sparkles, Heart, Flame, Shield, ArrowRight, Mail, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { submitNewsletterSubscription } from "../api";

interface HomeProps {
  events: EventItem[];
  team: TeamMember[];
  news: BlogPost[];
  videos: VideoItem[];
  onNavigate: (tab: string) => void;
  onOpenDonate: () => void;
  onSelectEvent: (event: EventItem) => void;
  onSelectPost: (post: BlogPost) => void;
  settings?: AppSettings;
}

export default function Home({
  events,
  team,
  news,
  videos,
  onNavigate,
  onOpenDonate,
  onSelectEvent,
  onSelectPost,
  settings
}: HomeProps) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await submitNewsletterSubscription(newsletterEmail);
      setFeedback({ type: "success", message: res.message });
      setNewsletterEmail("");
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "An unexpected error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get upcoming event
  const nextEvent = events && events[0];
  const featuredPost = news && news[0];
  const featuredVideo = videos && videos[0];

  return (
    <div className="space-y-20 pb-20 font-sans">
      {/* 1. HERO SECTION */}
      <section id="home-hero" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-950 px-4 pt-10">
        {/* Customized or default Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-[0.15] scale-105 pointer-events-none -z-10 transition-all duration-700 filter saturate-[0.8]" 
          style={{ 
            backgroundImage: `url(${settings?.heroBgUrl || "https://images.unsplash.com/photo-1547153760-18fc86324498?w=1600"})` 
          }}
        />
        {/* Ambient background effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-600/20 via-slate-950 to-slate-950 -z-10" />
        <div className="absolute -left-40 top-20 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full" />
        <div className="absolute right-10 bottom-10 w-80 h-80 bg-orange-600/10 blur-2xl rounded-full" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-500 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 animate-spin text-orange-500" />
              <span>Nurturing Dance Talent Since 2025</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white leading-tight">
              Dance With <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Sizzy Afro</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-lg">
              A vibrant, youth-focused dance organization in Mbarara, Uganda. We elevate raw street talent, build discipline, and inspire communities through the powerful movement of Afro-Fusion, Breaking, and Hip-Hop styles.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onNavigate("events")}
                className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-orange-500/20 active:scale-95 transition-all text-sm flex items-center gap-2"
                id="hero-btn-join"
              >
                <span>Join Next Class</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenDonate}
                className="border border-slate-700 hover:border-orange-500/50 bg-slate-900/60 text-slate-200 hover:text-white font-semibold px-8 py-3.5 rounded-full transition-all text-sm flex items-center gap-2"
                id="hero-btn-donate"
              >
                <Heart className="w-4 h-4 text-orange-500 fill-orange-500/20" />
                <span>Support the Foundation</span>
              </button>
            </div>
          </motion.div>

          {/* Graphical Presentation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-pink-500/10 rounded-2xl blur-xl -z-10" />
            <div className="border border-slate-800/80 bg-slate-900/40 p-3 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80"
                alt="Dance session representation"
                className="w-full h-[300px] sm:h-[350px] object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Float Stat Badge */}
            <div className="absolute -bottom-6 -left-6 bg-slate-900/95 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-sm max-w-[200px]">
              <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Cultured</p>
                <p className="font-display font-black text-white text-lg">500+ Youth</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. THREE DYNAMIC PILLARS (CORE OBJECTIVES INTRO) */}
      <section id="home-pillars" className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/40 border border-slate-800/80 hover:border-orange-500/30 p-8 rounded-3xl transition-all duration-300">
            <div className="w-12 h-12 bg-orange-500/15 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-3">Street Authenticity</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              We specialize in pure street styles: Breaking, Popping, Krumping, and high-energy Afro-Fusion. We cultivate artistic integrity and syncopated expression.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 hover:border-orange-500/30 p-8 rounded-3xl transition-all duration-300">
            <div className="w-12 h-12 bg-amber-500/15 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-3">Structured Discipline</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Movement training is a path to character. We build respectful, committed, and punctual young citizens who carry their energy positively into academics and livelihood.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 hover:border-orange-500/30 p-8 rounded-3xl transition-all duration-300">
            <div className="w-12 h-12 bg-pink-500/15 text-pink-500 rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-3">Global Connectivity</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Connecting local Mbarara dancers with national networks, battle circuits, cultural exchanges, and certified performance platforms for career expansion.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED WORKSHOP & BATTLE TIMELINE */}
      {nextEvent && (
        <section id="home-event" className="max-w-6xl mx-auto px-4">
          <div className="bg-slate-900/40 border border-slate-800/60 hover:border-slate-800 p-8 rounded-3xl relative overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-2xl -z-10" />
            
            <div className="md:col-span-4 rounded-2xl overflow-hidden border border-slate-850">
              <img
                src={nextEvent.flyer_url}
                alt={nextEvent.title}
                className="w-full h-48 md:h-64 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="md:col-span-8 space-y-4">
              <div className="inline-block bg-orange-500/15 text-orange-500 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Upcoming Highlighted Event
              </div>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                {nextEvent.title}
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm line-clamp-2">
                {nextEvent.description}
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono text-slate-300 bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                <div>
                  <p className="text-slate-500 font-sans uppercase text-[10px] tracking-wider mb-0.5">Date & Time</p>
                  <p className="font-semibold text-orange-400">{nextEvent.date} @ {nextEvent.time}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-sans uppercase text-[10px] tracking-wider mb-0.5">Location</p>
                  <p className="font-semibold">{nextEvent.location}</p>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => onSelectEvent(nextEvent)}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-xl transition-all text-sm"
                >
                  View Event Details
                </button>
                <a
                  href={nextEvent.cta_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-6 rounded-xl transition-all text-sm flex items-center justify-center"
                >
                  {nextEvent.cta_label}
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. FOUNDER FOCUS & VISION STATEMENT */}
      <section id="home-founder" className="bg-slate-900/20 py-20 border-y border-slate-900">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-orange-500 font-display text-xs tracking-widest uppercase font-bold">MEET THE FOUNDER</span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Twinomujuni Emmanuel <span className="text-slate-400 block text-lg font-sans font-normal mt-1">(Sizzy Afro)</span>
            </h2>
            <blockquote className="border-l-4 border-orange-500 pl-6 italic text-slate-300 text-base leading-relaxed">
              &ldquo;Dance is the visual language of the soul. For the street youth of Mbarara, it is also a powerful conduit to acquire self-respect, find dynamic community support, and build real career platforms.&rdquo;
            </blockquote>
            <p className="text-slate-400 text-sm leading-relaxed">
              Established in 2025, our center has grown from a local driveway rehearsal circle to a fully certified independent performing arts academy hosting battles, classes, and mental health outreach events.
            </p>
            <div>
              <button
                onClick={() => onNavigate("about")}
                className="text-orange-500 font-bold flex items-center gap-1 hover:text-orange-400 text-sm transition-all"
              >
                <span>Read Our Mission & Goals</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 border border-slate-850 p-6 rounded-2xl space-y-4">
              <span className="text-3xl font-display font-black text-orange-500">2025</span>
              <p className="text-sm font-bold text-white">Year Established</p>
              <p className="text-xs text-slate-400 leading-relaxed">Bootstrapped in Mbarara as an urban choreographic movement.</p>
            </div>

            <div className="bg-slate-900/50 border border-slate-850 p-6 rounded-2xl space-y-4">
              <span className="text-3xl font-display font-black text-rose-500">100%</span>
              <p className="text-sm font-bold text-white">Youth Driven</p>
              <p className="text-xs text-slate-400 leading-relaxed">Focused on empowering youth and vulnerable street kids.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEWS / BLOG HIGHLIGHT */}
      {featuredPost && (
        <section id="home-stories" className="max-w-6xl mx-auto px-4 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-850 pb-4">
            <div>
              <span className="text-orange-500 font-display text-xs tracking-widest uppercase font-bold">STORIES & THOUGHTS</span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">Our Blog & Life Journals</h2>
            </div>
            <button
              onClick={() => onNavigate("blog")}
              className="text-sm text-slate-400 font-bold hover:text-orange-500 transition-colors flex items-center gap-1"
            >
              <span>Explore All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div
            onClick={() => onSelectPost(featuredPost)}
            className="group cursor-pointer bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 hover:border-slate-750 transition-all duration-300"
          >
            <div className="h-64 md:h-full relative overflow-hidden">
              <img
                src={featuredPost.image_url}
                alt={featuredPost.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-8 flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="text-orange-500 font-semibold">{featuredPost.category}</span>
                <span>•</span>
                <span>{featuredPost.date}</span>
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white group-hover:text-orange-500 transition-colors">
                {featuredPost.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                {featuredPost.excerpt}
              </p>
              <div className="font-bold text-xs text-orange-500 flex items-center gap-1.5 pt-2">
                <span>Read Full Breakthrough Story</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* NEWLETTER SUBSCRIPTION SECTION */}
      <section id="home-newsletter" className="max-w-4xl mx-auto px-4">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/5 rounded-full blur-3xl -z-10" />
          <div className="absolute left-0 bottom-0 w-80 h-80 bg-amber-500/5 rounded-full blur-2xl -z-10" />

          <div className="max-w-2xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-500 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Mail className="w-4 h-4 text-orange-500" />
              <span>Stay Synced with Sizzy Afro</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Join Our Newsletter
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
              Get raw street dance showcases, youth empowerment workshops, community events, and fresh breakdance battle announcements in Mbarara, Uganda.
            </p>

            <form onSubmit={handleSubscribe} className="max-w-md mx-auto pt-2 relative group" id="newsletter-form">
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-orange-500 text-white rounded-full pl-12 pr-32 py-3.5 text-xs outline-none transition-all placeholder:text-slate-500 text-ellipsis overflow-hidden"
                  id="newsletter-email-input"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !newsletterEmail}
                  className="absolute right-1.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-full text-xs transition-all focus:scale-95 active:scale-90 flex items-center justify-center gap-2"
                  id="newsletter-submit-btn"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                      <span>Joining...</span>
                    </>
                  ) : (
                    <span>Subscribe</span>
                  )}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mt-4 p-3 rounded-xl text-[11px] flex items-center justify-center gap-2 text-center ${
                      feedback.type === "success"
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                        : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                    }`}
                  >
                    {feedback.type === "success" ? (
                      <Check className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <span className="font-bold flex-shrink-0">!</span>
                    )}
                    <span>{feedback.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </section>

      {/* 6. CALL-TO-ACTION RECRUITMENT */}
      <section id="home-cta" className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 relative overflow-hidden shadow-2xl">
          {/* visual grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0c_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0c_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
          
          <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight relative z-10">
            Let&apos;s Discover Your True Rhythm
          </h2>
          <p className="text-orange-50 max-w-xl mx-auto text-sm sm:text-base leading-relaxed relative z-10">
            We welcome children, teenagers, beginners, and pro crews. Join our regular workshops or become a supporting member of the Mbarara street movement.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2 relative z-10">
            <button
              onClick={() => onNavigate("contact")}
              className="bg-slate-950 text-white hover:bg-slate-900 font-bold py-3.5 px-8 rounded-full shadow-xl transition-all text-sm"
              id="cta-join-partner"
            >
              Collaborate With Us
            </button>
            <button
              onClick={() => onNavigate("contact")}
              className="bg-transparent hover:bg-white/10 border border-white font-semibold py-3.5 px-8 rounded-full transition-all text-sm"
              id="cta-contact-us"
            >
              Locate Our Studio
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
