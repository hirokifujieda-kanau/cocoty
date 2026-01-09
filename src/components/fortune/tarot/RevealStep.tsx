import React from 'react';

export const RevealStep: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="relative aspect-[2/3] max-w-xs mx-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl shadow-2xl transform transition-all duration-1000">
          <div className="absolute inset-0 flex items-center justify-center text-white text-6xl">
            🔮
          </div>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-white mt-8">カードをめくっています...</h3>
    </div>
  );
};
