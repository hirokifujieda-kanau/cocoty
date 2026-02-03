'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  MentalCheckStep,
  ShuffleStep,
  CardSelectStep,
  RevealStep,
  ResultStep,
  CommentStep,
  type Target,
  type MentalState,
  type Step,
  type TarotState,
} from '@/components/fortune/tarot';
import styles from './tarot.module.css';

type TargetType = 'self' | 'partner' | null;

// 選択画面のコンテンツコンポーネント
function TarotSelectionContent({ 
  selectedTarget,
  setSelectedTarget, 
  onDecide,
  router 
}: { 
  selectedTarget: TargetType;
  setSelectedTarget: (target: TargetType) => void;
  onDecide: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <>
      {/* ヘッダー */}
      <div className="sticky top-0 z-10">
        <div style={{ paddingInline: 'calc(var(--spacing) * 1)' }}>
          <button
            onClick={() => router.back()}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="max-w-4xl mx-auto p-8 md:pt-[135px]">
        <div className="text-center">
          <h3 
            className="font-bold"
            style={{
              fontFamily: 'Noto Sans JP',
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '16px',
              textAlign: 'center',
              background: 'linear-gradient(360deg, #EDCFAC -31.25%, #E4BC89 75%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginTop: '30px',
              marginBottom: '12px'
            }}
          >
            タロット占い
          </h3>
          <p
            style={{
              fontFamily: 'Noto Sans JP',
              fontWeight: 700,
              fontSize: '12px',
              lineHeight: '20px',
              textAlign: 'center',
              color: '#FFFFFF',
              marginBottom: '32px'
            }}
          >
            どちらを占いますか？
          </p>
          <div className="flex justify-center gap-6">
            {/* 自分ボタン */}
            <button
              onClick={() => setSelectedTarget('self')}
              className="relative transform hover:scale-105 transition-all"
            >
              <Image
                src="/tarot-material/tarot_me.svg"
                alt="自分"
                width={95}
                height={153}
                className="relative z-10"
              />
              {selectedTarget === 'self' && (
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ width: '180px', height: '260px' }}
                >
                  <img
                    src="/tarot-material/effect.svg"
                    alt="選択中"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
              )}
            </button>

            {/* 相手ボタン */}
            <button
              onClick={() => setSelectedTarget('partner')}
              className="relative transform hover:scale-105 transition-all"
            >
              <Image
                src="/tarot-material/tarot_someone.svg"
                alt="相手"
                width={95}
                height={153}
                className="relative z-10"
              />
              {selectedTarget === 'partner' && (
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ width: '180px', height: '260px' }}
                >
                  <img
                    src="/tarot-material/effect.svg"
                    alt="選択中"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
              )}
            </button>
          </div>
          
          {/* 決定ボタン */}
          <div className="flex justify-center" style={{ marginTop: '48px' }}>
            <button
              onClick={onDecide}
              disabled={selectedTarget === null}
              style={{
                width: '140px',
                height: '48px',
                borderRadius: '8px',
                background: selectedTarget === null 
                  ? 'linear-gradient(180deg, #D0D0D0 0%, #848484 100%)'
                  : 'linear-gradient(180deg, #E3AC66 0%, #89602B 100%)',
                border: selectedTarget === null 
                  ? '1px solid #CECECE'
                  : '1px solid #FFB370',
                boxShadow: selectedTarget === null 
                  ? '0px 4px 0px 0px #676158'
                  : '0px 4px 0px 0px #5B3500',
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '16px',
                textAlign: 'center',
                color: '#FFFFFF',
                cursor: selectedTarget === null ? 'not-allowed' : 'pointer'
              }}
            >
              決定
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function TarotPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedTarget, setSelectedTarget] = useState<TargetType>(null);
  const [isDecided, setIsDecided] = useState(false);
  
  // タロット占いのステート管理
  const [tarotState, setTarotState] = useState<TarotState>({
    step: 'mental',
    target: null,
    mentalState: null,
    selectedCardIndex: null,
    drawnCard: null,
    interpretation: '',
    userComment: '',
    isShuffling: false,
    isRevealing: false,
  });
  
  // 一時的な選択状態（決定ボタンを押すまで確定しない）
  const [tempMentalState, setTempMentalState] = useState<MentalState | null>(null);

  // 決定ボタンが押された時の処理
  const handleDecide = () => {
    if (selectedTarget !== null) {
      setIsDecided(true);
      // targetをタロットステートに設定
      setTarotState(prev => ({
        ...prev,
        target: selectedTarget === 'self' ? 'self' : 'other',
        step: 'mental',
      }));
    }
  };

  // 気分選択（一時保存）
  const handleMentalSelect = (state: MentalState) => {
    setTempMentalState(state);
  };
  
  // 気分選択の決定
  const handleMentalDecide = () => {
    if (tempMentalState !== null) {
      setTarotState(prev => ({
        ...prev,
        mentalState: tempMentalState,
        step: 'shuffle',
      }));
    }
  };

  // シャッフル完了
  const handleShuffleComplete = () => {
    setTarotState(prev => ({
      ...prev,
      step: 'select',
    }));
  };

  // カード選択
  const handleCardSelect = (index: number) => {
    setTarotState(prev => ({
      ...prev,
      selectedCardIndex: index,
      step: 'reveal',
    }));
  };

  // カード公開完了
  const handleRevealComplete = () => {
    setTarotState(prev => ({
      ...prev,
      step: 'result',
    }));
  };

  // コメント入力へ
  const handleToComment = () => {
    setTarotState(prev => ({
      ...prev,
      step: 'comment',
    }));
  };

  // 完了
  const handleComplete = () => {
    // リセットして最初に戻る
    setSelectedTarget(null);
    setIsDecided(false);
    setTarotState({
      step: 'mental',
      target: null,
      mentalState: null,
      selectedCardIndex: null,
      drawnCard: null,
      interpretation: '',
      userComment: '',
      isShuffling: false,
      isRevealing: false,
    });
  };

  // シャッフル画面で自動的に次へ進む（コメントアウト - 決定ボタンで進むように変更）
  // useEffect(() => {
  //   if (tarotState.step === 'shuffle') {
  //     const timer = setTimeout(() => {
  //       handleShuffleComplete();
  //     }, 2000); // 2秒後
  //     return () => clearTimeout(timer);
  //   }
  // }, [tarotState.step]);

  // カード公開画面で自動的に結果へ進む
  useEffect(() => {
    if (tarotState.step === 'reveal') {
      const timer = setTimeout(() => {
        // TODO: ここでバックエンドからカード情報を取得
        // 仮のデータ
        setTarotState(prev => ({
          ...prev,
          drawnCard: {
            card: {
              id: 1,
              name: '魔術師',
              name_en: 'The Magician',
              meaning: '創造、行動力、自信、新しい始まり',
              reverse_meaning: '優柔不断、未熟、操作、欺瞞',
              description: '新しい始まりと創造の力を象徴するカードです。',
              image_url: '/tarot-images/1-the-magician.svg',
            },
            isReversed: Math.random() > 0.5,
          },
          interpretation: 'あなたには無限の可能性があります。今こそ行動を起こす時です。',
          step: 'result',
        }));
      }, 2000); // 2秒後
      return () => clearTimeout(timer);
    }
  }, [tarotState.step]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <h2 className="font-noto font-bold text-xl text-gray-900 mb-4">
            ログインが必要です
          </h2>
          <p className="text-gray-600 mb-6">
            タロット占いを利用するにはログインしてください
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all"
          >
            ログインページへ
          </button>
        </div>
      </div>
    );
  }

  // ターゲット選択画面(決定ボタンを押すまで)
  if (!isDecided) {
    return (
      <>
        {/* SP用 */}
        <div className={`min-h-screen md:hidden ${styles.tarotBackgroundSp}`}>
          <TarotSelectionContent 
            selectedTarget={selectedTarget} 
            setSelectedTarget={setSelectedTarget} 
            onDecide={handleDecide}
            router={router} 
          />
        </div>
        {/* PC用 */}
        <div className={`min-h-screen hidden md:block ${styles.tarotBackgroundPc}`}>
          <TarotSelectionContent 
            selectedTarget={selectedTarget} 
            setSelectedTarget={setSelectedTarget} 
            onDecide={handleDecide}
            router={router} 
          />
        </div>
      </>
    );
  }

  // カード引く画面（ステップ別に表示）
  return (
    <>
      {/* SP用 */}
      <div className={`min-h-screen md:hidden ${styles.tarotBackgroundSp}`}>
        {/* ヘッダー */}
        <div className="sticky top-0 z-10">
          <div style={{ paddingInline: 'calc(var(--spacing) * 1)' }}>
            <button
              onClick={() => {
                if (tarotState.step === 'mental') {
                  // 気分選択画面なら、カード選択画面に戻る
                  setSelectedTarget(null);
                  setIsDecided(false);
                } else {
                  // それ以外は前のステップに戻る
                  const stepOrder: Step[] = ['mental', 'shuffle', 'select', 'reveal', 'result', 'comment'];
                  const currentIndex = stepOrder.indexOf(tarotState.step);
                  if (currentIndex > 0) {
                    setTarotState(prev => ({
                      ...prev,
                      step: stepOrder[currentIndex - 1],
                    }));
                  }
                }
              }}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* タロット占いコンテンツ */}
        <div className="mx-auto md:pt-[135px]" style={{ padding: 'calc(var(--spacing) * 6)', maxWidth: '1024px' }}>
          <h3 
            className="font-bold"
            style={{
              fontFamily: 'Noto Sans JP',
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '16px',
              textAlign: 'center',
              background: 'linear-gradient(360deg, #EDCFAC -31.25%, #E4BC89 75%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginTop: '30px',
              marginBottom: '12px'
            }}
          >
            タロット占い
          </h3>
          
          {tarotState.step === 'shuffle' && (
            <p 
              className="font-bold" 
              style={{
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                fontSize: '12px',
                lineHeight: '20px',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}
            >
              カードをシャッフルします
            </p>
          )}
          
          {tarotState.step === 'mental' && (
            <>
              <MentalCheckStep
                target={tarotState.target || 'self'}
                onSelect={handleMentalSelect}
              />
              
              {/* 気分選択後の決定ボタン */}
              <div className="flex justify-center" style={{ marginTop: '48px' }}>
                <button
                  onClick={handleMentalDecide}
                  disabled={tempMentalState === null}
                  style={{
                    width: '140px',
                    height: '48px',
                    borderRadius: '8px',
                    background: tempMentalState === null 
                      ? 'linear-gradient(180deg, #D0D0D0 0%, #848484 100%)'
                      : 'linear-gradient(180deg, #E3AC66 0%, #89602B 100%)',
                    border: tempMentalState === null 
                      ? '1px solid #CECECE'
                      : '1px solid #FFB370',
                    boxShadow: tempMentalState === null 
                      ? '0px 4px 0px 0px #676158'
                      : '0px 4px 0px 0px #5B3500',
                    fontFamily: 'Noto Sans JP',
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '16px',
                    textAlign: 'center',
                    color: '#FFFFFF',
                    cursor: tempMentalState === null ? 'not-allowed' : 'pointer'
                  }}
                >
                  決定
                </button>
              </div>
            </>
          )}
          
          {tarotState.step === 'shuffle' && (
            <>
              <ShuffleStep />
              <div className="flex justify-center" style={{ marginTop: '48px' }}>
                <button
                  onClick={handleShuffleComplete}
                  style={{
                    width: '140px',
                    height: '48px',
                    borderRadius: '8px',
                    background: 'linear-gradient(180deg, #E3AC66 0%, #89602B 100%)',
                    border: '1px solid #FFB370',
                    boxShadow: '0px 4px 0px 0px #5B3500',
                    fontFamily: 'Noto Sans JP',
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '16px',
                    textAlign: 'center',
                    color: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  止める
                </button>
              </div>
            </>
          )}
          
          {tarotState.step === 'select' && (
            <CardSelectStep
              onSelect={handleCardSelect}
            />
          )}
          
          {tarotState.step === 'reveal' && (
            <RevealStep />
          )}
          
          {tarotState.step === 'result' && tarotState.drawnCard && (
            <ResultStep
              drawnCard={tarotState.drawnCard}
              interpretation={tarotState.interpretation}
              onComment={handleToComment}
              onClose={handleComplete}
            />
          )}
          
          {tarotState.step === 'comment' && (
            <CommentStep
              comment={tarotState.userComment}
              onChange={(comment) => setTarotState(prev => ({ ...prev, userComment: comment }))}
              onSave={handleComplete}
              onBack={() => setTarotState(prev => ({ ...prev, step: 'result' }))}
            />
          )}
        </div>
      </div>

      {/* PC用 */}
      <div className={`min-h-screen hidden md:block ${styles.tarotBackgroundPc}`}>
        {/* ヘッダー */}
        <div className="sticky top-0 z-10">
          <div style={{ paddingInline: 'calc(var(--spacing) * 1)' }}>
            <button
              onClick={() => {
                if (tarotState.step === 'mental') {
                  setSelectedTarget(null);
                  setIsDecided(false);
                } else {
                  const stepOrder: Step[] = ['mental', 'shuffle', 'select', 'reveal', 'result', 'comment'];
                  const currentIndex = stepOrder.indexOf(tarotState.step);
                  if (currentIndex > 0) {
                    setTarotState(prev => ({
                      ...prev,
                      step: stepOrder[currentIndex - 1],
                    }));
                  }
                }
              }}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* タロット占いコンテンツ */}
        <div className="mx-auto p-8 md:pt-[135px]" style={{ maxWidth: '1024px' }}>
          <h3 
            className="font-bold"
            style={{
              fontFamily: 'Noto Sans JP',
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '16px',
              textAlign: 'center',
              background: 'linear-gradient(360deg, #EDCFAC -31.25%, #E4BC89 75%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginTop: '30px',
              marginBottom: '12px'
            }}
          >
            タロット占い
          </h3>
          
          {tarotState.step === 'shuffle' && (
            <p 
              className="font-bold" 
              style={{
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                fontSize: '12px',
                lineHeight: '20px',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}
            >
              カードをシャッフルします
            </p>
          )}
          
          {tarotState.step === 'mental' && (
            <>
              <MentalCheckStep
                target={tarotState.target || 'self'}
                onSelect={handleMentalSelect}
              />
              
              {/* 気分選択後の決定ボタン */}
              <div className="flex justify-center" style={{ marginTop: '48px' }}>
                <button
                  onClick={handleMentalDecide}
                  disabled={tempMentalState === null}
                  style={{
                    width: '140px',
                    height: '48px',
                    borderRadius: '8px',
                    background: tempMentalState === null 
                      ? 'linear-gradient(180deg, #D0D0D0 0%, #848484 100%)'
                      : 'linear-gradient(180deg, #E3AC66 0%, #89602B 100%)',
                    border: tempMentalState === null 
                      ? '1px solid #CECECE'
                      : '1px solid #FFB370',
                    boxShadow: tempMentalState === null 
                      ? '0px 4px 0px 0px #676158'
                      : '0px 4px 0px 0px #5B3500',
                    fontFamily: 'Noto Sans JP',
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '16px',
                    textAlign: 'center',
                    color: '#FFFFFF',
                    cursor: tempMentalState === null ? 'not-allowed' : 'pointer'
                  }}
                >
                  決定
                </button>
              </div>
            </>
          )}
          
          {tarotState.step === 'shuffle' && (
            <>
              <ShuffleStep />
              <div className="flex justify-center" style={{ marginTop: '48px' }}>
                <button
                  onClick={handleShuffleComplete}
                  style={{
                    width: '140px',
                    height: '48px',
                    borderRadius: '8px',
                    background: 'linear-gradient(180deg, #E3AC66 0%, #89602B 100%)',
                    border: '1px solid #FFB370',
                    boxShadow: '0px 4px 0px 0px #5B3500',
                    fontFamily: 'Noto Sans JP',
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '16px',
                    textAlign: 'center',
                    color: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  止める
                </button>
              </div>
            </>
          )}
          
          {tarotState.step === 'select' && (
            <CardSelectStep
              onSelect={handleCardSelect}
            />
          )}
          
          {tarotState.step === 'reveal' && (
            <RevealStep />
          )}
          
          {tarotState.step === 'result' && tarotState.drawnCard && (
            <ResultStep
              drawnCard={tarotState.drawnCard}
              interpretation={tarotState.interpretation}
              onComment={handleToComment}
              onClose={handleComplete}
            />
          )}
          
          {tarotState.step === 'comment' && (
            <CommentStep
              comment={tarotState.userComment}
              onChange={(comment) => setTarotState(prev => ({ ...prev, userComment: comment }))}
              onSave={handleComplete}
              onBack={() => setTarotState(prev => ({ ...prev, step: 'result' }))}
            />
          )}
        </div>
      </div>
    </>
  );
}
