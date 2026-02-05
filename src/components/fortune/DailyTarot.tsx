'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  MentalCheckStep,
  ShuffleStep,
  CardSelectStep,
  ResultStep,
  CommentStep,
  HistoryStep,
  HistoryDetailStep,
  type Target,
  type MentalState,
  type Step,
  type TarotState,
} from './tarot';
import type { Profile } from '@/lib/api/client';
import styles from './DailyTarot.module.css';

interface DailyTarotProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  profile?: Profile | null;
}

type TargetType = 'self' | 'partner' | null;

// 定数
const INITIAL_TAROT_STATE: TarotState = {
  step: 'mental',
  target: null,
  mentalState: null,
  selectedCardIndex: null,
  drawnCard: null,
  interpretation: '',
  userComment: '',
  isShuffling: false,
  isRevealing: false,
};

const STEP_ORDER: Step[] = ['mental', 'shuffle', 'select', 'result', 'comment', 'history', 'historyDetail'];

const HEADING_STYLE = {
  fontFamily: 'Noto Sans JP',
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  background: 'linear-gradient(360deg, #EDCFAC -31.25%, #E4BC89 75%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  marginTop: '30px',
  marginBottom: '12px',
};

const SUBHEADING_STYLE = {
  fontFamily: 'Noto Sans JP',
  fontWeight: 700,
  fontSize: '12px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  color: '#FFFFFF',
  marginBottom: '32px',
};

const getButtonStyle = (isEnabled: boolean) => ({
  width: '140px',
  height: '48px',
  borderRadius: '8px',
  background: isEnabled 
    ? 'linear-gradient(180deg, #E3AC66 0%, #89602B 100%)'
    : 'linear-gradient(180deg, #D0D0D0 0%, #848484 100%)',
  border: isEnabled 
    ? '1px solid #FFB370'
    : '1px solid #CECECE',
  boxShadow: isEnabled 
    ? '0px 4px 0px 0px #5B3500'
    : '0px 4px 0px 0px #676158',
  fontFamily: 'Noto Sans JP',
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  color: '#FFFFFF',
  cursor: isEnabled ? 'pointer' : 'not-allowed',
});

// 戻るボタンアイコン
const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 決定ボタンコンポーネント
const DecideButton: React.FC<{ onClick: () => void; disabled: boolean }> = ({ onClick, disabled }) => (
  <div className="flex justify-center" style={{ marginTop: '48px' }}>
    <button onClick={onClick} disabled={disabled} style={getButtonStyle(!disabled)}>
      決定
    </button>
  </div>
);

