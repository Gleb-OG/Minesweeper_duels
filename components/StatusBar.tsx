
import React from 'react';
import { Player } from '../types.ts';

interface StatusBarProps {
    currentPlayer: Player;
    scores: { [key in Player]: number };
    minesLeft: number;
    onExit: () => void;
    roomId: string;
    revealedByPlayer: { [key in Player]: number };
    playerRole: 'player1' | 'player2' | 'spectator' | null;
    isMyTurn: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({ currentPlayer, scores, minesLeft, onExit, roomId, revealedByPlayer, playerRole, isMyTurn }) => {
    const player1Classes = `flex-1 text-center p-3 rounded-l-lg transition-all duration-300 ${currentPlayer === 1 ? 'bg-cyan-500 text-gray-900 scale-105 shadow-lg' : 'bg-gray-700'}`;
    const player2Classes = `flex-1 text-center p-3 rounded-r-lg transition-all duration-300 ${currentPlayer === 2 ? 'bg-pink-500 text-gray-900 scale-105 shadow-lg' : 'bg-gray-700'}`;
    
    return (
        <div className="w-full max-w-3xl mb-4 p-2 bg-gray-800 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-2 px-2">
                 <div className="text-left text-sm">
                    <span>You are: </span>
                    <span className={`font-bold tracking-wider ${playerRole === 'player1' ? 'text-cyan-400' : playerRole === 'player2' ? 'text-pink-400' : 'text-gray-400'}`}>
                        {playerRole}
                    </span>
                </div>
                <div className="text-center font-bold text-lg">
                    {playerRole !== 'spectator' && (isMyTurn ? <span className="text-green-400">Your Turn</span> : <span className="text-red-400">Opponent's Turn</span>)}
                </div>
                <button onClick={onExit} className="text-sm bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-3 rounded-md transition-colors">
                    Exit
                </button>
            </div>
            <div className="flex justify-center items-center">
                <div className={player1Classes}>
                    <div className="font-bold text-lg">Player 1</div>
                    <div className="text-2xl font-black">{scores[1]}</div>
                    <div className={`text-xs ${currentPlayer === 1 ? 'text-gray-800' : 'text-gray-300'}`}>Area: {revealedByPlayer[1]}</div>
                </div>

                <div className="flex flex-col items-center justify-center p-3 bg-gray-900 text-white w-28 mx-1 rounded-md shadow-inner">
                    <span className="text-2xl font-bold">{minesLeft}</span>
                    <span className="text-xs uppercase text-gray-400">Flags Left</span>
                </div>

                <div className={player2Classes}>
                    <div className="font-bold text-lg">Player 2</div>
                    <div className="text-2xl font-black">{scores[2]}</div>
                    <div className={`text-xs ${currentPlayer === 2 ? 'text-gray-800' : 'text-gray-300'}`}>Area: {revealedByPlayer[2]}</div>
                </div>
            </div>
            <div className="text-center text-xs text-gray-500 mt-2">Room ID: {roomId}</div>
        </div>
    );
};

export default StatusBar;
