import React from 'react';

interface FeelingSelectorProps {
  selectedFeeling: 'good' | 'soso' | 'bad' | null;
  onSelect: (feeling: 'good' | 'soso' | 'bad') => void;
}

export const FeelingSelector: React.FC<FeelingSelectorProps> = ({
  selectedFeeling,
  onSelect
}) => {
  const feelings: Array<{ value: 'good' | 'soso' | 'bad'; label: string }> = [
    { value: 'good', label: '良い' },
    { value: 'soso', label: '普通' },
    { value: 'bad', label: '悪い' }
  ];

  return (
    <div className="flex justify-center gap-3 mb-3">
      {feelings.map(({ value, label }) => {
        // 何も選択されてない or 自分が選択されてる → そのまま
        // 他が選択されてる → 暗くする
        const shouldDarken = selectedFeeling !== null && selectedFeeling !== value;
        
        return (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className="bg-transparent border-none p-0 cursor-pointer relative block"
            style={{
              filter: shouldDarken ? 'brightness(0.3) saturate(0.5)' : 'none'
            }}
          >
            <img 
              alt={label}
              src={`/tarot-material/${value}.svg`}
              className="block"
            />
          </button>
        );
      })}
    </div>
  );
};
