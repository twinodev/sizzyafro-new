"use client";

import React from "react";
import { Sparkles, Terminal, Code2, ArrowLeftRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function App() {
  return (
    <div id="rebuild-root" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between p-6 md:p-12 font-sans overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {/* Decorative top ambient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-50/50 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between border-b border-slate-200/80 pb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <Code2 size={20} className="stroke-[2.5]" />
          </div>
          <span className="font-semibold tracking-tight text-slate-900">Clean Slate Workspace</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 text-emerald-700 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Ready to Rebuild
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full text-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Centered Icon Container */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Outer soft glowing rings */}
              <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-30 animate-pulse scale-125" />
              <div className="relative p-6 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 flex items-center justify-center">
                <Sparkles size={40} className="text-indigo-600 animate-bounce" />
              </div>
            </div>
          </div>

          {/* Heading Text */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
              Workspace Cleaned Successfully
            </h1>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              Every redundant view, component, and static asset has been cleared. The project environment is fully primed and optimized.
            </p>
          </div>

          {/* Action List Section with high visual alignment */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/60 shadow-sm text-left divide-y divide-slate-100">
            <div className="flex items-start gap-3 pb-3">
              <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-800">Components & Views Cleared</p>
                <p className="text-xs text-slate-400 mt-0.5">Deprecated dance files, modal dialogs, and admin boards deleted.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 py-3">
              <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-800">Compilation & Linter Safe</p>
                <p className="text-xs text-slate-400 mt-0.5">The Next.js builder compiles smoothly without broken references or stale imports.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pt-3">
              <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-800">Awaiting Your Goal Input</p>
                <p className="text-xs text-slate-400 mt-0.5">Describe what you want to build next, and I will assemble it perfectly.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer Details */}
      <footer className="w-full max-w-5xl mx-auto border-t border-slate-200/80 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-400 font-mono tracking-tight flex items-center gap-1.5">
          <Terminal size={12} /> ENV: Next.js + Tailwind v4 + TypeScript
        </p>
        <span className="text-xs text-slate-400">Ready for instructions</span>
      </footer>
    </div>
  );
}
