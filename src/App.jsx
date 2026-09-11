import React, { useState, useEffect } from 'react';
import PersonalitySelector from './components/PersonalitySelector.jsx';
import VoiceChat from './components/VoiceChat.jsx';
import ChatLogView from './components/ChatLogView.jsx';
import VisionStudio from './components/VisionStudio.jsx';
import FriendSync from './components/FriendSync.jsx';
import MobileTabBar from './components/MobileTabBar.jsx';
import { generateAIResponse, PERSONALITIES } from './services/aiService.js';
import { Sparkles, Wifi, Battery, Smartphone, Download, Share2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('voice'); // 'voice' | 'chat' | 'vision' | 'sync'
  const [personality, setPersonality] = useState('prime');
  const [conversation, setConversation] = useState(() => {
    return [
      {
        id: 'msg-init',
        role: 'assistant',
        content: PERSONALITIES.prime.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [latestAIMessage, setLatestAIMessage] = useState(PERSONALITIES.prime.greeting);
  const [visionResult, setVisionResult] = useState(null);
  const [isAnalyzingVision, setIsAnalyzingVision] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(true);

  const currentPersona = PERSONALITIES[personality] || PERSONALITIES.prime;

  // Handle Sending a Message (Voice or Text)
  const handleSendMessage = async (text, attachedImage = null) => {
    if (!text.trim()) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversation(prev => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const aiReply = await generateAIResponse(text, personality, conversation, attachedImage);
      
      const assistantMsg = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setConversation(prev => [...prev, assistantMsg]);
      setLatestAIMessage(aiReply);
    } catch (err) {
      console.error('AI generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Vision Analysis
  const handleAnalyzeImage = async (imageSample, prompt) => {
    setIsAnalyzingVision(true);
    setVisionResult(null);

    try {
      const analysis = await generateAIResponse(prompt, personality, conversation, imageSample);
      setVisionResult(analysis);
      
      // Also log into chat
      setConversation(prev => [
        ...prev,
        {
          id: `usr-img-${Date.now()}`,
          role: 'user',
          content: `📷 [Scanned Photo: ${imageSample.title}] - ${prompt}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: `ai-img-${Date.now()}`,
          role: 'assistant',
          content: analysis,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setLatestAIMessage(analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingVision(false);
    }
  };

  const handleClearChat = () => {
    setConversation([
      {
        id: `init-${Date.now()}`,
        role: 'assistant',
        content: currentPersona.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex items-center justify-center p-0 sm:p-4 selection:bg-aura-cyan selection:text-dark-950">
      
      {/* Mobile Phone Mock Container */}
      <div className="w-full sm:max-w-[420px] h-[100dvh] sm:h-[880px] bg-dark-950 sm:border sm:border-white/10 sm:rounded-[44px] flex flex-col justify-between overflow-hidden shadow-2xl relative">
        
        {/* Mobile Device Status Bar */}
        <div className="pt-3 px-6 pb-2 flex items-center justify-between text-xs text-slate-400 select-none z-30">
          <span className="font-bold text-[11px] text-white font-mono">09:41</span>
          
          {/* Dynamic Island / Speaker Pill */}
          <div className="w-24 h-4 bg-dark-900 rounded-full border border-white/5 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
          </div>

          <div className="flex items-center gap-2">
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Mobile App Header */}
        <header className="px-4 py-2 border-b border-white/5 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <div 
              className="w-7 h-7 rounded-xl flex items-center justify-center text-dark-950 font-black shadow-md transition-colors"
              style={{ backgroundColor: currentPersona.color }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-display font-black text-sm text-white tracking-tight flex items-center gap-1">
                AURA <span style={{ color: currentPersona.color }}>AI</span>
              </h1>
              <p className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">
                {currentPersona.tagline}
              </p>
            </div>
          </div>

          {/* Download / Share Pill */}
          <button
            onClick={() => setActiveTab('sync')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-dark-900 border border-white/10 text-xs font-bold text-slate-300 hover:text-white"
          >
            <Smartphone className="w-3.5 h-3.5 text-aura-cyan" />
            <span className="text-[10px]">Invite Friend</span>
          </button>
        </header>

        {/* Persona Mode Switcher */}
        <div className="pt-2 z-10">
          <PersonalitySelector
            currentPersonality={personality}
            onSelect={(p) => {
              setPersonality(p);
              setLatestAIMessage(PERSONALITIES[p].greeting);
            }}
          />
        </div>

        {/* Active Tab Main Viewport */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {activeTab === 'voice' && (
            <VoiceChat
              currentPersonality={personality}
              onSendMessage={handleSendMessage}
              isGenerating={isGenerating}
              latestAIMessage={latestAIMessage}
              conversation={conversation}
            />
          )}

          {activeTab === 'chat' && (
            <ChatLogView
              conversation={conversation}
              onSendMessage={handleSendMessage}
              onClearChat={handleClearChat}
              isGenerating={isGenerating}
              currentPersonality={personality}
            />
          )}

          {activeTab === 'vision' && (
            <VisionStudio
              onAnalyzeImage={handleAnalyzeImage}
              isAnalyzing={isAnalyzingVision}
              visionResult={visionResult}
            />
          )}

          {activeTab === 'sync' && (
            <FriendSync
              onSendMessage={handleSendMessage}
            />
          )}
        </main>

        {/* Mobile Tab Navigation */}
        <MobileTabBar
          activeTab={activeTab}
          onChangeTab={setActiveTab}
        />

      </div>

    </div>
  );
}
