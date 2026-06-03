/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { EventItem } from "../types";
import { Calendar, MapPin, Clock, Tag, Search, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import SEO from "../components/SEO";

interface EventsProps {
  events: EventItem[];
  selectedEvent: EventItem | null;
  onClearSelectedEvent: () => void;
  onSelectEvent: (event: EventItem | null) => void;
}

export default function Events({
  events,
  selectedEvent,
  onClearSelectedEvent,
  onSelectEvent
}: EventsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { label: "All Items", val: "all" },
    { label: "Dance Battles", val: "battles" },
    { label: "Workshops", val: "workshops" },
    { label: "Outreaches", val: "outreaches" },
    { label: "Classes", val: "classes" }
  ];

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "all" || ev.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12 font-sans">
      <SEO
        title={selectedEvent ? selectedEvent.seo_title : "Classes, Workshops, and Dance Battles"}
        description={selectedEvent ? selectedEvent.seo_description : "Stay up to date with our events calendar. Register for the regional Mbarara Dance Battle, Master workshops, and weekly street dance classes."}
        keywords={selectedEvent ? selectedEvent.seo_keywords : "dance battles, workshops, mbarara events, urban dance, sizzy afro, community schedule"}
      />

      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-orange-500 font-display text-xs tracking-widest uppercase font-bold">
          DANCE SCHEDULE
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
          Classes, Workshops & Battles
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          From intensive regional dance showdowns and battles, to specialized development workshops and free neighborhood outreaches. Join our next cypher!
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
        {/* Category Toggles */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.val}
              onClick={() => setSelectedCategory(cat.val)}
              className={`text-xs px-4 py-2 rounded-xl font-semibold transition-all ${
                selectedCategory === cat.val
                  ? "bg-orange-500 text-white"
                  : "bg-slate-950/60 text-slate-400 border border-slate-850 hover:bg-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search dates, names, venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-850 py-2 pl-10 pr-4 text-slate-200 text-xs rounded-xl focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/10 border border-dashed border-slate-800 rounded-3xl">
          <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No schedule items match your current filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredEvents.map((ev) => (
            <motion.div
              key={ev.id}
              layout
              className="bg-slate-900/30 border border-slate-800 hover:border-slate-750 p-6 rounded-3xl flex flex-col sm:flex-row gap-6 hover:scale-[1.01] transition-all duration-300 cursor-pointer group"
              onClick={() => onSelectEvent(ev)}
            >
              <div className="w-full sm:w-44 h-44 shrink-0 rounded-2xl overflow-hidden border border-slate-850 bg-slate-950 relative">
                <img
                  src={ev.flyer_url}
                  alt={ev.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 bg-orange-500 text-white font-mono text-[9px] uppercase px-2 py-0.5 rounded font-black max-w-[100px] truncate">
                  {ev.category}
                </div>
              </div>

              <div className="flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-display font-extrabold text-white text-lg sm:text-xl group-hover:text-orange-500 transition-colors leading-tight">
                    {ev.title}
                  </h3>
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs font-mono text-slate-300">
                  <div className="flex items-center gap-2 text-orange-400">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>{ev.date} @ {ev.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onSelectEvent(ev)}
                    className="text-xs font-bold text-orange-500 flex items-center gap-1 hover:text-orange-400 transition-colors"
                  >
                    <span>Read Overview</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-slate-700">|</span>
                  <a
                    href={ev.cta_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    {ev.cta_label}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detailed Event Modal Panel */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClearSelectedEvent}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative z-10"
            >
              <button
                onClick={onClearSelectedEvent}
                className="absolute top-4 right-4 bg-slate-950/60 hover:bg-slate-950 text-white rounded-full p-1.5 transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="h-60 relative w-full bg-slate-950">
                <img
                  src={selectedEvent.flyer_url}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                <div className="absolute top-4 left-4 inline-block bg-orange-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded">
                  {selectedEvent.category}
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <h3 className="font-display font-extrabold text-2xl text-white tracking-tight">
                    {selectedEvent.title}
                  </h3>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Concept Description</h4>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>

                {/* Scheduling Details Grid */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-850 text-xs font-mono">
                  <div className="space-y-1">
                    <p className="text-slate-500 font-sans uppercase text-[9px] tracking-wider font-bold">Session Timing</p>
                    <div className="flex items-center gap-1.5 text-orange-400 font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{selectedEvent.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300 pl-5">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{selectedEvent.time}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-slate-500 font-sans uppercase text-[9px] tracking-wider font-bold">Venue Location</p>
                    <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  </div>
                </div>

                {/* Call to action register */}
                <div className="flex gap-4 border-t border-slate-850 pt-4">
                  <a
                    href={selectedEvent.cta_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold py-3 px-6 rounded-xl shadow-xl hover:shadow-orange-500/10 active:scale-95 transition-all text-sm text-center flex items-center justify-center gap-2"
                  >
                    <span>{selectedEvent.cta_label}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <button
                    onClick={onClearSelectedEvent}
                    className="px-5 py-3 border border-slate-800 hover:border-slate-700 bg-slate-950/45 text-slate-300 hover:text-white rounded-xl transition-colors text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
