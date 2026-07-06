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
    <div id="beat-practice-arena" className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
      
      {/* Title & Interactive Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="text-orange-500 animate-pulse" size={18} />
            <span className="font-mono text-xs uppercase tracking-widest text-orange-400 font-extrabold">SIZZY BEAT LAB</span>
          </div>
          <h3 className="text-xl font-display font-extrabold text-white">Dynamic Groove Practice Station</h3>
          <p className="text-xs text-slate-300">Tap manual pads or start the syncopated lock-loop to practice freestyle moves.</p>
        </div>

        <button
          onClick={() => {
            setIsLoopActive(!isLoopActive);
            isAudioUnlocked.current = true;
          }}
          className={`px-5 py-2.5 rounded-xl font-extrabold text-xs tracking-wider flex items-center gap-2 shadow-lg transition-all duration-300 cursor-pointer ${
            isLoopActive
              ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
              : "bg-gradient-to-r from-orange-500 to-amber-500 hover:scale-[1.02] text-black shadow-orange-500/20"
          }`}
        >
          {isLoopActive ? (
            <>
              <Pause size={14} className="fill-current" />
              <span>PAUSE SEQUENCE</span>
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
      <div className="mb-6 p-4 rounded-2xl bg-slate-950/40 border border-slate-850/60 flex items-center justify-between gap-6">
        <div className="flex items-center gap-2 shrink-0">
          <Sliders className="text-slate-400" size={14} />
          <span className="text-[11px] font-mono font-bold text-slate-300">TEMPO: <span className="text-orange-400">{bpm} BPM</span></span>
        </div>
        <input
          type="range"
          min="80"
          max="145"
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="w-full accent-orange-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
        />
      </div>

      {/* Grid Pads */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* PAD 1: STREET BASS (KICK) */}
        <button
          onClick={() => triggerPad("kick")}
          className={`h-24 rounded-2xl border transition-all duration-150 p-4 text-left flex flex-col justify-between cursor-pointer select-none ${
            manualActive.kick || (isLoopActive && (activeStep === 0 || activeStep === 4 || activeStep === 6))
              ? "bg-orange-500/20 border-orange-500/80 shadow-[0_0_15px_rgba(249,115,22,0.3)] scale-[1.03]"
              : "bg-slate-950/80 border-slate-800 hover:border-orange-500/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-slate-500 uppercase font-black tracking-wider">TRACK 01</span>
            <div className={`w-2 h-2 rounded-full ${
              manualActive.kick || (isLoopActive && (activeStep === 0 || activeStep === 4 || activeStep === 6))
                ? "bg-orange-500"
                : "bg-slate-700"
            }`} />
          </div>
          <div>
            <span className="block font-black font-display text-xs text-white uppercase tracking-tight">STREET BASS</span>
            <span className="text-[9px] text-slate-400 font-mono">Analog Kick Sub</span>
          </div>
        </button>

        {/* PAD 2: CRISP SNARE */}
        <button
          onClick={() => triggerPad("snare")}
          className={`h-24 rounded-2xl border transition-all duration-150 p-4 text-left flex flex-col justify-between cursor-pointer select-none ${
            manualActive.snare || (isLoopActive && (activeStep === 3 || activeStep === 7))
              ? "bg-rose-500/20 border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.3)] scale-[1.03]"
              : "bg-slate-950/80 border-slate-800 hover:border-rose-500/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-slate-500 uppercase font-black tracking-wider">TRACK 02</span>
            <div className={`w-2 h-2 rounded-full ${
              manualActive.snare || (isLoopActive && (activeStep === 3 || activeStep === 7))
                ? "bg-rose-500"
                : "bg-slate-700"
            }`} />
          </div>
          <div>
            <span className="block font-black font-display text-xs text-white uppercase tracking-tight">SIZZY SNAP</span>
            <span className="text-[9px] text-slate-400 font-mono">Friction Clack</span>
          </div>
        </button>

        {/* PAD 3: CYMBAL SLAM */}
        <button
          onClick={() => triggerPad("hihat")}
          className={`h-24 rounded-2xl border transition-all duration-150 p-4 text-left flex flex-col justify-between cursor-pointer select-none ${
            manualActive.hihat || (isLoopActive && (activeStep === 1 || activeStep === 4 || activeStep === 5 || activeStep === 7))
              ? "bg-amber-400/20 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-[1.03]"
              : "bg-slate-950/80 border-slate-800 hover:border-amber-400/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-slate-500 uppercase font-black tracking-wider">TRACK 03</span>
            <div className={`w-2 h-2 rounded-full ${
              manualActive.hihat || (isLoopActive && (activeStep === 1 || activeStep === 4 || activeStep === 5 || activeStep === 7))
                ? "bg-amber-400"
                : "bg-slate-700"
            }`} />
          </div>
          <div>
            <span className="block font-black font-display text-xs text-white uppercase tracking-tight">CYMBAL SLAM</span>
            <span className="text-[9px] text-slate-400 font-mono">Hiss Transient</span>
          </div>
        </button>

        {/* PAD 4: AFRO SWEEP (SYNTH) */}
        <button
          onClick={() => triggerPad("synth")}
          className={`h-24 rounded-2xl border transition-all duration-150 p-4 text-left flex flex-col justify-between cursor-pointer select-none ${
            manualActive.synth || (isLoopActive && (activeStep === 2 || activeStep === 6))
              ? "bg-purple-500/20 border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.3)] scale-[1.03]"
              : "bg-slate-950/80 border-slate-800 hover:border-purple-500/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-slate-500 uppercase font-black tracking-wider">TRACK 04</span>
            <div className={`w-2 h-2 rounded-full ${
              manualActive.synth || (isLoopActive && (activeStep === 2 || activeStep === 6))
                ? "bg-purple-500"
                : "bg-slate-700"
            }`} />
          </div>
          <div>
            <span className="block font-black font-display text-xs text-white uppercase tracking-tight">AFRO SWEEP</span>
            <span className="text-[9px] text-slate-400 font-mono">Sawtooth Pitch Pitch</span>
          </div>
        </button>
      </div>

      {/* Real-time ticker */}
      <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-850 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 pl-2">
          <Music className="text-orange-500" size={13} />
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">GRID TRAX ENGINE:</span>
        </div>
        <div className="flex gap-1.5 flex-1 justify-end max-w-sm sm:max-w-md">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((num) => (
            <div
              key={num}
              className={`h-6 rounded-md flex-1 text-[9px] font-mono font-extrabold flex items-center justify-center transition-all duration-150 ${
                activeStep === num
                  ? "bg-gradient-to-t from-orange-500 to-amber-400 text-black shadow-md scale-y-110"
                  : num % 4 === 0 
                    ? "bg-slate-800 text-slate-400 border border-slate-700/50"
                    : "bg-slate-900/60 text-slate-600 border border-slate-800/40"
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
