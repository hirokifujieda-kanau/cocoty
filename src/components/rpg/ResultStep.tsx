'use client';

import React from 'react';
import type { InstinctLevels } from '@/lib/rpg/calculator';
import { INSTINCT_DESCRIPTIONS } from '@/lib/rpg/constants';
import { saveRpgDiagnosis } from '@/lib/api/client';

// シンプルなレーダーチャートコンポーネント
const RadarChart: React.FC<{ data: InstinctLevels }> = ({ data }) => {
  // 順序を固定（時計回り）
  const CHART_ORDER: (keyof InstinctLevels)[] = [
    '職人魂',
    '狩猟本能',
    '共感本能',
    '防衛本能',
    '飛躍本能',
  ];
  
  const labels = CHART_ORDER;
  const values = CHART_ORDER.map(key => data[key]);
  const maxValue = 4;
  
  // 五角形の頂点を計算
  const points = labels.map((_, index) => {
    const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
    const value = values[index];
    const radius = (value / maxValue) * 100;
    const x = 150 + radius * Math.cos(angle);
    const y = 150 + radius * Math.sin(angle);
    return { x, y, value };
  });

  // 背景グリッドの円
  const gridCircles = [1, 2, 3, 4].map(level => {
    const radius = (level / maxValue) * 100;
    return radius;
  });

  return (
    <svg viewBox="0 0 300 300" className="w-full h-full max-w-md mx-auto">
      {/* 背景グリッド */}
      {gridCircles.map((radius, i) => (
        <circle
          key={i}
          cx="150"
          cy="150"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
        />
      ))}

      {/* グリッドライン */}
      {labels.map((_, index) => {
        const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
        const x = 150 + 100 * Math.cos(angle);
        const y = 150 + 100 * Math.sin(angle);
        return (
          <line
            key={index}
            x1="150"
            y1="150"
            x2={x}
            y2={y}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
        );
      })}

      {/* データ領域 */}
      <polygon
        points={points.map(p => `${p.x},${p.y}`).join(' ')}
        fill="rgba(168, 85, 247, 0.3)"
        stroke="rgba(168, 85, 247, 1)"
        strokeWidth="2"
      />

      {/* データポイント */}
      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="4"
          fill="rgba(236, 72, 153, 1)"
          stroke="#fff"
          strokeWidth="2"
        />
      ))}

      {/* ラベル */}
      {labels.map((label, index) => {
        const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
        const x = 150 + 120 * Math.cos(angle);
        const y = 150 + 120 * Math.sin(angle);
        return (
          <text
            key={index}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fff"
            fontSize="12"
            fontWeight="bold"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
};

interface ResultStepProps {
  instinctLevels: InstinctLevels;
  onClose: () => void;
  onRetry: () => void;
  onSave?: (saved: boolean) => void;
  isCompleted?: boolean;  // 診断完了済みフラグ
}

export const ResultStep: React.FC<ResultStepProps> = ({
  instinctLevels,
  onClose,
  onRetry,
  onSave,
  isCompleted = false,
}) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(isCompleted); // 完了済みなら既に保存済み
  const hasAttemptedSave = React.useRef(false); // 保存試行フラグ

  // 自動保存: 未完了の場合のみ、結果表示時に1回だけ自動保存
  React.useEffect(() => {
    // 既に保存を試行済み、または完了済み、または既に保存済みならスキップ
    if (hasAttemptedSave.current || isCompleted || isSaved) {
      return;
    }

    hasAttemptedSave.current = true;
    handleSave();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 診断結果を保存
  const handleSave = async () => {
    // 完了済みの場合は保存処理をスキップ
    if (isCompleted) {
      return;
    }

    setIsSaving(true);
    try {
      // 診断結果をAPI形式に変換
      const diagnosisData = {
        fencer: instinctLevels['狩猟本能'],
        shielder: instinctLevels['防衛本能'],
        gunner: instinctLevels['職人魂'],
        healer: instinctLevels['共感本能'],
        schemer: instinctLevels['飛躍本能'],
      };

      // バックエンドAPIに保存（認証されたユーザーに自動保存）
      await saveRpgDiagnosis(diagnosisData);
      
      setIsSaved(true);
      onSave?.(true);
    } catch (error) {
      console.error('❌ RPG診断の保存に失敗:', error);
      onSave?.(false);
      // アラートは表示しない（コンソールログのみ）
    } finally {
      setIsSaving(false);
    }
  };

  // 因子の順序を固定（要件通り：時計回り）
  const FIXED_ORDER: (keyof typeof INSTINCT_DESCRIPTIONS)[] = [
    '職人魂',    // ガンナー素質
    '狩猟本能',  // フェンサー素質
    '共感本能',  // ヒーラー素質
    '防衛本能',  // シールダー素質
    '飛躍本能',  // スキーマー素質
  ];

  return (
    <div className="space-y-8">
      {/* タイトル */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          🎮 あなたのRPG診断結果
        </h2>
        <p className="text-purple-200">
          5つの本能から見たあなたの特性
        </p>
      </div>

      {/* レーダーチャート */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
        <div className="max-w-md mx-auto aspect-square">
          <RadarChart data={instinctLevels} />
        </div>
      </div>

      {/* 5つの因子を静的に表示（固定順序） */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white text-center">📊 全本能の詳細レポート</h3>
        <p className="text-center text-purple-200 text-sm mb-4">
          <span className="font-semibold">名称：</span>ガンナー素質・フェンサー素質・ヒーラー素質・シールダー素質・スキーマー素質<br />
          <span className="font-semibold">遺伝"素質"名：</span>職人魂・狩猟本能・共感本能・防衛本能・飛躍本能
        </p>
        {FIXED_ORDER.map((instinct) => {
          const info = INSTINCT_DESCRIPTIONS[instinct];
          const level = instinctLevels[instinct];
          const isHigh = level >= 3;
          
          return (
            <div
              key={instinct}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-4"
            >
              {/* ヘッダー */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{info.emoji}</span>
                  <div>
                    <h4 className="font-bold text-white text-lg">{instinct}</h4>
                    <p className="text-sm text-purple-200">{info.素質名}</p>
                    <p className="text-xs text-purple-300 mt-1">{info.description}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-3xl font-bold text-white">
                    {level}
                  </div>
                  <div className="text-xs text-purple-200 mt-1">
                    レベル
                  </div>
                </div>
              </div>
              
              {/* レベルバー */}
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                  style={{ width: `${(level / 4) * 100}%` }}
                />
              </div>

              {/* 詳細情報 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* 左列：高い場合の特徴 */}
                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-3 border border-blue-400/30">
                    <div className="font-semibold text-blue-200 mb-2 text-sm">
                      📈 レベルが高い人の特徴
                    </div>
                    <p className="text-white/90 text-sm mb-2">{info.高い人の特徴}</p>
                    <div className="space-y-1">
                      <div className="flex items-start gap-1">
                        <span className="text-green-300 text-xs">✅</span>
                        <p className="text-green-200 text-xs">{info.高い利点}</p>
                      </div>
                      <div className="flex items-start gap-1">
                        <span className="text-orange-300 text-xs">⚠️</span>
                        <p className="text-orange-200 text-xs">{info.高いコスト}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 右列：低い場合の特徴 */}
                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-gray-500/20 to-slate-500/20 rounded-lg p-3 border border-gray-400/30">
                    <div className="font-semibold text-gray-200 mb-2 text-sm">
                      📉 レベルが低い人の特徴
                    </div>
                    <p className="text-white/90 text-sm mb-2">{info.低い人の特徴}</p>
                    <div className="space-y-1">
                      <div className="flex items-start gap-1">
                        <span className="text-green-300 text-xs">✅</span>
                        <p className="text-green-200 text-xs">{info.低い利点}</p>
                      </div>
                      <div className="flex items-start gap-1">
                        <span className="text-orange-300 text-xs">⚠️</span>
                        <p className="text-orange-200 text-xs">{info.低いコスト}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* アクションボタン */}
      <div className="space-y-3">
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all"
        >
          閉じる
        </button>
      </div>
      
      {isCompleted && (
        <p className="text-center text-purple-200 text-sm mt-4">
          この診断は完了済みです。診断は1回のみ実施可能です。
        </p>
      )}
      
      {!isCompleted && (
        <p className="text-center text-purple-200 text-sm mt-4">
          結果は自動的に保存されました
        </p>
      )}
    </div>
  );
};
