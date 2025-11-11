import React from 'react';
import { useSettings } from '../contexts/SettingsContext.tsx';

interface RouletteScreenProps {
  targetRotation?: number;
  onAnimationEnd: () => void;
}

const RouletteScreen: React.FC<RouletteScreenProps> = ({ targetRotation, onAnimationEnd }) => {
  const { t } = useSettings();

  const handleAnimationEnd = () => {
    onAnimationEnd();
  };

  const animationKeyframes = `
    @keyframes spin-roulette {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(${targetRotation || 2160}deg); }
    }
  `;

  const animationStyle = {
    animation: targetRotation !== undefined ? 'spin-roulette 4s cubic-bezier(0.25, 1, 0.5, 1) forwards' : 'none',
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col items-center text-center">
      <style>{animationKeyframes}</style>
      <h2 className="text-2xl font-bold text-white mb-4">{t('decidingFirst')}</h2>
      <div className="relative w-48 h-48 my-4">
        <div 
            className="w-full h-full rounded-full" 
            style={{ 
                background: 'conic-gradient(#22d3ee 0% 12.5%, #ec4899 12.5% 25%, #22d3ee 25% 37.5%, #ec4899 37.5% 50%, #22d3ee 50% 62.5%, #ec4899 62.5% 75%, #22d3ee 75% 87.5%, #ec4899 87.5% 100%)',
                ...animationStyle
            }}
            onAnimationEnd={handleAnimationEnd}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gray-800 rounded-full"></div>
        <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-0 h-0"
            style={{
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderTop: '20px solid white'
            }}
        ></div>
      </div>
    </div>
  );
};

export default RouletteScreen;
