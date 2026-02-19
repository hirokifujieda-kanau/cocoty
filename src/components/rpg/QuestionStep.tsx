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
        <p className="text-sm font-noto-sans-jp font-light" style={{ color: '#7d7d7d' }}>
          質問{formatQuestionNumber(questionNumber)}
        </p>
      </div>

      {/* 質問セクション全体（背景色付き） */}
      <div className="w-full max-w-3xl mx-auto" style={{ backgroundColor: '#52333f' }}>
        {/* 質問文 */}
        <div className="text-center pt-12 pb-6 px-6">
          <div className="flex items-center justify-center w-full" style={{ gap: 'calc(var(--spacing) * 4)', paddingInline: 'calc(var(--spacing) * 24)' }}>
            {getQuestionImagePath(questionNumber) && (
              <img 
                src={getQuestionImagePath(questionNumber)!} 
                alt={`質問${questionNumber}アイコン`} 
                className="w-24 h-24 lg:w-32 lg:h-32 object-contain flex-shrink-0"
              />
            )}
            <h3 className="text-lg text-white flex-1 whitespace-nowrap font-noto-sans-jp font-medium">
              {questionText}
            </h3>
            {/* 右側のスペーサー（画像と同じサイズ） */}
            {getQuestionImagePath(questionNumber) && (
              <div className="w-24 h-24 lg:w-32 lg:h-32 flex-shrink-0 opacity-0" aria-hidden="true"></div>
            )}
          </div>
        </div>

        {/* 回答選択肢 */}
        <div className="space-y-4 pb-6 w-full px-8">
        {/* ボタンとラベル */}
        <div className="flex flex-col gap-4">
          {/* 中央: 数字とボタン */}
          <div className="flex flex-col items-center gap-2">
            {/* スケールラベル（数字） - ボタンと同じ幅のコンテナに配置 */}
            <div className="flex justify-center items-center w-full" style={{ gap: 'calc(var(--spacing) * 18)' }}>
              {/* PC時: 左スペーサー（左ラベルと同じ幅） */}
              <span className="hidden md:block text-xs flex-shrink-0 opacity-0">{labels[0]}</span>
              
              {/* 数字 */}
              <div className="flex justify-center items-center text-xs text-white" style={{ gap: 'clamp(1rem, calc(var(--spacing) * 11), calc(var(--spacing) * 12))' }}>
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
            <div className="flex justify-center items-center w-full" style={{ gap: 'calc(var(--spacing) * 18)' }}>
              {/* PC時: 左ラベル */}
              <span className="hidden md:block text-sm text-white flex-shrink-0 font-noto-sans-jp font-light">{labels[0]}</span>

              {/* ボタン */}
              <div className="flex justify-center items-center flex-nowrap" style={{ gap: 'clamp(1rem, calc(var(--spacing) * 11), calc(var(--spacing) * 12))' }}>
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
              <span className="hidden md:block text-sm text-white flex-shrink-0 font-noto-sans-jp font-light">{labels[4]}</span>
            </div>
          </div>
        </div>

        {/* SP時: テキストラベル */}
        <div className="flex md:hidden justify-between text-sm text-white font-noto-sans-jp font-light">
          <span>{labels[0]}</span>
          <span>{labels[4]}</span>
        </div>
      </div>
      {/* 質問セクション全体の終了 */}
      </div>

      {/* ナビゲーションボタン */}
      <div className="flex justify-center pt-8" style={{ gap: 'calc(var(--spacing) * 33)' }}>
        <button
          onClick={onBack}
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
          onClick={onNext}
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
      <div className="text-center pt-4">
        <p className="text-black text-sm">
          {formatQuestionNumber(questionNumber)}/{formatQuestionNumber(totalQuestions)}
        </p>
      </div>
    </div>
  );
};
