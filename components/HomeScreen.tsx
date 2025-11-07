
import React from 'react';

interface HomeScreenProps {
    onCreateRoom: () => void;
    onJoinRoom: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onCreateRoom, onJoinRoom }) => {
    return (
        <div className="w-full max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2 tracking-wider">Minesweeper</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-pink-500 mb-8 tracking-wider">Duels</h2>
            <div className="flex flex-col space-y-4 w-full">
                <button
                    onClick={onCreateRoom}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold py-3 px-4 rounded-lg text-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                >
                    Create Game
                </button>
                <button
                    onClick={onJoinRoom}
                    className="w-full bg-pink-500 hover:bg-pink-400 text-gray-900 font-bold py-3 px-4 rounded-lg text-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-300"
                >
                    Join Game
                </button>
            </div>
            <p className="mt-8 text-sm text-gray-400">Challenge a friend in a turn-based minesweeper battle!</p>
        </div>
    );
};

export default HomeScreen;
