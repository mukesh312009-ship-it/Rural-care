import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Volume2, VolumeX, X, Send, Sparkles, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { voiceService } from './voiceService';
import { processVoiceQuery, VoiceAssistantResponse } from './voiceQueryHandler';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [activeResponse, setActiveResponse] = useState<VoiceAssistantResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    setSpeechSupported(voiceService.isSpeechRecognitionSupported());
  }, []);

  // Cleanup speech synthesis on close
  useEffect(() => {
    if (!isOpen) {
      voiceService.stopListening();
      voiceService.stopSpeaking();
      setIsListening(false);
      setIsSpeaking(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleQuerySubmit = (text: string) => {
    if (!text.trim()) return;
    setErrorMessage(null);

    const response = processVoiceQuery(text, language);
    setActiveResponse(response);
    setInputText('');

    // Speak response out loud
    setIsSpeaking(true);
    voiceService.speak(response.spokenReply, language, () => {
      setIsSpeaking(false);
    });

    // Auto navigate after a short delay if navigation route was returned
    if (response.navigateRoute) {
      setTimeout(() => {
        onClose();
        navigate(response.navigateRoute!);
      }, 2400);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
    } else {
      setErrorMessage(null);
      voiceService.startListening(
        language,
        (transcript) => {
          setIsListening(false);
          setInputText(transcript);
          handleQuerySubmit(transcript);
        },
        (err) => {
          setIsListening(false);
          setErrorMessage(
            language === 'ta'
              ? 'குரல் உள்ளீடு பிழை அல்லது உலாவி அனுமதி வழங்கப்படவில்லை. கீழே உள்ள பெட்டியில் தட்டச்சு செய்யவும்.'
              : 'Microphone permission denied or unsupported. Please use the text input below.'
          );
        },
        () => {
          setIsListening(false);
        }
      );
      setIsListening(true);
    }
  };

  const sampleQueries =
    language === 'ta'
      ? [
          'அருகிலுள்ள அரசு மருத்துவமனை எங்கே?',
          'எனக்கு ஒரு appointment book செய்ய வேண்டும்.',
          'என்னுடைய அடுத்த appointment எப்போது?',
          'எனக்கு மருந்து நினைவூட்டலைக் காட்டு.',
          'அவசர ஆம்புலன்ஸ் உதவி தேவை.',
        ]
      : [
          'Where is the nearest government hospital?',
          'I want to book a doctor appointment.',
          'When is my next upcoming appointment?',
          'Show me my medicine reminders.',
          'I need emergency ambulance transport.',
        ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-teal-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-sky-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-teal-100" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {language === 'ta' ? 'ரூரல்கேர் குரல் உதவியாளர்' : 'RuralCare Voice Assistant'}
              </h2>
              <p className="text-xs text-teal-100">
                {language === 'ta' ? 'தமிழ் & English AI Healthcare Navigation' : 'Bilingual Voice Guide'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Microphone Animation Area */}
          <div className="text-center py-4">
            <button
              onClick={toggleListening}
              className={`relative mx-auto w-24 h-24 rounded-full flex items-center justify-center transition-all transform active:scale-95 shadow-lg ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse ring-8 ring-rose-200'
                  : 'bg-teal-600 hover:bg-teal-700 text-white hover:shadow-teal-200'
              }`}
            >
              {isListening ? <Mic className="w-10 h-10 animate-bounce" /> : <Mic className="w-10 h-10" />}
            </button>
            <p className="mt-3 font-medium text-slate-700 text-sm">
              {isListening
                ? language === 'ta'
                  ? 'கேட்கிறது... தமிழில் அல்லது ஆங்கிலத்தில் பேசுங்கள்'
                  : 'Listening... Speak in Tamil or English'
                : language === 'ta'
                ? 'மைக் பட்டனை அழுத்தி பேசத் தொடங்குங்கள்'
                : 'Click microphone to speak your question'}
            </p>
            {!speechSupported && (
              <p className="text-xs text-amber-600 mt-1">
                {language === 'ta'
                  ? 'உலாவி குரல் உள்ளீட்டை ஆதரிக்கவில்லை. கீழேயுள்ள பெட்டியில் தட்டச்சு செய்யலாம்.'
                  : 'Speech recognition not detected in this browser. Please use text below.'}
              </p>
            )}
          </div>

          {/* Active Response Display */}
          {activeResponse && (
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-slate-800 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-semibold text-teal-800">
                <span>{language === 'ta' ? 'உதவியாளரின் பதில்:' : 'Assistant Response:'}</span>
                {isSpeaking ? (
                  <span className="flex items-center gap-1 text-teal-600">
                    <Volume2 className="w-4 h-4 animate-pulse" /> Spoken Audio Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-slate-500">
                    <VolumeX className="w-4 h-4" /> Finished
                  </span>
                )}
              </div>
              <p className="text-sm font-medium leading-relaxed">{activeResponse.displayReply}</p>
              {activeResponse.navigateRoute && (
                <div className="pt-2 text-xs text-teal-700 font-semibold flex items-center gap-1">
                  ➡️ {language === 'ta' ? 'தானாக பக்கத்திற்கு மாறுகிறது...' : 'Redirecting you to page...'}
                </div>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Sample Prompts */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {language === 'ta' ? 'எடுத்துக்காட்டு கேள்விகள் (தட்டிப் பார்க்கவும்):' : 'Suggested Queries (Click to try):'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {sampleQueries.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuerySubmit(sample)}
                  className="text-xs bg-slate-100 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 border border-slate-200 px-3 py-1.5 rounded-full text-slate-700 text-left transition"
                >
                  💬 {sample}
                </button>
              ))}
            </div>
          </div>

          {/* Clinical Disclaimer */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 text-xs leading-relaxed">
            🛡️{' '}
            {language === 'ta'
              ? 'அறிவிப்பு: ரூரல்கேர் குரல் உதவியாளர் தளத்தில் தகவல்களை எளிதாக பெற மட்டுமே. இது நோய்களைக் கண்டறியவோ மருந்து பரிந்துரைக்கவோ இயலாது.'
              : 'Notice: RuralCare Assistant is for navigation & scheduling only. It does not provide medical diagnosis or prescribe medications.'}
          </div>
        </div>

        {/* Text Input Fallback */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleQuerySubmit(inputText);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                language === 'ta'
                  ? 'கேள்வியை தமிழில் அல்லது ஆங்கிலத்தில் தட்டச்சு செய்யவும்...'
                  : 'Type your question in Tamil or English...'
              }
              className="flex-1 px-4 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-lg transition font-medium text-sm flex items-center gap-1"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
