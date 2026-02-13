'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import {
  canReadTarotToday,
  getTarotCards,
  getTarotReadings,
  createTarotReading,
  drawRandomCard,
  generateInterpretation,
  type TarotCard,
  type TarotReading
} from '@/lib/api/tarot';
import type { Profile } from '@/lib/api/client';
import {
  AlreadyDrawnStep,
  TargetSelectStep,
  MentalCheckStep,
  ShuffleStep,
  CardSelectStep,
  RevealStep,
  ResultStep,
  CommentStep,
  TarotHistoryList,
  TarotHistoryDetail,
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
  profile?: Profile | null;
}

const DailyTarot: React.FC<DailyTarotProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
  profile
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
  const [selectedReading, setSelectedReading] = useState<TarotReading | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showHistoryDetail, setShowHistoryDetail] = useState(false);
  const [todayReading, setTodayReading] = useState<TarotReading | null>(null);

  // 初期化：タロットカードマスタデータを取得 & 今日占いができるかチェック
  useEffect(() => {
    if (isOpen && step === 'check') {
      const initialize = async () => {
        try {
          setLoading(true);
          setError(null);

          // タロットカードマスタを取得（認証不要）
          const cards = await getTarotCards();
          setTarotCards(cards);

          // 今日占えるかチェック（認証必要）
          // ※ローカル環境でも制限を適用（バックエンドと整合性を取るため）
          try {
            const { can_read } = await canReadTarotToday();
            
            if (!can_read) {
              // 今日の占い結果を取得
              try {
                const { readings } = await getTarotReadings(1, 1);
                if (readings && readings.length > 0) {
                  setTodayReading(readings[0]);
                }
              } catch (err) {
                console.error('今日の占い結果取得エラー:', err);
              }
              
              setStep('alreadyDrawn');
            } else {
              setStep('target');
            }
          } catch (apiErr) {
            console.error('🔴 [DailyTarot] can_read_today API エラー:', apiErr);
            // APIエラーの場合、フロントエンド側でチェック
            if (profile?.tarot_last_drawn_at) {
              const lastDrawn = new Date(profile.tarot_last_drawn_at);
              const today = new Date();
              const isDrawnToday = 
                lastDrawn.getDate() === today.getDate() &&
                lastDrawn.getMonth() === today.getMonth() &&
                lastDrawn.getFullYear() === today.getFullYear();
              
              if (isDrawnToday) {
                setStep('alreadyDrawn');
              } else {
                setStep('target');
              }
            } else {
              // プロフィール情報がない場合は実行可能とする
              setStep('target');
            }
          }
        } catch (err) {
          console.error('Failed to initialize tarot:', err);
          setError('タロットデータの読み込みに失敗しました');
          // カード取得に失敗した場合は続行不可
          setStep('check');
        } finally {
          setLoading(false);
        }
      };

      initialize();
    }
  }, [isOpen, step]);

  // モーダルを閉じる
  const handleClose = () => {
    // リセット（stepはcheckに戻す - 次回開いたときに再初期化される）
    setStep('check');
    setTarget(null);
    setMentalState(null);
    setSelectedCardIndex(null);
    setDrawnCard(null);
    setInterpretation('');
    setUserComment('');
    setShowHistory(false);
    setShowHistoryDetail(false);
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
    let generatedInterpretation = '';
    if (target && mentalState) {
      generatedInterpretation = generateInterpretation(target, mentalState, result.card, result.isReversed);
      setInterpretation(generatedInterpretation);
    }
    
    // めくり演出後に結果表示 + 自動保存
    setTimeout(async () => {
      setStep('result');
      
      // 占い結果を自動的にバックエンドに保存
      if (target && mentalState) {
        try {
          setLoading(true);
          await createTarotReading({
            target,
            mental_state: mentalState,
            card_id: result.card.id,
            is_reversed: result.isReversed,
            interpretation: generatedInterpretation,
            user_comment: undefined // 初回は感想なし
          });
        } catch (err) {
          console.error('❌ Failed to auto-save tarot reading:', err);
          setError('占い結果の自動保存に失敗しました');
        } finally {
          setLoading(false);
        }
      }
    }, 2000);
  };

  // 感想を追加で保存（更新）
  const handleSaveComment = async () => {
    if (!target || !mentalState || !drawnCard || !userComment.trim()) {
      // 感想がない場合はそのまま閉じる
      handleClose();
      return;
    }
    
    try {
      setLoading(true);
      setError(null);

      // 感想を追加して再保存（上書き）
      await createTarotReading({
        target,
        mental_state: mentalState,
        card_id: drawnCard.card.id,
        is_reversed: drawnCard.isReversed,
        interpretation,
        user_comment: userComment
      });

      alert('✅ 感想を保存しました！\n\nあなたの記録が残りました。\n履歴からいつでも振り返ることができます。');
      
      // モーダルを閉じる
      handleClose();
    } catch (err) {
      console.error('Failed to update tarot reading comment:', err);
      setError('感想の保存に失敗しました');
      
      const errorMessage = err instanceof Error ? err.message : '不明なエラーが発生しました';
      alert(
        '❌ 感想の保存に失敗しました\n\n' +
        'エラー内容: ' + errorMessage + '\n\n' +
        '再度お試しいただくか、時間をおいてから試してください。'
      );
    } finally {
      setLoading(false);
    }
  };

  // 履歴表示
  const handleViewHistory = () => {
    setShowHistory(true);
  };

  // 履歴詳細表示
  const handleViewHistoryDetail = (reading: TarotReading) => {
    setSelectedReading(reading);
    setShowHistory(false);
    setShowHistoryDetail(true);
  };

  // 履歴詳細を閉じる
  const handleCloseHistoryDetail = () => {
    setShowHistoryDetail(false);
    setSelectedReading(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 rounded-2xl shadow-2xl">
        {/* ヘッダー */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-gradient-to-r from-purple-800 to-indigo-800 border-b border-purple-600">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-yellow-300" />
            <h2 className="text-2xl font-bold text-white">今日のタロット占い</h2>
          </div>
          <div className="flex items-center gap-3">
            {/* 履歴ボタン */}
            <button
              onClick={handleViewHistory}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all flex items-center gap-2"
              title="過去の占い結果を見る"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden sm:inline">履歴</span>
            </button>
            {/* 閉じるボタン */}
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
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
            <AlreadyDrawnStep 
              onViewHistory={handleViewHistory}
              lastDrawnCard={todayReading ? {
                card_name: todayReading.card.name,
                card_number: todayReading.card.id,
                interpretation: todayReading.interpretation
              } : null}
            />
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
              isLoading={loading}
            />
          )}
        </div>
      </div>
    </div>

    {/* 履歴表示モーダル */}
    <TarotHistoryList
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onSelectReading={handleViewHistoryDetail}
      />

      {/* 履歴詳細表示モーダル */}
      <TarotHistoryDetail
        isOpen={showHistoryDetail}
        onClose={handleCloseHistoryDetail}
        reading={selectedReading}
      />
    </>
  );
};

export default DailyTarot;
