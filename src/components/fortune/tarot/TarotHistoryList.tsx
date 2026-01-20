/**
 * タロット占い履歴一覧表示コンポーネント
 */

import React, { useEffect, useState } from 'react';
import { X, Calendar, User, Heart, Sun, Cloud, CloudRain } from 'lucide-react';
import { getTarotReadings, type TarotReading } from '@/lib/api/tarot';

interface TarotHistoryListProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReading: (reading: TarotReading) => void;
}

export const TarotHistoryList: React.FC<TarotHistoryListProps> = ({
  isOpen,
  onClose,
  onSelectReading
}) => {
  const [readings, setReadings] = useState<TarotReading[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (isOpen) {
      fetchReadings(1);
    }
  }, [isOpen]);

  const fetchReadings = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTarotReadings(page, 10);
      setReadings(response.readings);
      setCurrentPage(response.pagination.current_page);
      setTotalPages(response.pagination.total_pages);
    } catch (err) {
      console.error('Failed to fetch readings:', err);
      setError('履歴の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const getMentalIcon = (state: string) => {
    switch (state) {
      case 'sunny': return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-4 w-4 text-gray-500" />;
      case 'rainy': return <CloudRain className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  const getTargetIcon = (target: string) => {
    return target === 'self' 
      ? <User className="h-4 w-4 text-blue-500" /> 
      : <Heart className="h-4 w-4 text-pink-500" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 rounded-2xl shadow-2xl">
        {/* ヘッダー */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-gradient-to-r from-purple-800 to-indigo-800 border-b border-purple-600">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-yellow-300" />
            <h2 className="text-2xl font-bold text-white">占い履歴</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6">
          {loading && (
            <div className="text-center text-white py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>読み込み中...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500 text-white px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {!loading && readings.length === 0 && (
            <div className="text-center text-white py-12">
              <p className="text-lg">まだ占い履歴がありません</p>
              <p className="text-sm text-purple-200 mt-2">最初の占いをしてみましょう！</p>
            </div>
          )}

          {!loading && readings.length > 0 && (
            <div className="space-y-4">
              {readings.map((reading) => (
                <button
                  key={reading.id}
                  onClick={() => onSelectReading(reading)}
                  className="w-full p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all text-left"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getTargetIcon(reading.target)}
                      <span className="text-sm text-white">
                        {reading.target === 'self' ? '自分' : '相手'}
                      </span>
                      {getMentalIcon(reading.mental_state)}
                    </div>
                    <span className="text-xs text-purple-200">
                      {new Date(reading.created_at).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">{reading.is_reversed ? '🔄' : '✨'}</div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{reading.card.name}</h3>
                      <p className="text-sm text-purple-200">{reading.card.name_en}</p>
                    </div>
                  </div>

                  <p className="text-sm text-purple-100 line-clamp-2">
                    {reading.interpretation}
                  </p>

                  {reading.user_comment && (
                    <div className="mt-2 pt-2 border-t border-purple-400">
                      <p className="text-xs text-purple-200">💭 {reading.user_comment}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* ページネーション */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => fetchReadings(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                前へ
              </button>
              <span className="text-white">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => fetchReadings(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                次へ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