const DailyTarot: React.FC<DailyTarotProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
  profile
}) => {
  const [selectedTarget, setSelectedTarget] = useState<TargetType>(null);
  const [isDecided, setIsDecided] = useState(false);
  const [tarotState, setTarotState] = useState<TarotState>(INITIAL_TAROT_STATE);
  const [tempMentalState, setTempMentalState] = useState<MentalState | null>(null);
  const [selectedReading, setSelectedReading] = useState<any>(null);

  const resetState = () => {
    setSelectedTarget(null);
    setIsDecided(false);
    setTarotState(INITIAL_TAROT_STATE);
    setTempMentalState(null);
  };

  const handleDecide = () => {
    if (selectedTarget !== null) {
      setIsDecided(true);
      setTarotState(prev => ({
        ...prev,
        target: selectedTarget === 'self' ? 'self' : 'other',
        step: 'mental',
      }));
    }
  };

  const handleMentalSelect = (state: MentalState) => {
    setTempMentalState(state);
  };
  
  const handleMentalDecide = () => {
    if (tempMentalState !== null) {
      setTarotState(prev => ({
        ...prev,
        mentalState: tempMentalState,
        step: 'shuffle',
      }));
    }
  };

  const handleShuffleComplete = () => {
    setTarotState(prev => ({ ...prev, step: 'select' }));
  };

  const handleCardSelect = (index: number) => {
    // ホワイトアウト演出後、直接結果画面へ (revealステップをスキップ)
    setTarotState(prev => ({
      ...prev,
      selectedCardIndex: index,
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
  };

  const handleToComment = () => {
    // TODO: ここで実際にデータを保存する処理を追加
    // 例: await createTarotReading(tarotState);
    
    setTarotState(prev => ({ ...prev, step: 'history' }));
  };

  const handleComplete = () => {
    resetState();
    onClose();
  };

  const handleBack = () => {
    if (tarotState.step === 'mental') {
      setSelectedTarget(null);
      setIsDecided(false);
    } else if (tarotState.step === 'historyDetail') {
      // 履歴詳細から履歴一覧に戻る
      setTarotState(prev => ({
        ...prev,
        step: 'history',
      }));
    } else if (tarotState.step === 'history') {
      // 履歴一覧から完全に閉じる
      handleComplete();
    } else {
      const currentIndex = STEP_ORDER.indexOf(tarotState.step);
      if (currentIndex > 0) {
        setTarotState(prev => ({
          ...prev,
          step: STEP_ORDER[currentIndex - 1],
        }));
      }
    }
  };

  if (!isOpen) return null;

  // ターゲット選択カードコンポーネント
  const TargetCard: React.FC<{ 
    type: 'self' | 'partner'; 
    isSelected: boolean;
  }> = ({ type, isSelected }) => (
    <button
      onClick={() => setSelectedTarget(type)}
      className="relative transform hover:scale-105 transition-all"
    >
      <Image
        src={`/tarot-material/tarot_${type === 'self' ? 'me' : 'someone'}.svg`}
        alt={type === 'self' ? '自分' : '相手'}
        width={95}
        height={153}
        className="relative z-10"
      />
      {isSelected && (
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
          style={{ width: '180px', height: '270px' }}
        >
          <img
            src="/tarot-material/effect.svg"
            alt="選択中"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      )}
    </button>
  );

  if (!isDecided) {
    return (
      <div className="fixed inset-0 z-50" style={{ overflow: 'auto' }}>
        <div className={`min-h-screen ${styles.tarotBackgroundSp}`}>
          <div className="sticky top-0 z-10">
            <div style={{ paddingInline: 'calc(var(--spacing) * 1)' }}>
              <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors">
                <BackIcon />
              </button>
            </div>
          </div>

          <div className="mx-auto" style={{ padding: 'calc(var(--spacing) * 6)', maxWidth: '1024px' }}>
            <div className="text-center">
              <h3 className="font-bold" style={HEADING_STYLE}>タロット占い</h3>
              <p style={SUBHEADING_STYLE}>どちらを占いますか？</p>
              <div className="flex justify-center gap-6">
                <TargetCard type="self" isSelected={selectedTarget === 'self'} />
                <TargetCard type="partner" isSelected={selectedTarget === 'partner'} />
              </div>
              <DecideButton onClick={handleDecide} disabled={selectedTarget === null} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50" style={{ overflow: 'auto' }}>
      <div className={`min-h-screen ${styles.tarotBackgroundSp}`}>
        <div className="sticky top-0 z-10">
          <div style={{ paddingInline: 'calc(var(--spacing) * 1)' }}>
            <button onClick={handleBack} className="text-white hover:text-gray-300 transition-colors">
              <BackIcon />
            </button>
          </div>
        </div>

        <div className="mx-auto" style={{ padding: 'calc(var(--spacing) * 6)', maxWidth: '1024px' }}>
          <h3 className="font-bold" style={HEADING_STYLE}>タロット占い</h3>
          
          {tarotState.step === 'shuffle' && (
            <p className="font-bold" style={{ ...SUBHEADING_STYLE, marginBottom: '12px' }}>
              カードをシャッフルします
            </p>
          )}
          
          {tarotState.step === 'mental' && (
            <>
              <MentalCheckStep target={tarotState.target || 'self'} onSelect={handleMentalSelect} />
              <DecideButton onClick={handleMentalDecide} disabled={tempMentalState === null} />
            </>
          )}
          
          {tarotState.step === 'shuffle' && (
            <>
              <ShuffleStep />
              <div className="flex justify-center" style={{ marginTop: '48px' }}>
                <button onClick={handleShuffleComplete} style={getButtonStyle(true)}>
                  止める
                </button>
              </div>
            </>
          )}
          
          {tarotState.step === 'select' && <CardSelectStep onSelect={handleCardSelect} />}
          
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
          
          {tarotState.step === 'history' && (
            <HistoryStep
              onClose={handleComplete}
              onViewDetail={(reading) => {
                setSelectedReading(reading);
                setTarotState(prev => ({ ...prev, step: 'historyDetail' }));
              }}
            />
          )}
          
          {tarotState.step === 'historyDetail' && selectedReading && (
            <HistoryDetailStep
              reading={selectedReading}
              onBack={() => setTarotState(prev => ({ ...prev, step: 'history' }))}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyTarot;
