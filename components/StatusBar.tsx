import React from 'react';
import { Player, GameMode } from '../types.ts';
import { useSettings } from '../contexts/SettingsContext.tsx';

interface StatusBarProps {
    currentPlayer: Player;
    onExit: () => void;
    roomId: string;
    revealedByPlayer: { [key in Player]: number };
    playerRole: 'player1' | 'player2' | 'spectator' | null;
    isMyTurn: boolean;
    turnTimer: number;
    matchTimer: number;
    gameMode: GameMode;
}

const StatusBar: React.FC<StatusBarProps> = ({ currentPlayer, onExit, roomId, revealedByPlayer, playerRole, isMyTurn, turnTimer, matchTimer, gameMode }) => {
    const { t } = useSettings();
    const player1Classes = `flex-1 text-center p-3 rounded-l-lg transition-all duration-300 relative z-10 ${currentPlayer === 1 ? 'bg-cyan-500 text-gray-900 scale-105 shadow-lg origin-left' : 'bg-gray-700'}`;
    const player2Classes = `flex-1 text-center p-3 rounded-r-lg transition-all duration-300 relative z-10 ${currentPlayer === 2 ? 'bg-pink-500 text-gray-900 scale-105 shadow-lg origin-right' : 'bg-gray-700'}`;
    
    const getTurnText = () => {
        if (gameMode === 'local') {
            return <span className={currentPlayer === 1 ? 'text-cyan-400' : 'text-pink-400'}>{t('playersTurn').replace('{player}', String(currentPlayer))}</span>
        }
        if (playerRole !== 'spectator') {
            return isMyTurn ? <span className="text-green-400">{t('yourTurn')}</span> : <span className="text-red-400">{t('opponentsTurn')}</span>
        }
        return null;
    }

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const timerColor = turnTimer <= 5 ? 'text-red-500' : turnTimer <= 10 ? 'text-yellow-500' : 'text-white';

    return (
        <div className="w-full max-w-3xl mb-4 p-2 bg-gray-800 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-2 px-2">
                 <div className="text-left text-sm w-1/3">
                    {gameMode === 'online' && (
                        <>
                            <span>{t('youAre')}: </span>
                            <span className={`font-bold tracking-wider ${playerRole === 'player1' ? 'text-cyan-400' : playerRole === 'player2' ? 'text-pink-400' : 'text-gray-400'}`}>
                                {playerRole}
                            </span>
                        </>
                    )}
                </div>
                <div className="text-center font-bold text-lg w-1/3">
                    {getTurnText()}
                </div>
                <div className="text-right w-1/3">
                    <button onClick={onExit} className="text-sm bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-3 rounded-md transition-colors">
                        {t('exit')}
                    </button>
                </div>
            </div>
            <div className="flex justify-center items-center rounded-lg overflow-hidden">
                <div className={player1Classes}>
                    <div className="font-bold text-lg">{t('player')} 1</div>
                    <div className="flex items-baseline justify-center gap-2">
                        <span className={`text-sm font-medium ${currentPlayer === 1 ? 'text-gray-800' : 'text-gray-300'}`}>{t('area')}</span>
                        <span className="text-2xl font-black">{revealedByPlayer[1]}</span>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center p-3 bg-gray-900 text-white w-32 mx-1 rounded-md shadow-inner relative z-20">
                    <div className="text-xs uppercase text-gray-400">{t('matchTime')}</div>
                    <div className="text-xl font-bold">{formatTime(matchTimer)}</div>
                    <div className={`text-3xl font-bold transition-colors mt-1 ${timerColor}`}>{turnTimer}</div>
                    <div className="text-xs uppercase text-gray-400">{t('turn')}</div>
                </div>

                <div className={player2Classes}>
                    <div className="font-bold text-lg">{t('player')} 2</div>
                     <div className="flex items-baseline justify-center gap-2">
                        <span className={`text-sm font-medium ${currentPlayer === 2 ? 'text-gray-800' : 'text-gray-300'}`}>{t('area')}</span>
                        <span className="text-2xl font-black">{revealedByPlayer[2]}</span>
                    </div>
                </div>
            </div>
            <div className="text-center text-xs text-gray-500 mt-2">{t('roomId')} {roomId}</div>
        </div>
    );
};

export default StatusBar;