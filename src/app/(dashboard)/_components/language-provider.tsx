'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useTransition } from 'react';
import { translateText } from '@/ai/flows/translate-text';

type Locale = 'en' | 'hi';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const handleSetLocale = (newLocale: Locale) => {
    startTransition(() => {
        setLocale(newLocale);
    });
  };

  const t = useCallback((text: string): string => {
    if (locale === 'en') {
      return text;
    }
    return translations[text] || text;
  }, [locale, translations]);

  const translateAndStore = useCallback(async (texts: string[]) => {
    const textsToTranslate = texts.filter(text => !translations[text] && text);
    if (textsToTranslate.length === 0) return;

    try {
        const uniqueTexts = Array.from(new Set(textsToTranslate));
        const newTranslations: Record<string, string> = {};
        
        await Promise.all(uniqueTexts.map(async (text) => {
            const result = await translateText({ text });
            if (result.translation) {
                newTranslations[text] = result.translation;
            }
        }));

        setTranslations(prev => ({ ...prev, ...newTranslations }));

    } catch (error) {
      console.error('Translation error:', error);
    }
  }, [translations]);


  useEffect(() => {
    if (locale === 'hi') {
      // Collect all text that needs to be translated
      const textsToTranslate: string[] = [
        'Dashboard', 'Orders', 'My Products', 'AI Tools', 
        'Product Descriptions', 'Sales Insights', 'Trending Crafts', 'Marketing Coach'
      ];
      translateAndStore(textsToTranslate);
    }
  }, [locale, translateAndStore]);


  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
