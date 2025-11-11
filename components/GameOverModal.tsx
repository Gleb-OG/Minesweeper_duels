import React from 'react';
import { Player } from '../types.ts';
import { useSettings } from '../contexts/SettingsContext.tsx';

interface GameOverModalProps {
    winner: Player | null;
    onBackToMenu: () => void;
    revealedByPlayer: { [key in Player]: number };
}

const GameOverModal: React.FC<GameOverModalProps> = ({ winner, onBackToMenu, revealedByPlayer }) => {
    const { t } = useSettings();

    const getWinnerText = () => {
        if (winner === null) {
            return t('itsADraw');
        }
        return t('playerWins').replace('{winner}', String(winner));
    };

    const winnerClass = winner === 1 ? 'text-cyan-400' : winner === 2 ? 'text-pink-400' : 'text-white';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 text-center border-2 border-gray-700 max-w-sm w-full mx-4">
                <h2 className="text-3xl font-bold mb-4">{t('gameOver')}</h2>
                <h3 className={`text-4xl font-extrabold mb-6 ${winnerClass}`}>
                    {getWinnerText()}
                </h3>
                <div className="flex justify-around mb-8 text-lg">
                    <div className="p-4 rounded-lg bg-gray-700 w-32 flex flex-col items-center">
                        <p className="font-bold text-cyan-400">{t('player')} 1</p>
                        <p className="text-2xl font-black">{revealedByPlayer[1]}</p>
                        <p className="text-sm text-gray-300 mt-1">{t('area')}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-700 w-32 flex flex-col items-center">
                        <p className="font-bold text-pink-400">{t('player')} 2</p>
                        <p className="text-2xl font-black">{revealedByPlayer[2]}</p>
                        <p className="text-sm text-gray-300 mt-1">{t('area')}</p>
                    </div>
                </div>
                <button
                    onClick={onBackToMenu}
                    className="w-full bg-green-500 hover:bg-green-400 text-gray-900 font-bold py-3 px-4 rounded-lg text-lg transition duration-300 transform hover:scale-105"
                >
                    {t('backToMainMenu')}
                </button>
            </div>
        </div>
    );
};

export default GameOverModal;