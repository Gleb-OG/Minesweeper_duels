
import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Player } from '../types.ts';
import { createEmptyBoard, plantMines, calculateAdjacentMines, revealCells } from '../utils/gameLogic.ts';

const ROWS = 12;
const COLS = 12;
const MINES = 15;

const createInitialGameState = (): GameState => ({
    board: createEmptyBoard(ROWS, COLS),
    isFirstClick: true,
    currentPlayer: 1,
    scores: { 1: 0, 2: 0 },
    gameState: 'waiting',
    minesFound: 0,
    winner: null,
    revealedCellsCount: 0,
    revealedByPlayer: { 1: 0, 2: 0 },
    players: { player1: false, player2: false },
    flagsPlaced: 0,
});

export const useNetworkedGameState = (roomId: string) => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [playerRole, setPlayerRole] = useState<'player1' | 'player2' | 'spectator' | null>(null);
    const gameStateRef = useRef<GameState | null>(null);

    const updateGameState = useCallback((newState: GameState) => {
        gameStateRef.current = newState;
        setGameState(newState);
        try {
            localStorage.setItem(`minesweeper_${roomId}`, JSON.stringify(newState));
        } catch (error) {
            console.error("Could not save game state to localStorage", error);
        }
    }, [roomId]);

    // Effect for initializing and syncing state
    useEffect(() => {
        const storageKey = `minesweeper_${roomId}`;

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === storageKey && event.newValue) {
                const newState = JSON.parse(event.newValue);
                gameStateRef.current = newState;
                setGameState(newState);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        const existingStateJSON = localStorage.getItem(storageKey);
        let initialState: GameState;

        if (existingStateJSON) {
            initialState = JSON.parse(existingStateJSON);
        } else {
            initialState = createInitialGameState();
        }

        if (!playerRole) {
             if (!initialState.players.player1) {
                setPlayerRole('player1');
                initialState.players.player1 = true;
            } else if (!initialState.players.player2) {
                setPlayerRole('player2');
                initialState.players.player2 = true;
            } else {
                setPlayerRole('spectator');
            }
        }
       
        if(initialState.players.player1 && initialState.players.player2 && initialState.gameState === 'waiting'){
            initialState.gameState = 'playing';
        }

        updateGameState(initialState);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [roomId, playerRole, updateGameState]);

    const handleCellClick = useCallback((row: number, col: number) => {
        const state = gameStateRef.current;
        if (!state || state.gameState !== 'playing' || !playerRole || playerRole === 'spectator') return;
        
        const myTurnPlayer: Player = playerRole === 'player1' ? 1 : 2;
        if (state.currentPlayer !== myTurnPlayer) return;

        let currentBoard = state.board;
        const isFirstClick = state.isFirstClick;
        if (isFirstClick) {
            currentBoard = plantMines(currentBoard, ROWS, COLS, MINES, row, col);
            currentBoard = calculateAdjacentMines(currentBoard, ROWS, COLS);
        }
        
        const cell = currentBoard[row][col];
        if (cell.isRevealed || cell.isFlagged) return;

        const newState = JSON.parse(JSON.stringify(state));
        if (isFirstClick) {
            newState.board = currentBoard;
            newState.isFirstClick = false;
        }

        if (cell.isMine) {
            newState.board[row][col].isRevealed = true;
            newState.board[row][col].revealedBy = state.currentPlayer;
            newState.scores[state.currentPlayer] -= 10;
        } else {
            const { newBoard } = revealCells(currentBoard, row, col, ROWS, COLS);
            
            let points = 0;
            let newlyRevealedByPlayer = 0;
            for (let r=0; r < ROWS; r++) {
                for (let c=0; c < COLS; c++) {
                    if (newBoard[r][c].isRevealed && !currentBoard[r][c].isRevealed) {
                        newBoard[r][c].revealedBy = state.currentPlayer;
                        points += newBoard[r][c].adjacentMines > 0 ? newBoard[r][c].adjacentMines : 1;
                        newlyRevealedByPlayer++;
                    }
                }
            }
            newState.board = newBoard;
            newState.scores[state.currentPlayer] += points;
            newState.revealedCellsCount += newlyRevealedByPlayer;
            newState.revealedByPlayer[state.currentPlayer] += newlyRevealedByPlayer;
        }
        
        newState.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
        updateGameState(newState);
    }, [playerRole, updateGameState]);

    const handleContextMenu = useCallback((e: React.MouseEvent, row: number, col: number) => {
        e.preventDefault();
        const state = gameStateRef.current;
        if (!state || state.gameState !== 'playing' || !playerRole || playerRole === 'spectator') return;
        
        const myTurnPlayer: Player = playerRole === 'player1' ? 1 : 2;
        if (state.currentPlayer !== myTurnPlayer) return;

        if (state.board[row][col].isRevealed) return;

        const newState = JSON.parse(JSON.stringify(state));
        const cell = newState.board[row][col];
        const wasFlagged = cell.isFlagged;
        cell.isFlagged = !wasFlagged;

        if (!wasFlagged) {
            newState.flagsPlaced += 1;
            if (cell.isMine) {
                newState.scores[state.currentPlayer] += 5;
                newState.minesFound += 1;
            }
        } else {
            newState.flagsPlaced -= 1;
            if (cell.isMine) {
                newState.scores[state.currentPlayer] -= 5;
                newState.minesFound -= 1;
            }
        }

        newState.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
        updateGameState(newState);
    }, [playerRole, updateGameState]);

    useEffect(() => {
        const state = gameStateRef.current;
        if (!state || state.gameState !== 'playing') return;

        const nonMineCells = ROWS * COLS - MINES;
        const allMinesFlagged = state.minesFound === MINES;
        const allSafeCellsRevealed = state.revealedCellsCount >= nonMineCells;

        if (allMinesFlagged || allSafeCellsRevealed) {
            const newState = JSON.parse(JSON.stringify(state));
            newState.gameState = 'gameOver';
            if (newState.scores[1] > newState.scores[2]) {
                newState.winner = 1;
            } else if (newState.scores[2] > newState.scores[1]) {
                newState.winner = 2;
            } else {
                if (newState.revealedByPlayer[1] > newState.revealedByPlayer[2]) {
                    newState.winner = 1;
                } else if (newState.revealedByPlayer[2] > newState.revealedByPlayer[1]) {
                    newState.winner = 2;
                } else {
                    newState.winner = null;
                }
            }

            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    if (newState.board[r][c].isMine) {
                        newState.board[r][c].isRevealed = true;
                    }
                }
            }
            updateGameState(newState);
        }
    }, [gameState, updateGameState]);

    return { gameState, playerRole, handleCellClick, handleContextMenu };
};
