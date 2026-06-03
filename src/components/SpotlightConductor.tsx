/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Lightbulb, 
  Sparkles, 
  Settings, 
  X, 
  Sliders, 
  Eye, 
  Check, 
  Play,
  RotateCcw,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SpotlightSection {
  id: string;
  label: string;
  description: string;
}

interface SpotlightConductorProps {
  activeTab: string;
}

const PAGE_SECTIONS: Record<string, SpotlightSection[]> = {
  home: [
    { id: "home-hero", label: "Hero Cypher", description: "Main landing stage & welcome deck" },
    { id: "home-pillars", label: "Street Pillars", description: "Core objectives & foundation values" },
    { id: "home-event", label: "Featured Workshop", description: "Highlight classes & battle schedule" },
    { id: "home-founder", label: "Emmanuel Focus", description: "Founder story & milestone overview" },
    { id: "home-stories", label: "Breakthrough blog", description: "Life stories & media posts" },
    { id: "home-cta", label: "Support Cypher", description: "Dynamic community call to action" },
  ],
  about: [
    { id: "about-story", label: "Our Story", description: "Foundation overview & background metrics" },
    { id: "about-vision", label: "Vision & Mission", description: "Inspirational path & goals" },
    { id: "about-values", label: "Core Values", description: "Systematic character guidelines" },
    { id: "about-mentors", label: "Artistic Mentors", description: "Coaches and choreographers list" },
    { id: "about-objectives", label: "Key Objectives", description: "Measurable project guidelines" },
    { id: "about-reviews", label: "Citizens Reviews", description: "Approved parent & student feedback" },
  ]
};

const COLOR_PALETTES = [
  { name: "Sizzy Orange", color: "#f97316", textClass: "text-orange-500", bgClass: "bg-orange-500" },
  { name: "Cyber Purple", color: "#a855f7", textClass: "text-purple-500", bgClass: "bg-purple-500" },
  { name: "Laser Teal", color: "#06b6d4", textClass: "text-cyan-500", bgClass: "bg-cyan-500" },
  { name: "Sunset Gold", color: "#eab308", textClass: "text-yellow-500", bgClass: "bg-yellow-500" },
];

