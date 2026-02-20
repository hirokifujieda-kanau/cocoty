'use client';

import React from 'react';

interface GenderStepProps {
  onSelect: (gender: '男性' | '女性' | 'その他') => void;
}

export const GenderStep: React.FC<GenderStepProps> = ({ onSelect }) => {
  return (
    <div className="text-center">
      {/* タイトルと画像 */}
      <div className="mb-4">
        <div className="flex items-center justify-center gap-6 max-w-4xl mx-auto">
          <img 
            src="/tarot-question/Question_01.png" 
            alt="質問アイコン" 
            className="w-24 h-24 lg:w-32 lg:h-32 object-contain flex-shrink-0"
          />
          <h3 className="text-2xl font-bold text-white text-center flex-1">
            性別を選択してください
          </h3>
          {/* 右側のスペーサー（画像と同じサイズ） */}
          <div className="w-24 h-24 lg:w-32 lg:h-32 flex-shrink-0 opacity-0" aria-hidden="true"></div>
        </div>
      </div>
      
      <p className="text-purple-200 mb-8">
        共感本能の判定に使用します
      </p>

      <div className="space-y-4">
        <button
          onClick={() => onSelect('男性')}
          className="w-full px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all transform hover:scale-105"
        >
          男性
        </button>
        
        <button
          onClick={() => onSelect('女性')}
          className="w-full px-8 py-6 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-semibold rounded-xl transition-all transform hover:scale-105"
        >
          女性
        </button>
        
        <button
          onClick={() => onSelect('その他')}
          className="w-full px-8 py-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl transition-all transform hover:scale-105"
        >
          その他
        </button>
      </div>
    </div>
  );
};
