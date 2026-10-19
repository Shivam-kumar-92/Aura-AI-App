// AURA AI Voice & Audio Engine with Mobile Silence-Debounce & Fallback

class VoiceEngine {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.recognition = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.onResultCallback = null;
    this.onStateChangeCallback = null;
    this.silenceTimer = null;
    this.accumulatedTranscript = '';

    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
          this.isListening = true;
          this.notifyState();
        };

        this.recognition.onend = () => {
          this.isListening = false;
          this.notifyState();
          // Clear any pending debounce timer
          if (this.silenceTimer) {
            clearTimeout(this.silenceTimer);
            this.silenceTimer = null;
          }
        };

        this.recognition.onresult = (event) => {
          let interimText = '';
          let finalText = '';

          for (let i = 0; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalText += transcript;
            } else {
              interimText += transcript;
            }
          }

          const currentText = finalText || interimText;
          if (!currentText.trim()) return;

          // Notify UI of interim live transcript
          if (this.onResultCallback) {
            this.onResultCallback(currentText, false);
          }

          // Debounce detection: wait 1000ms of user silence before automatically submitting
          if (this.silenceTimer) clearTimeout(this.silenceTimer);
          this.silenceTimer = setTimeout(() => {
            if (this.onResultCallback && currentText.trim().length > 0) {
              this.onResultCallback(currentText.trim(), true);
              this.stopListening();
            }
          }, 1100);
        };

        this.recognition.onerror = (event) => {
          console.warn('Speech recognition warning:', event.error);
          if (event.error !== 'no-speech') {
            this.isListening = false;
            this.notifyState();
          }
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
      alert('Speech recognition is not supported in this browser. You can type queries via the chat input!');
      return;
    }

    try {
      this.stopSpeaking();
      if (this.silenceTimer) clearTimeout(this.silenceTimer);
      this.recognition.start();
    } catch (err) {
      // In case recognition was already active
      console.warn('Recognition start caught:', err);
    }
  }

  stopListening() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
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

    // Clean markdown symbols for natural voice speech
    const cleanText = text
      .replace(/[*#`_~]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/https?:\/\/\S+/g, 'link')
      .replace(/🔍|✨|💡|📷|⚡/g, '');

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
    if (this.synth && (this.synth.speaking || this.synth.pending)) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.notifyState();
    }
  }
}

export const voiceEngine = new VoiceEngine();
