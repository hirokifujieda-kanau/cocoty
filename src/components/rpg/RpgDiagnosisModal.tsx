'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { calculateRpgDiagnosis, type RpgAnswer, type InstinctLevels } from '@/lib/rpg/calculator';
import { type Profile } from '@/lib/api/client';
import { type RpgQuestion } from '@/lib/rpg/constants';
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
  
  // 音声制御用のステート
  const [isSoundOn, setIsSoundOn] = useState(true);
  const bgmRef = React.useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = React.useRef<HTMLAudioElement | null>(null);

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

  // BGMと効果音の初期化と再生制御
  useEffect(() => {
    // BGMの作成
    if (!bgmRef.current) {
      bgmRef.current = new Audio('/rpg-characters/質問中のBGM.mp3');
      bgmRef.current.loop = true;
      bgmRef.current.volume = 0.5;
    }

    // 効果音の作成
    if (!clickSoundRef.current) {
      clickSoundRef.current = new Audio('/rpg-characters/ボタンクリック音.mp3');
      clickSoundRef.current.volume = 0.7;
    }

    // BGMの再生/停止（性別選択画面または質問画面の場合のみ）
    if (isOpen && (showGenderSelect || (!showStart && !showResult)) && isSoundOn) {
      bgmRef.current.play().catch(() => {});
    } else {
      // 一時停止またはOFF時、結果画面表示時
      bgmRef.current.pause();
    }

    // クリーンアップ（モーダルを閉じた時のみリセット）
    return () => {
      if (bgmRef.current && !isOpen) {
        bgmRef.current.pause();
        bgmRef.current.currentTime = 0;
      }
    };
  }, [isOpen, showGenderSelect, showStart, showResult, isSoundOn]);

  // ボタンクリック時の効果音再生
  const playClickSound = () => {
    if (isSoundOn && clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {});
    }
  };

  // 質問データをフロントエンドから取得
  useEffect(() => {
    console.log('🎯 [RpgDiagnosis] useEffect triggered, isOpen:', isOpen, 'questions.length:', questions.length);
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
        console.log('🔒 [RpgDiagnosis] Modal closed, resetting state but keeping questions');
        setShowResult(false);
        setShowStart(true);
        setShowGenderSelect(false);
        setCurrentQuestionIndex(0);
        setAnswers([]);
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
    console.log('🔍 [RpgDiagnosis] Loading questions from frontend...');
    setIsLoading(true);
    setError(null);
    try {
      // フロントエンドの定数から質問を取得（APIリクエスト不要）
      const { RPG_QUESTIONS } = await import('@/lib/rpg/constants');
      console.log('✅ [RpgDiagnosis] Questions loaded:', RPG_QUESTIONS.length);
      setQuestions(RPG_QUESTIONS);
      console.log('✅ [RpgDiagnosis] Questions set:', RPG_QUESTIONS.length);
    } catch (err) {
      console.error('❌ [RpgDiagnosis] Failed to load RPG questions:', err);
      setError('質問の読み込みに失敗しました。');
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

  // 質問13は性別選択なので、currentQuestionIndexが12（questions.length）の場合はnullを返す
  const currentQuestion = currentQuestionIndex < questions.length ? questions[currentQuestionIndex] : null;
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
    // 通常質問12問 + 性別選択1問 = 13問
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
      // BGMを停止
      if (bgmRef.current) {
        bgmRef.current.pause();
      }
      
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
  // 戻る
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      // 質問1の場合はスタート画面に戻る
      handleBackToStart();
    }
  };

  // スタート画面から質問1へ
  const handleStart = () => {
    setShowStart(false);
    setShowGenderSelect(false);
    setCurrentQuestionIndex(0); // 質問1（通常質問）から開始
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
        {/* 音声ON/OFFボタン（結果画面以外で表示） */}
        {!showResult && !showVideo && (
          <div 
            className="fixed flex items-center gap-2 z-[10000]"
            style={{
              top: 'calc(var(--spacing) * 8)',
              right: 'calc(var(--spacing) * 64)'
            }}
          >
            {/* スピーカーアイコン */}
            <div className="w-8 h-8 flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 5L6 9H2v6h4l5 4V5z"
                  fill="#7d7d7d"
                  stroke="#7d7d7d"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {isSoundOn && (
                  <path
                    d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"
                    stroke="#7d7d7d"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            </div>
            
            {/* ON/OFFボタン */}
            <button
              onClick={() => setIsSoundOn(!isSoundOn)}
              className="flex items-center rounded-md font-noto-sans-jp font-medium px-3 py-1 transition-all border-2 border-[#a7a7a7] text-sm text-[#7d7d7d]"
            >
              {isSoundOn ? 'ON' : 'OFF'}
            </button>
          </div>
        )}

        {/* コンテンツ */}
        <div className="h-screen overflow-y-auto flex items-center justify-center">
          <div className={`mx-auto w-full ${showResult ? 'max-w-7xl' : ''}`}>
            {/* スタート画面 */}
            {showStart && !showResult && (
              <div className="p-8">
                <StartStep
                  onStart={handleStart}
                  onBack={onClose}
                  isSoundOn={isSoundOn}
                  playClickSound={playClickSound}
                />
              </div>
            )}

            {/* 質問画面：動画再生中または非表示フラグが立っている場合は表示しない */}
            {!showVideo && !showResult && !hideQuestion && !showStart && !showGenderSelect && (
              <>
                {currentQuestionIndex === questions.length ? (
                  /* 質問13: 性別選択 */
                  <div className="space-y-0">
                    {/* 質問番号表示（上部） */}
                    <div className="text-center mb-8">
                      <p className="text-base font-noto-sans-jp font-light" style={{ color: '#7d7d7d' }}>
                        質問13
                      </p>
                    </div>

                    {/* 質問セクション全体（背景色付き） - 固定幅 */}
                    <div className="w-full mx-auto" style={{ backgroundColor: '#52333f', maxWidth: '1050px' }}>
                      {/* 質問文 */}
                      <div className="text-center px-6" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
                        <div className="flex items-center justify-center w-full" style={{ gap: 'calc(var(--spacing) * 8)' }}>
                          <img 
                            src="/tarot-question/Question_13.png" 
                            alt="質問アイコン" 
                            className="w-40 h-40 lg:w-48 lg:h-48 object-contain flex-shrink-0"
                          />
                          <h3 className="text-2xl text-white whitespace-nowrap font-noto-sans-jp font-medium">
                            性別を選択してください
                          </h3>
                        </div>
                      </div>

                      {/* 性別選択 */}
                      <div className="w-full px-8" style={{ paddingBottom: '60px' }}>
                      {/* ボタンとラベル */}
                      <div className="flex flex-col gap-4">
                        {/* 中央: 数字とボタン */}
                        <div className="flex flex-col items-center gap-2">
                          {/* スケールラベル（数字） - ボタンと同じ幅のコンテナに配置 */}
                          <div className="flex justify-center items-center w-full" style={{ gap: 'calc(var(--spacing) * 12)' }}>
                            {/* PC時: 左スペーサー（左ラベルと同じ幅） */}
                            <span className="hidden md:block text-base flex-shrink-0 opacity-0 font-noto-sans-jp">男</span>
                            
                            {/* 数字 */}
                            <div className="flex justify-center items-center text-base text-white" style={{ gap: 'clamp(8rem, calc(var(--spacing) * 40), calc(var(--spacing) * 50))' }}>
                              <span className="w-6 text-center">1</span>
                              <span className="w-6 text-center">2</span>
                            </div>
                            
                            {/* PC時: 右スペーサー（右ラベルと同じ幅） */}
                            <span className="hidden md:block text-base flex-shrink-0 opacity-0 font-noto-sans-jp">女</span>
                          </div>

                          {/* ボタンと左右ラベル（PC時） */}
                          <div className="flex justify-center items-center w-full" style={{ gap: 'calc(var(--spacing) * 12)' }}>
                            {/* PC時: 左ラベル */}
                            <span className="hidden md:block text-2xl text-white flex-shrink-0 font-noto-sans-jp font-light">男</span>

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
                            <span className="hidden md:block text-2xl text-white flex-shrink-0 font-noto-sans-jp font-light">女</span>
                          </div>
                        </div>
                      </div>

                      {/* SP時: テキストラベル */}
                      <div className="flex md:hidden justify-between text-xl text-white font-noto-sans-jp font-light">
                        <span className="font-noto-sans-jp">男</span>
                        <span className="font-noto-sans-jp">女</span>
                      </div>
                      </div>
                    </div>

                    {/* ナビゲーションボタン */}
                    <div className="relative w-full pt-8">
                      {/* 左寄せの「もどる」ボタン */}
                      <button
                        onClick={() => {
                          playClickSound();
                          handleBack();
                        }}
                        className="absolute left-0 w-[140px] h-12 rounded-lg transition-all hover:opacity-90 p-1"
                        style={{
                          left: 'calc(var(--spacing) * 80)',
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
                      
                      {/* 中央の「結果を見る」ボタン */}
                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            if (gender) {
                              playClickSound();
                              // 質問13（性別選択）が終わったので結果表示へ
                              handleNext();
                            }
                          }}
                          disabled={!gender}
                          className="w-[240px] h-12 rounded-lg transition-all hover:opacity-90 relative p-1"
                          style={{
                            background: gender 
                              ? 'linear-gradient(to bottom, #00edfe, #015eea)'
                              : 'linear-gradient(to bottom, #d4cfc9, #686c6f)',
                            opacity: gender ? 1 : 0.5,
                            cursor: gender ? 'pointer' : 'not-allowed'
                          }}
                        >
                          <span 
                            className="flex items-center justify-center w-full h-full rounded-md font-noto-sans-jp font-medium"
                            style={{
                              background: gender
                                ? 'linear-gradient(to bottom, #0960d8, #00f6ff)'
                                : 'linear-gradient(to bottom, #515151, #b1b0b0)',
                              color: '#ffffff'
                            }}
                          >
                            結果を見る
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* 質問番号表示 */}
                    <div className="text-center pt-4">
                      <p className="text-black text-sm">
                        13/{(questions.length + 1).toString().padStart(2, '0')}
                      </p>
                    </div>
                  </div>
                ) : currentQuestion ? (
                  /* 質問1-12: 通常の質問 */
                  <QuestionStep
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={questions.length + 1}
                    questionText={currentQuestion.text}
                    currentAnswer={currentAnswer}
                    onAnswer={handleAnswer}
                    onNext={handleNext}
                    onBack={handleBack}
                    canGoNext={true}
                    canGoBack={true}
                    isSoundOn={isSoundOn}
                    setIsSoundOn={setIsSoundOn}
                    playClickSound={playClickSound}
                  />
                ) : null}
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
