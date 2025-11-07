
import React from 'react';
import Cell from './Cell.tsx';
import StatusBar from './StatusBar.tsx';
import GameOverModal from './GameOverModal.tsx';
import { useNetworkedGameState } from '../hooks/useNetworkedGameState.ts';

interface GameScreenProps {
    onExit: () => void;
    roomId: string;
}

const ROWS = 12;
const COLS = 12;
const MINES = 15;

const GameScreen: React.FC<GameScreenProps> = ({ onExit, roomId }) => {
    const { gameState, playerRole, handleCellClick, handleContextMenu } = useNetworkedGameState(roomId);

    if (!gameState || !playerRole) {
        return <div className="text-center text-xl">Connecting to game room...</div>;
    }
    
    const isMyTurn = (gameState.currentPlayer === 1 && playerRole === 'player1') || (gameState.currentPlayer === 2 && playerRole === 'player2');

    if (gameState.gameState === 'waiting') {
        return (
            <div className="w-full max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col items-center text-center">
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">Room ID: {roomId}</h2>
                <p className="text-xl">Waiting for opponent to join...</p>
                 <div className="mt-6 w-full text-center">
                    <div className="loader border-t-4 border-cyan-400 rounded-full w-12 h-12 animate-spin mx-auto"></div>
                </div>
                <p className="mt-6 text-sm text-gray-400">You are <span className={playerRole === 'player1' ? 'text-cyan-400' : 'text-pink-400'}>{playerRole}</span></p>
                 <style>{`
                    .loader {
                        border-top-color: #22d3ee;
                    }
                `}</style>
            </div>
        );
    }
    
    return (
        <div className={`flex flex-col items-center w-full max-w-7xl mx-auto transition-opacity duration-500 ${!isMyTurn && gameState.gameState === 'playing' ? 'opacity-70' : 'opacity-100'}`}>
            <StatusBar
                currentPlayer={gameState.currentPlayer}
                scores={gameState.scores}
                minesLeft={MINES - gameState.flagsPlaced}
                onExit={onExit}
                roomId={roomId}
                revealedByPlayer={gameState.revealedByPlayer}
                playerRole={playerRole}
                isMyTurn={isMyTurn}
            />
            <div className={`bg-gray-800 p-2 sm:p-4 rounded-lg shadow-xl border-2 transition-all duration-300 ${isMyTurn && gameState.gameState === 'playing' ? 'border-green-500' : 'border-transparent'}`}
                 style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: '2px' }}>
                {gameState.board.map((row, rowIndex) => 
                    row.map((cell, colIndex) => (
                        <Cell 
                            key={`${rowIndex}-${colIndex}`} 
                            cell={cell}
                            onClick={() => isMyTurn && handleCellClick(rowIndex, colIndex)}
                            onContextMenu={(e) => isMyTurn && handleContextMenu(e, rowIndex, colIndex)}
                        />
                    ))
                )}
            </div>
             {gameState.gameState === 'gameOver' && (
                <GameOverModal
                    winner={gameState.winner}
                    scores={gameState.scores}
                    onPlayAgain={onExit}
                    revealedByPlayer={gameState.revealedByPlayer}
                />
            )}
        </div>
    );
};

export default GameScreen;
