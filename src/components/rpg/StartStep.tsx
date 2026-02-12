'use client';

import React from 'react';

interface StartStepProps {
  onStart: () => void;
  onBack: () => void;
}

export const StartStep: React.FC<StartStepProps> = ({ onStart, onBack }) => {
  return (
    <div className="flex items-center justify-center min-h-[600px] gap-[176px]">
      <img 
        src="/rpg-images/TOP.png" 
        alt="RPG診断" 
        className="w-[400px] h-auto object-contain"
      />
      
      <div className="flex flex-col h-[500px] justify-between">
        <div className="mt-20 space-y-6">
          {/* タイトル */}
          <div className="text-center">
            <h2 
              className="text-3xl font-bold text-gray-600"
              style={{ fontFamily: "'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif" }}
            >
              さぁ！あなたの適性を<br />
              診断してみましょう！
            </h2>
            <p className="text-base text-gray-600 mt-2">
              (15の質問が出題されます)
            </p>
          </div>
          
          {/* ボタン */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={onBack}
              className="w-[140px] h-12 rounded-lg font-semibold text-white border border-gray-400 transition-all hover:opacity-90"
              style={{
                background: 'linear-gradient(rgb(107, 114, 128) 0%, rgb(75, 85, 99) 100%)',
                boxShadow: 'rgb(55, 65, 81) 0px 4px 0px 0px'
              }}
            >
              もどる
            </button>
            <button
              onClick={onStart}
              className="w-[140px] h-12 rounded-lg font-semibold text-white border border-cyan-300 transition-all hover:opacity-90"
              style={{
                background: 'linear-gradient(rgb(34, 211, 238) 0%, rgb(8, 145, 178) 100%)',
                boxShadow: 'rgb(22, 78, 99) 0px 4px 0px 0px'
              }}
            >
              はじめる
            </button>
          </div>
        </div>

        {/* 注意書き */}
        <div className="text-left text-sm text-gray-500 space-y-1">
          <p>※この診断は一度しか行えません。</p>
          <p>やり直しが必要な場合は、こちらから管理者承認が必要となります</p>
        </div>
      </div>
    </div>
  );
};
