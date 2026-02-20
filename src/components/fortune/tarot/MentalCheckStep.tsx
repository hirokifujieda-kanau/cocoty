import React, { useState } from 'react';
import Image from 'next/image';
import { MentalState, Target } from './types';

interface MentalCheckStepProps {
  target: Target;
  onSelect: (state: MentalState) => void;
}

interface MentalCardProps {
  state: MentalState;
  selectedMental: MentalState | null;
  onSelect: (state: MentalState) => void;
  imagePath: string;
  alt: string;
}

const MentalCard: React.FC<MentalCardProps> = ({ state, selectedMental, onSelect, imagePath, alt }) => {
  const shouldDarken = selectedMental !== null && selectedMental !== state;
  
  return (
    <button
      onClick={() => onSelect(state)}
      className={`transform hover:scale-105 transition-all relative overflow-visible ${
        shouldDarken ? 'brightness-[0.4] saturate-[0.3] opacity-60' : ''
      }`}
    >
      <Image
        src={imagePath}
        alt={alt}
        width={130}
        height={85}
        className="object-contain"
      />
      {selectedMental === state && (
        <div className="absolute top-1/2 left-[calc(50%-6px)] -translate-x-1/2 -translate-y-1/2 rotate-90 w-[160px] h-[230px] pointer-events-none">
          <img 
            src="/tarot-material/effect.svg" 
            alt="選択エフェクト"
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </button>
  );
};

export const MentalCheckStep: React.FC<MentalCheckStepProps> = ({ target, onSelect }) => {
  const [selectedMental, setSelectedMental] = useState<MentalState | null>(null);

  const handleSelect = (state: MentalState) => {
    setSelectedMental(state);
    onSelect(state);
  };

  return (
    <div className="text-center">
      <h3 className="font-bold text-xs leading-5 text-center text-[#F9F9F9] font-noto-sans-jp">
        カードを１枚選んでください
      </h3>
      <p className="font-bold text-xs leading-5 text-center text-[#C7D2FF] font-noto-sans-jp mb-8">
        {target === 'self' ? 'あなた' : '相手'}の今の心の状態を選んでください
      </p>
      <div className="grid grid-cols-2 gap-4 mx-auto px-[20.5px] overflow-visible w-full max-w-[342px]">
        <MentalCard
          state="sunny"
          selectedMental={selectedMental}
          onSelect={handleSelect}
          imagePath="/tarot-material/sunny.svg"
          alt="晴れ"
        />
        <MentalCard
          state="cloudy"
          selectedMental={selectedMental}
          onSelect={handleSelect}
          imagePath="/tarot-material/cloudy.svg"
          alt="曇り"
        />
        <MentalCard
          state="rainy"
          selectedMental={selectedMental}
          onSelect={handleSelect}
          imagePath="/tarot-material/rainy.svg"
          alt="雨"
        />
        <MentalCard
          state="very-rainy"
          selectedMental={selectedMental}
          onSelect={handleSelect}
          imagePath="/tarot-material/very-rainy.svg"
          alt="大雨"
        />
      </div>
    </div>
  );
};

