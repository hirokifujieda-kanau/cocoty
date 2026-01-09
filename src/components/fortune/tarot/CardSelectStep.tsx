import React from 'react';

interface CardSelectStepProps {
  onSelect: (index: number) => void;
}

export const CardSelectStep: React.FC<CardSelectStepProps> = ({ onSelect }) => {
  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold text-white mb-8">カードを1枚選んでください</h3>
      <div className="grid grid-cols-3 gap-6">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className="group relative aspect-[2/3] bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-300"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl text-white font-bold group-hover:scale-110 transition-transform">
                {String.fromCharCode(65 + index)}
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
};
