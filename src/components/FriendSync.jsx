import React, { useState } from 'react';
import { Users, QrCode, Copy, Check, Share2, Sparkles, Smartphone, ArrowRight } from 'lucide-react';

export default function FriendSync({ onSendMessage }) {
  const [roomCode, setRoomCode] = useState('AURA-9821');
  const [copied, setCopied] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [connectedFriends, setConnectedFriends] = useState([
    { id: 'you', name: 'You (Host Device)', role: 'Owner', active: true },
    { id: 'friend-1', name: 'Friend Device (Linked)', role: 'Guest', active: true }
  ]);
  const [sharedNote, setSharedNote] = useState('');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://aura-ai.local/room/${roomCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendSharedPrompt = () => {
    if (!sharedNote.trim()) return;
    onSendMessage(`[Co-op Prompt with Friend]: ${sharedNote}`);
    setSharedNote('');
  };

  return (
    <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full space-y-5 overflow-y-auto pb-24">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-aura-violet">
          <Users className="w-4 h-4" />
          <h2 className="text-base font-black text-white">Friend Sync & Session Room</h2>
        </div>
        <p className="text-xs text-slate-400">
          Share your AURA AI session with your friend so you can both interact with the AI together on your mobile phones!
        </p>
      </div>

      {/* Room Code Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-dark-900 to-slate-900 border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Your Private Room Code
          </span>
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live Sync Active
          </span>
        </div>

        <div className="text-3xl font-black font-mono tracking-widest text-center text-aura-cyan bg-dark-950/80 py-3 rounded-2xl border border-white/10">
          {roomCode}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopyLink}
            className="flex-1 py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/10 active:scale-95 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-aura-cyan" />}
            <span>{copied ? 'Link Copied!' : 'Copy Invite Link'}</span>
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Join my AURA AI Session',
                  text: `Use Room Code ${roomCode} to collaborate on AURA AI with me!`,
                  url: window.location.href
                });
              } else {
                handleCopyLink();
              }
            }}
            className="p-3 rounded-2xl bg-aura-violet/20 border border-aura-violet/40 text-aura-violet hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Connected Devices List */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
          Connected Mobile Devices ({connectedFriends.length})
        </span>

        <div className="space-y-2">
          {connectedFriends.map((device) => (
            <div
              key={device.id}
              className="p-3 rounded-2xl bg-dark-900 border border-white/5 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-dark-950 border border-white/10 flex items-center justify-center text-slate-300">
                  <Smartphone className="w-4 h-4 text-aura-cyan" />
                </div>
                <div>
                  <h4 className="font-bold text-white">{device.name}</h4>
                  <span className="text-[10px] text-slate-500 font-mono">{device.role}</span>
                </div>
              </div>

              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Connected
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Collaborative Prompt Notepad */}
      <div className="p-4 rounded-3xl bg-dark-900 border border-white/10 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Sparkles className="w-4 h-4 text-aura-pink" />
          <span>Shared Co-Op Prompt</span>
        </div>

        <textarea
          rows="2"
          value={sharedNote}
          onChange={(e) => setSharedNote(e.target.value)}
          placeholder="Type an idea or query for you and your friend to send to AURA..."
          className="w-full bg-dark-950 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-aura-violet"
        />

        <button
          onClick={handleSendSharedPrompt}
          disabled={!sharedNote.trim()}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-aura-violet to-pink-500 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 hover:shadow-glow-violet disabled:opacity-50 transition-all"
        >
          <span>Send Shared Prompt to AURA</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
