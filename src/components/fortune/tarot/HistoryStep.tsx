import React, { useEffect, useState } from 'react';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { getTarotReadings, type TarotReading } from '@/lib/api/tarot';
import { generateMockReadings } from '@/lib/mock/mockTarot';

interface HistoryStepProps {
  onClose: () => void;
  onViewDetail: (reading: TarotReading) => void;
}

export const HistoryStep: React.FC<HistoryStepProps> = ({ onClose, onViewDetail }) => {
  const [readings, setReadings] = useState<TarotReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10;

  useEffect(() => {
    fetchReadings(currentPage);
  }, [currentPage]);

  const fetchReadings = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // モックデータを使用
      const mockReadings = generateMockReadings(20);
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedReadings = mockReadings.slice(startIndex, endIndex);
      
      setReadings(paginatedReadings);
      setTotalPages(Math.ceil(mockReadings.length / perPage));
      
      // 本番環境用のAPI呼び出し（コメントアウト）
      // const response = await getTarotReadings(page, perPage);
      // setReadings(response.readings);
      // setTotalPages(response.pagination.total_pages);
    } catch (err) {
      console.error('Failed to fetch readings:', err);
      setError('占い履歴の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMentalStateLabel = (state: string) => {
    const labels = {
      sunny: '☀️ 晴れ',
      cloudy: '☁️ 曇り',
      rainy: '🌧️ 雨'
    };
    return labels[state as keyof typeof labels] || state;
  };

  const getTargetLabel = (target: string) => {
    return target === 'self' ? '自分' : '相手';
  };

  if (loading && readings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3
          style={{
            fontFamily: 'Noto Sans JP',
            fontWeight: 700,
            fontSize: '12px',
            lineHeight: '20px',
            letterSpacing: '0%',
            textAlign: 'center',
            color: '#FFFFFF'
          }}
        >
          過去の占い
        </h3>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded">
          {error}
        </div>
      )}

      {readings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔮</div>
          <p className="text-white text-lg">まだ占い履歴がありません</p>
          <p className="text-purple-200 mt-2">最初の占いを始めましょう</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {readings.map((reading) => (
              <button
                key={reading.id}
                onClick={() => onViewDetail(reading)}
                className="w-full p-4 backdrop-blur-sm rounded-xl transition-all text-left border border-purple-400/30 hover:border-purple-400"
                style={{
                  background: 'linear-gradient(180deg, #1B2742 0%, #0F172A 100%)'
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-300" />
                    <span className="text-sm text-purple-200">
                      {formatDate(reading.created_at)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 bg-purple-500/30 rounded-full text-white">
                      {getTargetLabel(reading.target)}
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-500/30 rounded-full text-white">
                      {getMentalStateLabel(reading.mental_state)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">
                    {reading.is_reversed ? '🔄' : '✨'}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">
                      {reading.card.name}
                    </h4>
                    <p className="text-sm text-purple-200">
                      {reading.card.name_en}
                      {reading.is_reversed && ' (逆位置)'}
                    </p>
                  </div>
                </div>

                {reading.user_comment && (
                  <div className="mt-3 pt-3 border-t border-purple-400/30">
                    <p className="text-sm text-purple-100 italic">
                      💭 {reading.user_comment}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              
              <span className="text-white">
                {currentPage} / {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
            </div>
          )}
        </>
      )}

      <button
        onClick={onClose}
        className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
      >
        閉じる
      </button>
    </div>
  );
};
