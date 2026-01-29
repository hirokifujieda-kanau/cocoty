/**
 * タロット占いAPIクライアント
 * バックエンドAPI統合版
 */

import { apiRequest } from './client';

// ============================================================================
// 型定義
// ============================================================================

export interface TarotCard {
  id: number;
  name: string;
  name_en: string;
  meaning: string;
  reverse_meaning: string;
  description: string;
  image_url: string;
}

export interface TarotReading {
  id: number;
  user_id: number;
  target: 'self' | 'other';
  mental_state: 'sunny' | 'cloudy' | 'rainy';
  card_id: number;
  is_reversed: boolean;
  interpretation: string;
  user_comment?: string;
  created_at: string;
  updated_at: string;
  card: TarotCard;
}

export interface CreateTarotReadingParams {
  target: 'self' | 'other';
  mental_state: 'sunny' | 'cloudy' | 'rainy';
  card_id: number;
  is_reversed: boolean;
  interpretation: string;
  user_comment?: string;
}

export interface TarotReadingsResponse {
  readings: TarotReading[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export interface CanReadTodayResponse {
  can_read: boolean;
  last_reading_date: string | null;
}

// ============================================================================
// APIクライアント関数
// ============================================================================

/**
 * タロットカードマスタを取得（認証不要）
 * 
 * @returns 22枚のタロットカード配列
 * @example
 * const cards = await getTarotCards();
 * console.log(cards.length); // => 22
 */
export async function getTarotCards(): Promise<TarotCard[]> {
  const response = await apiRequest<{ cards: TarotCard[] }>('/tarot/cards', {
    requireAuth: false // マスタデータは認証不要
  });
  return response.cards;
}

/**
 * 今日タロット占いができるかチェック（認証必要）
 * バックエンドAPIで制限を確認
 * 
 * @returns can_read: true（占える）/ false（今日はもう占った）
 * @example
 * const { can_read } = await canReadTarotToday();
 * if (!can_read) {
 *   alert('今日はもう占いました！');
 * }
 */
export async function canReadTarotToday(): Promise<CanReadTodayResponse> {
  return apiRequest<CanReadTodayResponse>('/tarot/can_read_today', {
    requireAuth: true
  });
}

/**
 * タロット占いを実行（新規作成）（認証必要）
 * 
 * @param params 占いパラメータ
 * @returns 作成された占い結果
 * @example
 * const reading = await createTarotReading({
 *   target: 'self',
 *   mental_state: 'sunny',
 *   card_id: 5,
 *   is_reversed: false,
 *   interpretation: '新しい冒険が...'
 * });
 */
export async function createTarotReading(params: CreateTarotReadingParams): Promise<TarotReading> {
  const response = await apiRequest<{ reading: TarotReading }>('/tarot/readings', {
    method: 'POST',
    requireAuth: true,
    body: JSON.stringify({ reading: params })
  });
  return response.reading;
}

/**
 * タロット占い履歴を取得（認証必要）
 * 
 * @param page ページ番号（デフォルト: 1）
 * @param perPage 1ページあたりの件数（デフォルト: 20）
 * @returns 占い履歴とページネーション情報
 * @example
 * const { readings, pagination } = await getTarotReadings(1, 10);
 * console.log(`${pagination.current_page} / ${pagination.total_pages}`);
 */
export async function getTarotReadings(page: number = 1, perPage: number = 20): Promise<TarotReadingsResponse> {
  return apiRequest<TarotReadingsResponse>(`/tarot/readings?page=${page}&per_page=${perPage}`, {
    requireAuth: true
  });
}

/**
 * タロット占い詳細を取得（認証必要）
 * 
 * @param id 占い結果ID
 * @returns 占い結果詳細
 */
export async function getTarotReading(id: number): Promise<TarotReading> {
  const response = await apiRequest<{ reading: TarotReading }>(`/tarot/readings/${id}`, {
    requireAuth: true
  });
  return response.reading;
}

/**
 * タロット占いに感想を追加（認証必要）
 * 
 * @param id 占い結果ID
 * @param comment ユーザーの感想
 * @returns 更新された占い結果
 * @example
 * const updated = await updateTarotReadingComment(123, '当たってました！');
 */
export async function updateTarotReadingComment(id: number, comment: string): Promise<TarotReading> {
  const response = await apiRequest<{ reading: TarotReading }>(`/tarot/readings/${id}`, {
    method: 'PATCH',
    requireAuth: true,
    body: JSON.stringify({ reading: { user_comment: comment } })
  });
  return response.reading;
}

// ============================================================================
// ヘルパー関数（フロントエンド側で実行）
// ============================================================================

/**
 * ランダムにタロットカードを1枚引く（フロントエンド側で実行）
 * バックエンドには選択されたカードIDを送信
 * 
 * @param cards タロットカード配列（getTarotCards()で取得）
 * @returns ランダムに選ばれたカードと正逆位置
 * @example
 * const cards = await getTarotCards();
 * const { card, isReversed } = drawRandomCard(cards);
 * console.log(`${card.name} - ${isReversed ? '逆位置' : '正位置'}`);
 */
export function drawRandomCard(cards: TarotCard[]): { card: TarotCard; isReversed: boolean } {
  const randomIndex = Math.floor(Math.random() * cards.length);
  const card = cards[randomIndex];
  const isReversed = Math.random() < 0.5;
  return { card, isReversed };
}

/**
 * メンタルステートとカードから解釈を生成（フロントエンド側で実行）
 * 
 * @param target 占い対象（self: 自分, other: 相手）
 * @param mentalState メンタル状態（sunny: 晴れ, cloudy: 曇り, rainy: 雨）
 * @param card タロットカード
 * @param isReversed 逆位置フラグ
 * @returns 自動生成された解釈文
 * @example
 * const interpretation = generateInterpretation('self', 'sunny', card, false);
 */
export function generateInterpretation(
  target: 'self' | 'other',
  mentalState: 'sunny' | 'cloudy' | 'rainy',
  card: TarotCard,
  isReversed: boolean
): string {
  const targetText = target === 'self' ? 'あなた自身' : 'あなたの大切な人';
  const mentalText = {
    sunny: '心が晴れやかな今',
    cloudy: '少し心に曇りがある今',
    rainy: '心に雨が降る今'
  }[mentalState];
  
  const cardMeaning = isReversed ? card.reverse_meaning : card.meaning;
  
  return `${targetText}へのメッセージ。${mentalText}、「${card.name}」のカードが現れました。${cardMeaning}。このカードは、${card.description}`;
}

/**
 * タロット占い履歴をCSV形式でエクスポート
 * 
 * @param readings タロット占い履歴配列
 * @returns CSV文字列（BOM付き、Excel対応）
 * @example
 * const { readings } = await getTarotReadings();
 * const csv = exportReadingsToCSV(readings);
 * const blob = new Blob([csv], { type: 'text/csv' });
 * const url = URL.createObjectURL(blob);
 * // ダウンロードリンク生成
 */
export function exportReadingsToCSV(readings: TarotReading[]): string {
  const headers = ['日時', '対象', 'メンタル状態', 'カード', '正逆', '解釈', '感想'];
  
  const rows = readings.map(r => [
    new Date(r.created_at).toLocaleString('ja-JP'),
    r.target === 'self' ? '自分' : '相手',
    { sunny: '晴れ', cloudy: '曇り', rainy: '雨' }[r.mental_state],
    r.card.name,
    r.is_reversed ? '逆位置' : '正位置',
    `"${r.interpretation.replace(/"/g, '""')}"`,
    r.user_comment ? `"${r.user_comment.replace(/"/g, '""')}"` : ''
  ]);
  
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  return '\uFEFF' + csv; // BOM付きでExcelで開けるように
}
