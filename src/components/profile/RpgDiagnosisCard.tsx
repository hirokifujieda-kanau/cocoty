'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import type { Profile } from '@/lib/api/client';

interface DiagnosisCardProps {
  profile: Profile;
  isOwner: boolean;
  onOpenDiagnosis: () => void;
}

/**
 * RPG診断完了状態を表示するカード
 */
export const RpgDiagnosisCard: React.FC<DiagnosisCardProps> = ({
  profile,
  isOwner,
  onOpenDiagnosis,
}) => {
  const isCompleted = !!profile.rpg_diagnosis_completed_at;
  
  // 他人の未診断プロフィールはクリック不可
  const isClickable = isOwner || isCompleted;

  return (
    <div
      onClick={isClickable ? onOpenDiagnosis : undefined}
      className={`relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-2xl p-6 transition-all duration-300 shadow-xl overflow-hidden ${
        isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-75'
      }`}
    >
      {/* 背景装飾 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-300" />
            <h3 className="text-xl font-bold text-white">RPG診断</h3>
          </div>
          {isCompleted && (
            <span className="px-3 py-1 bg-green-500/90 text-white text-sm font-bold rounded-full shadow-lg">
              完了
            </span>
          )}
        </div>

        {isCompleted ? (
          <div className="space-y-3">
            <p className="text-purple-100 text-sm mb-3">あなたの本能レベル</p>
            <DiagnosisResultBar label="狩猟本能" level={profile.rpg_fencer} />
            <DiagnosisResultBar label="共感本能" level={profile.rpg_healer} />
            <DiagnosisResultBar label="飛躍本能" level={profile.rpg_schemer} />
            <DiagnosisResultBar label="職人魂" level={profile.rpg_gunner} />
            <DiagnosisResultBar label="警戒本能" level={profile.rpg_shielder} />
            <p className="text-purple-200 text-sm mt-4 text-center">
              タップして詳細を表示
            </p>
          </div>
        ) : (
          <div className="text-center py-6">
            {isOwner ? (
              <>
                <div className="mb-3">
                  <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-3">
                    <Sparkles className="h-8 w-8 text-purple-200" />
                  </div>
                </div>
                <p className="text-white font-semibold mb-2">診断を開始</p>
                <p className="text-purple-200 text-sm">
                  あなたの5つの本能を診断します
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-3">
                  <Sparkles className="h-8 w-8 text-purple-300 opacity-50" />
                </div>
                <p className="text-purple-200">未診断</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 診断結果バー
 */
const DiagnosisResultBar: React.FC<{ label: string; level?: number }> = ({
  label,
  level,
}) => {
  if (!level) return null;

  return (
    <div className="flex items-center justify-between">
      <span className="text-white text-sm font-medium w-20">{label}</span>
      <div className="flex gap-1 flex-1 max-w-[120px]">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-all ${
              i <= level
                ? 'bg-gradient-to-r from-yellow-300 to-yellow-500 shadow-lg shadow-yellow-500/50'
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>
      <span className="text-purple-200 text-xs w-8 text-right">Lv.{level}</span>
    </div>
  );
};
