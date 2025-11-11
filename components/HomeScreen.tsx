import React, { useState } from 'react';
import { GameMode } from '../App.tsx';
import { GameSettings } from '../types.ts';
import GameSettingsComponent from './GameSettings.tsx';
import { useSettings } from '../contexts/SettingsContext.tsx';
import SettingsIcon from './icons/SettingsIcon.tsx';

interface HomeScreenProps {
    onSetOnlineMode: () => void;
    onStartLocalGame: (settings: GameSettings) => void;
    onCreateRoom: (settings: GameSettings) => void;
    onJoinRoomPrompt: () => void;
    onOpenSettings: () => void;
    gameMode: GameMode | null;
    onBack: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onSetOnlineMode, onStartLocalGame, onCreateRoom, onJoinRoomPrompt, onOpenSettings, gameMode, onBack }) => {
    const [showSettingsFor, setShowSettingsFor] = useState<GameMode | null>(null);
    const { t } = useSettings();

    const handleStartWithSettings = (settings: GameSettings) => {
        if (showSettingsFor === 'local') {
            onStartLocalGame(settings);
        } else if (showSettingsFor === 'online') {
            onCreateRoom(settings);
        }
        setShowSettingsFor(null);
    };

    const renderContent = () => {
        if (showSettingsFor) {
            return <GameSettingsComponent 
                        onStart={handleStartWithSettings}
                        onBack={() => setShowSettingsFor(null)} 
                        gameMode={showSettingsFor} 
                    />;
        }

        if (!gameMode) {
            return (
                <>
                    <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2 tracking-wider">{t('minesweeper')}</h1>
                    <h2 className="text-3xl md:text-4xl font-bold text-pink-500 mb-8 tracking-wider">{t('duels')}</h2>
                    <div className="flex flex-col space-y-4 w-full">
                        <button
                            onClick={onSetOnlineMode}
                            className="w-full bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold py-3 px-4 rounded-lg text-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                        >
                            {t('playOnline')}
                        </button>
                        <button
                            onClick={() => setShowSettingsFor('local')}
                            className="w-full bg-pink-500 hover:bg-pink-400 text-gray-900 font-bold py-3 px-4 rounded-lg text-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        >
                            {t('playLocal')}
                        </button>
                         <button
                            onClick={onOpenSettings}
                            className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center justify-center gap-2"
                        >
                            <SettingsIcon /> {t('settings')}
                        </button>
                    </div>
                    <p className="mt-8 text-sm text-gray-400">{t('homeScreenDescription')}</p>
                </>
            );
        }

        if (gameMode === 'online') {
            return (
                 <>
                    <h2 className="text-3xl font-bold text-cyan-400 mb-8">{t('onlineMode')}</h2>
                    <div className="flex flex-col space-y-4 w-full">
                        <button
                            onClick={() => setShowSettingsFor('online')}
                            className="w-full bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold py-3 px-4 rounded-lg text-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                        >
                            {t('createGame')}
                        </button>
                        <button
                            onClick={onJoinRoomPrompt}
                            className="w-full bg-pink-500 hover:bg-pink-400 text-gray-900 font-bold py-3 px-4 rounded-lg text-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        >
                            {t('joinGame')}
                        </button>
                    </div>
                     <button onClick={onBack} className="mt-8 text-sm text-gray-400 hover:text-white transition-colors">
                        &larr; {t('backToMenu')}
                    </button>
                </>
            );
        }
    }

    return (
        <div className="w-full max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col items-center text-center">
            {renderContent()}
        </div>
    );
};

export default HomeScreen;