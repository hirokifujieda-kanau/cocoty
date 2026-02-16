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

  // 音声再生用のヘルパー関数
  const playSound = (soundPath: string) => {
    const audio = new Audio(soundPath);
    audio.play().catch(() => {
      // 音声再生エラーは無視
    });
  };

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

  // 質問1は性別選択なので、currentQuestionIndexが0の場合はnullを返す
  const currentQuestion = currentQuestionIndex === 0 ? null : questions[currentQuestionIndex - 1];
  const currentAnswer = currentQuestion ? (answers.find(a => a.questionId === currentQuestion.id)?.score || 3) : 3;

  // 回答を保存
  const handleAnswer = (score: number) => {
    if (!currentQuestion) return;
    const newAnswers = answers.filter(a => a.questionId !== currentQuestion.id);
    newAnswers.push({ questionId: currentQuestion.id, score });
    setAnswers(newAnswers);
  };

  // 次へ
  const handleNext = () => {
    // 質問1（性別選択）+ questions.length なので、最後は questions.length
    if (currentQuestionIndex < questions.length) {
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
      // 診断結果へボタン音を再生
      playSound('/rpg-characters/診断結果へボタン音.mp3');
      
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
            // 動画の終了少し前に音声を再生
            videoRef.current.addEventListener('timeupdate', function checkTime() {
              if (videoRef.current && videoRef.current.duration - videoRef.current.currentTime < 1.0) {
                playSound('/rpg-characters/演出から診断結果表示.mp3');
                videoRef.current.removeEventListener('timeupdate', checkTime);
              }
            });
            
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
      }, 2000); // 1000ms → 2000ms にしてゆっくりに
    }, 1000); // 500ms → 1000ms にしてゆっくりに
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

  // スタート画面から質問1（性別選択）へ
  const handleStart = () => {
    setShowStart(false);
    setShowGenderSelect(false);
    setCurrentQuestionIndex(0); // 質問1から開始
  };

  // スタート画面に戻る
  const handleBackToStart = () => {
    setShowStart(true);
    setShowGenderSelect(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setGender(undefined);
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
        <source src="/rpg-characters/RPG職業診断アニメ演出 リサイズ版イエロー.mp4" type="video/mp4" />
      </video>

      {/* 動画再生中 */}
      {showVideo && (
        <div className="fixed inset-0 z-[10001] bg-black flex items-center justify-center">
          <video
            className="w-full h-full object-cover"
            src="/rpg-characters/RPG職業診断アニメ演出 リサイズ版イエロー.mp4"
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
        {/* コンテンツ */}
        <div className="h-screen overflow-y-auto flex items-center justify-center">
          <div className={`mx-auto p-8 ${showResult ? 'max-w-7xl' : ''}`}>
            {/* スタート画面 */}
            {showStart && !showResult && (
              <StartStep
                onStart={handleStart}
                onBack={onClose}
              />
            )}

            {/* 質問画面：動画再生中または非表示フラグが立っている場合は表示しない */}
            {!showVideo && !showResult && !hideQuestion && !showStart && !showGenderSelect && (
              <>
                {currentQuestionIndex === 0 ? (
                  /* 質問1: 性別選択 */
                  <div className="space-y-0">
                    {/* 質問番号表示（上部） */}
                    <div className="text-center mb-8">
                      <p className="text-black text-lg font-semibold">
                        質問01
                      </p>
                    </div>

                    {/* 質問セクション全体（背景色付き） */}
                    <div className="w-full max-w-3xl mx-auto" style={{ backgroundColor: '#6d4040' }}>
                      {/* 質問文 */}
                      <div className="text-center pt-12 pb-6 px-6">
                        <div className="flex items-center justify-center w-full" style={{ gap: 'calc(var(--spacing) * 4)', paddingInline: 'calc(var(--spacing) * 24)' }}>
                          <img 
                            src="/tarot-question/Question_01.png" 
                            alt="質問アイコン" 
                            className="w-24 h-24 lg:w-32 lg:h-32 object-contain flex-shrink-0"
                          />
                          <h3 className="text-lg font-bold text-white flex-1 whitespace-nowrap">
                            性別を選択してください
                          </h3>
                          {/* 右側のスペーサー（画像と同じサイズ） */}
                          <div className="w-24 h-24 lg:w-32 lg:h-32 flex-shrink-0 opacity-0" aria-hidden="true"></div>
                        </div>
                      </div>

                      {/* 性別選択 */}
                      <div className="space-y-4 pb-6 w-full px-8">
                      {/* ボタンとラベル */}
                      <div className="flex flex-col gap-4">
                        {/* 中央: 数字とボタン */}
                        <div className="flex flex-col items-center gap-2">
                          {/* スケールラベル（数字） - ボタンと同じ幅のコンテナに配置 */}
                          <div className="flex justify-center items-center w-full" style={{ gap: 'calc(var(--spacing) * 12)' }}>
                            {/* PC時: 左スペーサー（左ラベルと同じ幅） */}
                            <span className="hidden md:block text-xs flex-shrink-0 opacity-0 font-noto-sans-jp">男</span>
                            
                            {/* 数字 */}
                            <div className="flex justify-center items-center text-xs text-white" style={{ gap: 'clamp(8rem, calc(var(--spacing) * 40), calc(var(--spacing) * 50))' }}>
                              <span className="w-6 text-center">1</span>
                              <span className="w-6 text-center">2</span>
                            </div>
                            
                            {/* PC時: 右スペーサー（右ラベルと同じ幅） */}
                            <span className="hidden md:block text-xs flex-shrink-0 opacity-0 font-noto-sans-jp">女</span>
                          </div>

                          {/* ボタンと左右ラベル（PC時） */}
                          <div className="flex justify-center items-center w-full" style={{ gap: 'calc(var(--spacing) * 12)' }}>
                            {/* PC時: 左ラベル */}
                            <span className="hidden md:block text-sm text-white flex-shrink-0 font-noto-sans-jp">男</span>

                            {/* ボタン */}
                            <div className="flex justify-center items-center flex-nowrap" style={{ gap: 'clamp(8rem, calc(var(--spacing) * 40), calc(var(--spacing) * 50))' }}>
                            {/* 男性ボタン */}
                            <button
                              onClick={() => setGender('男性')}
                              className={`
                                w-6 h-6 rounded-full transition-all border-2 flex items-center justify-center
                                ${
                                  gender === '男性'
                                    ? 'border-white'
                                    : 'bg-transparent border-white hover:bg-white/20'
                                }
                              `}
                            >
                              {gender === '男性' && (
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

                            {/* 女性ボタン */}
                            <button
                              onClick={() => setGender('女性')}
                              className={`
                                w-6 h-6 rounded-full transition-all border-2 flex items-center justify-center
                                ${
                                  gender === '女性'
                                    ? 'border-white'
                                    : 'bg-transparent border-white hover:bg-white/20'
                                }
                              `}
                            >
                              {gender === '女性' && (
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
                            </div>

                            {/* PC時: 右ラベル */}
                            <span className="hidden md:block text-sm text-white flex-shrink-0 font-noto-sans-jp">女</span>
                          </div>
                        </div>
                      </div>

                      {/* SP時: テキストラベル */}
                      <div className="flex md:hidden justify-between text-sm text-white">
                        <span className="font-noto-sans-jp">男</span>
                        <span className="font-noto-sans-jp">女</span>
                      </div>
                      </div>
                    </div>

                    {/* ナビゲーションボタン */}
                    <div className="flex justify-center pt-8" style={{ gap: 'calc(var(--spacing) * 33)' }}>
                      <button
                        onClick={handleBackToStart}
                        className="w-[140px] h-12 rounded-lg font-semibold transition-all text-white border"
                        style={{
                          background: 'linear-gradient(180deg, #6B7280 0%, #4B5563 100%)',
                          borderColor: '#9CA3AF',
                          boxShadow: '0px 4px 0px 0px #374151',
                          cursor: 'pointer'
                        }}
                      >
                        もどる
                      </button>
                      <button
                        onClick={() => {
                          if (gender) {
                            // ホワイトアウト → ホワイトイン演出
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
                              setCurrentQuestionIndex(1);
                              
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
                          }
                        }}
                        disabled={!gender}
                        className="w-[140px] h-12 rounded-lg font-semibold transition-all text-white border"
                        style={{
                          background: gender
                            ? 'linear-gradient(180deg, #22D3EE 0%, #0891B2 100%)'
                            : 'linear-gradient(180deg, #6B7280 0%, #4B5563 100%)',
                          borderColor: gender ? '#67E8F9' : '#6B7280',
                          boxShadow: '0px 4px 0px 0px #164E63',
                          opacity: gender ? 1 : 0.5,
                          cursor: gender ? 'pointer' : 'not-allowed'
                        }}
                      >
                        次へ
                      </button>
                    </div>

                    {/* 質問番号表示 */}
                    <div className="text-center pt-4">
                      <p className="text-black text-sm">
                        01/{(questions.length + 1).toString().padStart(2, '0')}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* 質問2以降: 通常の質問 */
                  <QuestionStep
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={questions.length + 1}
                    questionText={currentQuestion!.text}
                    currentAnswer={currentAnswer}
                    onAnswer={handleAnswer}
                    onNext={handleNext}
                    onBack={handleBack}
                    canGoNext={true}
                    canGoBack={true}
                  />
                )}
              </>
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
