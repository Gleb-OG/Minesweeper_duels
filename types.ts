export interface GameSettings {
  rows: number;
  cols: number;
  mines: number;
  turnDuration: number;
}

export interface CellState {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
  revealedBy: Player | null;
}

export type Player = 1 | 2;
export type GameMode = 'online' | 'local';

export interface GameState {
  board: CellState[][];
  settings: GameSettings;
  isFirstClick: boolean;
  currentPlayer: Player;
  gameState: 'waiting' | 'roulette' | 'playing' | 'gameOver';
  winner: Player | null;
  revealedCellsCount: number;
  revealedByPlayer: { [key in Player]: number };
  players: { player1: boolean; player2: boolean };
  flagsPlaced: number;
  turnTimer: number;
  matchTimer: number;
  gameMode: GameMode;
  rouletteTargetRotation?: number;
}