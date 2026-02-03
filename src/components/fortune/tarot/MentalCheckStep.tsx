import React, { useState } from 'react';
import Image from 'next/image';
import { MentalState, Target } from './types';

interface MentalCheckStepProps {
  target: Target;
  onSelect: (state: MentalState) => void;
}

export const MentalCheckStep: React.FC<MentalCheckStepProps> = ({ target, onSelect }) => {
  const [selectedMental, setSelectedMental] = useState<MentalState | null>(null);

  const handleSelect = (state: MentalState) => {
    setSelectedMental(state);
    onSelect(state);
  };

  return (
    <div className="text-center">
      <h3 
        style={{
          fontFamily: 'Noto Sans JP',
          fontWeight: 700,
          fontSize: '12px',
          lineHeight: '20px',
          letterSpacing: '0%',
          textAlign: 'center',
          color: '#F9F9F9'
        }}
      >
        カードを１枚選んでください
      </h3>
      <p 
        style={{
          fontFamily: 'Noto Sans JP',
          fontWeight: 700,
          fontSize: '12px',
          lineHeight: '20px',
          letterSpacing: '0%',
          textAlign: 'center',
          color: '#C7D2FF',
          marginBottom: '32px'
        }}
      >
        {target === 'self' ? 'あなた' : '相手'}の今の心の状態を選んでください
      </p>
      <div className="grid grid-cols-2 gap-4 mx-auto" style={{ paddingLeft: '20.5px', paddingRight: '20.5px', overflow: 'visible', width: '100%', maxWidth: '342px' }}>
        {/* 左上: 晴れ */}
        <button
          onClick={() => handleSelect('sunny')}
          className="transform hover:scale-105 transition-all relative"
          style={{ overflow: 'visible' }}
        >
          <Image
            src="/tarot-material/sunny.svg"
            alt="晴れ"
            width={130}
            height={85}
            className="object-contain"
          />
          {selectedMental === 'sunny' && (
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                left: 'calc(50% - 2px)',
                transform: 'translate(-50%, -50%) rotate(90deg)',
                width: '160px',
                height: '230px',
                pointerEvents: 'none'
              }}
            >
              <img 
                src="/tarot-material/effect.svg" 
                alt="選択エフェクト"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
          )}
        </button>
        
        {/* 右上: 曇り */}
        <button
          onClick={() => handleSelect('cloudy')}
          className="transform hover:scale-105 transition-all relative"
          style={{ overflow: 'visible' }}
        >
          <Image
            src="/tarot-material/cloudy.svg"
            alt="曇り"
            width={130}
            height={85}
            className="object-contain"
          />
          {selectedMental === 'cloudy' && (
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                left: 'calc(50% - 2px)',
                transform: 'translate(-50%, -50%) rotate(90deg)',
                width: '160px',
                height: '230px',
                pointerEvents: 'none'
              }}
            >
              <img 
                src="/tarot-material/effect.svg" 
                alt="選択エフェクト"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
          )}
        </button>
        
        {/* 左下: 雨 */}
        <button
          onClick={() => handleSelect('rainy')}
          className="transform hover:scale-105 transition-all relative"
          style={{ overflow: 'visible' }}
        >
          <Image
            src="/tarot-material/rainy.svg"
            alt="雨"
            width={130}
            height={85}
            className="object-contain"
          />
          {selectedMental === 'rainy' && (
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                left: 'calc(50% - 2px)',
                transform: 'translate(-50%, -50%) rotate(90deg)',
                width: '160px',
                height: '230px',
                pointerEvents: 'none'
              }}
            >
              <img 
                src="/tarot-material/effect.svg" 
                alt="選択エフェクト"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
          )}
        </button>
        
        {/* 右下: 大雨 */}
        <button
          onClick={() => handleSelect('very-rainy')}
          className="transform hover:scale-105 transition-all relative"
          style={{ overflow: 'visible' }}
        >
          <Image
            src="/tarot-material/very-rainy.svg"
            alt="大雨"
            width={130}
            height={85}
            className="object-contain"
          />
          {selectedMental === 'very-rainy' && (
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                left: 'calc(50% - 2px)',
                transform: 'translate(-50%, -50%) rotate(90deg)',
                width: '160px',
                height: '230px',
                pointerEvents: 'none'
              }}
            >
              <img 
                src="/tarot-material/effect.svg" 
                alt="選択エフェクト"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
