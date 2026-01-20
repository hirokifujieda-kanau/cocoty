/**
 * タロット占い履歴詳細表示コンポーネント
 */

import React from 'react';
import { X, Calendar, User, Heart, Sun, Cloud, CloudRain } from 'lucide-react';
import { type TarotReading } from '@/lib/api/tarot';

interface TarotHistoryDetailProps {
  isOpen: boolean;
  onClose: () => void;
  reading: TarotReading | null;
}

export const TarotHistoryDetail: React.FC<TarotHistoryDetailProps> = ({
  isOpen,
  onClose,
  reading
}) => {
  if (!isOpen || !reading) return null;

  const getMentalLabel = (state: string) => {
    switch (state) {
      case 'sunny': return '晴れ';
      case 'cloudy': return '曇り';
      case 'rainy': return '雨';
      default: return state;
    }
  };

  const getMentalIcon = (state: string) => {
    switch (state) {
      case 'sunny': return <Sun className="h-6 w-6 text-yellow-400" />;
      case 'cloudy': return <Cloud className="h-6 w-6 text-gray-400" />;
      case 'rainy': return <CloudRain className="h-6 w-6 text-blue-400" />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 rounded-2xl shadow-2xl">
        {/* ヘッダー */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-gradient-to-r from-purple-800 to-indigo-800 border-b border-purple-600">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-yellow-300" />
            <h2 className="text-xl font-bold text-white">占い結果の詳細</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6 space-y-6">
          {/* 日時・対象・メンタル */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">
                  {new Date(reading.created_at).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white">
                {reading.target === 'self' ? (
                  <User className="h-5 w-5 text-blue-400" />
                ) : (
                  <Heart className="h-5 w-5 text-pink-400" />
                )}
                <span className="text-sm">
                  {reading.target === 'self' ? '自分' : '相手'}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-white">
                {getMentalIcon(reading.mental_state)}
                <span className="text-sm">{getMentalLabel(reading.mental_state)}</span>
              </div>
            </div>
          </div>

          {/* カード情報 */}
          <div className="text-center">
            {/* カード画像 */}
            <div className="mb-6">
              <img
                src={reading.card.image_url}
                alt={reading.card.name}
                className="w-48 h-auto mx-auto rounded-xl shadow-lg"
                onError={(e) => {
                  // 画像読み込みエラー時のフォールバック
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>

            <div className="inline-block px-6 py-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg mb-6">
              <div className="text-5xl mb-3">{reading.is_reversed ? '🔄' : '✨'}</div>
              <h3 className="text-2xl font-bold text-white">{reading.card.name}</h3>
              <p className="text-sm text-yellow-100 mt-1">{reading.card.name_en}</p>
              {reading.is_reversed && (
                <div className="mt-2 px-3 py-1 bg-white/20 rounded-lg">
                  <span className="text-xs text-white font-semibold">逆位置</span>
                </div>
              )}
            </div>
          </div>

          {/* 解釈 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h4 className="text-lg font-bold text-white mb-3">🔮 カードの意味</h4>
            <p className="text-purple-100 leading-relaxed whitespace-pre-line">
              {reading.interpretation}
            </p>
          </div>

          {/* キーワード */}
          <div className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 rounded-xl p-6">
            <h4 className="text-lg font-bold text-white mb-3">💡 キーワード</h4>
            <p className="text-white">
              {reading.is_reversed ? reading.card.reverse_meaning : reading.card.meaning}
            </p>
          </div>

          {/* ユーザーの感想 */}
          {reading.user_comment && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-3">💭 あなたの感想</h4>
              <p className="text-purple-100 leading-relaxed whitespace-pre-line">
                {reading.user_comment}
              </p>
            </div>
          )}

          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