export default function SpotlightConductor({ activeTab }: SpotlightConductorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTES[0]); // Orange default
  const [spotlightSize, setSpotlightSize] = useState<number>(300); //px
  const [intensity, setIntensity] = useState<number>(0.5); // opacity
  const [lightMode, setLightMode] = useState<"torch" | "pulse">("torch"); // torch follow cursor or auto pulses
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [elementRect, setElementRect] = useState<DOMRect | null>(null);
  const targetRef = useRef<HTMLElement | null>(null);

  // Sync state when elements are selected or scroll position alterations occur
  useEffect(() => {
    if (!activeSectionId) {
      targetRef.current = null;
      setElementRect(null);
      return;
    }

    const el = document.getElementById(activeSectionId);
    if (el) {
      targetRef.current = el;
      // Scroll to view
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      
      const updateRect = () => {
        const rect = el.getBoundingClientRect();
        setElementRect(rect);
      };
      
      // Update immediately
      updateRect();

      // Setup window listeners for changes
      window.addEventListener("scroll", updateRect, { passive: true });
      window.addEventListener("resize", updateRect);

      return () => {
        window.removeEventListener("scroll", updateRect);
        window.removeEventListener("resize", updateRect);
      };
    } else {
      targetRef.current = null;
      setElementRect(null);
    }
  }, [activeSectionId]);

  // Track cursor coordinates relative to active spotlight element space
  useEffect(() => {
    if (!activeSectionId || !elementRect) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (lightMode === "torch") {
        // Find relative percentage coordinates in original pixel layouts
        const x = e.clientX - elementRect.left;
        const y = e.clientY - elementRect.top;
        setMousePos({ x, y });
      }
    };

    // Auto pulsing cursor position if in auto-pulse mode
    let interval: NodeJS.Timeout;
    if (lightMode === "pulse") {
      let angle = 0;
      interval = setInterval(() => {
        angle += 0.04;
        const width = elementRect.width;
        const height = elementRect.height;
        // Sweep orbit path
        const x = width / 2 + Math.cos(angle) * (width * 0.3);
        const y = height / 2 + Math.sin(angle * 1.5) * (height * 0.25);
        setMousePos({ x, y });
      }, 16);
    } else {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (interval) clearInterval(interval);
    };
  }, [activeSectionId, elementRect, lightMode]);

  const currentSections = PAGE_SECTIONS[activeTab] || [];

  return (
    <>
      {/* 1. FLOATING CONTROL LAUNCH DECK */}
      <div className="fixed bottom-24 left-4 z-50 font-sans">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={() => setIsOpen(true)}
              className="bg-slate-950/95 border border-orange-500/30 hover:border-orange-500 text-white rounded-full py-2.5 px-4 flex items-center gap-2.5 shadow-2xl backdrop-blur-md text-xs font-bold transition-all group shrink-0"
              title="Activate Stage Spotlight Controls"
              id="spotlight-launcher-panel-btn"
            >
              <div className="w-5 h-5 bg-orange-500 text-white flex items-center justify-center rounded-full animate-bounce">
                <Lightbulb className="w-3 h-3 fill-white" />
              </div>
              <span className="group-hover:text-orange-400 font-display uppercase tracking-wider text-[10px]">Stage Spotlight UI</span>
              <span className="inline-block bg-orange-500/10 text-orange-400 text-[9px] px-1.5 py-0.5 rounded font-mono font-black uppercase">Live</span>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="w-80 bg-slate-950/95 border border-slate-850 rounded-3xl p-5 shadow-2xl backdrop-blur-lg relative text-left text-xs"
            >
              {/* Header section control bar */}
              <div className="flex items-center justify-between border-b border-slate-900 pb-3.5 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-orange-600 to-amber-500 rounded-lg flex items-center justify-center text-white">
                    <Zap className="w-3.5 h-3.5 fill-white" />
                  </div>
                  <div>
                    <h4 className="font-display font-black text-white text-xs uppercase tracking-wider">Theatre Spotlights</h4>
                    <p className="text-[10px] text-slate-500 uppercase font-mono tracking-widest font-bold">Dynamic Stage Layer</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setActiveSectionId(null);
                  }}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-755 text-slate-400 hover:text-white rounded-full p-1.5 transition-colors"
                  title="Close command deck"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Selector content */}
              <div className="space-y-4">
                {currentSections.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-slate-900/40 text-center border border-slate-900 text-slate-500">
                    <p>Theatre lights are configured for Home & About page cypher stages.</p>
                  </div>
                ) : (
                  <>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      Select an addressable section below. The system will auto-scroll and focus a thematic glowing searchlight overlay onto the physical space.
                    </p>

                    {/* Section buttons array */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {currentSections.map((sec) => {
                        const isFocused = activeSectionId === sec.id;
                        return (
                          <button
                            key={sec.id}
                            onClick={() => {
                              if (isFocused) {
                                setActiveSectionId(null);
                              } else {
                                setActiveSectionId(sec.id);
                              }
                            }}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              isFocused
                                ? "bg-orange-500/10 border-orange-500/60 text-white"
                                : "bg-slate-900/60 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-white"
                            }`}
                          >
                            <p className="font-black text-[10.5px] uppercase tracking-wide truncate">{sec.label}</p>
                            <p className="text-[9px] text-slate-500 mt-0.5 truncate">{sec.description}</p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Dynamic customization parameters slider */}
                    <div className="border-t border-slate-900 pt-3.5 space-y-3.5">
                      {/* Color Palette slider chips */}
                      <div className="space-y-1.5">
                        <span className="text-slate-500 font-bold block text-[9px] uppercase tracking-wider">Spotlight Theme Color</span>
                        <div className="flex gap-2">
                          {COLOR_PALETTES.map((palette) => {
                            const isChosen = selectedColor.name === palette.name;
                            return (
                              <button
                                key={palette.name}
                                onClick={() => setSelectedColor(palette)}
                                className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform active:scale-95 text-white ${palette.bgClass} ${
                                  isChosen ? "ring-2 ring-white scale-110" : "opacity-60 hover:opacity-100"
                                }`}
                                title={palette.name}
                              >
                                {isChosen && <Check className="w-3 h-3 stroke-[3px]" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Beam sizing inputs */}
                      <div className="grid grid-cols-2 gap-3 font-mono text-[9.5px]">
                        <div>
                          <div className="flex justify-between text-slate-500 uppercase font-sans font-bold mb-1">
                            <span>Light Beam Radius</span>
                            <span>{spotlightSize}px</span>
                          </div>
                          <input
                            type="range"
                            min="150"
                            max="550"
                            step="20"
                            value={spotlightSize}
                            onChange={(e) => setSpotlightSize(Number(e.target.value))}
                            className="w-full accent-orange-500"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-slate-500 uppercase font-sans font-bold mb-1">
                            <span>Stage Dim Level</span>
                            <span>{Math.round((1 - intensity) * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0.2"
                            max="0.8"
                            step="0.05"
                            value={intensity}
                            onChange={(e) => setIntensity(Number(e.target.value))}
                            className="w-full accent-orange-500"
                          />
                        </div>
                      </div>

                      {/* Light Tracking Engine Mode */}
                      <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-xl border border-slate-900 text-[10px]">
                        <span className="text-slate-400 font-semibold uppercase font-sans">Beam Search Engine:</span>
                        <div className="flex bg-slate-950 p-1.5 rounded-lg border border-slate-850 gap-1.5 font-sans font-bold">
                          <button
                            onClick={() => setLightMode("torch")}
                            className={`px-2 py-0.5 rounded transition-all text-[9.5px] uppercase ${
                              lightMode === "torch" ? "bg-orange-500 text-white" : "text-slate-400 hover:text-white"
                            }`}
                          >
                            Cursor Follow
                          </button>
                          <button
                            onClick={() => setLightMode("pulse")}
                            className={`px-2 py-0.5 rounded transition-all text-[9.5px] uppercase ${
                              lightMode === "pulse" ? "bg-orange-500 text-white" : "text-slate-400 hover:text-white"
                            }`}
                          >
                            Theatre Pulse
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Reset Controls support */}
                    {activeSectionId && (
                      <button
                        onClick={() => {
                          setActiveSectionId(null);
                        }}
                        className="w-full bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-400 py-2 rounded-xl text-[10px] transition-colors border border-slate-850 flex items-center justify-center gap-1.5 font-bold uppercase"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Blackout Theatre Bulbs</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. CORE THEATRICAL PHYSICAL MASK & SVG LIGHT CONE */}
      <AnimatePresence>
        {activeSectionId && elementRect && (
          <div
            style={{
              position: "fixed",
              top: elementRect.top,
              left: elementRect.left,
              width: elementRect.width,
              height: elementRect.height,
              zIndex: 30, // underneath headers, above content base layers
              pointerEvents: "none", // click through to links! Essential for usability!
            }}
            className="overflow-hidden mix-blend-multiply"
          >
            {/* The absolute dimmed overlay with radial mask */}
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: `rgba(4, 8, 16, ${intensity})`,
                maskImage: `radial-gradient(circle ${spotlightSize}px at ${mousePos.x}px ${mousePos.y}px, transparent 15%, black 100%)`,
                WebkitMaskImage: `radial-gradient(circle ${spotlightSize}px at ${mousePos.x}px ${mousePos.y}px, transparent 15%, black 100%)`,
                transition: "background-color 0.3s ease",
              }}
              className="absolute inset-0"
            />
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic additive glowing flare overlay for ultra-polished visual fidelity */}
      <AnimatePresence>
        {activeSectionId && elementRect && (
          <div
            style={{
              position: "fixed",
              top: elementRect.top,
              left: elementRect.left,
              width: elementRect.width,
              height: elementRect.height,
              zIndex: 31,
              pointerEvents: "none",
            }}
            className="overflow-hidden mix-blend-screen"
          >
            {/* Glowing spot flare */}
            <div
              style={{
                position: "absolute",
                left: mousePos.x - spotlightSize / 2,
                top: mousePos.y - spotlightSize / 2,
                width: spotlightSize,
                height: spotlightSize,
                background: `radial-gradient(circle, ${selectedColor.color}25 0%, ${selectedColor.color}10 40%, transparent 70%)`,
                borderRadius: "50%",
                transform: "translate3d(0, 0, 0)",
              }}
            />

            {/* Glowing core source focus */}
            <div
              style={{
                position: "absolute",
                left: mousePos.x - 30,
                top: mousePos.y - 30,
                width: 60,
                height: 60,
                background: `radial-gradient(circle, #ffffff90 0%, ${selectedColor.color}45 40%, transparent 70%)`,
                borderRadius: "50%",
                transform: "scale(1.2)",
              }}
              className="animate-pulse"
            />

            {/* Optional visual beam line representing a hanging physical search beam from top corner */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="theatreBeam" x1="0%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor={selectedColor.color} stopOpacity="0.4" />
                  <stop offset="60%" stopColor={selectedColor.color} stopOpacity="0.1" />
                  <stop offset="100%" stopColor={selectedColor.color} stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon
                points={`0,0 ${mousePos.x - 12} ${mousePos.y} ${mousePos.x + 12} ${mousePos.y}`}
                fill="url(#theatreBeam)"
                className="opacity-40"
              />
            </svg>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
