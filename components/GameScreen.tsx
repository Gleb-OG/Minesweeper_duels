import React from 'react';
import Cell from './Cell.tsx';
import StatusBar from './StatusBar.tsx';
import GameOverModal from './GameOverModal.tsx';
import RouletteScreen from './RouletteScreen.tsx';
import { useMinesweeperGame } from '../hooks/useNetworkedGameState.ts';
import { GameMode } from '../App.tsx';
import { useSettings } from '../contexts/SettingsContext.tsx';

interface GameScreenProps {
    onExit: () => void;
    roomId: string;
    gameMode: GameMode;
}

const GameScreen: React.FC<GameScreenProps> = ({ onExit, roomId, gameMode }) => {
    const { gameState, playerRole, handleCellClick, handleContextMenu, handleRouletteAnimationEnd } = useMinesweeperGame(roomId, gameMode);
    const { t } = useSettings();

    if (!gameState || (gameMode === 'online' && !playerRole)) {
        return <div className="text-center text-xl">{t('connecting')}</div>;
    }
    
    const isMyTurn = gameMode === 'local' || (gameState.currentPlayer === 1 && playerRole === 'player1') || (gameState.currentPlayer === 2 && playerRole === 'player2');

    if (gameMode === 'online' && gameState.gameState === 'waiting') {
        return (
            <div className="w-full max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col items-center text-center">
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">{t('roomId')} {roomId}</h2>
                <p className="text-xl">{t('waitingForOpponent')}</p>
                 <div className="mt-6 w-full text-center">
                    <div className="loader border-t-4 border-cyan-400 rounded-full w-12 h-12 animate-spin mx-auto"></div>
                </div>
                <p className="mt-6 text-sm text-gray-400">{t('youAre')} <span className={playerRole === 'player1' ? 'text-cyan-400' : 'text-pink-400'}>{playerRole}</span></p>
                 <style>{`
                    .loader {
                        border-top-color: #22d3ee;
                    }
                `}</style>
                <button
                    onClick={onExit}
                    className="w-full mt-8 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-300 transform hover:scale-105"
                >
                    {t('backToMenu')}
                </button>
            </div>
        );
    }
    
    if (gameState.gameState === 'roulette') {
        return <RouletteScreen 
            targetRotation={gameState.rouletteTargetRotation}
            onAnimationEnd={handleRouletteAnimationEnd}
        />;
    }

    return (
        <div className={`flex flex-col items-center w-full max-w-7xl mx-auto transition-opacity duration-500 ${!isMyTurn && gameState.gameState === 'playing' ? 'opacity-70' : 'opacity-100'}`}>
            <StatusBar
                gameMode={gameMode}
                currentPlayer={gameState.currentPlayer}
                onExit={onExit}
                roomId={roomId}
                revealedByPlayer={gameState.revealedByPlayer}
                playerRole={playerRole}
                isMyTurn={isMyTurn}
                turnTimer={gameState.turnTimer}
                matchTimer={gameState.matchTimer}
            />
            <div className={`p-2 sm:p-4 bg-gray-800 rounded-lg shadow-xl border-2 transition-all duration-300 ${isMyTurn && gameState.gameState === 'playing' ? (gameMode === 'online' ? 'border-green-500' : 'border-transparent') : 'border-transparent'}`}>
                <div
                    className="grid bg-gray-900"
                    style={{
                        gridTemplateColumns: `repeat(${gameState.settings.cols}, minmax(0, 1fr))`,
                    }}
                >
                    {gameState.board.flat().map((cell, index) => {
                        const rowIndex = Math.floor(index / gameState.settings.cols);
                        const colIndex = index % gameState.settings.cols;
                        return (
                            <Cell 
                                key={`${rowIndex}-${colIndex}`} 
                                cell={cell}
                                onClick={() => isMyTurn && handleCellClick(rowIndex, colIndex)}
                                onContextMenu={(e) => isMyTurn && handleContextMenu(e, rowIndex, colIndex)}
                            />
                        );
                    })}
                </div>
            </div>
             {gameState.gameState === 'gameOver' && (
                <GameOverModal
                    winner={gameState.winner}
                    onBackToMenu={onExit}
                    revealedByPlayer={gameState.revealedByPlayer}
                />
            )}
        </div>
    );
};

export default GameScreen;