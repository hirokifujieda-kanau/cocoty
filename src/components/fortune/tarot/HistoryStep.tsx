import React, { useEffect, useState, useRef } from 'react';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { getTarotReadings, type TarotReading } from '@/lib/api/tarot';

interface HistoryStepProps {
  onClose: () => void;
  onViewDetail: (reading: TarotReading) => void;
  currentReading?: TarotReading | null;
}

export const HistoryStep: React.FC<HistoryStepProps> = ({ onClose, onViewDetail, currentReading }) => {
  const [readings, setReadings] = useState<TarotReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10;
  const historyListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchReadings(currentPage);
  }, [currentPage, currentReading]);

  // ページが変わったら一番上にスクロール
  useEffect(() => {
    if (historyListRef.current) {
      historyListRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  const fetchReadings = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // API呼び出しで履歴を取得
      const response = await getTarotReadings(page, perPage);
      let fetchedReadings = response.readings;
      
      // 現在の占い結果があれば一番上に追加
      if (currentReading) {
        fetchedReadings = [currentReading, ...fetchedReadings];
      }
      
      setReadings(fetchedReadings);
      setTotalPages(response.pagination.total_pages);
    } catch (err) {
      console.error('Failed to fetch readings:', err);
      setError('占い履歴の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}/${month}/${day}`;
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
          <div ref={historyListRef} className="space-y-0 max-h-96 md:max-h-[600px] overflow-y-auto backdrop-blur-sm rounded-xl" style={{ width: '343px', margin: '0 auto', background: 'linear-gradient(180deg, #1B2742 0%, #0F172A 100%)' }}>
            {readings.map((reading, index) => (
              <div key={reading.id}>
                <button
                  onClick={() => onViewDetail(reading)}
                  className="w-full p-4 transition-all text-left"
                  style={{
                    background: 'transparent'
                  }}
                >
                <div style={{ display: 'flex', gap: '12px' }}>
                  {/* 左側: カード画像 */}
                  <div style={{ flexShrink: 0 }}>
                    <img
                      alt="カード"
                      width={30}
                      height={49}
                      src={reading.card.image_url}
                    />
                  </div>
                  
                  {/* 右側: テキスト情報 */}
                  <div style={{ flex: 1 }}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          style={{
                            fontFamily: 'Noto Sans JP',
                            fontWeight: 700,
                            fontSize: '8px',
                            lineHeight: '1',
                            letterSpacing: '0%',
                            textAlign: 'center',
                            color: '#FFFFFF',
                            background: reading.target === 'self' ? '#3A84C9' : '#C93A67',
                            padding: '3px 5px',
                            borderRadius: '10px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {getTargetLabel(reading.target)}
                        </span>
                        <span
                          style={{
                            fontFamily: 'Noto Sans JP',
                            fontWeight: 700,
                            fontSize: '10px',
                            lineHeight: '20px',
                            letterSpacing: '0%',
                            textAlign: 'center',
                            color: '#AEAEAE'
                          }}
                        >
                          {formatDate(reading.created_at)}
                        </span>
                        <span 
                          style={{
                            fontFamily: 'Noto Sans JP',
                            fontWeight: 700,
                            fontSize: '12px',
                            lineHeight: '100%',
                            letterSpacing: '0%',
                            textAlign: 'center',
                            color: '#C4C46D',
                            margin: 0
                          }}
                        >
                          {reading.card.name}
                        </span>
                        <span
                          style={{
                            fontFamily: 'Noto Sans JP',
                            fontWeight: 700,
                            fontSize: '12px',
                            lineHeight: '100%',
                            letterSpacing: '0%',
                            textAlign: 'center',
                            color: '#C4C46D',
                            margin: 0
                          }}
                        >
                          ({reading.is_reversed ? '逆位置' : '正位置'})
                        </span>
                      </div>
                      <div className="flex gap-2">
                      </div>
                    </div>
                    
                    {reading.user_comment && (
                      <p
                        style={{
                          fontFamily: 'Noto Sans JP',
                          fontWeight: 400,
                          fontSize: '12px',
                          lineHeight: '112.99999999999999%',
                          letterSpacing: '0%',
                          color: '#FFFFFF',
                          marginTop: '8px',
                          marginBottom: 0
                        }}
                      >
                        {reading.user_comment}
                      </p>
                    )}
                  </div>
                </div>
                </button>
                {/* 最後の項目以外に区切り線 */}
                {index < readings.length - 1 && (
                  <div style={{ borderBottom: '1px solid #73732F', width: '169px', margin: '0 auto' }} />
                )}
              </div>
            ))}
          </div>

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2" style={{ width: '343px', margin: '0 auto' }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                style={{ background: 'transparent', display: 'flex', alignItems: 'center' }}
              >
                <ChevronLeft style={{ width: '16px', height: '24px', marginRight: '-10px' }} className="text-white" />
                <ChevronLeft style={{ width: '16px', height: '24px' }} className="text-white" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-4 h-4 flex items-center justify-center rounded transition-all"
                  style={{
                    background: currentPage === pageNum ? '#C4C46D' : 'transparent',
                    color: '#FFFFFF',
                    fontFamily: 'Noto Sans JP',
                    fontSize: '16px',
                    fontWeight: 500,
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    textAlign: 'center'
                  }}
                >
                  {pageNum}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                style={{ background: 'transparent', display: 'flex', alignItems: 'center' }}
              >
                <ChevronRight style={{ width: '16px', height: '24px', marginRight: '-10px' }} className="text-white" />
                <ChevronRight style={{ width: '16px', height: '24px' }} className="text-white" />
              </button>
            </div>
          )}
        </>
      )}

      <button
        onClick={onClose}
        className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
        style={{ width: '343px', margin: '0 auto', display: 'block' }}
      >
        閉じる
      </button>
    </div>
  );
};
