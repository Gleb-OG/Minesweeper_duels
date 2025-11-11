import React, { useState, useCallback } from 'react';
import HomeScreen from './components/HomeScreen.tsx';
import LobbyScreen from './components/LobbyScreen.tsx';
import GameScreen from './components/GameScreen.tsx';
import SettingsScreen from './components/SettingsScreen.tsx';
import { GameSettings } from './types.ts';
import { createInitialGameState } from './hooks/useNetworkedGameState.ts';
import { useSettings } from './contexts/SettingsContext.tsx';

type GameScreenType = 'home' | 'lobby' | 'game';
export type GameMode = 'online' | 'local';

const App: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<GameScreenType>('home');
    const [roomId, setRoomId] = useState<string>('');
    const [gameKey, setGameKey] = useState<number>(0);
    const [gameMode, setGameMode] = useState<GameMode | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { t } = useSettings();

    const handleStartLocalGame = useCallback((settings: GameSettings) => {
        setGameMode('local');
        setRoomId('LOCAL'); 
        localStorage.setItem('minesweeper_LOCAL_SETTINGS', JSON.stringify(settings));
        setCurrentScreen('game');
    }, []);
    
    const handleSetOnlineMode = useCallback(() => {
        setGameMode('online');
    }, []);

    const handleCreateRoom = useCallback((settings: GameSettings) => {
        const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
        const initialState = createInitialGameState('online', settings);
        localStorage.setItem(`minesweeper_${newRoomId}`, JSON.stringify(initialState));
        setRoomId(newRoomId);
        setCurrentScreen('lobby');
    }, []);

    const handleJoinRoomPrompt = useCallback(() => {
        setRoomId(''); // Clear room ID for joining
        setCurrentScreen('lobby');
    }, []);
    
    const handleJoinRoom = useCallback((id: string): boolean => {
        const gameExists = localStorage.getItem(`minesweeper_${id}`);
        if (!gameExists) {
            return false; // Room does not exist
        }
        setRoomId(id);
        setCurrentScreen('game');
        return true; // Successfully joined
    }, []);

    const handleStartGame = useCallback(() => {
        setCurrentScreen('game');
    }, []);
    
    const handleGoHome = useCallback(() => {
        setRoomId('');
        setCurrentScreen('home');
        setGameMode(null);
        setGameKey(prev => prev + 1); // Reset game state by changing key
    }, []);

    const renderScreen = () => {
        switch (currentScreen) {
            case 'home':
                return (
                    <HomeScreen 
                        onSetOnlineMode={handleSetOnlineMode}
                        onStartLocalGame={handleStartLocalGame}
                        onCreateRoom={handleCreateRoom}
                        onJoinRoomPrompt={handleJoinRoomPrompt}
                        onOpenSettings={() => setIsSettingsOpen(true)}
                        gameMode={gameMode}
                        onBack={() => setGameMode(null)}
                    />
                );
            case 'lobby':
                return <LobbyScreen roomId={roomId} onStartGame={handleStartGame} onJoinRoom={handleJoinRoom} onBack={handleGoHome} />;
            case 'game':
                return <GameScreen key={gameKey} onExit={handleGoHome} roomId={roomId} gameMode={gameMode!} />;
            default:
                return (
                     <HomeScreen 
                        onSetOnlineMode={handleSetOnlineMode}
                        onStartLocalGame={handleStartLocalGame}
                        onCreateRoom={handleCreateRoom}
                        onJoinRoomPrompt={handleJoinRoomPrompt}
                        onOpenSettings={() => setIsSettingsOpen(true)}
                        gameMode={gameMode}
                        onBack={() => setGameMode(null)}
                    />
                );
        }
    };

    return (
        <div className="h-full bg-gray-900 text-gray-100 flex flex-col items-center justify-center px-4 font-mono">
            {renderScreen()}
            {isSettingsOpen && <SettingsScreen onClose={() => setIsSettingsOpen(false)} />}
        </div>
    );
};

export default App;