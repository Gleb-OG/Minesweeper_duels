import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Player, GameMode, GameSettings } from '../types.ts';
import { createEmptyBoard, plantMines, calculateAdjacentMines, revealCells } from '../utils/gameLogic.ts';

export const DEFAULT_SETTINGS: GameSettings = {
    rows: 12,
    cols: 12,
    mines: 35,
    turnDuration: 15,
};

export const createInitialGameState = (gameMode: GameMode, settings: GameSettings = DEFAULT_SETTINGS): GameState => ({
    settings,
    board: createEmptyBoard(settings.rows, settings.cols),
    isFirstClick: true,
    currentPlayer: 1,
    gameState: gameMode === 'local' ? 'roulette' : 'waiting',
    winner: null,
    revealedCellsCount: 0,
    revealedByPlayer: { 1: 0, 2: 0 },
    players: { player1: false, player2: false },
    flagsPlaced: 0,
    turnTimer: settings.turnDuration,
    matchTimer: 0,
    gameMode: gameMode,
});

export const useMinesweeperGame = (roomId: string, gameMode: GameMode) => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [playerRole, setPlayerRole] = useState<'player1' | 'player2' | 'spectator' | null>(null);
    const gameStateRef = useRef<GameState | null>(null);
    const turnTimerIntervalRef = useRef<number | null>(null);
    const matchTimerIntervalRef = useRef<number | null>(null);

    const updateGameState = useCallback((newState: GameState) => {
        gameStateRef.current = newState;
        setGameState(newState);
        if (gameMode === 'online') {
            try {
                localStorage.setItem(`minesweeper_${roomId}`, JSON.stringify(newState));
            } catch (error) {
                console.error("Could not save game state to localStorage", error);
            }
        }
    }, [roomId, gameMode]);

    const switchTurn = useCallback((state: GameState): GameState => {
        const newState = { ...state };
        newState.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
        newState.turnTimer = state.settings.turnDuration;
        return newState;
    }, []);

    // Effect for initializing and syncing state
    useEffect(() => {
        if (gameMode === 'online') {
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
                initialState = createInitialGameState('online');
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
                updateGameState(initialState);
            } else {
                setGameState(initialState);
            }
            
            return () => window.removeEventListener('storage', handleStorageChange);
        } else { // Local mode
            const settingsJSON = localStorage.getItem('minesweeper_LOCAL_SETTINGS');
            const settings = settingsJSON ? JSON.parse(settingsJSON) : DEFAULT_SETTINGS;
            const initialState = createInitialGameState('local', settings);
            updateGameState(initialState);
            localStorage.removeItem('minesweeper_LOCAL_SETTINGS');
        }
    }, [roomId, gameMode, playerRole, updateGameState]);

    // Effect for Player 1 to start the game once Player 2 joins
    useEffect(() => {
        if (playerRole !== 'player1' || gameMode !== 'online') return;

        const state = gameStateRef.current;
        if (state && state.gameState === 'waiting' && state.players.player1 && state.players.player2) {
            updateGameState({ ...state, gameState: 'roulette' });
        }
    }, [gameState?.players, playerRole, gameMode, updateGameState]);


    // Effect for the roulette to decide the first player
    useEffect(() => {
        const state = gameStateRef.current;
        const isMyTurnToDecide = gameMode === 'local' || playerRole === 'player1';

        if (state?.gameState === 'roulette' && isMyTurnToDecide && state.rouletteTargetRotation === undefined) {
            const baseSpins = 6;
            const randomExtraDegrees = Math.random() * 360;
            const targetRotation = baseSpins * 360 + randomExtraDegrees;
            
            const landingAngle = (360 - (randomExtraDegrees % 360)) % 360;
            const sectorIndex = Math.floor(landingAngle / 45);
            const startingPlayer = (sectorIndex % 2 === 0 ? 1 : 2) as Player;

            const stateWithRotation = {
                ...state,
                rouletteTargetRotation: targetRotation,
                currentPlayer: startingPlayer,
            };
            updateGameState(stateWithRotation);
        }
    }, [gameState?.gameState, playerRole, gameMode, updateGameState]);


    // Turn timer effect
    useEffect(() => {
        const isMyTurnToTick = gameMode === 'local' || playerRole === 'player1';

        if (gameState?.gameState === 'playing' && isMyTurnToTick) {
            turnTimerIntervalRef.current = window.setInterval(() => {
                const state = gameStateRef.current;
                if (state && state.gameState === 'playing') {
                    if (state.turnTimer > 0) {
                        const newState = { ...state, turnTimer: state.turnTimer - 1 };
                        gameStateRef.current = newState;
                        setGameState(newState);
                    } else {
                        updateGameState(switchTurn(state));
                    }
                }
            }, 1000);
        }

        return () => {
            if (turnTimerIntervalRef.current) {
                clearInterval(turnTimerIntervalRef.current);
            }
        };
    }, [gameState?.gameState, gameState?.currentPlayer, playerRole, gameMode, updateGameState, switchTurn]);

    // Match timer effect
    useEffect(() => {
        const isMyTurnToTick = gameMode === 'local' || playerRole === 'player1';

        if (gameState?.gameState === 'playing' && isMyTurnToTick) {
            matchTimerIntervalRef.current = window.setInterval(() => {
                const state = gameStateRef.current;
                if (state && state.gameState === 'playing') {
                    const newState = { ...state, matchTimer: state.matchTimer + 1 };
                    updateGameState(newState);
                }
            }, 1000);
        }

        return () => {
            if (matchTimerIntervalRef.current) {
                clearInterval(matchTimerIntervalRef.current);
            }
        };
    }, [gameState?.gameState, playerRole, gameMode, updateGameState]);


    const handleCellClick = useCallback((row: number, col: number) => {
        const state = gameStateRef.current;
        if (!state || state.gameState !== 'playing') return;

        let currentBoard = state.board;
        const isFirstClick = state.isFirstClick;
        if (isFirstClick) {
            currentBoard = plantMines(currentBoard, state.settings.rows, state.settings.cols, state.settings.mines, row, col);
            currentBoard = calculateAdjacentMines(currentBoard, state.settings.rows, state.settings.cols);
        }
        
        const cell = currentBoard[row][col];
        if (cell.isRevealed || cell.isFlagged) return;

        let newState = JSON.parse(JSON.stringify(state));
        if (isFirstClick) {
            newState.board = currentBoard;
            newState.isFirstClick = false;
        }

        if (cell.isMine) {
            newState.board[row][col].isRevealed = true;
            newState.board[row][col].revealedBy = state.currentPlayer;
            newState = switchTurn(newState);
        } else {
            const playerForReveal = isFirstClick ? null : state.currentPlayer;
            const { newBoard, revealedCount } = revealCells(currentBoard, row, col, state.settings.rows, state.settings.cols, playerForReveal);
            
            newState.board = newBoard;
            newState.revealedCellsCount += revealedCount;
            
            if (!isFirstClick) {
                newState.revealedByPlayer[state.currentPlayer] += revealedCount;
            }
        }
        
        updateGameState(newState);
    }, [updateGameState, switchTurn]);

    const handleContextMenu = useCallback((e: React.MouseEvent, row: number, col: number) => {
        e.preventDefault();
        const state = gameStateRef.current;
        if (!state || state.gameState !== 'playing' || state.board[row][col].isRevealed) return;
        
        const newState = JSON.parse(JSON.stringify(state));
        const cell = newState.board[row][col];
        const wasFlagged = cell.isFlagged;
        cell.isFlagged = !wasFlagged;

        if (!wasFlagged) {
            newState.flagsPlaced += 1;
        } else {
            newState.flagsPlaced -= 1;
        }
        updateGameState(newState);
    }, [updateGameState]);
    
    // Game Over check effect
    useEffect(() => {
        const state = gameStateRef.current;
        if (!state || state.gameState !== 'playing') return;

        const nonMineCells = state.settings.rows * state.settings.cols - state.settings.mines;
        const allSafeCellsRevealed = state.revealedCellsCount >= nonMineCells;

        if (allSafeCellsRevealed) {
            const newState = JSON.parse(JSON.stringify(state));
            newState.gameState = 'gameOver';
            
            if (newState.revealedByPlayer[1] > newState.revealedByPlayer[2]) {
                newState.winner = 1;
            } else if (newState.revealedByPlayer[2] > newState.revealedByPlayer[1]) {
                newState.winner = 2;
            } else {
                newState.winner = null;
            }

            for (let r = 0; r < state.settings.rows; r++) {
                for (let c = 0; c < state.settings.cols; c++) {
                    if (newState.board[r][c].isMine) {
                        newState.board[r][c].isRevealed = true;
                    }
                }
            }
            updateGameState(newState);
        }
    }, [gameState, updateGameState]);

    const handleRouletteAnimationEnd = useCallback(() => {
        const isMyTurnToDecide = gameMode === 'local' || playerRole === 'player1';
        if (!isMyTurnToDecide) return;

        const state = gameStateRef.current;
        if (state && state.gameState === 'roulette') {
            updateGameState({
                ...state,
                gameState: 'playing',
            });
        }
    }, [gameMode, playerRole, updateGameState]);

    useEffect(() => {
        return () => {
            if (turnTimerIntervalRef.current) clearInterval(turnTimerIntervalRef.current);
            if (matchTimerIntervalRef.current) clearInterval(matchTimerIntervalRef.current);
        };
    }, []);

    return { gameState, playerRole, handleCellClick, handleContextMenu, handleRouletteAnimationEnd };
};
