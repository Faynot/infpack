import React, { useEffect, useState } from 'react';
import translate from 'translate';
import { getFromLocalStorage, saveToLocalStorage } from '../../storage'; // Adjust the import path as per your project structure

translate.engine = 'google';
translate.key = undefined; // API key is not required for the free version

const Translator: React.FC = () => {
  // Initialize state with the language from localStorage if available, otherwise default to 'en'
  const [language, setLanguage] = useState<string>(getFromLocalStorage('language') || 'en');

  // Update localStorage whenever language changes
  useEffect(() => {
    saveToLocalStorage('language', language);
  }, [language]);

  const changeLanguage = async (lng: string) => {
    setLanguage(lng);

    const elements = document.querySelectorAll('[data-translate]');

    elements.forEach(async (element) => {
      const text = element.getAttribute('data-original') || element.textContent;
      if (text) {
        if (!element.getAttribute('data-original')) {
          element.setAttribute('data-original', text);
        }
        const translatedText = await translateText(text, lng);
        element.textContent = translatedText;
        element.className = lng === 'ru' ? 'russ' : 'enn'; // Simplified class setting assuming you have 'russ' and 'enn' classes defined
      }
    });
  };

  const translateText = async (text: string, targetLang: string): Promise<string> => {
    try {
      const translatedText = await translate(text, { to: targetLang });
      return translatedText;
    } catch (error) {
      console.error('Error translating text:', error);
      return text;
    }
  };

  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('ru')}>Русский</button>
    </div>
  );
};

export default Translator;
