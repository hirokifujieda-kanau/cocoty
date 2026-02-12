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
  const [hideQuestion, setHideQuestion] = useState(false);  // ホワイトアウト完了後に質問を非表示
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // 診断完了済みかチェック
  const isCompleted = !!profile?.rpg_diagnosis_completed_at;

  // 完了済みの結果を取得
  const completedResult: InstinctLevels | null = isCompleted && profile ? {
    狩猟本能: profile.rpg_fencer || 1,
    共感本能: profile.rpg_healer || 1,
    飛躍本能: profile.rpg_schemer || 1,
    職人魂: profile.rpg_gunner || 1,
    警戒本能: profile.rpg_shielder || 1,
  } : null;

  // デバッグログ
  useEffect(() => {
    console.log('🔍 RpgDiagnosisModal - Profile:', {
      profile,
      isCompleted,
      rpg_diagnosis_completed_at: profile?.rpg_diagnosis_completed_at,
      completedResult,
    });
  }, [profile, isCompleted, completedResult]);

  // 質問データをAPIから取得
  useEffect(() => {
    console.log('🔍 RpgDiagnosisModal - useEffect:', { 
      isOpen, 
      isCompleted, 
      showResult,
      hasCompletedResult: !!completedResult,
      completedResult 
    });
    if (isOpen && !isCompleted) {
      // 未完了の場合は質問を読み込む
      console.log('📝 未完了 → 質問を読み込みます');
      loadQuestions();
      setShowResult(false);
      setShowStart(true);  // スタート画面を表示
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setHideQuestion(false);
    } else if (isOpen && isCompleted) {
      // 完了済みの場合は結果表示モードに
      console.log('✅ 完了済み → 結果を表示します', { completedResult });
      setShowResult(true);
      setShowStart(false);
      setIsLoading(false);
    } else if (!isOpen) {
      // モーダルが閉じられたときは、完了済みでない場合のみリセット
      if (!isCompleted) {
        setShowResult(false);
        setShowStart(true);
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setQuestions([]);
        setIsVideoLoaded(false);
        setHideQuestion(false);
      }
    }
  }, [isOpen, isCompleted]);

  // 動画のプリロード
  useEffect(() => {
    if (isOpen && !isCompleted && videoRef.current) {
      console.log('🎬 動画のプリロード開始');
      videoRef.current.load();
      
      // 動画の読み込み完了を検知
      const handleCanPlay = () => {
        console.log('✅ 動画のプリロード完了');
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
      console.log('📄 次の質問へ - ホワイトアウト開始');
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
          }, 500); // duration-500
        }, 100);
      }, 600); // ホワイトアウト表示時間
    } else {
      // 全問回答完了 → ホワイトアウト → 動画再生 → 結果表示
      console.log('🎬 ホワイトアウト開始');
      // 1. 質問15の画面を徐々に白くフェードアウト
      setShowWhiteOverlay(true);
      
      // 少し遅らせてopacityを1にする（フェードイン効果）
      setTimeout(() => {
        const overlay = document.getElementById('white-overlay');
        if (overlay) {
          overlay.style.opacity = '1';
        }
      }, 50);
      
      // ホワイトアウト完了まで待ってから動画再生
      setTimeout(() => {
        console.log('🎬 ホワイトアウト完了 - 質問画面を非表示に');
        // ホワイトアウト完了後に質問画面を非表示
        setHideQuestion(true);
        
        console.log('🎬 動画再生開始');
        // 2. 完全に白くなったら動画再生開始
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
            console.log('🎬 動画要素が存在します');
            videoRef.current.play().catch(err => {
              console.error('❌ 動画の再生に失敗:', err);
              // 動画再生に失敗した場合は直接結果を表示
              setShowVideo(false);
              setShowResult(true);
              setShowWhiteOverlay(false);
            });
          } else {
            console.error('❌ 動画要素が見つかりません');
          }
        }, 100);
      }, 1500); // ホワイトアウトを1500ms表示（より長く、しっかり見せる）
    }
  };

  // 動画再生終了時
  const handleVideoEnd = () => {
    console.log('🎬 動画再生終了');
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
      
      // フェードアウト開始と同時に結果を表示開始（白い画面から徐々に現れる）
      setTimeout(() => {
        setShowResult(true);
      }, 100);
      
      // フェードアウト完了後、オーバーレイを完全に削除
      setTimeout(() => {
        setShowWhiteOverlay(false);
        console.log('🎬 ホワイトオーバーレイを削除しました');
      }, 1000); // transition-opacity duration-1000と同じ時間
    }, 500); // 白い画面を少し長めに表示してからフェードアウト開始
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

  // スタート画面から診断開始
  const handleStart = () => {
    setShowStart(false);
  };

  // スタート画面に戻る
  const handleBackToStart = () => {
    setShowStart(true);
  };

  // やり直し（完了済みの場合は不可）
  const handleRetry = () => {
    if (isCompleted) return; // 完了済みはやり直し不可
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResult(false);
    setShowStart(true);  // スタート画面に戻る
    setHideQuestion(false);  // 質問を再表示
  };

  // モーダルを閉じる
  const handleClose = () => {
    // 完了済みの場合はリセットしない
    if (!isCompleted) {
      handleRetry();
    }
    onClose();
  };

  // 診断結果を計算
  const result = showResult ? calculateRpgDiagnosis(answers) : null;

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
            zIndex: showVideo ? 10002 : 10001,  // 常に質問画面の上に表示
            opacity: showResult ? 0 : 0  // 初期状態は0、JSで1にする
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
        <div className={`mx-auto p-8 ${showResult ? 'max-w-7xl' : showStart ? '' : 'max-w-2xl'}`}>
          {/* スタート画面 */}
          {showStart && !showResult ? (
            <StartStep
              onStart={handleStart}
              onBack={onClose}
            />
          ) : !showVideo && !showResult && !hideQuestion && !showStart ? (
            // 質問画面：動画再生中または非表示フラグが立っている場合は表示しない
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
          ) : !showVideo && showResult ? (
            // 結果表示: 完了済みの場合と新規診断の場合を統一
            <ResultStep
              instinctLevels={completedResult || result?.instinctLevels || { 狩猟本能: 1, 共感本能: 1, 飛躍本能: 1, 職人魂: 1, 警戒本能: 1 }}
              onClose={handleClose}
              onRetry={handleRetry}
              onSave={(saved) => {
                if (saved) {
                  console.log('RPG診断結果が保存されました');
                }
              }}
              isCompleted={isCompleted}  // 完了済みフラグで判定
            />
          ) : null}
        </div>
      </div>
      </div>
    </>
  );
};
