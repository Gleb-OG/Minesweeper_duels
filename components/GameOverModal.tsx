import React from 'react';
import { Player } from '../types.ts';

interface GameOverModalProps {
    winner: Player | null;
    scores: { [key in Player]: number };
    onPlayAgain: () => void;
    revealedByPlayer: { [key in Player]: number };
}

const GameOverModal: React.FC<GameOverModalProps> = ({ winner, scores, onPlayAgain, revealedByPlayer }) => {
    const getWinnerText = () => {
        if (winner === null) {
            return "It's a Draw!";
        }
        return `Player ${winner} Wins!`;
    };

    const winnerClass = winner === 1 ? 'text-cyan-400' : winner === 2 ? 'text-pink-400' : 'text-white';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 text-center border-2 border-gray-700 max-w-sm w-full mx-4">
                <h2 className="text-3xl font-bold mb-4">Game Over</h2>
                <h3 className={`text-4xl font-extrabold mb-6 ${winnerClass}`}>
                    {getWinnerText()}
                </h3>
                <div className="flex justify-around mb-8 text-lg">
                    <div className="p-4 rounded-lg bg-gray-700 w-32 flex flex-col items-center">
                        <p className="font-bold text-cyan-400">Player 1</p>
                        <p className="text-2xl font-black">{scores[1]}</p>
                        <p className="text-sm text-gray-300 mt-1">Area: {revealedByPlayer[1]}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-700 w-32 flex flex-col items-center">
                        <p className="font-bold text-pink-400">Player 2</p>
                        <p className="text-2xl font-black">{scores[2]}</p>
                        <p className="text-sm text-gray-300 mt-1">Area: {revealedByPlayer[2]}</p>
                    </div>
                </div>
                <button
                    onClick={onPlayAgain}
                    className="w-full bg-green-500 hover:bg-green-400 text-gray-900 font-bold py-3 px-4 rounded-lg text-lg transition duration-300 transform hover:scale-105"
                >
                    Play Again
                </button>
            </div>
        </div>
    );
};

export default GameOverModal;