"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Sliders, Radio, Music } from "lucide-react";

// Web Audio API Synthesizer
const synthesizeDrum = (type: "kick" | "snare" | "hihat" | "synth") => {
  if (typeof window === "undefined") return;
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;

  const ctx = new AudioContext();
  
  if (type === "kick") {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const dist = ctx.createWaveShaper();
    
    osc.connect(dist);
    dist.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    
    const makeDistortionCurve = (amount = 20) => {
      const k = typeof amount === "number" ? amount : 50;
      const n_samples = 44100;
      const curve = new Float32Array(n_samples);
      const deg = Math.PI / 180;
      for (let i = 0 ; i < n_samples; ++i ) {
        const x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
      }
      return curve;
    };
    dist.curve = makeDistortionCurve(15);
    dist.oversample = "4x";
    
    gain.gain.setValueAtTime(0.85, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } else if (type === "snare") {
    const bufferSize = ctx.sampleRate * 0.28;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
       data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "highpass";
    noiseFilter.frequency.value = 1250;
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.55, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(185, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);
    
    oscGain.gain.setValueAtTime(0.35, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    
    noise.start(ctx.currentTime);
    osc.start(ctx.currentTime);
    noise.stop(ctx.currentTime + 0.28);
    osc.stop(ctx.currentTime + 0.15);
  } else if (type === "hihat") {
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 9500;
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.32, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noise.start(ctx.currentTime);
    noise.stop(ctx.currentTime + 0.08);
  } else if (type === "synth") {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(70, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.35);
    
    gain.gain.setValueAtTime(0.24, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  }
};

export default function BeatArena() {
  const [bpm, setBpm] = useState<number>(115);
  const [isLoopActive, setIsLoopActive] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const isAudioUnlocked = useRef<boolean>(false);
  
  const [manualActive, setManualActive] = useState({
    kick: false,
    snare: false,
    hihat: false,
    synth: false,
  });

  const triggerPad = (type: "kick" | "snare" | "hihat" | "synth") => {
    synthesizeDrum(type);
    isAudioUnlocked.current = true;
    setManualActive(prev => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setManualActive(prev => ({ ...prev, [type]: false }));
    }, 120);
  };

  // Automated sequencer sync
  useEffect(() => {
    if (!isLoopActive) {
      setActiveStep(-1);
      return;
    }

    const intervalMs = (60 / bpm) * 1000 * 0.5; // Eighth-note pulses
    let current = 0;

    const playStepAndAdvance = () => {
      setActiveStep(current);

      // Sizzy Afro authentic Syncopation grid
      if (current === 0 || current === 4 || current === 6) {
        synthesizeDrum("kick");
      }
      if (current === 1 || current === 4 || current === 5 || current === 7) {
        synthesizeDrum("hihat");
      }
      if (current === 3 || current === 7) {
        synthesizeDrum("snare");
      }
      if (current === 2 || current === 6) {
        synthesizeDrum("synth");
      }

      current = (current + 1) % 8;
    };

    // First trigger immediately
    playStepAndAdvance();
    const interval = setInterval(playStepAndAdvance, intervalMs);

    return () => clearInterval(interval);
  }, [isLoopActive, bpm]);

  return (
    <div id="beat-practice-arena" className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-2xl relative overflow-hidden transition-all duration-300">
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-500/10 to-amber-500/0 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Title & Interactive Switch */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-800/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Radio className="text-orange-500 animate-pulse" size={16} />
            <span className="font-mono text-[10px] tracking-widest text-orange-500 font-extrabold uppercase">Freestyle Training Hub</span>
          </div>
          <h3 className="text-2xl font-display font-black text-white tracking-tight">SIZZY BEAT SEQUENCER</h3>
          <p className="text-xs text-slate-400">Trigger low-frequency sub drums, snaps, or start the automated syncopated loop to practice street dance locks.</p>
        </div>

        <button
          onClick={() => {
            setIsLoopActive(!isLoopActive);
            isAudioUnlocked.current = true;
          }}
          className={`px-6 py-3 rounded-xl font-extrabold text-xs tracking-wider flex items-center justify-center gap-2.5 shadow-lg transition-all duration-300 transform active:scale-95 cursor-pointer ${
            isLoopActive
              ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20"
              : "bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-orange-500/10 text-black"
          }`}
        >
          {isLoopActive ? (
            <>
              <Pause size={14} className="fill-current" />
              <span>STOP LOOP RUN</span>
            </>
          ) : (
            <>
              <Play size={14} className="fill-current" />
              <span>START FREESTYLE BEAT</span>
            </>
          )}
        </button>
      </div>

      {/* BPM Controller */}
      <div className="mb-8 p-5 rounded-2xl bg-slate-950/60 border border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 shrink-0">
          <Sliders className="text-slate-400" size={14} />
          <span className="text-xs font-mono font-bold text-slate-300">PRACTICE TEMPO: <span className="text-orange-400 font-black">{bpm} BPM</span></span>
        </div>
        <div className="w-full sm:flex-1 max-w-md flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-600">80</span>
          <input
            type="range"
            min="80"
            max="145"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer h-1.5 bg-slate-900 rounded-lg appearance-none border border-slate-800/40"
          />
          <span className="text-[10px] font-mono text-slate-600">145</span>
        </div>
      </div>

      {/* Grid Pads */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* PAD 1: STREET BASS (KICK) */}
        <button
          onClick={() => triggerPad("kick")}
          className={`h-28 rounded-2xl border transition-all duration-200 p-4.5 text-left flex flex-col justify-between cursor-pointer select-none relative group overflow-hidden ${
            manualActive.kick || (isLoopActive && (activeStep === 0 || activeStep === 4 || activeStep === 6))
              ? "bg-orange-500/10 border-orange-500/80 shadow-[0_0_20px_rgba(249,115,22,0.2)] scale-[1.02]"
              : "bg-slate-950/40 border-slate-800/80 hover:border-orange-500/40 hover:bg-slate-950/80"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between z-10">
            <span className="text-[9px] font-mono text-slate-500 tracking-wider font-bold">PAD 01</span>
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-150 ${
              manualActive.kick || (isLoopActive && (activeStep === 0 || activeStep === 4 || activeStep === 6))
                ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)] scale-110"
                : "bg-slate-800"
            }`} />
          </div>
          <div className="z-10">
            <span className="block font-black font-display text-xs text-white uppercase tracking-tight">STREET BASS</span>
            <span className="text-[9px] text-slate-400 font-mono">Analog Kick Sub</span>
          </div>
        </button>

        {/* PAD 2: CRISP SNARE */}
        <button
          onClick={() => triggerPad("snare")}
          className={`h-28 rounded-2xl border transition-all duration-200 p-4.5 text-left flex flex-col justify-between cursor-pointer select-none relative group overflow-hidden ${
            manualActive.snare || (isLoopActive && (activeStep === 3 || activeStep === 7))
              ? "bg-rose-500/10 border-rose-500/80 shadow-[0_0_20px_rgba(244,63,94,0.2)] scale-[1.02]"
              : "bg-slate-950/40 border-slate-800/80 hover:border-rose-500/40 hover:bg-slate-950/80"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between z-10">
            <span className="text-[9px] font-mono text-slate-500 tracking-wider font-bold">PAD 02</span>
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-150 ${
              manualActive.snare || (isLoopActive && (activeStep === 3 || activeStep === 7))
                ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] scale-110"
                : "bg-slate-800"
            }`} />
          </div>
          <div className="z-10">
            <span className="block font-black font-display text-xs text-white uppercase tracking-tight">RHYTHM SNAP</span>
            <span className="text-[9px] text-slate-400 font-mono">Friction Snare clack</span>
          </div>
        </button>

        {/* PAD 3: CYMBAL SLAM */}
        <button
          onClick={() => triggerPad("hihat")}
          className={`h-28 rounded-2xl border transition-all duration-200 p-4.5 text-left flex flex-col justify-between cursor-pointer select-none relative group overflow-hidden ${
            manualActive.hihat || (isLoopActive && (activeStep === 1 || activeStep === 4 || activeStep === 5 || activeStep === 7))
              ? "bg-amber-400/10 border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.2)] scale-[1.02]"
              : "bg-slate-950/40 border-slate-800/80 hover:border-amber-400/40 hover:bg-slate-950/80"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-amber-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between z-10">
            <span className="text-[9px] font-mono text-slate-500 tracking-wider font-bold">PAD 03</span>
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-150 ${
              manualActive.hihat || (isLoopActive && (activeStep === 1 || activeStep === 4 || activeStep === 5 || activeStep === 7))
                ? "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)] scale-110"
                : "bg-slate-800"
            }`} />
          </div>
          <div className="z-10">
            <span className="block font-black font-display text-xs text-white uppercase tracking-tight">CYMBAL SHIMMER</span>
            <span className="text-[9px] text-slate-400 font-mono">Crisp Hat Transient</span>
          </div>
        </button>

        {/* PAD 4: AFRO SWEEP */}
        <button
          onClick={() => triggerPad("synth")}
          className={`h-28 rounded-2xl border transition-all duration-200 p-4.5 text-left flex flex-col justify-between cursor-pointer select-none relative group overflow-hidden ${
            manualActive.synth || (isLoopActive && (activeStep === 2 || activeStep === 6))
              ? "bg-purple-500/10 border-purple-500/80 shadow-[0_0_20px_rgba(168,85,247,0.2)] scale-[1.02]"
              : "bg-slate-950/40 border-slate-800/80 hover:border-purple-500/40 hover:bg-slate-950/80"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between z-10">
            <span className="text-[9px] font-mono text-slate-500 tracking-wider font-bold">PAD 04</span>
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-150 ${
              manualActive.synth || (isLoopActive && (activeStep === 2 || activeStep === 6))
                ? "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)] scale-110"
                : "bg-slate-800"
            }`} />
          </div>
          <div className="z-10">
            <span className="block font-black font-display text-xs text-white uppercase tracking-tight">AFRO SYNTH SWEEP</span>
            <span className="text-[9px] text-slate-400 font-mono">Analog Sawtooth Sweep</span>
          </div>
        </button>
      </div>

      {/* Real-time ticker */}
      <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <Music className="text-orange-500" size={13} />
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">LOOP SEQUENCE STEPPER:</span>
        </div>
        <div className="flex gap-2 w-full sm:flex-1 justify-end max-w-sm sm:max-w-md">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((num) => (
            <div
              key={num}
              className={`h-8 rounded-lg flex-1 text-[10px] font-mono font-black flex items-center justify-center transition-all duration-200 border ${
                activeStep === num
                  ? "bg-gradient-to-t from-orange-500 to-amber-400 text-black border-orange-400 shadow-md scale-y-105"
                  : num % 4 === 0 
                    ? "bg-slate-800/80 text-slate-300 border-slate-700/60"
                    : "bg-slate-900/40 text-slate-550 border-slate-800/40"
              }`}
            >
              0{num + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
