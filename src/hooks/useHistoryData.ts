import { useState, useEffect } from 'react';
import { getTarotReadings, type TarotReading } from '@/lib/api/tarot';

interface UseHistoryDataProps {
  currentPage: number;
  perPage: number;
  currentReading?: TarotReading | null;
}

export const useHistoryData = ({
  currentPage,
  perPage,
  currentReading,
}: UseHistoryDataProps) => {
  const [readings, setReadings] = useState<TarotReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReadings(currentPage);
  }, [currentPage, currentReading]);

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

  return {
    readings,
    loading,
    error,
    totalPages,
    refetch: () => fetchReadings(currentPage),
  };
};
