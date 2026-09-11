import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, Copy, Check, Sparkles, User, Bot, Trash2 } from 'lucide-react';
import { voiceEngine } from '../services/voiceService.js';
import { PERSONALITIES } from '../services/aiService.js';

export default function ChatLogView({
  conversation = [],
  onSendMessage,
  onClearChat,
  isGenerating = false,
  currentPersonality = 'prime'
}) {
  const persona = PERSONALITIES[currentPersonality] || PERSONALITIES.prime;
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isGenerating]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isGenerating) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleSpeak = (text) => {
    voiceEngine.speak(text, {
      pitch: persona.voicePitch,
      rate: persona.voiceRate
    });
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full h-full pb-20">
      
      {/* Top Action Bar */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-white/5">
        <span className="text-xs font-bold text-slate-400">
          Conversation Log ({conversation.length} messages)
        </span>
        {conversation.length > 0 && (
          <button
            onClick={onClearChat}
            className="text-[11px] text-slate-500 hover:text-red-400 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {conversation.length === 0 ? (
          <div className="py-24 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-dark-900 border border-white/10 flex items-center justify-center mx-auto text-aura-cyan">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">No messages yet</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Start a voice conversation or type below to chat with {persona.name}.
            </p>
          </div>
        ) : (
          conversation.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in`}
              >
                {!isUser && (
                  <div 
                    className="w-7 h-7 rounded-xl flex items-center justify-center text-dark-950 font-black text-xs shrink-0 mt-0.5"
                    style={{ backgroundColor: persona.color }}
                  >
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[82%] space-y-1.5 ${
                  isUser 
                    ? 'bg-gradient-to-tr from-aura-cyan to-blue-500 text-dark-950 font-medium p-3.5 rounded-3xl rounded-tr-sm' 
                    : 'bg-dark-900 border border-white/10 text-slate-200 p-3.5 rounded-3xl rounded-tl-sm'
                }`}>
                  <p className="text-xs leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>

                  {!isUser && (
                    <div className="flex items-center gap-2 pt-1 border-t border-white/5 text-[10px] text-slate-400">
                      <button
                        onClick={() => handleSpeak(msg.content)}
                        className="hover:text-white flex items-center gap-1"
                        title="Play Voice"
                      >
                        <Volume2 className="w-3 h-3 text-aura-cyan" /> Play
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="hover:text-white flex items-center gap-1"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedId === msg.id ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center text-white shrink-0 mt-0.5 text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {isGenerating && (
          <div className="flex gap-2.5 items-center text-xs text-slate-400 p-2">
            <div 
              className="w-6 h-6 rounded-lg flex items-center justify-center text-dark-950 animate-spin"
              style={{ backgroundColor: persona.color }}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>{persona.name} is typing...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-white/5 bg-dark-950/80">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${persona.name}...`}
            className="w-full bg-dark-900 border border-white/10 rounded-2xl pl-4 pr-12 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-aura-cyan"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isGenerating}
            className="absolute right-2 p-2 rounded-xl bg-aura-cyan text-dark-950 font-bold disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
