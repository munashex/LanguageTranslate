import React, { useState, ChangeEvent } from 'react';
import { TbArrowsExchange2 } from 'react-icons/tb';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { languages } from '../data/language';
import { TranslateResponse } from '../types';
import axios from 'axios';

const Translate: React.FC = () => {
  const [openLeftLanguages, setOpenLeftLanguages] = useState(false);
  const [openRightLanguages, setOpenRightLanguages] = useState(false);
  const [translation, setTranslation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState<string>('');

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

  const source_language = localStorage.getItem('source_language') || 'en';
  const target_language = localStorage.getItem('target_language') || 'es';

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
            'X-Rapidapi-Key': 'dbd149b11cmsh0a8085e0c99eba0p115b16jsne187ecc0b7ac',
            'X-Rapidapi-Host': 'text-translator2.p.rapidapi.com',
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Access the translatedText from the response data
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

  const leftLanguageFromStorage = localStorage.getItem('leftLanguage');
  const rightLanguageFromStorage = localStorage.getItem('rightLanguage');

  return (
    <div className="mt-10">
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
        <div>
          <textarea
            className="text-xl md:text-2xl lg:text-3xl border-2 w-full rounded-lg md:placeholder:text-3xl placeholder:text-lg placeholder:font-bold border-slate-200 h-36 md:h-48 lg:h-72 overflow-y-auto py-3 px-3 outline-none"
            placeholder="Type the text to translate"
            onChange={handleChange}
            value={text}
          />
          <button
            onClick={translateText}
            disabled={loading || text?.length === 1}
            className="text-lg bg-green-600 font-bold py-1 rounded-full px-4 text-white"
          >
            {loading ? 'Translating...' : 'Translate'}
          </button>
        </div>

        <div className="border-2 w-full rounded-lg h-36 md:h-48 lg:h-72 border-slate-200 overflow-y-auto py-3 px-3">
          <h1 className="text-slate-500 font-bold text-xl md:text-2xl lg:text-3xl animate-pulse">
            {loading ? 'Translating...' : null}
          </h1>
          <h1 className="text-xl lg:text-2xl">
            {translation}
          </h1>
        </div>
      </div>

      <div className="absolute top-24 w-full overflow-y-auto">
        {openLeftLanguages && (
          <div className="grid mx-1 border md:mx-4 lg:mx-16 rounded-md grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-2 py-5 gap-1 bg-[#F7F7F7]">
            {languages.map((lang) => (
              <div key={lang.code}>
                <h1 className="cursor-pointer" onClick={() => leftLanguage(lang.language, lang.code)}>{lang.language}</h1>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="absolute top-24 w-full overflow-y-auto">
        {openRightLanguages && (
          <div className="grid mx-1 border md:mx-4 lg:mx-16 rounded-md grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-2 py-5 gap-1 bg-[#F7F7F7]">
            {languages.map((lang) => (
              <div key={lang.code}>
                <h1 className="cursor-pointer" onClick={() => rightLanguage(lang.language, lang.code)}>{lang.language}</h1>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Translate;
