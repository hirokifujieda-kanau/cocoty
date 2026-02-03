'use client';

import React from 'react';
import type { TarotCard as TarotCardType } from '@/lib/api/client';

interface TarotCardProps {
  card: TarotCardType;
  isReversed?: boolean;
  isFlipped?: boolean;
  onClick?: () => void;
}

const TarotCard: React.FC<TarotCardProps> = ({ 
  card, 
  isReversed = false, 
  isFlipped = false,
  onClick 
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer transition-all duration-700 ${
        isFlipped ? 'rotate-y-180' : ''
      }`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {/* カード裏面 */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-800 rounded-lg shadow-xl"
        style={{
          backfaceVisibility: 'hidden',
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-white text-6xl">🔮</div>
        </div>
      </div>

      {/* カード表面 */}
      <div
        className={`bg-white rounded-lg shadow-xl p-4 ${
          isReversed ? 'rotate-180' : ''
        }`}
        style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
        }}
      >
        <div className="flex flex-col items-center">
          <img
            src={card.image_url}
            alt={card.name}
            className="w-full h-48 object-contain mb-2"
          />
          <h3 className="font-bold text-lg text-center">{card.name}</h3>
          <p className="text-sm text-gray-600 text-center mt-2">
            {isReversed ? card.meaning_reversed : card.meaning_upright}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TarotCard;
