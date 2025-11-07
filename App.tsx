
import React, { useState, useCallback } from 'react';
import HomeScreen from './components/HomeScreen.tsx';
import LobbyScreen from './components/LobbyScreen.tsx';
import GameScreen from './components/GameScreen.tsx';

type GameScreenType = 'home' | 'lobby' | 'game';

const App: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<GameScreenType>('home');
    const [roomId, setRoomId] = useState<string>('');
    const [gameKey, setGameKey] = useState<number>(0);

    const handleCreateRoom = useCallback(() => {
        const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
        setRoomId(newRoomId);
        setCurrentScreen('lobby');
    }, []);

    const handleJoinRoom = useCallback((id: string) => {
        setRoomId(id);
        setCurrentScreen('game');
    }, []);
    
    const handleStartGame = useCallback(() => {
        setCurrentScreen('game');
    }, []);

    const handleExitGame = useCallback(() => {
        setRoomId('');
        setCurrentScreen('home');
        setGameKey(prev => prev + 1); // Reset game state by changing key
    }, []);

    const renderScreen = () => {
        switch (currentScreen) {
            case 'home':
                return <HomeScreen onCreateRoom={handleCreateRoom} onJoinRoom={() => setCurrentScreen('lobby')} />;
            case 'lobby':
                return <LobbyScreen roomId={roomId} onStartGame={handleStartGame} onJoinRoom={handleJoinRoom} />;
            case 'game':
                return <GameScreen key={gameKey} onExit={handleExitGame} roomId={roomId} />;
            default:
                return <HomeScreen onCreateRoom={handleCreateRoom} onJoinRoom={() => setCurrentScreen('lobby')} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 font-mono">
            {renderScreen()}
        </div>
    );
};

export default App;
