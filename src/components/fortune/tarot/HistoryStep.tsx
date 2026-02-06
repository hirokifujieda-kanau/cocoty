import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { TarotReading } from '@/lib/api/tarot';
import { useHistoryData } from '@/hooks/useHistoryData';
import { HistoryCard } from './components';

interface HistoryStepProps {
  onClose: () => void;
  onViewDetail: (reading: TarotReading) => void;
  currentReading?: TarotReading | null;
}

export const HistoryStep: React.FC<HistoryStepProps> = ({ onClose, onViewDetail, currentReading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const historyListRef = useRef<HTMLDivElement>(null);

  const { readings, loading, error, totalPages } = useHistoryData({
    currentPage,
    perPage,
    currentReading,
  });

  // ページが変わったら一番上にスクロール
  useEffect(() => {
    if (historyListRef.current) {
      historyListRef.current.scrollTop = 0;
    }
  }, [currentPage]);

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
              <HistoryCard
                key={reading.id}
                reading={reading}
                onClick={() => onViewDetail(reading)}
                showDivider={index < readings.length - 1}
              />
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
