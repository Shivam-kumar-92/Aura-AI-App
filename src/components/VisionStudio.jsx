import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Sparkles, Scan, CheckCircle2, ArrowRight, RefreshCw, UploadCloud, AlertCircle } from 'lucide-react';
import { getGeminiApiKey } from '../services/aiService.js';

export default function VisionStudio({ onAnalyzeImage, isAnalyzing = false, visionResult = null }) {
  const [selectedSample, setSelectedSample] = useState(null);
  const [customPrompt, setCustomPrompt] = useState('Analyze the composition, key objects, and technical details in this image.');

  const sampleImages = [
    {
      id: 'badminton',
      title: 'Badminton Racket Frame',
      desc: 'Aerodynamic frame and tension engineering analysis',
      url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'tech',
      title: 'Cyber Circuit Board',
      desc: 'Microcontroller & electronics diagnostics',
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'city',
      title: 'Futuristic Architecture',
      desc: 'Urban geometry & lighting structure',
      url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const customImg = {
          id: 'custom-' + Date.now(),
          title: file.name,
          desc: 'Uploaded mobile camera capture',
          url: event.target.result,
          name: file.name
        };
        setSelectedSample(customImg);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = () => {
    const target = selectedSample || sampleImages[0];
    onAnalyzeImage(target, customPrompt);
  };

  const currentActiveImage = selectedSample || sampleImages[0];
  const hasApiKey = Boolean(getGeminiApiKey());

  return (
    <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full space-y-4 overflow-y-auto pb-24">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-aura-cyan">
            <Scan className="w-4 h-4" />
            <h2 className="text-base font-black text-white tracking-wide">AURA Vision Scanner</h2>
          </div>
          {hasApiKey ? (
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Gemini Vision Live
            </span>
          ) : (
            <span className="text-[10px] bg-amber-500/20 text-amber-400 font-mono px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
              Neural Edge Mode
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400">
          Upload any photo from your phone or select a preset to perform real-time visual analysis.
        </p>
      </div>

      {/* Primary Image Viewport */}
      <div className="relative rounded-3xl overflow-hidden bg-dark-900 border border-white/10 h-64 flex items-center justify-center p-2 group shadow-2xl">
        <img
          src={currentActiveImage.url}
          alt="Visual Scanner Target"
          className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
        />

        {/* Laser Scan Overlay when analyzing */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-dark-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
            <div className="w-full h-1 bg-aura-cyan shadow-[0_0_15px_#00F0FF] animate-pulse" />
            <span className="mt-4 text-xs font-mono font-bold text-white bg-dark-950/90 px-3.5 py-1.5 rounded-full border border-aura-cyan/40 shadow-lg flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-aura-cyan animate-spin" />
              Scanning Image Telemetry...
            </span>
          </div>
        )}

        <div className="absolute top-4 left-4 bg-dark-950/80 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 text-[10px] font-mono text-aura-cyan font-bold shadow-md">
          {currentActiveImage.title}
        </div>
      </div>

      {/* Upload or Pick Samples */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Image Feed</span>
          <label className="cursor-pointer text-aura-cyan font-bold flex items-center gap-1.5 hover:text-white transition-colors bg-white/5 px-2.5 py-1 rounded-xl border border-white/10 text-[11px]">
            <UploadCloud className="w-3.5 h-3.5" /> Upload File
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {sampleImages.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSample(s)}
              className={`relative rounded-2xl overflow-hidden h-20 border transition-all text-left group ${
                currentActiveImage.id === s.id ? 'border-aura-cyan ring-2 ring-aura-cyan/40 scale-[1.02]' : 'border-white/10 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={s.url} alt={s.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-transparent p-1.5 flex flex-col justify-end">
                <span className="text-[9px] font-bold text-white truncate">{s.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Query Prompt Input */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Analysis Instruction</label>
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="E.g. What is the condition of this item?"
          className="w-full px-4 py-2.5 rounded-2xl bg-dark-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-aura-cyan transition-all"
        />
      </div>

      {/* Trigger Button */}
      <button
        onClick={handleScan}
        disabled={isAnalyzing}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-aura-cyan to-blue-600 text-dark-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-cyan active:scale-95 transition-all disabled:opacity-50"
      >
        <Sparkles className="w-4 h-4 fill-dark-950" />
        {isAnalyzing ? 'Analyzing with Neural Vision...' : 'Scan & Comprehend'}
      </button>

      {/* Vision Results Preview */}
      {visionResult && (
        <div className="p-4 rounded-2xl bg-dark-900/90 border border-aura-cyan/30 space-y-2 animate-fadeIn shadow-xl">
          <div className="flex items-center justify-between text-aura-cyan text-xs font-bold font-mono">
            <span>VISION REPORT</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
            {visionResult}
          </div>
        </div>
      )}
    </div>
  );
}
