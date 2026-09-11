import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Sparkles, Scan, CheckCircle2, ArrowRight, RefreshCw, UploadCloud } from 'lucide-react';

export default function VisionStudio({ onAnalyzeImage, isAnalyzing = false, visionResult = null }) {
  const [selectedSample, setSelectedSample] = useState(null);
  const [customPrompt, setCustomPrompt] = useState('Analyze the composition, key objects, and technical details in this image.');

  const sampleImages = [
    {
      id: 'badminton',
      title: 'Badminton Racket Frame',
      desc: 'Sports equipment aerodynamic analysis',
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
          id: 'custom',
          title: file.name,
          desc: 'Uploaded mobile snapshot',
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

  return (
    <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full space-y-4 overflow-y-auto pb-24">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-aura-cyan">
          <Scan className="w-4 h-4" />
          <h2 className="text-base font-black text-white">AURA Vision Scanner</h2>
        </div>
        <p className="text-xs text-slate-400">
          Upload any photo or select a sample for instant AI visual analysis and OCR comprehension.
        </p>
      </div>

      {/* Primary Image Viewport */}
      <div className="relative rounded-3xl overflow-hidden bg-dark-900 border border-white/10 h-64 flex items-center justify-center p-2 group">
        <img
          src={selectedSample ? selectedSample.url : sampleImages[0].url}
          alt="Visual Scanner Target"
          className="w-full h-full object-cover rounded-2xl"
        />

        {/* Laser Scan Overlay when analyzing */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-aura-cyan/10 flex flex-col items-center justify-center">
            <div className="w-full h-1 bg-aura-cyan shadow-glow-cyan animate-bounce" />
            <span className="mt-4 text-xs font-mono font-bold text-white bg-dark-950/80 px-3 py-1 rounded-full border border-aura-cyan/40">
              Neural Scanner Active...
            </span>
          </div>
        )}

        <div className="absolute top-4 left-4 bg-dark-950/80 px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-mono text-aura-cyan font-bold">
          {selectedSample ? selectedSample.title : sampleImages[0].title}
        </div>
      </div>

      {/* Upload or Pick Samples */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Select Image Source</span>
          <label className="cursor-pointer text-aura-cyan font-bold flex items-center gap-1 hover:underline">
            <UploadCloud className="w-3.5 h-3.5" /> Upload Photo
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {sampleImages.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSample(s)}
              className={`p-1.5 rounded-2xl border transition-all text-left ${
                (selectedSample?.id === s.id || (!selectedSample && s.id === 'badminton'))
                  ? 'bg-dark-900 border-aura-cyan shadow-glow-cyan'
                  : 'bg-dark-950/60 border-white/5 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={s.url} alt={s.title} className="w-full h-14 object-cover rounded-xl mb-1.5" />
              <span className="text-[10px] font-extrabold text-white block truncate">{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Prompt Box */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Vision Prompt Directives
        </label>
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="What would you like AURA to inspect?"
          className="w-full bg-dark-900 border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-aura-cyan"
        />
      </div>

      {/* Trigger Scan Button */}
      <button
        onClick={handleScan}
        disabled={isAnalyzing}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-aura-cyan via-teal-400 to-blue-500 text-dark-950 font-black text-xs uppercase tracking-wide flex items-center justify-center gap-2 hover:shadow-glow-cyan active:scale-98 transition-all"
      >
        {isAnalyzing ? (
          <RefreshCw className="w-4 h-4 animate-spin text-dark-950" />
        ) : (
          <>
            <Scan className="w-4 h-4" />
            <span>Process Neural Vision Scan</span>
          </>
        )}
      </button>

      {/* Vision Results Card */}
      {visionResult && (
        <div className="p-4 rounded-3xl bg-dark-900 border border-white/10 space-y-2 text-xs text-slate-200 animate-in fade-in">
          <div className="flex items-center gap-2 text-aura-cyan font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Vision Diagnostics Complete</span>
          </div>
          <p className="whitespace-pre-line leading-relaxed text-slate-300 text-[11px]">
            {visionResult}
          </p>
        </div>
      )}

    </div>
  );
}
