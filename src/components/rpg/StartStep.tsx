'use client';

import React, { useState } from 'react';

interface StartStepProps {
  onStart: () => void;
  onBack: () => void;
  isSoundOn: boolean;
  playClickSound: () => void;
}

export const StartStep: React.FC<StartStepProps> = ({ onStart, onBack, isSoundOn, playClickSound }) => {

  return (
    <div className="mx-auto p-8">
      <div className="mx-auto flex justify-center min-h-full pt-20 pb-8">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-[176px] px-4 font-noto-sans-jp">
        <img 
          src="/rpg-images/TOP.png" 
          alt="RPG診断" 
          className="w-[300px] sm:w-[350px] lg:w-[500px] h-auto object-contain"
        />
        
        <div className="flex flex-col space-y-6 lg:space-y-0 lg:h-[500px] lg:justify-between w-full max-w-sm lg:max-w-md mt-8 lg:mt-0">
          <div className="space-y-6 lg:mt-40">
            {/* タイトル */}
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-noto-sans-jp font-light" style={{ color: '#7d7d7d' }}>
                さぁ！あなたの適性を<br />
                診断してみましょう！
              </h2>
              <p className="text-sm lg:text-base font-noto-sans-jp font-light mt-2" style={{ color: '#7d7d7d' }}>
                (15の質問が出題されます)
              </p>
            </div>
            
            {/* ボタン */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  playClickSound();
                  onBack();
                }}
                className="w-[140px] h-12 rounded-lg transition-all hover:opacity-90 relative p-1"
                style={{
                  background: 'linear-gradient(to bottom, #d4cfc9, #686c6f)'
                }}
              >
                <span 
                  className="flex items-center justify-center w-full h-full rounded-md font-noto-sans-jp font-medium"
                  style={{
                    background: 'linear-gradient(to bottom, #515151, #b1b0b0)',
                    color: '#ffffff'
                  }}
                >
                  もどる
                </span>
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  onStart();
                }}
                className="w-[140px] h-12 rounded-lg transition-all hover:opacity-90 relative p-1"
                style={{
                  background: 'linear-gradient(to bottom, #00edfe, #015eea)'
                }}
              >
                <span 
                  className="flex items-center justify-center w-full h-full rounded-md font-noto-sans-jp font-medium"
                  style={{
                    background: 'linear-gradient(to bottom, #0960d8, #00f6ff)',
                    color: '#ffffff'
                  }}
                >
                  はじめる
                </span>
              </button>
            </div>
          </div>

          {/* 注意書き */}
          <div className="text-center text-xs lg:text-sm font-noto-sans-jp font-light space-y-1 mt-52" style={{ color: '#7d7d7d' }}>
            <p>※この診断は一度しか行えません。</p>
            <p>やり直しが必要な場合は、こちらから管理者承認が必要となります</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
