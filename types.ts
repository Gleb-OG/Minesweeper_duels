
export interface CellState {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
  revealedBy: Player | null;
}

export type Player = 1 | 2;
