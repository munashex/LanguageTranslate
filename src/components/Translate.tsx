import React, { useState, ChangeEvent } from 'react';
import { TbArrowsExchange2 } from 'react-icons/tb';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { AiOutlineSound } from "react-icons/ai";
import { FaMicrophone } from "react-icons/fa";
import { languages } from '../data/language';
import axios from 'axios';
import { CgPlayStopO } from "react-icons/cg";


interface TranslateResponse {
  data: {
    translatedText: string;
  };
}

// SpeechRecognition types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

// Add SpeechRecognition interface
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onstart: () => void;
  onaudiostart: () => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
    SpeechRecognition: new () => SpeechRecognition;
  }
}

const Translate: React.FC = () => {
  const [openLeftLanguages, setOpenLeftLanguages] = useState(false);
  const [openRightLanguages, setOpenRightLanguages] = useState(false);
  const [translation, setTranslation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);

  const source_language = localStorage.getItem('source_language') || 'en';
  const target_language = localStorage.getItem('target_language') || 'es';

  const leftLanguage = (lang: string, code: string) => {
    localStorage.setItem('leftLanguage', lang);
    localStorage.setItem('source_language', code);
    setOpenLeftLanguages(false);
  };

  const rightLanguage = (lang: string, code: string) => {
    localStorage.setItem('rightLanguage', lang);
    localStorage.setItem('target_language', code);
    setOpenRightLanguages(false);
  };

  const translateText = async () => {
    if (!text) {
      setError('Text is required for translation');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('source_language', source_language);
      formData.append('target_language', target_language);
      formData.append('text', text);

      const response = await axios.post<TranslateResponse>(
        'https://text-translator2.p.rapidapi.com/translate',
        formData,
        {
          headers: {
            'X-Rapidapi-Key': import.meta.env.VITE_API_KEY,
            'X-Rapidapi-Host': 'text-translator2.p.rapidapi.com',
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const translatedText = response.data.data.translatedText;
      setTranslation(translatedText);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.message || 'An error occurred');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition: SpeechRecognition = new SpeechRecognition();
    recognition.lang = source_language;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setIsListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const spokenText = event.results[0][0].transcript;
      setText(spokenText);
      setIsRecording(false);
      setIsListening(false);
    };

    recognition.onaudiostart = () => {
      setIsListening(true);
    };

    recognition.start();
  };

  const handleSpeechSynthesis = () => {
    if (!translation) {
      alert("Nothing to speak. Please translate text first.");
      return;
    }

    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(translation);
    utterance.lang = target_language;
    speechSynthesis.speak(utterance);
  };

  const leftLanguageFromStorage = localStorage.getItem('leftLanguage');
  const rightLanguageFromStorage = localStorage.getItem('rightLanguage');

  return (
    <div className="mt-16">
      <div className="flex justify-between px-3 md:px-14 lg:px-28 py-2 items-center">
        <h1
          onClick={() => setOpenLeftLanguages(!openLeftLanguages)}
          className="text-lg font-bold inline-flex items-center gap-1 cursor-pointer"
        >
          {leftLanguageFromStorage || 'English'} {openLeftLanguages ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </h1>
        <span className="border-2 p-1 rounded-full"><TbArrowsExchange2 size={29} /></span>
        <h1
          onClick={() => setOpenRightLanguages(!openRightLanguages)}
          className="text-lg font-bold inline-flex items-center gap-1 cursor-pointer"
        >
          {rightLanguageFromStorage || 'Spanish'} {openRightLanguages ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mx-1 md:mx-4 lg:mx-16">
        <div className="relative">
          <textarea
            className="text-xl md:text-2xl lg:text-3xl border-2 w-full rounded-lg md:placeholder:text-3xl placeholder:text-lg placeholder:font-bold border-slate-200 h-36 md:h-48 lg:h-72 overflow-y-auto py-3 px-3 outline-none"
            placeholder="Type the text to translate"
            onChange={handleChange}
            value={text}
          />
          <div className="flex flex-row gap-3 absolute bottom-4 left-3">
            <button
              onClick={translateText}
              disabled={loading || text.length === 1}
              className="text-lg bg-green-600 font-bold py-1 rounded-full px-4 text-white"
            >
              {loading ? 'Translating...' : 'Translate'}
            </button>
            <button
              className="bg-green-600 py-1 px-3 rounded-full"
              onClick={handleSpeechRecognition}
            >
              {isRecording ? (
                <CgPlayStopO size={24} color="white" className="animate-pulse" />
              ) : isListening ? (
                <FaMicrophone size={24} color="green" />
              ) : (
                <AiOutlineSound size={24} color="white" />
              )}
            </button>
          </div>
        </div>

        <div className="border-2 relative w-full rounded-lg h-36 md:h-48 lg:h-72 border-slate-200 overflow-y-auto py-3 px-3">
          <h1 className="text-slate-500 font-bold text-xl md:text-2xl lg:text-3xl animate-pulse">
            {loading ? 'Translating...' : null}
          </h1>
          <h1 className="text-xl lg:text-2xl">
            {translation}
          </h1>
          <button
            className="bg-green-600 absolute bottom-2 py-1 px-3 rounded-full"
            onClick={handleSpeechSynthesis}
          >
            <AiOutlineSound size={24} color="white" />
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 mt-2 text-center">{error}</div>}

      {/* Language selection dropdowns */}
      <div className="absolute top-48 md:top-52 w-full overflow-y-auto">
        {openLeftLanguages && (
          <div className="grid mx-1 border md:mx-4 lg:mx-16 rounded-md grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-2 py-5 gap-1 bg-[#F7F7F7]">
            {languages.map((lang) => (
              <div key={lang.code}>
                <h1 className="cursor-pointer" onClick={() => leftLanguage(lang.language, lang.code)}>
                  {lang.language}
                </h1>
              </div>
            ))}
          </div> 
        )}
      </div>

      <div className="absolute top-48 md:top-52 w-full overflow-y-auto">
        {openRightLanguages && (
          <div className="grid mx-1 border md:mx-4 lg:mx-16 rounded-md grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-2 py-5 gap-1 bg-[#F7F7F7]">
            {languages.map((lang) => (
              <div key={lang.code}>
                <h1 className="cursor-pointer" onClick={() => rightLanguage(lang.language, lang.code)}>
                  {lang.language}
                </h1>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Translate;