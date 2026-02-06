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
        <h3 className="font-bold text-xs leading-5 text-center text-white font-noto-sans-jp">
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
          <div 
            ref={historyListRef} 
            className="space-y-0 max-h-96 md:max-h-[600px] overflow-y-auto backdrop-blur-sm rounded-xl w-[343px] mx-auto bg-gradient-to-b from-[#1B2742] to-[#0F172A]"
          >
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
            <div className="flex items-center justify-center gap-2 w-[343px] mx-auto">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-transparent flex items-center"
              >
                <ChevronLeft className="w-4 h-6 -mr-[10px] text-white" />
                <ChevronLeft className="w-4 h-6 text-white" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-4 h-4 flex items-center justify-center rounded transition-all text-white font-noto-sans-jp text-base font-medium leading-none ${
                    currentPage === pageNum ? 'bg-[#C4C46D]' : 'bg-transparent'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-transparent flex items-center"
              >
                <ChevronRight className="w-4 h-6 -mr-[10px] text-white" />
                <ChevronRight className="w-4 h-6 text-white" />
              </button>
            </div>
          )}
        </>
      )}

      <button
        onClick={onClose}
        className="w-[343px] mx-auto block px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
      >
        閉じる
      </button>
    </div>
  );
};
