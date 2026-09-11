import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Send, RefreshCw, Radio } from 'lucide-react';
import AuraOrb from './AuraOrb.jsx';
import { voiceEngine } from '../services/voiceService.js';
import { PERSONALITIES } from '../services/aiService.js';

export default function VoiceChat({
  currentPersonality = 'prime',
  onSendMessage,
  isGenerating = false,
  latestAIMessage = '',
  conversation = []
}) {
  const persona = PERSONALITIES[currentPersonality] || PERSONALITIES.prime;
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [autoVoiceReply, setAutoVoiceReply] = useState(true);

  // Monitor voice engine state
  useEffect(() => {
    voiceEngine.onStateChangeCallback = (state) => {
      setIsListening(state.isListening);
      setIsSpeaking(state.isSpeaking);
    };
  }, []);

  // When new AI response arrives, speak it if auto voice is on
  useEffect(() => {
    if (latestAIMessage && autoVoiceReply && !isGenerating) {
      voiceEngine.speak(latestAIMessage, {
        pitch: persona.voicePitch,
        rate: persona.voiceRate
      });
    }
  }, [latestAIMessage, autoVoiceReply]);

  const toggleMic = () => {
    if (isListening) {
      voiceEngine.stopListening();
    } else {
      setTranscript('');
      voiceEngine.startListening((text, isFinal) => {
        setTranscript(text);
        if (isFinal && text.trim().length > 0) {
          onSendMessage(text);
          setTranscript('');
        }
      });
    }
  };

  const handleSendText = (e) => {
    e.preventDefault();
    if (!textInput.trim() || isGenerating) return;
    onSendMessage(textInput.trim());
    setTextInput('');
  };

  const stopVoice = () => {
    voiceEngine.stopSpeaking();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-4 max-w-md mx-auto w-full relative">
      
      {/* Top AI Persona Indicator */}
      <div className="flex items-center justify-between w-full pt-1 px-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span 
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: persona.color }}
            />
            <span 
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ backgroundColor: persona.color }}
            />
          </span>
          <span className="text-xs font-mono font-bold tracking-wider text-slate-300">
            {persona.badge} ACTIVE
          </span>
        </div>

        <button
          onClick={() => setAutoVoiceReply(!autoVoiceReply)}
          className={`p-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 ${
            autoVoiceReply 
              ? 'bg-dark-900 border-white/10 text-slate-200' 
              : 'bg-dark-950 text-slate-500 border-transparent'
          }`}
          title={autoVoiceReply ? "Voice output enabled" : "Voice muted"}
        >
          {autoVoiceReply ? <Volume2 className="w-3.5 h-3.5 text-aura-cyan" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="text-[10px]">{autoVoiceReply ? 'Voice ON' : 'Muted'}</span>
        </button>
      </div>

      {/* Central Luminous Aura Visualizer */}
      <div className="my-auto flex flex-col items-center justify-center relative py-6">
        
        {/* Animated Sound Waveform Bars around the Orb */}
        <div className="relative">
          <AuraOrb
            isListening={isListening}
            isSpeaking={isSpeaking}
            personality={currentPersonality}
            primaryColor={persona.color}
            size={220}
            onClick={toggleMic}
          />
        </div>

        {/* Dynamic Status / Speech Transcription Subtitle */}
        <div className="mt-4 text-center px-4 max-w-xs min-h-[52px] flex items-center justify-center">
          {isListening ? (
            <div className="space-y-1 animate-pulse">
              <span className="text-xs font-mono font-bold text-red-400 flex items-center justify-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-spin" /> Listening to your voice...
              </span>
              <p className="text-xs text-white font-medium italic">"{transcript || 'Speak now...'}"</p>
            </div>
          ) : isGenerating ? (
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-aura-cyan" />
              <span>AURA is synthesizing response...</span>
            </div>
          ) : isSpeaking ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-200 line-clamp-2">
                "{latestAIMessage}"
              </span>
              <button
                onClick={stopVoice}
                className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-slate-300 ml-1 shrink-0"
              >
                Stop
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center">
              Tap the glowing <span className="font-bold text-white">AURA Orb</span> or the mic to speak naturally.
            </p>
          )}
        </div>

      </div>

      {/* Bottom Floating Control Bar */}
      <div className="w-full space-y-3 pb-20">
        
        {/* Quick Suggestion Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            "🏸 Badminton training tips",
            "💡 Brainstorm creative ideas",
            "⚡ Write a Python utility",
            "🧘 Guide a 2-min meditation"
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => onSendMessage(prompt.replace(/^[^\s]+\s/, ''))}
              className="text-[11px] font-medium text-slate-300 bg-dark-900/80 hover:bg-dark-850 px-3 py-1.5 rounded-full border border-white/5 shrink-0 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar & Mic Trigger */}
        <form onSubmit={handleSendText} className="relative flex items-center gap-2">
          
          <div className="relative flex-1">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={`Message ${persona.name}...`}
              className="w-full bg-dark-900/90 border border-white/10 focus:border-aura-cyan rounded-2xl pl-4 pr-10 py-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-aura-cyan/30"
            />

            {textInput.trim() && (
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-aura-cyan text-dark-950 font-black hover:scale-105 active:scale-95 transition-transform"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Primary Voice Mic Action */}
          <button
            type="button"
            onClick={toggleMic}
            className={`p-3.5 rounded-2xl border transition-all active:scale-90 flex items-center justify-center shrink-0 ${
              isListening
                ? 'bg-red-500/20 text-red-400 border-red-500 shadow-lg shadow-red-500/30 animate-pulse'
                : 'bg-gradient-to-tr from-dark-900 to-dark-850 text-white border-white/10 hover:border-aura-cyan shadow-md'
            }`}
            style={{
              borderColor: isListening ? '#EF4444' : undefined,
            }}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-aura-cyan" />}
          </button>

        </form>

      </div>

    </div>
  );
}
