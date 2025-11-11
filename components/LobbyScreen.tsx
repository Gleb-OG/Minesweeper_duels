import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext.tsx';

interface LobbyScreenProps {
    roomId: string;
    onStartGame: () => void;
    onJoinRoom: (id: string) => boolean; // Updated to return boolean for validation
    onBack: () => void;
}

const LobbyScreen: React.FC<LobbyScreenProps> = ({ roomId, onStartGame, onJoinRoom, onBack }) => {
    const [joinId, setJoinId] = useState('');
    const [isJoining, setIsJoining] = useState(!roomId);
    const [error, setError] = useState<string | null>(null);
    const { t } = useSettings();

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(roomId);
        alert('Room ID copied to clipboard!');
    };

    const handleJoinSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (joinId.trim()) {
            const success = onJoinRoom(joinId.trim().toUpperCase());
            if (!success) {
                setError(t('roomNotFound'));
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJoinId(e.target.value);
        if (error) {
            setError(null);
        }
    }
    
    const renderJoinScreen = () => (
        <>
            <h2 className="text-2xl font-bold text-pink-500 mb-6">{t('joinGameRoom')}</h2>
            <form onSubmit={handleJoinSubmit} className="w-full flex flex-col space-y-2">
                <input
                    type="text"
                    value={joinId}
                    onChange={handleInputChange}
                    placeholder={t('enterRoomId')}
                    className="w-full bg-gray-700 text-white placeholder-gray-400 p-3 rounded-lg text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-pink-500"
                    maxLength={6}
                    autoFocus
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-pink-500 hover:bg-pink-400 text-gray-900 font-bold py-3 px-4 rounded-lg text-lg transition duration-300 transform hover:scale-105 mt-2"
                >
                    {t('join')}
                </button>
            </form>
            {roomId && <button onClick={() => setIsJoining(false)} className="mt-4 text-cyan-400 hover:text-cyan-300">{t('backToYourRoom')}</button>}
        </>
    );
    
    const renderCreateScreen = () => (
         <>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">{t('yourGameRoom')}</h2>
            <p className="text-gray-400 mb-4">{t('shareId')}</p>
            <div className="bg-gray-900 rounded-lg p-4 mb-6 w-full flex justify-center items-center cursor-pointer" onClick={handleCopyToClipboard}>
                <span className="text-4xl font-bold text-white tracking-widest">{roomId}</span>
            </div>
            <div className="flex flex-col space-y-4 w-full">
                <button
                    onClick={onStartGame}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold py-3 px-4 rounded-lg text-lg transition duration-300 transform hover:scale-105"
                >
                    {t('startGame')}
                </button>
                <button onClick={() => setIsJoining(true)} className="text-pink-400 hover:text-pink-300 text-sm">{t('joinAnotherRoom')}</button>
            </div>
        </>
    );

    return (
        <div className="w-full max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col items-center text-center">
            {isJoining ? renderJoinScreen() : renderCreateScreen()}
            <button onClick={onBack} className="mt-8 text-sm text-gray-400 hover:text-white transition-colors">
                &larr; {t('backToMenu')}
            </button>
        </div>
    );
};

export default LobbyScreen;