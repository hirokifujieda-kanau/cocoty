'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import {
  canReadTarotToday,
  getTarotCards,
  createTarotReading,
  drawRandomCard,
  generateInterpretation,
  exportReadingsToCSV,
  type TarotCard
} from '@/lib/api/tarot';
import {
  AlreadyDrawnStep,
  TargetSelectStep,
  MentalCheckStep,
  ShuffleStep,
  CardSelectStep,
  RevealStep,
  ResultStep,
  CommentStep,
  type Step,
  type Target,
  type MentalState,
  type DrawnCardResult
} from './tarot';

interface DailyTarotProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

const DailyTarot: React.FC<DailyTarotProps> = ({
  isOpen,
  onClose,
  userId,
  userName
}) => {
  const [step, setStep] = useState<Step>('check');
  const [target, setTarget] = useState<Target | null>(null);
  const [mentalState, setMentalState] = useState<MentalState | null>(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [drawnCard, setDrawnCard] = useState<DrawnCardResult | null>(null);
  const [interpretation, setInterpretation] = useState<string>('');
  const [userComment, setUserComment] = useState<string>('');
  const [tarotCards, setTarotCards] = useState<TarotCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初期化：タロットカードマスタデータを取得 & 今日占いができるかチェック
  useEffect(() => {
    if (isOpen) {
      const initialize = async () => {
        try {
          setLoading(true);
          setError(null);

          // タロットカードマスタを取得（認証不要）
          const cards = await getTarotCards();
          setTarotCards(cards);

          // 今日占えるかチェック（認証必要）
          const { can_read } = await canReadTarotToday();
          
          if (!can_read) {
            setStep('alreadyDrawn');
          } else {
            setStep('target');
          }
        } catch (err) {
          console.error('Failed to initialize tarot:', err);
          setError('タロットデータの読み込みに失敗しました');
          setStep('target'); // エラーでも続行
        } finally {
          setLoading(false);
        }
      };

      initialize();
    }
  }, [isOpen]);

  // モーダルを閉じる
  const handleClose = () => {
    // リセット
    setStep('check');
    setTarget(null);
    setMentalState(null);
    setSelectedCardIndex(null);
    setDrawnCard(null);
    setInterpretation('');
    setUserComment('');
    onClose();
  };

  // 対象選択
  const handleTargetSelect = (selectedTarget: Target) => {
    setTarget(selectedTarget);
    setStep('mental');
  };

  // メンタルステート選択
  const handleMentalSelect = (state: MentalState) => {
    setMentalState(state);
    setStep('shuffle');
    
    // シャッフル演出後にカード選択へ
    setTimeout(() => {
      setStep('select');
    }, 3000);
  };

  // カード選択
  const handleCardSelect = (index: number) => {
    if (tarotCards.length === 0) {
      setError('タロットカードが読み込まれていません');
      return;
    }

    setSelectedCardIndex(index);
    setStep('reveal');
    
    // カードを引く（tarotCardsを渡す）
    const result = drawRandomCard(tarotCards);
    setDrawnCard(result);
    
    // 解釈を生成
    if (target && mentalState) {
      const interp = generateInterpretation(target, mentalState, result.card, result.isReversed);
      setInterpretation(interp);
    }
    
    // めくり演出後に結果表示
    setTimeout(() => {
      setStep('result');
    }, 2000);
  };

  // 感想を保存してバックエンドに送信
  const handleSaveComment = async () => {
    if (!target || !mentalState || !drawnCard) return;
    
    try {
      setLoading(true);
      setError(null);

      await createTarotReading({
        target,
        mental_state: mentalState,
        card_id: drawnCard.card.id,
        is_reversed: drawnCard.isReversed,
        interpretation,
        user_comment: userComment || undefined
      });

      console.log('✅ Tarot reading saved to backend');
      setStep('comment');
    } catch (err) {
      console.error('Failed to save tarot reading:', err);
      setError('占い結果の保存に失敗しました');
      // エラーでも次のステップへ進む（UX優先）
      setStep('comment');
    } finally {
      setLoading(false);
    }
    
    handleClose();
  };

  // CSVエクスポート（履歴取得が必要）
  const handleExportCSV = async () => {
    try {
      const { getTarotReadings } = await import('@/lib/api/tarot');
      const { readings } = await getTarotReadings(1, 1000); // 全件取得
      const csv = exportReadingsToCSV(readings);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `tarot_readings_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } catch (err) {
      console.error('Failed to export CSV:', err);
      setError('CSVエクスポートに失敗しました');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 rounded-2xl shadow-2xl">
        {/* ヘッダー */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-gradient-to-r from-purple-800 to-indigo-800 border-b border-purple-600">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-yellow-300" />
            <h2 className="text-2xl font-bold text-white">今日のタロット占い</h2>
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
          {loading && (
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>読み込み中...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500 text-white px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {step === 'alreadyDrawn' && (
            <AlreadyDrawnStep onExportCSV={handleExportCSV} />
          )}

          {step === 'target' && (
            <TargetSelectStep onSelect={handleTargetSelect} />
          )}

          {step === 'mental' && target && (
            <MentalCheckStep target={target} onSelect={handleMentalSelect} />
          )}

          {step === 'shuffle' && (
            <ShuffleStep />
          )}

          {step === 'select' && (
            <CardSelectStep onSelect={handleCardSelect} />
          )}

          {step === 'reveal' && (
            <RevealStep />
          )}

          {step === 'result' && drawnCard && (
            <ResultStep
              drawnCard={drawnCard}
              interpretation={interpretation}
              onComment={() => setStep('comment')}
              onClose={handleClose}
            />
          )}

          {step === 'comment' && (
            <CommentStep
              comment={userComment}
              onChange={setUserComment}
              onSave={handleSaveComment}
              onBack={() => setStep('result')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyTarot;
