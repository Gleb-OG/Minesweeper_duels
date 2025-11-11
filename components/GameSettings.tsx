import React, { useState } from 'react';
import { GameSettings } from '../types.ts';
import { GameMode } from '../App.tsx';
import { useSettings } from '../contexts/SettingsContext.tsx';

interface GameSettingsProps {
    onStart: (settings: GameSettings) => void;
    onBack: () => void;
    gameMode: GameMode;
}

type BoardSize = 'small' | 'medium' | 'large';
type Difficulty = 'easy' | 'medium' | 'hard';

const sizeOptions: Record<BoardSize, { labelKey: 'small' | 'medium' | 'large'; rows: number; cols: number }> = {
    small: { labelKey: 'small', rows: 8, cols: 8 },
    medium: { labelKey: 'medium', rows: 12, cols: 12 },
    large: { labelKey: 'large', rows: 16, cols: 16 },
};

const mineOptions: Record<BoardSize, Record<Difficulty, number>> = {
    small: { easy: 10, medium: 14, hard: 18 },
    medium: { easy: 25, medium: 35, hard: 45 },
    large: { easy: 50, medium: 70, hard: 90 },
};

const difficultyLabels: Record<Difficulty, 'easy' | 'medium' | 'hard'> = {
    easy: 'easy',
    medium: 'medium',
    hard: 'hard',
};

const timeOptions = [5, 10, 15, 20];

interface SettingButtonProps {
    label: string;
    value: string;
    state: any;
    setter: (value: any) => void;
}

const SettingButton: React.FC<SettingButtonProps> = ({ label, value, state, setter }) => {
    const isActive = state === value;
    const activeClass = 'bg-cyan-500 text-gray-900';
    const inactiveClass = 'bg-gray-700 hover:bg-gray-600';
    return (
        <button
            onClick={() => setter(value)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-colors ${isActive ? activeClass : inactiveClass}`}
        >
            {label}
        </button>
    );
};

const GameSettingsComponent: React.FC<GameSettingsProps> = ({ onStart, onBack, gameMode }) => {
    const [boardSize, setBoardSize] = useState<BoardSize>('medium');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [turnDuration, setTurnDuration] = useState<number>(15);
    const { t } = useSettings();

    const handleSubmit = () => {
        const { rows, cols } = sizeOptions[boardSize];
        const settings: GameSettings = {
            rows,
            cols,
            mines: mineOptions[boardSize][difficulty],
            turnDuration,
        };
        onStart(settings);
    };

    const titleColor = gameMode === 'local' ? 'text-pink-400' : 'text-cyan-400';
    const startButtonColor = gameMode === 'local' ? 'bg-pink-500 hover:bg-pink-400' : 'bg-cyan-500 hover:bg-cyan-400';

    return (
        <div className="w-full flex flex-col space-y-6">
            <h2 className={`text-2xl font-bold ${titleColor} text-center`}>{t('matchSettings')}</h2>

            <div>
                <label className="block text-lg font-medium text-gray-300 mb-2">{t('boardSize')}</label>
                <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
                    {Object.entries(sizeOptions).map(([key, {labelKey, rows, cols}]) => (
                        <SettingButton key={key} label={`${t(labelKey)} (${rows}x${cols})`} value={key} state={boardSize} setter={setBoardSize} />
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-lg font-medium text-gray-300 mb-2">{t('difficulty')}</label>
                <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
                    {Object.entries(mineOptions[boardSize]).map(([key, value]) => (
                         <SettingButton key={key} label={`${t(difficultyLabels[key as Difficulty])} (${value})`} value={key} state={difficulty} setter={setDifficulty} />
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-lg font-medium text-gray-300 mb-2">{t('turnTimer')}</label>
                <div className="grid grid-cols-4 gap-2 bg-gray-800 p-1 rounded-lg">
                    {timeOptions.map(time => (
                         <button key={time} onClick={() => setTurnDuration(time)} className={`py-2 px-3 rounded-md text-sm font-semibold transition-colors ${turnDuration === time ? 'bg-cyan-500 text-gray-900' : 'bg-gray-700 hover:bg-gray-600'}`}>
                            {time}s
                         </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col space-y-3 pt-4">
                <button
                    onClick={handleSubmit}
                    className={`w-full ${startButtonColor} text-gray-900 font-bold py-3 px-4 rounded-lg text-lg transition duration-300 transform hover:scale-105`}
                >
                    {gameMode === 'local' ? t('startLocalGame') : t('createOnlineRoom')}
                </button>
                <button
                    onClick={onBack}
                    className="w-full text-gray-400 hover:text-white font-bold py-2 px-4 rounded-lg text-sm transition duration-300"
                >
                    {t('back')}
                </button>
            </div>
        </div>
    );
};

export default GameSettingsComponent;