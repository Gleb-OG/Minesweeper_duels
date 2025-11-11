import React from 'react';
import { useSettings } from '../contexts/SettingsContext.tsx';
import { Language } from '../utils/i18n.ts';

interface SettingsScreenProps {
    onClose: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClose }) => {
    const { language, setLanguage, t } = useSettings();

    const LanguageButton: React.FC<{ lang: Language, label: string }> = ({ lang, label }) => {
        const isActive = language === lang;
        return (
            <button
                onClick={() => setLanguage(lang)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-colors ${isActive ? 'bg-cyan-500 text-gray-900' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
                {label}
            </button>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 border-2 border-gray-700 max-w-sm w-full mx-4 flex flex-col space-y-6">
                <h2 className="text-2xl font-bold text-cyan-400 text-center">{t('settings')}</h2>
                
                <div>
                    <label className="block text-lg font-medium text-gray-300 mb-2">{t('language')}</label>
                    <div className="flex space-x-2 bg-gray-900 p-1 rounded-lg">
                        <LanguageButton lang="en" label="English" />
                        <LanguageButton lang="ru" label="Русский" />
                    </div>
                </div>
                
                <button
                    onClick={onClose}
                    className="w-full bg-green-500 hover:bg-green-400 text-gray-900 font-bold py-3 px-4 rounded-lg text-lg transition duration-300 transform hover:scale-105 mt-4"
                >
                    {t('done')}
                </button>
            </div>
        </div>
    );
};

export default SettingsScreen;