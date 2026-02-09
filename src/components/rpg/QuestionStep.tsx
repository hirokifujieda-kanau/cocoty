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
}) => {
  const scores = [1, 2, 3, 4, 5];
  const labels = ['まったく違う', '', '', '', 'まさにその通り'];
  
  // 質問番号を2桁にフォーマット (例: 1 -> 01, 15 -> 15)
  const formatQuestionNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="space-y-0">
      {/* 質問番号表示（上部） */}
      <div className="text-center mb-8">
        <p className="text-black text-lg font-semibold">
          質問{formatQuestionNumber(questionNumber)}
        </p>
      </div>

      {/* 質問文 */}
      <div className="text-center pt-12 pb-6 px-6" style={{ backgroundColor: '#6d4040' }}>
        <h3 className="text-lg font-bold text-white">
          {questionText}
        </h3>
      </div>

      {/* 回答選択肢 */}
      <div className="space-y-4 p-6" style={{ backgroundColor: '#6d4040' }}>
        {/* ボタンとラベル */}
        <div className="flex flex-col gap-4">
          {/* 中央: 数字とボタン */}
          <div className="flex flex-col items-center gap-2">
            {/* スケールラベル（数字） - ボタンと同じ幅のコンテナに配置 */}
            <div className="flex justify-center items-center w-full" style={{ gap: 'calc(var(--spacing) * 12)' }}>
              {/* PC時: 左スペーサー（左ラベルと同じ幅） */}
              <span className="hidden md:block text-xs flex-shrink-0 opacity-0">{labels[0]}</span>
              
              {/* 数字 */}
              <div className="flex justify-center items-center text-xs text-white" style={{ gap: 'clamp(1rem, calc(var(--spacing) * 8), calc(var(--spacing) * 12))' }}>
                {scores.map((score) => (
                  <span key={score} className="w-6 text-center">
                    {score}
                  </span>
                ))}
              </div>
              
              {/* PC時: 右スペーサー（右ラベルと同じ幅） */}
              <span className="hidden md:block text-xs flex-shrink-0 opacity-0">{labels[4]}</span>
            </div>

            {/* ボタンと左右ラベル（PC時） */}
            <div className="flex justify-center items-center w-full" style={{ gap: 'calc(var(--spacing) * 12)' }}>
              {/* PC時: 左ラベル */}
              <span className="hidden md:block text-xs text-white flex-shrink-0">{labels[0]}</span>

              {/* ボタン */}
              <div className="flex justify-center items-center flex-nowrap" style={{ gap: 'clamp(1rem, calc(var(--spacing) * 8), calc(var(--spacing) * 12))' }}>
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
              <span className="hidden md:block text-xs text-white flex-shrink-0">{labels[4]}</span>
            </div>
          </div>
        </div>

        {/* SP時: テキストラベル */}
        <div className="flex md:hidden justify-between text-xs text-white">
          <span>{labels[0]}</span>
          <span>{labels[4]}</span>
        </div>
      </div>

      {/* ナビゲーションボタン */}
      <div className="flex justify-center pt-8" style={{ gap: 'calc(var(--spacing) * 33)' }}>
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className="w-[140px] h-12 rounded-lg font-semibold transition-all text-white border"
          style={{
            background: canGoBack 
              ? 'linear-gradient(180deg, #6B7280 0%, #4B5563 100%)'
              : 'linear-gradient(180deg, #9CA3AF 0%, #6B7280 100%)',
            borderColor: canGoBack ? '#9CA3AF' : '#6B7280',
            boxShadow: '0px 4px 0px 0px #374151',
            opacity: canGoBack ? 1 : 0.5,
            cursor: canGoBack ? 'pointer' : 'not-allowed'
          }}
        >
          もどる
        </button>
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className="w-[140px] h-12 rounded-lg font-semibold transition-all text-white border"
          style={{
            background: canGoNext
              ? 'linear-gradient(180deg, #22D3EE 0%, #0891B2 100%)'
              : 'linear-gradient(180deg, #6B7280 0%, #4B5563 100%)',
            borderColor: canGoNext ? '#67E8F9' : '#6B7280',
            boxShadow: '0px 4px 0px 0px #164E63',
            opacity: canGoNext ? 1 : 0.5,
            cursor: canGoNext ? 'pointer' : 'not-allowed'
          }}
        >
          {questionNumber === totalQuestions ? '結果を見る' : '次へ'}
        </button>
      </div>

      {/* 質問番号表示 */}
      <div className="text-center pt-4">
        <p className="text-black text-sm">
          {formatQuestionNumber(questionNumber)}/{formatQuestionNumber(totalQuestions)}
        </p>
      </div>
    </div>
  );
};
