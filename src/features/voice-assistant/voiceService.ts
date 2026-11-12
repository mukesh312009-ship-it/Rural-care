// RuralCare Voice Recognition & Text-To-Speech Engine
import { LanguageCode } from '../../types';

// SpeechRecognition type declarations for browser compatibility
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export class VoiceService {
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const win = window as IWindow;
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
      }
      if ('speechSynthesis' in window) {
        this.synthesis = window.speechSynthesis;
      }
    }
  }

  isSpeechRecognitionSupported(): boolean {
    return Boolean(this.recognition);
  }

  isSpeechSynthesisSupported(): boolean {
    return Boolean(this.synthesis);
  }

  startListening(
    lang: LanguageCode,
    onResult: (transcript: string) => void,
    onError: (err: any) => void,
    onEnd: () => void
  ) {
    if (!this.recognition) {
      onError(new Error('Speech recognition not supported in this browser. Please use text input.'));
      return;
    }

    try {
      this.recognition.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };
      this.recognition.onerror = (event: any) => {
        onError(event.error);
      };
      this.recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.isListening = true;
      this.recognition.start();
    } catch (e) {
      onError(e);
      onEnd();
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speak(text: string, lang: LanguageCode, onEnd?: () => void) {
    if (!this.synthesis) return;

    this.synthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
    utterance.rate = 0.95; // Clear natural pace for rural patients
    utterance.pitch = 1.0;

    if (onEnd) {
      utterance.onend = onEnd;
    }

    // Try finding matching voice
    const voices = this.synthesis.getVoices();
    const matchedVoice = voices.find(
      (v) => (lang === 'ta' && v.lang.includes('ta')) || (lang === 'en' && v.lang.includes('en'))
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    this.synthesis.speak(utterance);
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }
}

export const voiceService = new VoiceService();
