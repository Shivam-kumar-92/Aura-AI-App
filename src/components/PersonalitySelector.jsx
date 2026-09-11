import React from 'react';
import { PERSONALITIES } from '../services/aiService.js';
import { Sparkles, Cpu, Compass, Flame, Check } from 'lucide-react';

export default function PersonalitySelector({ currentPersonality, onSelect }) {
  const getIcon = (id) => {
    switch(id) {
      case 'nexus': return Cpu;
      case 'muse': return Compass;
      case 'spark': return Flame;
      default: return Sparkles;
    }
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none px-4 select-none">
      {Object.values(PERSONALITIES).map((persona) => {
        const Icon = getIcon(persona.id);
        const isActive = currentPersonality === persona.id;

        return (
          <button
            key={persona.id}
            onClick={() => onSelect(persona.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all shrink-0 active:scale-95 ${
              isActive
                ? 'bg-dark-900 text-white shadow-lg'
                : 'bg-dark-950/60 text-slate-400 border-white/5 hover:text-slate-200'
            }`}
            style={{
              borderColor: isActive ? persona.color : 'rgba(255,255,255,0.08)',
              boxShadow: isActive ? `0 0 20px -3px ${persona.color}44` : 'none'
            }}
          >
            <div 
              className="w-5 h-5 rounded-lg flex items-center justify-center text-dark-950 shrink-0 font-bold"
              style={{ backgroundColor: persona.color }}
            >
              <Icon className="w-3 h-3 text-dark-950" />
            </div>
            <span>{persona.name}</span>
            {isActive && <Check className="w-3.5 h-3.5 text-white" />}
          </button>
        );
      })}
    </div>
  );
}
