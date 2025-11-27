'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { Survey, getSurveyById, answerSurvey, getSurveyResults, hasUserAnswered } from '@/lib/mock/mockSocialData';
import { useAuth } from '@/context/AuthContext';

interface SurveyAnswerModalProps {
  surveyId: string;
  isOpen: boolean;
  onClose: () => void;
}

const SurveyAnswerModal: React.FC<SurveyAnswerModalProps> = ({ surveyId, isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string }>({});
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (isOpen && surveyId && currentUser) {
      const surveyData = getSurveyById(surveyId);
      setSurvey(surveyData);
      setHasAnswered(surveyData ? hasUserAnswered(surveyId, currentUser.id) : false);
      setShowResults(surveyData ? hasUserAnswered(surveyId, currentUser.id) : false);
    }
  }, [isOpen, surveyId, currentUser]);

  const handleSelectAnswer = (questionId: string, option: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmit = () => {
    if (!survey || !currentUser) return;

    let allAnswered = true;
    survey.questions.forEach(question => {
      const answer = selectedAnswers[question.id];
      if (answer) {
        answerSurvey(survey.id, question.id, answer, currentUser.id);
      } else {
        allAnswered = false;
      }
    });

    if (allAnswered) {
      setHasAnswered(true);
      setShowResults(true);
      // アンケート情報を再取得
      const updatedSurvey = getSurveyById(survey.id);
      setSurvey(updatedSurvey);
    } else {
      alert('すべての質問に回答してください');
    }
  };

  const getResults = (questionId: string) => {
    if (!survey) return {};
    return getSurveyResults(survey.id, questionId);
  };

  const getTotalVotes = (questionId: string) => {
    const results = getResults(questionId);
    return Object.values(results).reduce((sum, count) => sum + count, 0);
  };

  const getPercentage = (questionId: string, option: string) => {
    const results = getResults(questionId);
    const total = getTotalVotes(questionId);
    if (total === 0) return 0;
    return Math.round(((results[option] || 0) / total) * 100);
  };

  if (!isOpen || !survey) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex-1 pr-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{survey.title}</h2>
            <p className="text-sm text-gray-500">{survey.community}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6 space-y-6">
          {/* 説明 */}
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-gray-700">{survey.description}</p>
          </div>

          {/* 質問 */}
          {survey.questions.map((question, qIndex) => (
            <div key={question.id} className="space-y-3">
              <h3 className="font-semibold text-gray-900">
                質問 {qIndex + 1}: {question.text}
              </h3>

              {!showResults ? (
                /* 回答フォーム */
                <div className="space-y-2">
                  {question.options?.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSelectAnswer(question.id, option)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedAnswers[question.id] === option
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option}</span>
                        {selectedAnswers[question.id] === option && (
                          <CheckCircle2 className="h-5 w-5 text-purple-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                /* 結果表示 */
                <div className="space-y-3">
                  {question.options?.map((option) => {
                    const percentage = getPercentage(question.id, option);
                    const voteCount = getResults(question.id)[option] || 0;
                    const isUserChoice = selectedAnswers[question.id] === option;

                    return (
                      <div
                        key={option}
                        className={`p-4 rounded-lg border-2 ${
                          isUserChoice
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{option}</span>
                            {isUserChoice && (
                              <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">
                                あなたの回答
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-semibold text-gray-700">
                            {percentage}% ({voteCount}票)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <p className="text-sm text-gray-500 text-center mt-4">
                    総投票数: {getTotalVotes(question.id)}票
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* フッター */}
        {!showResults && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleSubmit}
                disabled={Object.keys(selectedAnswers).length === 0}
                className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
              >
                回答を送信
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyAnswerModal;
