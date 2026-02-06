'use client';

import React from 'react';
import {
  MentalCheckStep,
  ShuffleStep,
  CardSelectStep,
  ResultStep,
  CommentStep,
  HistoryStep,
  HistoryDetailStep,
} from './tarot';
import type { Profile } from '@/lib/api/client';
import { useTarotState } from '@/hooks/useTarotState';
import { HEADING_STYLE, SUBHEADING_STYLE, getButtonStyle } from './tarot/constants';
import { BackIcon, DecideButton, TargetCard } from './tarot/components';
import styles from './DailyTarot.module.css';

interface DailyTarotProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  profile?: Profile | null;
  isDrawnToday?: boolean;
}

const DailyTarot: React.FC<DailyTarotProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
  profile,
  isDrawnToday = false,
}) => {
  const {
    selectedTarget,
    tarotState,
    tempMentalState,
    selectedReading,
    showResultConfirmation,
    savedFeeling,
    savedComment,
    setSelectedTarget,
    setSelectedReading,
    handleDecide,
    handleMentalSelect,
    handleMentalDecide,
    handleShuffleComplete,
    handleCardSelect,
    handleToComment,
    handleComplete,
    handleBack,
    handleSaveData,
    getCurrentReading,
  } = useTarotState({ isOpen, isDrawnToday, userId, onClose });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto">
      <div className={`min-h-screen ${styles.tarotBackgroundSp}`}>
        <div className="sticky top-0 z-10">
          <div className="px-[calc(var(--spacing)*1)]">
            {/* result と history ステップでは戻るボタンを表示しない */}
            {tarotState.step !== 'result' && tarotState.step !== 'history' && (
              <button 
                onClick={tarotState.step === 'target' ? onClose : handleBack} 
                className="text-white hover:text-gray-300 transition-colors"
              >
                <BackIcon />
              </button>
            )}
          </div>
        </div>

        <div className="mx-auto py-[calc(var(--spacing)*6)] px-4 max-w-[1024px]">
          {/* タイトルは常に表示 */}
          <h3 className="font-bold text-[32px] leading-[130%] text-center text-white font-inter mb-6">タロット占い</h3>
          
          {/* コンテンツエリア - 高さを固定してレイアウトシフトを防ぐ */}
          <div className="text-center min-h-[300px] relative">
            {tarotState.step === 'target' && (
              <>
                <p className="font-bold text-base leading-[130%] text-center text-white font-inter mb-6">どちらを占いますか？</p>
                <div className="flex justify-center gap-6">
                  <TargetCard 
                    type="self" 
                    isSelected={selectedTarget === 'self'} 
                    selectedTarget={selectedTarget}
                    onSelect={setSelectedTarget}
                  />
                  <TargetCard 
                    type="partner" 
                    isSelected={selectedTarget === 'partner'} 
                    selectedTarget={selectedTarget}
                    onSelect={setSelectedTarget}
                  />
                </div>
              </>
            )}

            {tarotState.step === 'mental' && (
              <MentalCheckStep target={tarotState.target || 'self'} onSelect={handleMentalSelect} />
            )}

            {tarotState.step === 'shuffle' && (
              <>
                <p className="font-bold text-base leading-[130%] text-center text-white font-inter mb-3">
                  カードをシャッフルします
                </p>
                <ShuffleStep />
              </>
            )}
            
            {tarotState.step === 'select' && (
              <CardSelectStep onSelect={handleCardSelect} />
            )}
            
            {tarotState.step === 'result' && tarotState.drawnCard && (
              <>
                {/* 本日の占い結果とターゲットバッジ */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  {selectedTarget && (
                    <div className={`font-bold text-xs leading-5 text-center text-white font-noto-sans-jp px-[7.5px] rounded-[10px] ${
                      selectedTarget === 'self' ? 'bg-[#3A84C9]' : 'bg-[#C93A67]'
                    }`}>
                      {selectedTarget === 'self' ? '自分' : '相手'}
                    </div>
                  )}
                  <p className="font-bold text-xs leading-5 text-center text-white font-noto-sans-jp m-0">
                    本日の占い結果
                  </p>
                </div>
                <ResultStep
                  drawnCard={tarotState.drawnCard}
                  interpretation={tarotState.interpretation}
                  onComment={handleToComment}
                  onClose={handleComplete}
                  initialShowConfirmation={showResultConfirmation}
                  savedFeeling={savedFeeling}
                  savedComment={savedComment}
                  target={selectedTarget}
                  onSaveData={handleSaveData}
                />
              </>
            )}
            
            {tarotState.step === 'comment' && (
              <CommentStep
                comment={tarotState.userComment}
                onChange={(comment) => {
                  console.log('Comment changed:', comment);
                }}
                onSave={handleComplete}
                onBack={handleBack}
              />
            )}
            
            {tarotState.step === 'history' && (
              <HistoryStep
                onClose={handleComplete}
                onViewDetail={(reading) => {
                  setSelectedReading(reading);
                }}
                currentReading={getCurrentReading()}
              />
            )}
            
            {tarotState.step === 'historyDetail' && selectedReading && (
              <HistoryDetailStep
                reading={selectedReading}
                onBack={handleBack}
              />
            )}

            {/* 決定ボタンエリア - 常に同じ位置を確保 */}
            <div className="flex justify-center mt-12">
              {tarotState.step === 'target' && (
                <DecideButton onClick={handleDecide} disabled={selectedTarget === null} />
              )}
              
              {tarotState.step === 'mental' && (
                <DecideButton onClick={handleMentalDecide} disabled={tempMentalState === null} />
              )}
              
              {tarotState.step === 'shuffle' && (
                <button 
                  onClick={handleShuffleComplete}
                  className="min-w-[200px] px-6 py-3 bg-[#C4C46D] hover:opacity-90 text-white font-bold rounded-[14px] transition-all font-noto-sans-jp text-base leading-5"
                >
                  止める
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTarot;
