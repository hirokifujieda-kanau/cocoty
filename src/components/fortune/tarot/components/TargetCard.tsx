import React from 'react';
import Image from 'next/image';

interface TargetCardProps {
  type: 'self' | 'partner';
  isSelected: boolean;
  selectedTarget: 'self' | 'partner' | null;
  onSelect: (type: 'self' | 'partner') => void;
}

export const TargetCard = React.memo<TargetCardProps>(
  ({ type, isSelected, selectedTarget, onSelect }) => {
    const shouldDarken = selectedTarget !== null && !isSelected;

    return (
      <button
        onClick={() => onSelect(type)}
        className={`relative transform hover:scale-105 transition-all ${
          shouldDarken ? 'brightness-[0.4] saturate-[0.3] opacity-60' : ''
        }`}
      >
        <Image
          src={`/tarot-material/tarot_${type === 'self' ? 'me' : 'someone'}.svg`}
          alt={type === 'self' ? '自分' : '相手'}
          width={95}
          height={153}
          className="relative z-10 w-auto h-auto"
        />
        {/* エフェクトは常に存在させ、opacityで制御 */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 w-[180px] h-[270px] transition-opacity duration-200 ease-in-out ${
            isSelected ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src="/tarot-material/effect.svg"
            alt="選択中"
            className="w-full h-full object-contain"
          />
        </div>
      </button>
    );
  }
);

TargetCard.displayName = 'TargetCard';
