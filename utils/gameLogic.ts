
import { CellState } from '../types.ts';

export const createEmptyBoard = (rows: number, cols: number): CellState[][] => {
    return Array.from({ length: rows }, () => 
        Array.from({ length: cols }, () => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            adjacentMines: 0,
            revealedBy: null,
        }))
    );
};

export const plantMines = (board: CellState[][], rows: number, cols: number, mineCount: number, firstClickRow: number, firstClickCol: number): CellState[][] => {
    let minesPlaced = 0;
    const newBoard = JSON.parse(JSON.stringify(board));

    while (minesPlaced < mineCount) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);

        // Don't place a mine on the first clicked cell or its neighbors
        const isFirstClickZone = Math.abs(row - firstClickRow) <= 1 && Math.abs(col - firstClickCol) <= 1;

        if (!newBoard[row][col].isMine && !isFirstClickZone) {
            newBoard[row][col].isMine = true;
            minesPlaced++;
        }
    }
    return newBoard;
};

export const calculateAdjacentMines = (board: CellState[][], rows: number, cols: number): CellState[][] => {
    const newBoard = JSON.parse(JSON.stringify(board));
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (newBoard[row][col].isMine) continue;
            let mineCount = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 0 && j === 0) continue;
                    const newRow = row + i;
                    const newCol = col + j;
                    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && newBoard[newRow][newCol].isMine) {
                        mineCount++;
                    }
                }
            }
            newBoard[row][col].adjacentMines = mineCount;
        }
    }
    return newBoard;
};

export const revealCells = (board: CellState[][], row: number, col: number, rows: number, cols: number): { newBoard: CellState[][], revealedCount: number } => {
    const newBoard = JSON.parse(JSON.stringify(board));
    let revealedCount = 0;

    const reveal = (r: number, c: number) => {
        if (r < 0 || r >= rows || c < 0 || c >= cols || newBoard[r][c].isRevealed || newBoard[r][c].isFlagged) {
            return;
        }

        newBoard[r][c].isRevealed = true;
        revealedCount++;

        if (newBoard[r][c].adjacentMines === 0) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 0 && j === 0) continue;
                    reveal(r + i, c + j);
                }
            }
        }
    };

    reveal(row, col);
    return { newBoard, revealedCount };
};