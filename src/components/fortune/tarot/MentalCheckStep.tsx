import React from 'react';
import { Sun, Cloud, CloudRain } from 'lucide-react';
import { MentalState, Target } from './types';

interface MentalCheckStepProps {
  target: Target;
  onSelect: (state: MentalState) => void;
}

export const MentalCheckStep: React.FC<MentalCheckStepProps> = ({ target, onSelect }) => {
  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold text-white mb-4">今の気分は？</h3>
      <p className="text-purple-200 mb-8">
        {target === 'self' ? 'あなた' : '相手'}の今の心の状態を選んでください
      </p>
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => onSelect('sunny')}
          className="p-6 bg-gradient-to-br from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 rounded-2xl transform hover:scale-105 transition-all"
        >
          <Sun className="h-12 w-12 mx-auto mb-3 text-white" />
          <div className="text-lg font-bold text-white">晴れ</div>
          <div className="text-xs text-yellow-100 mt-1">気分良好</div>
        </button>
        <button
          onClick={() => onSelect('cloudy')}
          className="p-6 bg-gradient-to-br from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 rounded-2xl transform hover:scale-105 transition-all"
        >
          <Cloud className="h-12 w-12 mx-auto mb-3 text-white" />
          <div className="text-lg font-bold text-white">曇り</div>
          <div className="text-xs text-gray-100 mt-1">少しモヤモヤ</div>
        </button>
        <button
          onClick={() => onSelect('rainy')}
          className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-2xl transform hover:scale-105 transition-all"
        >
          <CloudRain className="h-12 w-12 mx-auto mb-3 text-white" />
          <div className="text-lg font-bold text-white">雨</div>
          <div className="text-xs text-blue-100 mt-1">気分が沈む</div>
        </button>
      </div>
    </div>
  );
};
