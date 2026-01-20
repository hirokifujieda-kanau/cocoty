'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { calculateRpgDiagnosis, type RpgAnswer } from '@/lib/rpg/calculator';
import { getRpgQuestions, type RpgQuestion } from '@/lib/api/client';
import { QuestionStep } from './QuestionStep';
import { ResultStep } from './ResultStep';

interface RpgDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RpgDiagnosisModal: React.FC<RpgDiagnosisModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<RpgAnswer[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState<RpgQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 質問データをAPIから取得
  useEffect(() => {
    if (isOpen) {
      loadQuestions();
    }
  }, [isOpen]);

  const loadQuestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getRpgQuestions();
      // orderでソート
      const sortedQuestions = response.questions.sort((a, b) => a.order - b.order);
      setQuestions(sortedQuestions);
    } catch (err) {
      console.error('Failed to load RPG questions:', err);
      setError('質問の読み込みに失敗しました。ネットワーク接続を確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // ローディング中
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
        <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 rounded-2xl p-8 text-center">
          <Sparkles className="h-12 w-12 text-yellow-300 mx-auto mb-4 animate-spin" />
          <p className="text-white text-lg">質問を読み込んでいます...</p>
        </div>
      </div>
    );
  }

  // エラー表示
  if (error && questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
        <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 rounded-2xl p-8 text-center max-w-md">
          <p className="text-red-300 text-lg mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all"
          >
            閉じる
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id)?.score || null;

  // 回答を保存
  const handleAnswer = (score: number) => {
    const newAnswers = answers.filter(a => a.questionId !== currentQuestion.id);
    newAnswers.push({ questionId: currentQuestion.id, score });
    setAnswers(newAnswers);
  };

  // 次へ
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 全問回答完了 → 結果表示
      setShowResult(true);
    }
  };

  // 戻る
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // やり直し
  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResult(false);
  };

  // モーダルを閉じる
  const handleClose = () => {
    handleRetry();
    onClose();
  };

  // 診断結果を計算
  const result = showResult ? calculateRpgDiagnosis(answers) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 rounded-2xl shadow-2xl">
        {/* ヘッダー */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-gradient-to-r from-purple-800 to-indigo-800 border-b border-purple-600">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-yellow-300" />
            <h2 className="text-2xl font-bold text-white">
              {showResult ? 'RPG診断結果' : 'RPG診断'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-8">
          {!showResult ? (
            <QuestionStep
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              questionText={currentQuestion.text}
              currentAnswer={currentAnswer}
              onAnswer={handleAnswer}
              onNext={handleNext}
              onBack={handleBack}
              canGoNext={currentAnswer !== null}
              canGoBack={currentQuestionIndex > 0}
            />
          ) : result ? (
            <ResultStep
              instinctLevels={result.instinctLevels}
              onClose={handleClose}
              onRetry={handleRetry}
              onSave={(saved) => {
                if (saved) {
                  console.log('RPG診断結果が保存されました');
                }
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};
