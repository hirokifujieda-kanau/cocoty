'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import type { Profile } from '@/lib/api/client';

interface TarotCardProps {
  profile: Profile;
  isOwner: boolean;
  onOpenTarot: () => void;
}

/**
 * タロット占い完了状態を表示するカード
 * 1日1回制限（0時リセット）
 */
export const TarotCard: React.FC<TarotCardProps> = ({
  profile,
  isOwner,
  onOpenTarot,
}) => {
  // 今日引いたかどうかを判定
  const lastDrawn = profile.tarot_last_drawn_at
    ? new Date(profile.tarot_last_drawn_at)
    : null;
  const today = new Date();
  const isDrawnToday =
    lastDrawn &&
    lastDrawn.getDate() === today.getDate() &&
    lastDrawn.getMonth() === today.getMonth() &&
    lastDrawn.getFullYear() === today.getFullYear();

  // 他人が今日引いていない場合はクリック不可
  const isClickable = isOwner || isDrawnToday;

  return (
    <div
      onClick={isClickable ? onOpenTarot : undefined}
      className={`relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 transition-all duration-300 shadow-xl overflow-hidden ${
        isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-75'
      }`}
    >
      {/* 背景装飾 */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-300" />
            <h3 className="text-xl font-bold text-white">タロット占い</h3>
          </div>
          {isDrawnToday && (
            <span className="px-3 py-1 bg-green-500/90 text-white text-sm font-bold rounded-full shadow-lg">
              本日完了
            </span>
          )}
        </div>

        <div className="text-center py-6">
          {isDrawnToday ? (
            <>
              <div className="mb-3">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
              </div>
              <p className="text-white font-semibold mb-2">今日の占い済み</p>
              <p className="text-purple-100 text-sm">
                {isOwner
                  ? 'タップして結果を確認'
                  : '本日の占い結果を表示中'}
              </p>
              <p className="text-purple-200 text-xs mt-3">
                次回: 明日0:00〜
              </p>
            </>
          ) : (
            <>
              {isOwner ? (
                <>
                  <div className="mb-3">
                    <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-3 border-2 border-white/30">
                      <Sparkles className="h-10 w-10 text-purple-200" />
                    </div>
                  </div>
                  <p className="text-white font-semibold mb-2">
                    今日のカードを引く
                  </p>
                  <p className="text-purple-100 text-sm">
                    1日1回、運勢を占えます
                  </p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-3">
                    <Sparkles className="h-10 w-10 text-purple-300 opacity-50" />
                  </div>
                  <p className="text-purple-200">本日未実施</p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
