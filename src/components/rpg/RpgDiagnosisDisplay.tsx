'use client';

import React from 'react';
import { Swords, Shield, Target, Heart, Sparkles } from 'lucide-react';
import type { Profile } from '@/lib/api/client';

interface RpgDiagnosisDisplayProps {
  profile: Profile;
  isOwner: boolean;
  onDiagnose?: () => void;
}

const INSTINCT_CONFIG = {
  rpg_fencer: { 
    label: '狩猟本能', 
    icon: Swords,
    color: 'from-red-500 to-orange-500',
    description: 'フェンサー素質'
  },
  rpg_healer: { 
    label: '共感本能', 
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    description: 'ヒーラー素質'
  },
  rpg_schemer: { 
    label: '飛躍本能', 
    icon: Sparkles,
    color: 'from-purple-500 to-indigo-500',
    description: 'スキーマー素質'
  },
  rpg_gunner: { 
    label: '職人魂', 
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
    description: 'ガンナー素質'
  },
  rpg_shielder: { 
    label: '警戒本能', 
    icon: Shield,
    color: 'from-green-500 to-emerald-500',
    description: 'シールダー素質'
  },
} as const;

const LEVEL_LABELS = ['未診断', '弱い', '標準的', '強い', '非常に強い'];

export const RpgDiagnosisDisplay: React.FC<RpgDiagnosisDisplayProps> = ({
  profile,
  isOwner,
  onDiagnose,
}) => {
  const hasDiagnosis = profile.rpg_diagnosed_at && (
    profile.rpg_fencer !== null ||
    profile.rpg_healer !== null ||
    profile.rpg_schemer !== null ||
    profile.rpg_gunner !== null ||
    profile.rpg_shielder !== null
  );

  if (!hasDiagnosis && !isOwner) {
    // 他人のプロフィールで未診断の場合は何も表示しない
    return null;
  }

  if (!hasDiagnosis && isOwner) {
    // 自分のプロフィールで未診断の場合は診断ボタンを表示
    return (
      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 rounded-2xl p-6 text-center">
        <Sparkles className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">RPG診断</h3>
        <p className="text-gray-300 mb-4">
          あなたの5つの本能を診断しましょう
        </p>
        <button
          onClick={onDiagnose}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105"
        >
          診断を開始
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-300" />
            RPG診断結果
          </h3>
          {profile.rpg_diagnosed_at && (
            <p className="text-sm text-gray-400 mt-1">
              診断日: {new Date(profile.rpg_diagnosed_at).toLocaleDateString('ja-JP')}
            </p>
          )}
        </div>
        {isOwner && onDiagnose && (
          <button
            onClick={onDiagnose}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            再診断
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(INSTINCT_CONFIG).map(([key, config]) => {
          const level = profile[key as keyof Profile] as number | null;
          const Icon = config.icon;
          
          return (
            <div
              key={key}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 bg-gradient-to-br ${config.color} rounded-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold">{config.label}</div>
                  <div className="text-xs text-gray-400">{config.description}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${config.color} transition-all duration-500`}
                    style={{ width: `${((level || 0) / 4) * 100}%` }}
                  />
                </div>
                <div className="text-white font-bold text-sm w-16 text-right">
                  Lv.{level || 0}
                </div>
              </div>
              
              <div className="text-xs text-gray-400 mt-2">
                {LEVEL_LABELS[level || 0]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
