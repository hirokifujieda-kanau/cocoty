import { useState, useEffect } from 'react';
import type { TarotState, MentalState } from '@/components/fortune/tarot/types';
import type { TarotReading } from '@/lib/api/tarot';
import { getTodayReading, saveTodayReading } from '@/lib/tarot/storage';
import { INITIAL_TAROT_STATE, STEP_ORDER } from '@/components/fortune/tarot/constants';

type TargetType = 'self' | 'partner' | null;

interface UseTarotStateProps {
  isOpen: boolean;
  isDrawnToday: boolean;
  userId: string;
  onClose: () => void;
}

export const useTarotState = ({
  isOpen,
  isDrawnToday,
  userId,
  onClose,
}: UseTarotStateProps) => {
  const [selectedTarget, setSelectedTarget] = useState<TargetType>(null);
  const [tarotState, setTarotState] = useState<TarotState>(INITIAL_TAROT_STATE);
  const [tempMentalState, setTempMentalState] = useState<MentalState | null>(null);
  const [selectedReading, setSelectedReading] = useState<TarotReading | null>(null);
  const [showResultConfirmation, setShowResultConfirmation] = useState(false);
  const [savedFeeling, setSavedFeeling] = useState<'good' | 'soso' | 'bad' | null>(null);
  const [savedComment, setSavedComment] = useState('');

  // 現在の占い結果をTarotReading形式で作成
  const getCurrentReading = (): TarotReading | null => {
    if (!tarotState.drawnCard || !selectedTarget || !tarotState.mentalState) {
      return null;
    }

    const mentalStateMap: Record<MentalState, 'sunny' | 'cloudy' | 'rainy'> = {
      sunny: 'sunny',
      cloudy: 'cloudy',
      rainy: 'rainy',
      'very-rainy': 'rainy',
    };

    return {
      id: 0,
      user_id: parseInt(userId) || 0,
      target: selectedTarget === 'self' ? 'self' : ('other' as 'self' | 'other'),
      mental_state: mentalStateMap[tarotState.mentalState],
      card_id: tarotState.drawnCard.card.id,
      is_reversed: tarotState.drawnCard.isReversed,
      interpretation: tarotState.interpretation,
      user_comment: savedComment,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      card: tarotState.drawnCard.card,
    };
  };

  const resetState = () => {
    setSelectedTarget(null);
    setTarotState(INITIAL_TAROT_STATE);
    setTempMentalState(null);
  };

  // 初期化時に今日既に占いを実施済みの場合、今日の結果を表示
  useEffect(() => {
    console.log('🔍 [useTarotState] useEffect triggered - isOpen:', isOpen, 'isDrawnToday:', isDrawnToday);
    if (isOpen && isDrawnToday) {
      const todayReading = getTodayReading();
      console.log('📖 [useTarotState] getTodayReading result:', todayReading);
      if (todayReading) {
        console.log('✅ [useTarotState] 今日の結果を復元します');
        const restoredState = {
          ...todayReading.tarotState,
          step: 'result' as const,
        };
        setTarotState(restoredState);
        setSelectedTarget(todayReading.selectedTarget);
        setSavedFeeling(todayReading.savedFeeling);
        setSavedComment(todayReading.savedComment);
        setShowResultConfirmation(true);
        console.log('📺 [useTarotState] Restored state:', {
          step: restoredState.step,
          showResultConfirmation: true,
          hasDrawnCard: !!restoredState.drawnCard,
        });
      } else {
        console.log('⚠️ [useTarotState] 今日の結果が見つかりませんでした');
      }
    } else if (isOpen && !isDrawnToday) {
      console.log('🆕 [useTarotState] 新規占いを開始');
      resetState();
    }
  }, [isOpen, isDrawnToday]);

  const handleDecide = () => {
    if (selectedTarget !== null) {
      setTarotState((prev) => ({
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
      setTarotState((prev) => ({
        ...prev,
        mentalState: tempMentalState,
        step: 'shuffle',
      }));
    }
  };

  const handleShuffleComplete = () => {
    setTarotState((prev) => ({ ...prev, step: 'select' }));
  };

  const handleCardSelect = (index: number) => {
    setShowResultConfirmation(false);
    setSavedFeeling(null);
    setSavedComment('');
    setTarotState((prev) => ({
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
    saveTodayReading({
      tarotState,
      selectedTarget,
      savedFeeling,
      savedComment,
    });
    setShowResultConfirmation(true);
    setTarotState((prev) => ({ ...prev, step: 'history' }));
  };

  const handleComplete = () => {
    resetState();
    onClose();
  };

  const handleBack = () => {
    if (tarotState.step === 'result' && showResultConfirmation && isDrawnToday) {
      handleComplete();
      return;
    }

    if (tarotState.step === 'result' && showResultConfirmation) {
      setShowResultConfirmation(false);
      return;
    }

    if (tarotState.step === 'mental') {
      setTempMentalState(null);
      setTarotState((prev) => ({
        ...prev,
        step: 'target',
      }));
      return;
    } else if (tarotState.step === 'historyDetail') {
      setTarotState((prev) => ({
        ...prev,
        step: 'history',
      }));
    } else if (tarotState.step === 'history') {
      setTarotState((prev) => ({
        ...prev,
        step: 'result',
      }));
    } else {
      const currentIndex = STEP_ORDER.indexOf(tarotState.step);
      if (currentIndex > 0) {
        setTarotState((prev) => ({
          ...prev,
          step: STEP_ORDER[currentIndex - 1],
        }));
      }
    }
  };

  const handleSaveData = (feeling: 'good' | 'soso' | 'bad' | null, comment: string) => {
    console.log('💾 [useTarotState] onSaveData called - feeling:', feeling, 'comment:', comment);
    setSavedFeeling(feeling);
    setSavedComment(comment);
    const dataToSave = {
      tarotState,
      selectedTarget,
      savedFeeling: feeling,
      savedComment: comment,
    };
    console.log('💾 [useTarotState] Saving to localStorage:', dataToSave);
    saveTodayReading(dataToSave);
    console.log('✅ [useTarotState] Saved to localStorage');
  };

  return {
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
  };
};
