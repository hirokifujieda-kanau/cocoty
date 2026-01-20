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

  return (
    <div className="space-y-8">
      {/* 進捗表示 */}
      <div className="text-center">
        <p className="text-purple-200 text-sm mb-2">
          質問 {questionNumber} / {totalQuestions}
        </p>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* 質問文 */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">
          {questionText}
        </h3>
        <p className="text-purple-200 text-sm">
          考え過ぎずに直感で回答してください
        </p>
      </div>

      {/* 回答選択肢 */}
      <div className="space-y-4">
        <div className="flex justify-between text-xs text-purple-200 mb-2">
          <span>{labels[0]}</span>
          <span>{labels[4]}</span>
        </div>

        <div className="flex gap-3 justify-center">
          {scores.map((score) => (
            <button
              key={score}
              onClick={() => onAnswer(score)}
              className={`
                w-16 h-16 rounded-full font-bold text-lg transition-all
                ${
                  currentAnswer === score
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white scale-110 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }
              `}
            >
              {score}
            </button>
          ))}
        </div>

        {/* スケールラベル */}
        <div className="flex justify-between text-xs text-purple-300 px-2">
          {scores.map((score) => (
            <span key={score} className="w-16 text-center">
              {score}
            </span>
          ))}
        </div>
      </div>

      {/* ナビゲーションボタン */}
      <div className="flex gap-4 pt-8">
        {canGoBack && (
          <button
            onClick={onBack}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
          >
            ← 戻る
          </button>
        )}
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`
            flex-1 px-6 py-3 rounded-xl font-semibold transition-all
            ${
              canGoNext
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {questionNumber === totalQuestions ? '結果を見る →' : '次へ →'}
        </button>
      </div>
    </div>
  );
};
