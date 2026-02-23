'use client';

import React from 'react';

interface QuestionStepProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  currentAnswer: number | null;
  onAnswer: (score: number) => void;
  onNext: () => void;
  onBack: () => void;
  canGoNext: boolean;
  canGoBack: boolean;
  isSoundOn: boolean;
  setIsSoundOn: (value: boolean) => void;
  playClickSound: () => void;
}

export const QuestionStep: React.FC<QuestionStepProps> = ({
  questionNumber,
  totalQuestions,
  questionText,
  currentAnswer,
  onAnswer,
  onNext,
  onBack,
  canGoNext,
  canGoBack,
  isSoundOn,
  setIsSoundOn,
  playClickSound,
}) => {
  const scores = [1, 2, 3, 4, 5];
  const labels = ['まったく違う', '', '', '', 'まさにその通り'];

  // 質問番号を2桁にフォーマット (例: 1 -> 01, 15 -> 15)
  const formatQuestionNumber = (num: number) => num.toString().padStart(2, '0');
  
  // 質問画像のパスを取得（1-13の範囲内のみ）
  const getQuestionImagePath = (num: number) => {
    if (num >= 1 && num <= 13) {
      return `/tarot-question/Question_${formatQuestionNumber(num)}.png`;
    }
    return null;
  };

  return (
    <div className="space-y-0">
      {/* 質問番号表示（上部） */}
      <div className="text-center mb-8">
        <p className="text-base font-noto-sans-jp font-light" style={{ color: '#7d7d7d' }}>
          質問{formatQuestionNumber(questionNumber)}
        </p>
      </div>

      {/* 質問セクション全体（背景色付き） - 固定幅 */}
      <div className="w-full mx-auto" style={{ backgroundColor: '#52333f', maxWidth: '1050px' }}>
        {/* 質問文 */}
        <div className="text-center px-6" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
          <div className="flex items-center justify-center w-full" style={{ gap: 'calc(var(--spacing) * 8)' }}>
            {getQuestionImagePath(questionNumber) && (
              <img 
                src={getQuestionImagePath(questionNumber)!} 
                alt={`質問${questionNumber}アイコン`} 
                className="w-40 h-40 lg:w-48 lg:h-48 object-contain flex-shrink-0"
              />
            )}
            <h3 className="text-2xl text-white whitespace-nowrap font-noto-sans-jp font-bold">
              {questionText}
            </h3>
          </div>
        </div>

        {/* 回答選択肢 */}
        <div className="w-full px-8" style={{ paddingBottom: '60px' }}>
        {/* ボタンとラベル */}
        <div className="flex flex-col gap-4">
          {/* 中央: 数字とボタン */}
          <div className="flex flex-col items-center gap-2">
            {/* スケールラベル（数字） - ボタンと同じ幅のコンテナに配置 */}
            <div className="flex justify-center items-center w-full" style={{ gap: 'calc(var(--spacing) * 18)' }}>
              {/* PC時: 左スペーサー（左ラベルと同じ幅） */}
              <span className="hidden md:block text-2xl flex-shrink-0 opacity-0 font-noto-sans-jp font-light">{labels[0]}</span>
              
              {/* 数字 */}
              <div className="flex justify-center items-center text-base text-white" style={{ gap: 'clamp(1rem, calc(var(--spacing) * 15), calc(var(--spacing) * 16))' }}>
                {scores.map((score) => (
                  <span key={score} className="w-6 text-center flex items-center justify-center h-6">
                    {score}
                  </span>
                ))}
              </div>
              
              {/* PC時: 右スペーサー（右ラベルと同じ幅） */}
              <span className="hidden md:block text-2xl flex-shrink-0 opacity-0 font-noto-sans-jp font-light">{labels[4]}</span>
            </div>

            {/* ボタンと左右ラベル（PC時） */}
            <div className="flex justify-center items-center w-full" style={{ gap: 'calc(var(--spacing) * 18)' }}>
              {/* PC時: 左ラベル */}
              <span className="hidden md:block text-2xl text-white flex-shrink-0 font-noto-sans-jp font-light">{labels[0]}</span>

              {/* ボタン */}
              <div className="flex justify-center items-center flex-nowrap" style={{ gap: 'clamp(1rem, calc(var(--spacing) * 15), calc(var(--spacing) * 16))' }}>
                {scores.map((score) => (
                  <button
                    key={score}
                    onClick={() => onAnswer(score)}
                    className={`
                      w-6 h-6 rounded-full transition-all border-2 flex items-center justify-center
                      ${
                        currentAnswer === score
                          ? 'border-white'
                          : 'bg-transparent border-white hover:bg-white/20'
                      }
                    `}
                  >
                    {currentAnswer === score && (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="w-4 h-4 text-white"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              {/* PC時: 右ラベル */}
              <span className="hidden md:block text-2xl text-white flex-shrink-0 font-noto-sans-jp font-light">{labels[4]}</span>
            </div>
          </div>
        </div>

        {/* SP時: テキストラベル */}
        <div className="flex md:hidden justify-between text-xl text-white font-noto-sans-jp font-light">
          <span>{labels[0]}</span>
          <span>{labels[4]}</span>
        </div>
      </div>
      {/* 質問セクション全体の終了 */}
      </div>

      {/* ナビゲーションボタン */}
      <div className="flex justify-center pt-8" style={{ gap: 'calc(var(--spacing) * 70)' }}>
        <button
          onClick={() => {
            playClickSound();
            onBack();
          }}
          disabled={!canGoBack}
          className="w-[140px] h-12 rounded-lg transition-all hover:opacity-90 relative p-1"
          style={{
            background: canGoBack 
              ? 'linear-gradient(to bottom, #d4cfc9, #686c6f)'
              : 'linear-gradient(to bottom, #d4cfc9, #686c6f)',
            opacity: canGoBack ? 1 : 0.5,
            cursor: canGoBack ? 'pointer' : 'not-allowed'
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
            // 最後の質問でない場合のみ効果音を再生
            if (questionNumber !== totalQuestions) {
              playClickSound();
            }
            onNext();
          }}
          disabled={!canGoNext}
          className="w-[140px] h-12 rounded-lg transition-all hover:opacity-90 relative p-1"
          style={{
            background: canGoNext
              ? 'linear-gradient(to bottom, #00edfe, #015eea)'
              : 'linear-gradient(to bottom, #d4cfc9, #686c6f)',
            opacity: canGoNext ? 1 : 0.5,
            cursor: canGoNext ? 'pointer' : 'not-allowed'
          }}
        >
          <span 
            className="flex items-center justify-center w-full h-full rounded-md font-noto-sans-jp font-medium"
            style={{
              background: canGoNext
                ? 'linear-gradient(to bottom, #0960d8, #00f6ff)'
                : 'linear-gradient(to bottom, #515151, #b1b0b0)',
              color: '#ffffff'
            }}
          >
            {questionNumber === totalQuestions ? '結果を見る' : '次へ'}
          </span>
        </button>
      </div>

      {/* 質問番号表示 */}
      <div className="text-center pt-8">
        <p className="text-lg font-noto-sans-jp font-light" style={{ color: '#7d7d7d' }}>
          {formatQuestionNumber(questionNumber)}/{formatQuestionNumber(totalQuestions)}
        </p>
      </div>
    </div>
  );
};
