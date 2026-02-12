'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { calculateRpgDiagnosis, type RpgAnswer, type InstinctLevels } from '@/lib/rpg/calculator';
import { getRpgQuestions, type RpgQuestion, type Profile } from '@/lib/api/client';
import { StartStep } from './StartStep';
import { QuestionStep } from './QuestionStep';
import { ResultStep } from './ResultStep';

interface RpgDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: Profile | null;  // プロフィール情報を受け取る
}

export const RpgDiagnosisModal: React.FC<RpgDiagnosisModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<RpgAnswer[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showStart, setShowStart] = useState(true);  // スタート画面表示フラグ
  const [questions, setQuestions] = useState<RpgQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 動画再生用のステート
  const [showVideo, setShowVideo] = useState(false);
  const [showWhiteOverlay, setShowWhiteOverlay] = useState(false);
  const [hideQuestion, setHideQuestion] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  
  // 性別選択用のステート
  const [showGenderSelect, setShowGenderSelect] = useState(false);
  const [gender, setGender] = useState<'男性' | '女性' | undefined>(undefined);

  // 診断完了済みかチェック
  const isCompleted = !!profile?.rpg_diagnosis_completed_at;

  // 完了済みの結果を取得
  const completedResult: InstinctLevels | null = isCompleted && profile ? {
    狩猟本能: profile.rpg_fencer || 1,
    共感本能: profile.rpg_healer || 1,
    飛躍本能: profile.rpg_schemer || 1,
    職人魂: profile.rpg_gunner || 1,
    防衛本能: profile.rpg_shielder || 1,
  } : null;

  // 質問データをAPIから取得
  useEffect(() => {
    if (isOpen && !isCompleted) {
      // 未完了の場合はスタート画面から開始
      loadQuestions();
      setShowResult(false);
      setShowStart(true);
      setShowGenderSelect(false);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setHideQuestion(false);
      setGender(undefined);
    } else if (isOpen && isCompleted) {
      // 完了済みの場合は結果表示モードに
      setShowResult(true);
      setShowStart(false);
      setShowGenderSelect(false);
      setIsLoading(false);
    } else if (!isOpen) {
      // モーダルが閉じられたときは、完了済みでない場合のみリセット
      if (!isCompleted) {
        setShowResult(false);
        setShowStart(true);
        setShowGenderSelect(false);
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setQuestions([]);
        setIsVideoLoaded(false);
        setHideQuestion(false);
        setGender(undefined);
      }
    }
  }, [isOpen, isCompleted]);

  // 動画のプリロード
  useEffect(() => {
    if (isOpen && !isCompleted && videoRef.current) {
      videoRef.current.load();
      
      // 動画の読み込み完了を検知
      const handleCanPlay = () => {
        setIsVideoLoaded(true);
      };
      
      videoRef.current.addEventListener('canplaythrough', handleCanPlay);
      
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('canplaythrough', handleCanPlay);
        }
      };
    }
  }, [isOpen, isCompleted]);

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
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-yellow-300 mx-auto mb-4 animate-spin" />
          <p className="text-white text-lg">質問を読み込んでいます...</p>
        </div>
      </div>
    );
  }

  // エラー表示
  if (error && questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <p className="text-red-300 text-lg mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all"
          >
            閉じる
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id)?.score || 3;

  // 回答を保存
  const handleAnswer = (score: number) => {
    const newAnswers = answers.filter(a => a.questionId !== currentQuestion.id);
    newAnswers.push({ questionId: currentQuestion.id, score });
    setAnswers(newAnswers);
  };

  // 次へ
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // 次の質問へ移動（ホワイトアウト → ホワイトイン演出）
      setShowWhiteOverlay(true);
      
      // ホワイトアウト開始
      setTimeout(() => {
        const overlay = document.getElementById('white-overlay');
        if (overlay) {
          overlay.style.opacity = '1';
        }
      }, 50);
      
      // ホワイトアウト完了後、質問を切り替えてホワイトイン
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        
        // 質問切り替え後、ホワイトイン開始
        setTimeout(() => {
          const overlay = document.getElementById('white-overlay');
          if (overlay) {
            overlay.style.opacity = '0';
          }
          
          // フェードアウト完了後、オーバーレイを削除
          setTimeout(() => {
            setShowWhiteOverlay(false);
          }, 500);
        }, 100);
      }, 600);
    } else {
      // 全問回答完了 → ホワイトアウト → 動画再生 → 結果表示
      setShowWhiteOverlay(true);
      
      // 少し遅らせてopacityを1にする
      setTimeout(() => {
        const overlay = document.getElementById('white-overlay');
        if (overlay) {
          overlay.style.opacity = '1';
        }
      }, 50);
      
      // ホワイトアウト完了まで待ってから動画再生
      setTimeout(() => {
        // ホワイトアウト完了後に質問画面を非表示
        setHideQuestion(true);
        
        // 完全に白くなったら動画再生開始
        setShowVideo(true);
        
        // 動画再生開始と同時にオーバーレイをフェードアウト開始
        setTimeout(() => {
          const overlay = document.getElementById('white-overlay');
          if (overlay) {
            overlay.style.opacity = '0';
          }
        }, 100);
        
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play().catch(err => {
              // 動画再生に失敗した場合は直接結果を表示
              setShowVideo(false);
              setShowResult(true);
              setShowWhiteOverlay(false);
            });
          }
        }, 100);
      }, 1500);
    }
  };

  // 動画再生終了時
  const handleVideoEnd = () => {
    setShowVideo(false);
    // 再度白い画面を表示
    setShowWhiteOverlay(true);
    
    // 白い画面を一瞬表示してからフェードイン開始
    setTimeout(() => {
      // 白いオーバーレイをopacity: 1にする
      const overlay = document.getElementById('white-overlay');
      if (overlay) {
        overlay.style.opacity = '1';
      }
    }, 50);
    
    setTimeout(() => {
      // 白いオーバーレイをフェードアウト開始
      const overlay = document.getElementById('white-overlay');
      if (overlay) {
        overlay.style.opacity = '0';
      }
      
      // フェードアウト開始と同時に結果を表示開始
      setTimeout(() => {
        setShowResult(true);
      }, 100);
      
      // フェードアウト完了後、オーバーレイを完全に削除
      setTimeout(() => {
        setShowWhiteOverlay(false);
      }, 1000);
    }, 500);
  };

  // 戻る
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      // 質問1の場合はスタート画面に戻る
      handleBackToStart();
    }
  };

  // スタート画面から性別選択へ
  const handleStart = () => {
    setShowStart(false);
    setShowGenderSelect(true);
  };

  // スタート画面に戻る
  const handleBackToStart = () => {
    setShowStart(true);
    setShowGenderSelect(false);
  };

  // やり直し（完了済みの場合は不可）
  const handleRetry = () => {
    if (isCompleted) return;
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResult(false);
    setShowStart(true);
    setShowGenderSelect(false);
    setHideQuestion(false);
    setGender(undefined);
  };

  // 性別選択後の処理
  const handleGenderSelect = (selectedGender: '男性' | '女性') => {
    setGender(selectedGender);
    setShowGenderSelect(false);
  };

  // モーダルを閉じる
  const handleClose = () => {
    // 完了済みの場合はリセットしない
    if (!isCompleted) {
      handleRetry();
    }
    onClose();
  };

  // 診断結果を計算（性別を含める）
  const result = showResult && gender ? calculateRpgDiagnosis(answers, gender) : null;

  return (
    <>
      {/* 動画要素（プリロード用 - 常に存在） */}
      <video
        ref={videoRef}
        className="hidden"
        onEnded={handleVideoEnd}
        playsInline
        preload="auto"
      >
        <source src="/rpg-characters/02.職業診断デザイン-アニメー演出 (1).mp4" type="video/mp4" />
      </video>

      {/* 動画再生中 */}
      {showVideo && (
        <div className="fixed inset-0 z-[10001] bg-black flex items-center justify-center">
          <video
            className="max-w-full max-h-full"
            src="/rpg-characters/02.職業診断デザイン-アニメー演出 (1).mp4"
            autoPlay
            playsInline
            onEnded={handleVideoEnd}
          />
        </div>
      )}

      {/* ホワイトアウトオーバーレイ */}
      {showWhiteOverlay && (
        <div
          id="white-overlay"
          className="fixed inset-0 bg-white transition-opacity duration-1000"
          style={{ 
            zIndex: showVideo ? 10002 : 10001,
            opacity: showResult ? 0 : 0
          }}
        />
      )}

      <div className="fixed inset-0 z-[9999] bg-white">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              {showResult ? 'RPG診断結果' : 'RPG診断'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="h-[calc(100vh-80px)] overflow-y-auto">
          <div className={`mx-auto p-8 ${showResult ? 'max-w-7xl' : (showStart || showGenderSelect) ? '' : 'max-w-2xl'}`}>
            {/* スタート画面 */}
            {showStart && !showResult && (
              <StartStep
                onStart={handleStart}
                onBack={onClose}
              />
            )}
            
            {/* 性別選択画面 */}
            {!showStart && showGenderSelect && !showResult && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">性別を選択してください</h3>
                  <p className="text-gray-600">診断結果の計算に使用します</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleGenderSelect('男性')}
                    className="p-8 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-bold text-xl transition-all transform hover:scale-105"
                  >
                    👨 男性
                  </button>
                  <button
                    onClick={() => handleGenderSelect('女性')}
                    className="p-8 bg-pink-600 hover:bg-pink-700 rounded-xl text-white font-bold text-xl transition-all transform hover:scale-105"
                  >
                    👩 女性
                  </button>
                </div>
              </div>
            )}

            {/* 質問画面：動画再生中または非表示フラグが立っている場合は表示しない */}
            {!showVideo && !showResult && !hideQuestion && !showStart && !showGenderSelect && (
              <QuestionStep
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                questionText={currentQuestion.text}
                currentAnswer={currentAnswer}
                onAnswer={handleAnswer}
                onNext={handleNext}
                onBack={handleBack}
                canGoNext={true}
                canGoBack={true}
              />
            )}

            {/* 結果表示 */}
            {!showVideo && showResult && (
              <ResultStep
                instinctLevels={completedResult || result?.instinctLevels || { 狩猟本能: 1, 共感本能: 1, 飛躍本能: 1, 職人魂: 1, 防衛本能: 1 }}
                onClose={handleClose}
                onRetry={handleRetry}
                onSave={() => {}}
                isCompleted={isCompleted}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
