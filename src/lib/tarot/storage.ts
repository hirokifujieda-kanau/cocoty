import type { TarotState } from '@/components/fortune/tarot/types';

export interface SavedTarotReading {
  tarotState: TarotState;
  selectedTarget: 'self' | 'partner' | null;
  savedFeeling: 'good' | 'soso' | 'bad' | null;
  savedComment: string;
}

const STORAGE_KEY = 'tarot_today_reading';

/**
 * 今日の占い結果をlocalStorageから取得
 */
export const getTodayReading = (): SavedTarotReading | null => {
  const today = new Date().toDateString();
  const storedData = localStorage.getItem(STORAGE_KEY);
  
  if (storedData) {
    try {
      const reading = JSON.parse(storedData);
      // 日付が今日と一致するかチェック
      if (reading.date === today) {
        return reading.data;
      }
    } catch (error) {
      console.error('Failed to parse stored tarot reading:', error);
    }
  }
  
  return null;
};

/**
 * 占い完了時に今日の結果を保存
 */
export const saveTodayReading = (reading: SavedTarotReading): void => {
  const today = new Date().toDateString();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      date: today,
      data: reading,
    })
  );
};
