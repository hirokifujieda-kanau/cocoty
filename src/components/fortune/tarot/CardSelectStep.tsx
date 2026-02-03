import React, { useState } from 'react';
import Image from 'next/image';
import { WhiteoutAnimation } from './WhiteoutAnimation';

interface CardSelectStepProps {
  onSelect: (index: number) => void;
}

// スタイル定数
const STYLES = {
  heading: {
    fontFamily: 'Noto Sans JP',
    fontWeight: 700,
    fontSize: '12px',
    lineHeight: '20px',
    letterSpacing: '0%',
    textAlign: 'center' as const,
    color: '#FFFFFF',
    marginBottom: '36px',
  },
  decideButton: {
    enabled: {
      background: 'linear-gradient(180deg, #E3AC66 0%, #89602B 100%)',
      border: '1px solid #FFB370',
      boxShadow: '0px 4px 0px 0px #5B3500',
      cursor: 'pointer' as const,
    },
    disabled: {
      background: 'linear-gradient(180deg, #D0D0D0 0%, #848484 100%)',
      border: '1px solid #CECECE',
      boxShadow: '0px 4px 0px 0px #676158',
      cursor: 'not-allowed' as const,
    },
    base: {
      width: '140px',
      height: '48px',
      borderRadius: '8px',
      fontFamily: 'Noto Sans JP',
      fontWeight: 700,
      fontSize: '16px',
      lineHeight: '16px',
      textAlign: 'center' as const,
      color: '#FFFFFF',
    },
  },
} as const;

// カードサイズ定数
const CARD_SIZE = {
  width: 95,
  height: 153,
} as const;

const EFFECT_SIZE = {
  width: 180,
  height: 270,
} as const;

// タロットカードボタンコンポーネント
interface TarotCardButtonProps {
  cardIndex: number;
  isSelected: boolean;
  onCardClick: (index: number) => void;
}

const TarotCardButton: React.FC<TarotCardButtonProps> = ({ 
  cardIndex, 
  isSelected, 
  onCardClick 
}) => {
  return (
    <button
      onClick={() => onCardClick(cardIndex)}
      className="relative transform hover:scale-105 transition-all"
      aria-label={`カード${cardIndex + 1}`}
    >
      <Image
        src="/tarot-material/tarot_default.svg"
        alt="タロットカード"
        width={CARD_SIZE.width}
        height={CARD_SIZE.height}
        className="relative z-10"
      />
      {isSelected && (
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20" 
          style={{ 
            width: `${EFFECT_SIZE.width}px`, 
            height: `${EFFECT_SIZE.height}px` 
          }}
        >
          <Image
            src="/tarot-material/effect.svg"
            alt="選択エフェクト"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      )}
    </button>
  );
};

// 決定ボタンコンポーネント
interface DecideButtonProps {
  isEnabled: boolean;
  onClick: () => void;
}

const DecideButton: React.FC<DecideButtonProps> = ({ isEnabled, onClick }) => {
  const buttonStyle = isEnabled 
    ? STYLES.decideButton.enabled 
    : STYLES.decideButton.disabled;

  return (
    <div className="flex justify-center" style={{ marginTop: '48px' }}>
      <button
        onClick={onClick}
        disabled={!isEnabled}
        style={{
          ...STYLES.decideButton.base,
          ...buttonStyle,
        }}
        aria-label="選択を決定"
      >
        決定
      </button>
    </div>
  );
};

// メインコンポーネント
export const CardSelectStep: React.FC<CardSelectStepProps> = ({ onSelect }) => {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCardClick = (index: number) => {
    setSelectedCardIndex(index);
  };

  const handleDecideClick = () => {
    if (selectedCardIndex !== null) {
      setIsAnimating(true);
      setTimeout(() => {
        onSelect(selectedCardIndex);
      }, 3000);
    }
  };

  const isCardSelected = selectedCardIndex !== null;

  return (
    <>
      <div className="text-center">
        <h3 style={STYLES.heading}>
          カードを1枚選んでください
        </h3>
        
        <div className="flex justify-center gap-6">
          {[0, 1, 2].map((cardIndex) => (
            <TarotCardButton
              key={cardIndex}
              cardIndex={cardIndex}
              isSelected={selectedCardIndex === cardIndex}
              onCardClick={handleCardClick}
            />
          ))}
        </div>
        
        <DecideButton
          isEnabled={isCardSelected}
          onClick={handleDecideClick}
        />
      </div>

      {isAnimating && <WhiteoutAnimation />}
    </>
  );
};
