import React from 'react';
import { User, Heart } from 'lucide-react';
import { Target } from './types';

interface TargetSelectStepProps {
  onSelect: (target: Target) => void;
}

export const TargetSelectStep: React.FC<TargetSelectStepProps> = ({ onSelect }) => {
  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold text-white mb-8">誰のことを占いますか？</h3>
      <div className="grid grid-cols-2 gap-6">
        <button
          onClick={() => onSelect('self')}
          className="p-8 bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-2xl transform hover:scale-105 transition-all"
        >
          <User className="h-16 w-16 mx-auto mb-4 text-white" />
          <div className="text-xl font-bold text-white">自分</div>
          <div className="text-sm text-blue-100 mt-2">あなた自身の運勢</div>
        </button>
        <button
          onClick={() => onSelect('other')}
          className="p-8 bg-gradient-to-br from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-2xl transform hover:scale-105 transition-all"
        >
          <Heart className="h-16 w-16 mx-auto mb-4 text-white" />
          <div className="text-xl font-bold text-white">相手</div>
          <div className="text-sm text-pink-100 mt-2">大切な人との関係</div>
        </button>
      </div>
    </div>
  );
};
