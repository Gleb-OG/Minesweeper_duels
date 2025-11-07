import React, { useState, useEffect, useCallback } from 'react';
import { CellState, Player } from '../types.ts';
import { createEmptyBoard, plantMines, calculateAdjacentMines, revealCells } from '../utils/gameLogic.ts';
import Cell from './Cell.tsx';
import StatusBar from './StatusBar.tsx';
import GameOverModal from './GameOverModal.tsx';

interface GameScreenProps {
    onExit: () => void;
    roomId: string;
}

const ROWS = 12;
const COLS = 12;
const MINES = 15;

const GameScreen: React.FC<GameScreenProps> = ({ onExit, roomId }) => {
    const [board, setBoard] = useState<CellState[][]>(createEmptyBoard(ROWS, COLS));
    const [isFirstClick, setIsFirstClick] = useState(true);
    const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
    const [scores, setScores] = useState<{ [key in Player]: number }>({ 1: 0, 2: 0 });
    const [gameState, setGameState] = useState<'playing' | 'gameOver'>('playing');
    const [minesFound, setMinesFound] = useState(0);
    const [winner, setWinner] = useState<Player | null>(null);
    const [revealedCellsCount, setRevealedCellsCount] = useState(0);
    const [revealedByPlayer, setRevealedByPlayer] = useState<{ [key in Player]: number }>({ 1: 0, 2: 0 });


    const switchPlayer = () => {
        setCurrentPlayer(prev => (prev === 1 ? 2 : 1));
    };

    const handleCellClick = useCallback((row: number, col: number) => {
        if (gameState === 'gameOver') return;

        let currentBoard = board;
        if (isFirstClick) {
            currentBoard = plantMines(board, ROWS, COLS, MINES, row, col);
            currentBoard = calculateAdjacentMines(currentBoard, ROWS, COLS);
            setIsFirstClick(false);
        }
        
        const cell = currentBoard[row][col];
        if (cell.isRevealed || cell.isFlagged) return;

        if (cell.isMine) {
            const newBoard = JSON.parse(JSON.stringify(currentBoard));
            newBoard[row][col].isRevealed = true;
            newBoard[row][col].revealedBy = currentPlayer;
            setBoard(newBoard);
            
            setScores(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] - 10 }));
            setMinesFound(prev => prev + 1);
            switchPlayer();
        } else {
            const { newBoard } = revealCells(currentBoard, row, col, ROWS, COLS);
            
            let points = 0;
            let newlyRevealedByPlayer = 0;
            for(let r=0; r < ROWS; r++){
                for(let c=0; c < COLS; c++){
                    if(newBoard[r][c].isRevealed && !currentBoard[r][c].isRevealed){
                        newBoard[r][c].revealedBy = currentPlayer;
                        points += newBoard[r][c].adjacentMines > 0 ? newBoard[r][c].adjacentMines : 1;
                        newlyRevealedByPlayer++;
                    }
                }
            }
            
            setBoard(newBoard);
            setScores(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] + points }));
            setRevealedCellsCount(prev => prev + newlyRevealedByPlayer);
            setRevealedByPlayer(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] + newlyRevealedByPlayer }));
            // Player's turn continues
        }
    }, [board, currentPlayer, gameState, isFirstClick]);

    const handleContextMenu = useCallback((e: React.MouseEvent, row: number, col: number) => {
        e.preventDefault();
        if (gameState === 'gameOver' || board[row][col].isRevealed) return;

        const newBoard = [...board];
        newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
        setBoard(newBoard);
    }, [board, gameState]);
    
    useEffect(() => {
        const nonMineCells = ROWS * COLS - MINES;
        if (minesFound === MINES || revealedCellsCount >= nonMineCells) {
            setGameState('gameOver');
            if (scores[1] > scores[2]) {
                setWinner(1);
            } else if (scores[2] > scores[1]) {
                setWinner(2);
            } else {
                if (revealedByPlayer[1] > revealedByPlayer[2]) {
                    setWinner(1);
                } else if (revealedByPlayer[2] > revealedByPlayer[1]) {
                    setWinner(2);
                } else {
                    setWinner(null); // Draw
                }
            }
        }
    }, [minesFound, scores, revealedCellsCount, revealedByPlayer]);

    return (
        <div className="flex flex-col items-center w-full max-w-7xl mx-auto">
            <StatusBar
                currentPlayer={currentPlayer}
                scores={scores}
                minesLeft={MINES - minesFound}
                onExit={onExit}
                roomId={roomId}
                revealedByPlayer={revealedByPlayer}
            />
            <div className="bg-gray-800 p-2 sm:p-4 rounded-lg shadow-xl"
                 style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: '2px' }}>
                {board.map((row, rowIndex) => 
                    row.map((cell, colIndex) => (
                        <Cell 
                            key={`${rowIndex}-${colIndex}`} 
                            cell={cell}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                            onContextMenu={(e) => handleContextMenu(e, rowIndex, colIndex)}
                        />
                    ))
                )}
            </div>
             {gameState === 'gameOver' && (
                <GameOverModal
                    winner={winner}
                    scores={scores}
                    onPlayAgain={onExit}
                    revealedByPlayer={revealedByPlayer}
                />
            )}
        </div>
    );
};

export default GameScreen;