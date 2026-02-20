/**
 * タロット占い関連の型定義
 */

import type { TarotCard as APITarotCard } from '@/lib/api/tarot';

export type Target = 'self' | 'other';
export type MentalState = 'sunny' | 'cloudy' | 'rainy' | 'very-rainy';
export type Step = 'check' | 'alreadyDrawn' | 'target' | 'mental' | 'shuffle' | 'select' | 'reveal' | 'result' | 'comment' | 'history' | 'historyDetail';

// API型をそのまま使用
export type TarotCard = APITarotCard;

export interface DrawnCardResult {
  card: TarotCard;
  isReversed: boolean;
}

export interface TarotState {
  step: Step;
  target: Target | null;
  mentalState: MentalState | null;
  selectedCardIndex: number | null;
  drawnCard: DrawnCardResult | null;
  interpretation: string;
  userComment: string;
  isShuffling: boolean;
  isRevealing: boolean;
}
