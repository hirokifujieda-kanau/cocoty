/**
 * 環境判定ユーティリティ
 */

/**
 * Local環境かどうかを判定
 */
export function isLocalEnvironment(): boolean {
  return process.env.NODE_ENV === 'development' || 
         process.env.NEXT_PUBLIC_API_BASE_URL?.includes('localhost') || 
         false;
}

/**
 * タロット占いの1日1回制限を適用するか
 * Local環境では制限なし
 */
export function shouldEnforceTarotDailyLimit(): boolean {
  return !isLocalEnvironment();
}
