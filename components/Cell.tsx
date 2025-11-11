import React from 'react';
import { CellState } from '../types.ts';
import FlagIcon from './icons/FlagIcon.tsx';
import MineIcon from './icons/MineIcon.tsx';
import { useSettings } from '../contexts/SettingsContext.tsx';

interface CellProps {
    cell: CellState;
    onClick: () => void;
    onContextMenu: (e: React.MouseEvent) => void;
}

const MemoizedFlagIcon = React.memo(FlagIcon);
const MemoizedMineIcon = React.memo(MineIcon);

const Cell: React.FC<CellProps> = ({ cell, onClick, onContextMenu }) => {
    const getCellContent = () => {
        if (cell.isFlagged) {
            return <MemoizedFlagIcon />;
        }
        if (cell.isRevealed) {
            if (cell.isMine) {
                return <MemoizedMineIcon />;
            }
            if (cell.adjacentMines > 0) {
                return cell.adjacentMines;
            }
        }
        return null;
    };

    const getNumberColor = (num: number) => {
        switch (num) {
            case 1: return 'text-cyan-400';
            case 2: return 'text-green-400';
            case 3: return 'text-red-500';
            case 4: return 'text-blue-400';
            case 5: return 'text-yellow-500';
            case 6: return 'text-purple-400';
            case 7: return 'text-pink-500';
            case 8: return 'text-orange-500';
            default: return 'text-gray-400';
        }
    };

    const revealedByClass = cell.revealedBy === 1 ? 'bg-cyan-900/50' : cell.revealedBy === 2 ? 'bg-pink-900/50' : 'bg-gray-700';

    const baseClasses = "w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center font-bold text-base sm:text-lg md:text-xl select-none transition-all duration-150 shadow-[inset_0_0_0_1px_#111827]";

    if (cell.isRevealed) {
        return (
            <div className={`${baseClasses} ${revealedByClass} ${getNumberColor(cell.adjacentMines)}`}>
                {getCellContent()}
            </div>
        );
    }

    return (
        <div 
            className={`${baseClasses} bg-gray-600 hover:bg-gray-500 cursor-pointer`}
            onClick={onClick}
            onContextMenu={onContextMenu}
        >
            {getCellContent()}
        </div>
    );
};

// Memoize the component, re-rendering only when cell props change or language changes (for future accessibility labels).
const MemoizedCell = React.memo(Cell, (prevProps, nextProps) => {
    return prevProps.cell === nextProps.cell;
});

const CellWrapper: React.FC<CellProps> = (props) => {
    const { language } = useSettings(); // Depend on language
    return <MemoizedCell {...props} key={language} />;
};

export default CellWrapper;
