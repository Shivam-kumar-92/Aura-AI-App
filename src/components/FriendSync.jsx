import React, { useState, useEffect } from 'react';
import { Users, QrCode, Copy, Check, Share2, Sparkles, Smartphone, ArrowRight, Radio, RefreshCw, Send } from 'lucide-react';
import { syncEngine } from '../services/syncService.js';

export default function FriendSync({ onSendMessage, conversation = [] }) {
  const [roomCode, setRoomCode] = useState('AURA-8800');
  const [copied, setCopied] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [sharedNote, setSharedNote] = useState('');
  const [peers, setPeers] = useState([]);

  useEffect(() => {
    // Listen for peer discoveries
    syncEngine.onPeerListUpdated = (peerList) => {
      setPeers(peerList);
    };

    // Auto-broadcast the latest conversation message
    const lastMsg = conversation[conversation.length - 1];
    if (lastMsg) {
      syncEngine.broadcastMessage(lastMsg);
    }
  }, [conversation]);

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/#room=${roomCode}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const clean = inputCode.trim().toUpperCase();
    setRoomCode(clean);
    syncEngine.setRoom(clean);
    setInputCode('');
  };

  const handleSendSharedPrompt = () => {
    if (!sharedNote.trim()) return;
    onSendMessage(`[Co-op Prompt]: ${sharedNote}`);
    setSharedNote('');
  };

  return (
    <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full space-y-4 overflow-y-auto pb-24">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-aura-violet">
          <Users className="w-4 h-4" />
          <h2 className="text-base font-black text-white">Friend Sync & Session Room</h2>
        </div>
        <p className="text-xs text-slate-400">
          Share your AURA AI session with your friend so you can both interact with the AI together in real-time across devices!
        </p>
      </div>

      {/* Room Code Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-dark-900 to-slate-900 border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Active Room Channel
          </span>
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live Sync Ready
          </span>
        </div>

        <div className="text-3xl font-black font-mono tracking-widest text-center text-aura-cyan bg-dark-950/80 py-3 rounded-2xl border border-white/10 select-all">
          {roomCode}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopyLink}
            className="flex-1 py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/10 active:scale-95 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Room Link Copied!' : 'Share Room Link'}
          </button>
        </div>
      </div>

      {/* Join Another Room Form */}
      <form onSubmit={handleJoinRoom} className="flex gap-2">
        <input
          type="text"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          placeholder="Enter Friend's Room Code..."
          className="flex-1 px-4 py-2.5 rounded-2xl bg-dark-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-aura-violet uppercase font-mono"
        />
        <button
          type="submit"
          className="px-4 py-2.5 rounded-2xl bg-aura-violet text-white text-xs font-bold active:scale-95 transition-all flex items-center gap-1 shrink-0"
        >
          <span>Join</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Connected Devices Presence */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="uppercase tracking-wider text-[10px]">Connected Session Peers</span>
          <span className="text-aura-cyan font-mono text-[11px]">{peers.length + 1} Online</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-dark-900/60 border border-white/5 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <div>
                <p className="font-bold text-white leading-tight">This Device (Host)</p>
                <p className="text-[10px] text-slate-400">Broadcasting on channel</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-aura-cyan border border-white/10">Active</span>
          </div>

          {peers.map((peer) => (
            <div key={peer.id} className="flex items-center justify-between p-3 rounded-2xl bg-dark-900/60 border border-aura-violet/20 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-aura-violet animate-pulse" />
                <div>
                  <p className="font-bold text-white leading-tight">{peer.name}</p>
                  <p className="text-[10px] text-slate-400">Joined Room Channel</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-aura-violet/20 text-aura-violet border border-aura-violet/30">Synced</span>
            </div>
          ))}
        </div>
      </div>

      {/* Collaborative Prompt Box */}
      <div className="p-4 rounded-3xl bg-dark-900 border border-white/10 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Sparkles className="w-3.5 h-3.5 text-aura-pink" />
          <span>Send Joint Prompt to AURA</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={sharedNote}
            onChange={(e) => setSharedNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendSharedPrompt()}
            placeholder="Suggest a joint query or question..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-dark-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-aura-pink"
          />
          <button
            onClick={handleSendSharedPrompt}
            className="p-2.5 rounded-xl bg-aura-pink text-dark-950 font-bold active:scale-95 transition-all"
            title="Send"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
