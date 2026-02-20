/**
 * 日付を "YYYY/M/D" 形式にフォーマット
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}/${month}/${day}`;
};

/**
 * メンタル状態をラベルに変換
 */
export const getMentalStateLabel = (state: string): string => {
  const labels = {
    sunny: '☀️ 晴れ',
    cloudy: '☁️ 曇り',
    rainy: '🌧️ 雨',
  };
  return labels[state as keyof typeof labels] || state;
};

/**
 * ターゲットをラベルに変換
 */
export const getTargetLabel = (target: string): string => {
  return target === 'self' ? '自分' : '相手';
};
