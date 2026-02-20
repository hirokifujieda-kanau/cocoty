'use client';

import React, { useState } from 'react';
import { drawTarotCards, type DrawnCard } from '@/lib/api/client';
import TarotCard from './TarotCard';

interface TarotDrawProps {
  onDrawComplete?: (cards: DrawnCard[]) => void;
}

const TarotDraw: React.FC<TarotDrawProps> = ({ onDrawComplete }) => {
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const handleDraw = async () => {
    try {
      setIsDrawing(true);
      setError(null);
      setDrawnCards([]);
      setFlippedCards(new Set());

      const response = await drawTarotCards(3);
      setDrawnCards(response.drawn_cards);
      
      if (onDrawComplete) {
        onDrawComplete(response.drawn_cards);
      }
    } catch (err: any) {
      setError(err.message || 'カードを引けませんでした');
      console.error('Tarot draw error:', err);
    } finally {
      setIsDrawing(false);
    }
  };

  const handleCardClick = (position: number) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(position)) {
        newSet.delete(position);
      } else {
        newSet.add(position);
      }
      return newSet;
    });
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      {/* 説明テキスト */}
      <div className="text-center">
        <p className="text-white text-lg">
          3枚のカードがあなたの過去・現在・未来を示します
        </p>
      </div>

      {/* カード引くボタン */}
      {drawnCards.length === 0 && (
        <button
          onClick={handleDraw}
          disabled={isDrawing}
          className="px-8 py-4 bg-white hover:bg-gray-100 text-purple-900 font-bold rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDrawing ? 'カードを引いています...' : '3枚引く'}
        </button>
      )}

      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-500/20 border border-red-400 text-white px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* カード表示 */}
      {drawnCards.length > 0 && (
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {drawnCards.map((drawnCard, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <span className="text-sm font-semibold text-white">
                  {index === 0 ? '過去' : index === 1 ? '現在' : '未来'}
                </span>
                <div className="w-full max-w-xs">
                  <TarotCard
                    card={drawnCard.card}
                    isReversed={drawnCard.is_reversed}
                    isFlipped={flippedCards.has(drawnCard.position)}
                    onClick={() => handleCardClick(drawnCard.position)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* もう一度引くボタン */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleDraw}
              disabled={isDrawing}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/30"
            >
              もう一度引く
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TarotDraw;
