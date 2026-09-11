// AURA AI Voice & Audio Engine

class VoiceEngine {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.recognition = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.onResultCallback = null;
    this.onStateChangeCallback = null;

    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
          this.isListening = true;
          this.notifyState();
        };

        this.recognition.onend = () => {
          this.isListening = false;
          this.notifyState();
        };

        this.recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          
          if (this.onResultCallback) {
            const isFinal = event.results[0].isFinal;
            this.onResultCallback(transcript, isFinal);
          }
        };

        this.recognition.onerror = (event) => {
          console.warn('Speech recognition error:', event.error);
          this.isListening = false;
          this.notifyState();
        };
      }
    }
  }

  notifyState() {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback({
        isListening: this.isListening,
        isSpeaking: this.isSpeaking
      });
    }
  }

  startListening(onResult, onStateChange) {
    this.onResultCallback = onResult;
    this.onStateChangeCallback = onStateChange;

    if (!this.recognition) {
      alert('Speech recognition is not supported in this browser. You can still type queries!');
      return;
    }

    try {
      this.stopSpeaking();
      this.recognition.start();
    } catch (err) {
      console.warn('Recognition start error:', err);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.warn(err);
      }
    }
  }

  speak(text, { pitch = 1.0, rate = 1.0, onEnd = null } = {}) {
    if (!this.synth) return;

    this.stopSpeaking();

    // Clean markdown symbols for cleaner voice speech
    const cleanText = text
      .replace(/[*#`_~]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/https?:\/\/\S+/g, 'link');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.pitch = pitch;
    utterance.rate = rate;

    // Pick best natural voice if available
    const voices = this.synth.getVoices();
    const naturalVoice = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen'))
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.notifyState();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.notifyState();
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.notifyState();
    };

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.notifyState();
    }
  }
}

export const voiceEngine = new VoiceEngine();
