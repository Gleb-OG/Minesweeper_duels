
export interface CellState {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
  revealedBy: Player | null;
}

export type Player = 1 | 2;

export interface GameState {
  board: CellState[][];
  isFirstClick: boolean;
  currentPlayer: Player;
  scores: { [key in Player]: number };
  gameState: 'waiting' | 'playing' | 'gameOver';
  minesFound: number; // Correctly flagged mines
  winner: Player | null;
  revealedCellsCount: number;
  revealedByPlayer: { [key in Player]: number };
  players: { player1: boolean; player2: boolean };
  flagsPlaced: number;
}
