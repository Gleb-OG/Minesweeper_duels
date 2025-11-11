import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { translations, Language, TranslationKey } from '../utils/i18n.ts';

interface SettingsContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        return (localStorage.getItem('minesweeper_language') as Language) || 'en';
    });

    useEffect(() => {
        localStorage.setItem('minesweeper_language', language);
    }, [language]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    const t = useCallback((key: TranslationKey): string => {
        return translations[key]?.[language] || key;
    }, [language]);

    const value = useMemo(() => ({
        language,
        setLanguage,
        t,
    }), [language, t]);

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};