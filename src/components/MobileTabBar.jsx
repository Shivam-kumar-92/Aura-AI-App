import React from 'react';
import { Mic, MessageSquare, Scan, Users, Settings } from 'lucide-react';

export default function MobileTabBar({ activeTab, onChangeTab }) {
  const tabs = [
    { id: 'voice', label: 'Aura Orb', icon: Mic },
    { id: 'chat', label: 'Chat Log', icon: MessageSquare },
    { id: 'vision', label: 'Vision', icon: Scan },
    { id: 'sync', label: 'Friend Sync', icon: Users }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-dark-950/90 backdrop-blur-2xl border-t border-white/10 px-4 py-2 flex items-center justify-around max-w-md mx-auto select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-200 active:scale-90 ${
              isActive
                ? 'text-aura-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${
              isActive ? 'bg-aura-cyan/15 text-aura-cyan shadow-glow-cyan' : ''
            }`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
