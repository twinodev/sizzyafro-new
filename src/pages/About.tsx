/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { TeamMember, TestimonialItem } from "../types";
import { 
  Users, 
  Award, 
  Shield, 
  Check, 
  Heart, 
  Sparkles, 
  MapPin, 
  Milestone, 
  Compass, 
  Star, 
  MessageSquare, 
  Plus, 
  AlertCircle, 
  X, 
  Instagram, 
  Facebook, 
  Youtube, 
  Twitter 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { submitTestimonial } from "../api";
import SEO from "../components/SEO";

interface AboutProps {
  team: TeamMember[];
  testimonials: TestimonialItem[];
  onRefreshState: () => void;
}

export default function About({ team, testimonials, onRefreshState }: AboutProps) {
  // Team Modal state
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Testimonials form state
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Filter approved testimonials for visual wall
  const approvedTestimonials = testimonials.filter((t) => t.approved);

  // Aggregate ratings
  const totalReviews = approvedTestimonials.length;
  const averageRating = totalReviews > 0
    ? (approvedTestimonials.reduce((sum, curr) => sum + curr.rating, 0) / totalReviews).toFixed(1)
    : "5.0";

  const coreValues = [
    {
      name: "Discipline",
      desc: "Commitment, respect, and responsibility in choreographies and everyday livelihoods."
    },
    {
      name: "Integrity",
      desc: "Honesty, professional transparency, and accountability in all scheduled classes and financial sponsorships."
    },
    {
      name: "Creativity",
      desc: "Encouraging continuous innovation, stylistic exploration, and unique artistic fusion formats."
    },
    {
      name: "Teamwork",
      desc: "Building regional unity, supporting group synchronization, and encouraging mutual development."
    },
    {
      name: "Diversity & Inclusion",
      desc: "Welcoming individuals of all age brackets, cultural heritages, dancing levels, and physical conditions."
    },
    {
      name: "Excellence",
      desc: "Striving for high technical qualities in physical performances, workshops, and general self-respect."
    }
  ];

  const objectives = [
    "To discover and develop raw dance talent among vulnerable young people.",
    "To provide professional level dance training and systematic mentorship structures.",
    "To create certified performance and competitive battle opportunities.",
    "To promote diverse urban moves such as Breaking, Popping, Hip-Hop, and Freestyle setups.",
    "To deploy dance as an active medium for education, leadership growth, and social advocacy.",
    "To connect local dancers to national and international advancement opportunities.",
    "To construct self-confidence, physical discipline, and emotional life skills in youth."
  ];

  const targets = [
    "Children and active youth",
    "Beginner and professional dancers",
    "Schools and institutional centers",
    "Dance crews and street collectives",
    "Parents and patrons of young street talent"
  ];

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !role.trim() || !content.trim()) return;

    setIsSubmitting(true);
    setFeedback(null);
    try {
      const response = await submitTestimonial({
        author: author.trim(),
        role: role.trim(),
        content: content.trim(),
        rating
      });
      setFeedback(response.message || "Submitted successfully! Pending moderator authorization.");
      setAuthor("");
      setRole("");
      setContent("");
      setRating(5);
      onRefreshState(); // reload list
    } catch (err) {
      console.error(err);
      alert("Error submitting testimonial.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-24 font-sans text-sm text-slate-300">
      <SEO
        title="Our Story, Mentors & Reviews | Dance With Sizzy Afro"
        description="Discover Dance With Sizzy Afro's roots (established in 2025 in Mbarara, Uganda), meet our world-class dance instructors/coaches, and read authentic community feedback."
        keywords="about organization, sizzy afro vision, dance coaches Twinomujuni Emmanuel, parents reviews, student reviews mbarara"
      />

      {/* SECTION 1: HEADER & STORY OVERVIEW */}
      <section id="about-story" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-xs font-bold uppercase">
            <Milestone className="w-4 h-4 text-orange-500" />
            <span>ESTABLISHED IN 2025</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-none">
            Dance With <span className="text-orange-500">Sizzy Afro</span>
          </h1>
          <p className="text-slate-200 text-base leading-relaxed">
            A specialized, youth-focused dance organization dedicated to nurturing raw talent, building structural discipline, and transforming lives through syncopated street movement.
          </p>
          <p className="leading-relaxed text-slate-400">
            Founded in 2025 by lead regional choreographer Twinomujuni Emmanuel (Sizzy Afro) in Mbarara, Uganda, the center emerged from a deep passion to create viable, professional paths for street kids, school groups, and dance enthusiasts.
          </p>

          <div className="grid grid-cols-3 gap-4 border-t border-slate-900 pt-6 font-mono text-xs">
            <div>
              <p className="text-slate-500">Founder</p>
              <p className="text-white font-bold">Sizzy Afro</p>
            </div>
            <div>
              <p className="text-slate-500">Location</p>
              <p className="text-white font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>Mbarara</span>
              </p>
            </div>
            <div>
              <p className="text-slate-500">Focus</p>
              <p className="text-white font-bold">Street Youth</p>
            </div>
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950">
          <img
            src="https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&auto=format&fit=crop&q=80"
            alt="Rehearsal space"
            className="w-full h-80 object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* SECTION 2: VISION & MISSION */}
      <section id="about-vision" className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl space-y-4">
          <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-display font-extrabold text-xl text-white">Our Vision</h3>
          <p className="text-slate-300 leading-relaxed text-sm">
            &ldquo;To become Africa&apos;s leading street dance community, inspiring young people through creativity, culture, structured education, and global excellence in movement.&rdquo;
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl space-y-4">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-display font-extrabold text-xl text-white">Our Mission</h3>
          <p className="text-slate-300 leading-relaxed text-sm">
            &ldquo;To empower individuals through high-quality choreography training, performance opportunities, and creative self-expression; promoting cultural appreciation, character growth, and systematic community development.&rdquo;
          </p>
        </div>
      </section>

      {/* SECTION 3: CORE VALUES */}
      <section id="about-values" className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">CHARACTER ETHICS</span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">Our Core Values</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreValues.map((val, idx) => (
            <div
              key={idx}
              className="bg-slate-900/15 border border-slate-850 p-6 rounded-2xl space-y-2 hover:border-slate-800 transition-colors"
            >
              <h4 className="font-display font-bold text-white text-base flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                <span>{val.name}</span>
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: TRAINING MENTORS & ROSTERS */}
      <section id="about-mentors" className="space-y-8 border-t border-slate-900/60 pt-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-orange-500 font-display text-xs tracking-widest uppercase font-bold">
            THE ARTISTIC ENGINES
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            Meet Our Instructors & Mentors
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Expert coaches and community educators dedicated to transforming lives through street dance and rhythmic discipline.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <motion.div
              key={member.id}
              whileHover={{ y: -5 }}
              className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all group cursor-pointer"
              onClick={() => setSelectedMember(member)}
            >
              <div className="h-64 relative overflow-hidden bg-slate-950">
                <img
                  src={member.profile_picture}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
                
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <h3 className="font-display font-bold text-white text-base tracking-tight">
                    {member.name}
                  </h3>
                  <p className="text-orange-500 text-xs font-semibold">
                    {member.role}
                  </p>
                </div>
              </div>

              <div className="p-5 space-y-4 text-left">
                <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                  {member.bio}
                </p>

                {member.achievements && member.achievements.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300 bg-slate-950/60 py-1.5 px-3 rounded-lg border border-slate-850">
                    <Award className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="truncate">{member.achievements[0]}</span>
                  </div>
                )}

                {/* mini social handles */}
                <div className="flex gap-3 pt-1" onClick={(e) => e.stopPropagation()}>
                  {member.socials.instagram && (
                    <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-orange-500 transition-colors">
                      <Instagram className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.socials.facebook && (
                    <a href={member.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-orange-500 transition-colors">
                      <Facebook className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.socials.youtube && (
                    <a href={member.socials.youtube} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-orange-500 transition-colors">
                      <Youtube className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.socials.twitter && (
                    <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-orange-500 transition-colors">
                      <Twitter className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 5: OBJECTIVES CHECKLIST */}
      <section id="about-objectives" className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start border-t border-slate-900/60 pt-16">
        <div className="md:col-span-8 space-y-6 text-left">
          <h3 className="font-display font-extrabold text-xl text-white tracking-tight">
            Key Objectives We Work Toward
          </h3>
          <div className="space-y-3">
            {objectives.map((obj, idx) => (
              <div key={idx} className="flex gap-3 leading-relaxed text-xs sm:text-sm">
                <div className="w-5 h-5 bg-orange-500/15 text-orange-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-300">{obj}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-4 bg-slate-900/20 border border-slate-850 p-6 rounded-2xl space-y-6 text-left">
          <h3 className="font-display font-bold text-base text-white border-b border-slate-850 pb-3">
            We Wholeheartedly Welcome
          </h3>
          <div className="space-y-4">
            {targets.map((tgt, idx) => (
              <div key={idx} className="flex gap-2.5 items-center">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0" />
                <span className="text-xs font-semibold text-slate-300">{tgt}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: COMMUNITY VOICES & REVIEWS */}
      <section id="about-reviews" className="space-y-8 border-t border-slate-900/60 pt-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-orange-500 font-display text-xs tracking-widest uppercase font-bold">
            CITIZENS CONFIRMATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            What Our Community Says
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            From parents witnessing character restoration, to professional dancers admiring our choreographic precision.
          </p>
        </div>

        {/* Aggregate Stats Bar */}
        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          <div className="space-y-2">
            <p className="text-slate-400 uppercase text-[10px] tracking-wider font-bold">Aggregate Star Rating</p>
            <div className="flex items-baseline justify-center md:justify-start gap-2">
              <span className="text-4xl sm:text-5xl font-display font-black text-white">{averageRating}</span>
              <span className="text-slate-400 text-sm">/ 5.0</span>
            </div>
            <div className="flex gap-1 justify-center md:justify-start">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= Math.round(Number(averageRating)) ? "text-amber-500 fill-amber-500" : "text-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1 text-slate-400 text-xs sm:text-sm md:border-x md:border-slate-800 md:px-8 text-left">
            <p className="font-bold text-white mb-2 text-xs uppercase tracking-wider text-slate-500">Metrics Breakdown</p>
            <div className="flex justify-between">
              <span>Student Satisfaction:</span>
              <strong className="text-orange-500">98%</strong>
            </div>
            <div className="flex justify-between">
              <span>Parent Recommendation:</span>
              <strong className="text-orange-500">100%</strong>
            </div>
            <div className="flex justify-between">
              <span>School Coach Partnership:</span>
              <strong className="text-orange-500">4.9 / 5.0</strong>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-2">
            <p className="text-xs text-slate-500 italic max-w-xs leading-relaxed">
              &ldquo;We maintain high standards of social accountability. Every review uploaded is logged directly to our public feedback logs.&rdquo;
            </p>
          </div>
        </div>

        {/* Testimonials Stream & Testimonial Submission Form side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
          {/* Testimonial List */}
          <div className="lg:col-span-7 space-y-6">
            {approvedTestimonials.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/10 border border-dashed border-slate-800 rounded-3xl">
                <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-3 animate-pulse" />
                <p className="text-slate-400 font-medium text-xs">Waiting for admin authorization on public testimonials.</p>
              </div>
            ) : (
              approvedTestimonials.map((item) => (
                <motion.div
                  key={item.id}
                  className="bg-slate-900/20 border border-slate-850 p-6 rounded-2xl space-y-4"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-3 items-center">
                      <img
                        src={item.avatar}
                        alt={item.author}
                        className="w-10 h-10 rounded-full border border-slate-800 object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-display font-bold text-white text-sm">{item.author}</h4>
                        <p className="text-orange-500 text-[10px] uppercase font-semibold tracking-wider">{item.role}</p>
                      </div>
                    </div>

                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-3.5 h-3.5 ${
                            starIdx <= item.rating ? "text-amber-500 fill-amber-500" : "text-slate-800"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed italic">
                    &ldquo;{item.content}&rdquo;
                  </p>
                </motion.div>
              ))
            )}
          </div>

          {/* Testimonial Submission form */}
          <div className="lg:col-span-5 bg-slate-900/20 border border-slate-850 p-6 sm:p-8 rounded-3xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/10 rounded-full blur-2xl -z-10" />

            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-white text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500 shrink-0" />
                <span>Write a Testimonial</span>
              </h3>
              <p className="text-slate-500 text-xs">Your personal feedback inspires the community.</p>
            </div>

            <form onSubmit={handleTestimonialSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="text-slate-400 font-bold block mb-1.5">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g., Atwiine Arthur"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500 placeholder-slate-700"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1.5">Who You Are / Role</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Parent / Advanced Student / Visitor"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500 placeholder-slate-700"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1.5">Overall Performance Rating</label>
                <div className="flex gap-1.5 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none group"
                    >
                      <Star
                        className={`w-6 h-6 transition-all ${
                          star <= rating
                            ? "text-amber-500 fill-amber-500 hover:scale-110 active:scale-95"
                            : "text-slate-800 hover:text-slate-650"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1.5">Your Review / Breakthrough Story</label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share details of physical discipline skills, rhythm mastery, mentorship growth, or parent perspectives here..."
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500 placeholder-slate-700 leading-relaxed font-sans"
                />
              </div>

              {feedback && (
                <div className="flex gap-2 items-start bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl text-orange-400">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="leading-relaxed font-medium">{feedback}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-550 hover:to-amber-450 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-orange-500/5 hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? "Submitting Review..." : "Submit Review for Verification"}</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* BIOGRAPHY MODAL (FOR MENTORS) */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 text-left"
            >
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 z-20 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-full p-2 transition-colors"
                title="Close overlay"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-span-5 h-64 md:h-auto bg-slate-950 relative">
                  <img
                    src={selectedMember.profile_picture}
                    alt={selectedMember.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900 via-transparent to-transparent opacity-60" />
                </div>

                <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
                  <div>
                    <span className="text-orange-500 text-[10px] uppercase font-bold tracking-widest font-mono">
                      {selectedMember.role}
                    </span>
                    <h3 className="font-display font-black text-2xl text-white tracking-tight mt-1">
                      {selectedMember.name}
                    </h3>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                    {selectedMember.bio}
                  </p>

                  {/* Achievements section */}
                  {selectedMember.achievements && selectedMember.achievements.length > 0 && (
                    <div className="space-y-2 border-t border-slate-850 pt-4">
                      <h4 className="text-white text-xs font-display font-bold uppercase tracking-wider">Certified Milestones</h4>
                      <div className="space-y-1.5">
                        {selectedMember.achievements.map((ach, id) => (
                          <div key={id} className="flex gap-2 items-start text-xs font-mono text-slate-400">
                            <Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                            <span>{ach}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social Handles */}
                  <div className="flex gap-3 border-t border-slate-850 pt-4">
                    {selectedMember.socials.instagram && (
                      <a
                        href={selectedMember.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 bg-slate-950 border border-slate-850 hover:border-pink-500 px-3 py-1.5 rounded-xl text-slate-400 hover:text-white text-xs transition-colors"
                      >
                        <Instagram className="w-3.5 h-3.5 text-pink-500" />
                        <span className="font-mono text-[10px]">Instagram</span>
                      </a>
                    )}
                    {selectedMember.socials.youtube && (
                      <a
                        href={selectedMember.socials.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 bg-slate-950 border border-slate-850 hover:border-red-500 px-3 py-1.5 rounded-xl text-slate-400 hover:text-white text-xs transition-colors"
                      >
                        <Youtube className="w-3.5 h-3.5 text-red-500" />
                        <span className="font-mono text-[10px]">YouTube</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
