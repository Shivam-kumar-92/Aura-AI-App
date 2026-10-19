import React, { useState, useEffect } from 'react';
import PersonalitySelector from './components/PersonalitySelector.jsx';
import VoiceChat from './components/VoiceChat.jsx';
import ChatLogView from './components/ChatLogView.jsx';
import VisionStudio from './components/VisionStudio.jsx';
import FriendSync from './components/FriendSync.jsx';
import MobileTabBar from './components/MobileTabBar.jsx';
import { generateAIResponse, PERSONALITIES, getGeminiApiKey, setGeminiApiKey } from './services/aiService.js';
import { syncEngine } from './services/syncService.js';
import { Sparkles, Wifi, Battery, Smartphone, Key, Settings, X, Check, ShieldCheck } from 'lucide-react';

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
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => getGeminiApiKey());
  const [savedKeyNotice, setSavedKeyNotice] = useState(false);

  const currentPersona = PERSONALITIES[personality] || PERSONALITIES.prime;

  // Listen for incoming peer messages from FriendSync
  useEffect(() => {
    syncEngine.onMessageReceived = (incomingMsg) => {
      setConversation(prev => {
        if (prev.some(m => m.id === incomingMsg.id)) return prev;
        return [...prev, incomingMsg];
      });
      if (incomingMsg.role === 'assistant') {
        setLatestAIMessage(incomingMsg.content);
      }
    };
  }, []);

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
      
      setConversation(prev => [
        ...prev,
        {
          id: `usr-img-${Date.now()}`,
          role: 'user',
          content: `📷 [Scanned: ${imageSample.title}] - ${prompt}`,
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
        id: `msg-clear-${Date.now()}`,
        role: 'assistant',
        content: `Session refreshed. How can I help you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    setGeminiApiKey(apiKeyInput);
    setSavedKeyNotice(true);
    setTimeout(() => {
      setSavedKeyNotice(false);
      setShowSettingsModal(false);
    }, 1200);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950 font-sans text-slate-100 p-0 sm:p-4 select-none">
      
      {/* Mobile Device Mockup Frame */}
      <div className="w-full max-w-md h-[100dvh] sm:h-[844px] bg-dark-950 flex flex-col relative overflow-hidden sm:rounded-[44px] border border-white/10 shadow-2xl">
        
        {/* Glow ambient background based on active persona */}
        <div 
          className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-[100px] opacity-25 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: currentPersona.color }}
        />
        <div 
          className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-[100px] opacity-20 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: currentPersona.color }}
        />

        {/* Top Status Bar (iOS/Android feel) */}
        <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-mono text-slate-400 z-20 shrink-0">
          <span>9:41</span>
          <div className="w-20 h-4 bg-black rounded-full mx-auto hidden sm:block" />
          <div className="flex items-center gap-2">
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-[10px] text-emerald-400 font-bold">5G</span>
            <Battery className="w-4 h-4 text-slate-300" />
          </div>
        </div>

        {/* Header Bar */}
        <header className="px-5 py-2 flex items-center justify-between border-b border-white/5 z-20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-8 h-8 rounded-2xl flex items-center justify-center font-black text-dark-950 transition-colors shadow-lg"
              style={{ backgroundColor: currentPersona.color }}
            >
              <Sparkles className="w-4 h-4 text-dark-950" />
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

          <div className="flex items-center gap-1.5">
            {/* Settings / API Key Button */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 rounded-xl bg-dark-900 border border-white/10 text-slate-300 hover:text-white transition-all active:scale-95"
              title="AI Settings & API Key"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            {/* Invite Friend Button */}
            <button
              onClick={() => setActiveTab('sync')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-dark-900 border border-white/10 text-xs font-bold text-slate-300 hover:text-white"
            >
              <Smartphone className="w-3.5 h-3.5 text-aura-cyan" />
              <span className="text-[10px]">Invite</span>
            </button>
          </div>
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
              conversation={conversation}
            />
          )}
        </main>

        {/* Mobile Tab Navigation */}
        <MobileTabBar
          activeTab={activeTab}
          onChangeTab={setActiveTab}
        />

        {/* Settings / API Key Modal */}
        {showSettingsModal && (
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-md z-50 flex items-center justify-center p-5 animate-fadeIn">
            <div className="w-full bg-dark-900 border border-white/10 rounded-3xl p-5 space-y-4 shadow-2xl relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Key className="w-4 h-4 text-aura-cyan" />
                  <span>AI Engine Settings</span>
                </div>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your Google Gemini API key to activate live generative reasoning and real multimodal vision. Without a key, AURA runs in fast offline neural companion mode.
              </p>

              <form onSubmit={handleSaveApiKey} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Google Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-aura-cyan font-mono"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Stored locally in browser
                  </span>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-aura-cyan text-dark-950 font-bold text-xs flex items-center gap-1 active:scale-95 transition-all shadow-glow-cyan"
                  >
                    {savedKeyNotice ? <Check className="w-3.5 h-3.5" /> : null}
                    <span>{savedKeyNotice ? 'Saved!' : 'Save Key'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
