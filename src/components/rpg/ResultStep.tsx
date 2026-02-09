'use client';

import React from 'react';
import type { InstinctLevels } from '@/lib/rpg/calculator';
import { INSTINCT_DESCRIPTIONS } from '@/lib/mock/mockRpgDiagnosis';
import { saveRpgDiagnosis } from '@/lib/api/client';

// グラデーション背景付きレーダーチャートコンポーネント
const RadarChart: React.FC<{ data: InstinctLevels }> = ({ data }) => {
  const labels = Object.keys(data) as (keyof InstinctLevels)[];
  const values = Object.values(data);
  const maxValue = 4;
  
  // 五角形の頂点を計算
  const points = labels.map((_, index) => {
    const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
    const value = values[index];
    const radius = (value / maxValue) * 90; // 最大値90に調整
    const x = 150 + radius * Math.cos(angle);
    const y = 150 + radius * Math.sin(angle);
    return { x, y, value };
  });

  // 最大サイズの五角形（背景用）
  const maxPolygonPoints = labels.map((_, index) => {
    const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
    const x = 150 + 100 * Math.cos(angle);
    const y = 150 + 100 * Math.sin(angle);
    return { x, y };
  });

  // グリッド用の五角形（複数サイズ）
  const gridPentagons = [0.2, 0.4, 0.6, 0.8].map(ratio => {
    return labels.map((_, index) => {
      const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
      const x = 150 + 100 * ratio * Math.cos(angle);
      const y = 150 + 100 * ratio * Math.sin(angle);
      return { x, y };
    });
  });

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square">
      <svg viewBox="0 0 300 300" className="w-full h-full" style={{ display: 'block' }}>
        <defs>
          {/* データ領域のグラデーション（明るく光る感じ） */}
          <linearGradient id="dataGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#cffafe', stopOpacity: 0.95 }} />
            <stop offset="50%" style={{ stopColor: '#a5f3fc', stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: '#67e8f9', stopOpacity: 0.85 }} />
          </linearGradient>
          
          {/* 背景五角形のグラデーション */}
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#1e40af', stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: '#1e3a8a', stopOpacity: 0.8 }} />
          </linearGradient>
          
          {/* 角丸フィルター */}
          <filter id="round">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
          </filter>
          
          {/* 放射状の光グラデーション */}
          <radialGradient id="lightGradient">
            <stop offset="0%" style={{ stopColor: '#22d3ee', stopOpacity: 0.4 }} />
            <stop offset="50%" style={{ stopColor: '#06b6d4', stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: '#0891b2', stopOpacity: 0 }} />
          </radialGradient>
          
          {/* 光のフィルター（グロー効果 - 形を保持） */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* 奥行き用のグラデーション（内側が明るく、外側が暗く） */}
          <radialGradient id="depthGradient">
            <stop offset="0%" style={{ stopColor: '#22d3ee', stopOpacity: 0.5 }} />
            <stop offset="50%" style={{ stopColor: '#0891b2', stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: '#164e63', stopOpacity: 0 }} />
          </radialGradient>
          
          {/* モヤモヤエフェクト用フィルター */}
          <filter id="mist" x="-100%" y="-100%" width="300%" height="300%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="5" result="turbulence"/>
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="25" result="displacement"/>
            <feGaussianBlur in="displacement" stdDeviation="12" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="blur"/>
              <feMergeNode in="blur"/>
            </feMerge>
          </filter>
          
          {/* 水色（内側）〜ピンク（外側）の放射グラデーション */}
          <radialGradient id="mistGradient" cx="50%" cy="50%">
            <stop offset="0%" style={{ stopColor: '#22d3ee', stopOpacity: 0.8 }} />
            <stop offset="45%" style={{ stopColor: '#22d3ee', stopOpacity: 0.7 }} />
            <stop offset="55%" style={{ stopColor: '#ec4899', stopOpacity: 0.7 }} />
            <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 0.6 }} />
          </radialGradient>
        </defs>

        {/* 中心からの奥行き感を出す放射光 */}
        <circle cx="150" cy="150" r="90" fill="url(#depthGradient)" />

        {/* モヤモヤレイヤー - 外側のピンク */}
        <polygon
          points={maxPolygonPoints.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="#d946ef"
          strokeWidth="35"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.4"
          filter="url(#mist)"
        />
        
        {/* モヤモヤレイヤー - 内側の水色 */}
        <polygon
          points={maxPolygonPoints.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="#22d3ee"
          strokeWidth="8"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.5"
          filter="url(#mist)"
        />

        {/* 背景の最大五角形（フィルターで角丸） */}
        <polygon
          points={maxPolygonPoints.map(p => `${p.x},${p.y}`).join(' ')}
          fill="url(#bgGradient)"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
          filter="url(#round)"
        />

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
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="1"
            />
          );
        })}

        {/* グリッド五角形（線の外側に光） */}
        {gridPentagons.map((pentagon, i) => {
          // 内側ほど明るく（手前に見える）
          const innerRatio = 1 - (i / gridPentagons.length);
          const brightness = 0.3 + innerRatio * 0.6;
          const glowSize = 3 + innerRatio * 6;
          
          return (
            <g key={i}>
              {/* 外側に広がる光レイヤー3（最も外側・薄い） */}
              <polygon
                points={pentagon.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#22d3ee"
                strokeWidth={glowSize * 3}
                opacity={brightness * 0.15}
                strokeLinejoin="round"
                filter="url(#glow)"
              />
              {/* 外側に広がる光レイヤー2（中間） */}
              <polygon
                points={pentagon.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#06b6d4"
                strokeWidth={glowSize * 2}
                opacity={brightness * 0.35}
                strokeLinejoin="round"
                filter="url(#glow)"
              />
              {/* 外側に広がる光レイヤー1（コア） */}
              <polygon
                points={pentagon.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#22d3ee"
                strokeWidth={glowSize}
                opacity={brightness * 0.6}
                strokeLinejoin="round"
                filter="url(#glow)"
              />
              {/* 線本体（細く鮮明に） */}
              <polygon
                points={pentagon.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke={`rgba(34, 211, 238, ${0.5 + innerRatio * 0.5})`}
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </g>
          );
        })}

        {/* データ領域（グラデーション） */}
        <polygon
          points={points.map(p => `${p.x},${p.y}`).join(' ')}
          fill="url(#dataGradient)"
          stroke="rgba(34, 211, 238, 0.8)"
          strokeWidth="2"
        />

        {/* データポイントと数値 */}
        {points.map((point, index) => {
          const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
          const labelX = 150 + 115 * Math.cos(angle);
          const labelY = 150 + 115 * Math.sin(angle);
          
          return (
            <g key={index}>
              {/* 数値ラベル（頂点近く） */}
              <text
                x={labelX}
                y={labelY - 15}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#fff"
                fontSize="14"
                fontWeight="bold"
              >
                {point.value}
              </text>
            </g>
          );
        })}

        {/* ラベルテキスト */}
        {labels.map((label, index) => {
          const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
          const x = 150 + 130 * Math.cos(angle);
          const y = 150 + 130 * Math.sin(angle);
          
          return (
            <text
              key={index}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#3b82f6"
              fontSize="13"
              fontWeight="bold"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
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
      if (isCompleted) {
        console.log('✅ 診断は既に完了済みです。保存処理はスキップします。');
      }
      return;
    }

    console.log('🔄 自動保存を実行します...');
    hasAttemptedSave.current = true;
    handleSave();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 診断結果を保存
  const handleSave = async () => {
    // 完了済みの場合は保存処理をスキップ
    if (isCompleted) {
      console.log('✅ 診断は既に完了しています。保存処理をスキップします。');
      return;
    }

    setIsSaving(true);
    try {
      // 診断結果をAPI形式に変換
      const diagnosisData = {
        fencer: instinctLevels['狩猟本能'],
        shielder: instinctLevels['警戒本能'],
        gunner: instinctLevels['職人魂'],
        healer: instinctLevels['共感本能'],
        schemer: instinctLevels['飛躍本能'],
      };

      // バックエンドAPIに保存（認証されたユーザーに自動保存）
      await saveRpgDiagnosis(diagnosisData);
      
      setIsSaved(true);
      onSave?.(true);
      console.log('✅ 診断結果を自動保存しました');
    } catch (error) {
      console.error('❌ RPG診断の保存に失敗:', error);
      onSave?.(false);
      // アラートは表示しない（コンソールログのみ）
    } finally {
      setIsSaving(false);
    }
  };

  // 因子の順序を固定（要件通り）
  const FIXED_ORDER: (keyof typeof INSTINCT_DESCRIPTIONS)[] = [
    '職人魂',    // ガンナー素質
    '狩猟本能',  // フェンサー素質
    '共感本能',  // ヒーラー素質
    '警戒本能',  // シールダー素質
    '飛躍本能',  // スキーマー素質
  ];

  return (
    <div className="space-y-8">
      {/* メインコンテンツエリア（上部：レーダーチャート + スコア + キャラクター） */}
      <div className="rounded-2xl p-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* 左：スコア表示 */}
          <div>
            {/* タイトル（青い六角形） */}
            <div className="text-center mb-4">
              <div className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-12 py-4 relative"
                   style={{
                     clipPath: 'polygon(15% 0%, 85% 0%, 92% 50%, 85% 100%, 15% 100%, 8% 50%)'
                   }}>
                <h2 className="text-2xl font-bold">
                  あなたの適性診断結果
                </h2>
              </div>
            </div>
            
            <div className="overflow-hidden shadow-lg border-[8px] border-blue-600">
              {FIXED_ORDER.map((instinct, index) => {
                const info = INSTINCT_DESCRIPTIONS[instinct];
                const level = instinctLevels[instinct];
                const isEven = index % 2 === 0;
                return (
                  <div 
                    key={instinct} 
                    className="flex justify-between items-center px-6 border-b-[4px] border-blue-600"
                    style={{ 
                      backgroundColor: isEven ? '#c3ddf5' : '#9fc5f0',
                      paddingBlock: 'calc(var(--spacing) * 2)'
                    }}
                  >
                    <span className="text-blue-600 font-bold text-lg">{instinct}</span>
                    <span className="font-bold text-2xl">
                      <span className="text-blue-800">{level}</span>
                      <span className="text-blue-700 text-base"> ポイント</span>
                    </span>
                  </div>
                );
              })}
              <div className="bg-cyan-500 px-6 py-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-xl">トータル</span>
                  <span className="font-bold text-3xl">
                    <span className="text-white">{Object.values(instinctLevels).reduce((a, b) => a + b, 0)}</span>
                    <span className="text-white text-base">ポイント</span>
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              ※ポイントの大小は、
              <br />
              直接的な評価や優劣を示すものではありません。
            </p>
          </div>

          {/* 中央：レーダーチャート */}
          <div className="flex justify-center">
            <div className="w-80 h-80 relative">
              <RadarChart data={instinctLevels} />
            </div>
          </div>

          {/* 右：キャラクターイラスト + 吹き出し */}
          <div className="flex flex-col items-center">
            <div className="relative bg-white rounded-2xl p-4 mb-4 shadow-lg max-w-xs border-2" style={{ borderColor: '#a5b4fc' }}>
              <p className="text-sm text-gray-700 text-center">
                <span className="font-semibold text-blue-600">診断結果の各数値</span>と
                <br />
                <span className="font-semibold text-blue-600">下の表を照らし合わせる</span>と、
                <br />
                あなたのタイプが分かっちゃいます♪
              </p>
              {/* 吹き出しの三角形（下向き） - 外側のボーダー */}
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-0 h-0 border-l-[13px] border-l-transparent border-r-[13px] border-r-transparent border-t-[13px]" style={{ borderTopColor: '#a5b4fc' }}></div>
              {/* 吹き出しの三角形（下向き） - 内側の白 */}
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-[10px] w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-t-[11px] border-t-white"></div>
            </div>
            {/* キャラクター画像（モック：紫のグラデーション） */}
            <div className="w-48 h-48 bg-gradient-to-br from-pink-200 to-purple-300 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-6xl">👧</span>
            </div>
          </div>
        </div>
      </div>

      {/* 下部：5つのカード - ゲームカード風デザイン */}
      <div className="border-2 rounded-lg p-4" style={{ borderColor: '#fed7aa' }}>
        <div className="flex gap-6">
          {/* 左側：項目リスト */}
          <div className="w-32 flex-shrink-0 flex flex-col text-amber-700" style={{ fontSize: '0.65rem' }}>
            <div className="py-3 px-2 text-center font-bold" style={{ backgroundColor: '#f5e6d3', marginBottom: '2px' }}>名称</div>
            <div className="py-3 px-2 text-center" style={{ backgroundColor: '#f5e6d3', marginBottom: '2px' }}>適性名</div>
            <div className="text-center flex items-center justify-center" style={{ backgroundColor: '#ffffff', marginBottom: '2px', writingMode: 'horizontal-tb', paddingTop: '3rem', paddingBottom: '3rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
              職業イメージ
            </div>
            <div className="py-3 px-2 text-center font-bold" style={{ backgroundColor: '#e8d4b8', marginBottom: '2px' }}>高い人の特徴</div>
            <div className="py-3 px-2 text-center" style={{ backgroundColor: '#e8d4b8', marginBottom: '2px' }}>高い利点</div>
            <div className="py-3 px-2 text-center" style={{ backgroundColor: '#e8d4b8', marginBottom: '2px' }}>高いコスト</div>
            <div className="py-3 px-2 text-center font-bold" style={{ backgroundColor: '#f5e6d3', marginBottom: '2px' }}>低い人の特徴</div>
            <div className="py-3 px-2 text-center" style={{ backgroundColor: '#f5e6d3', marginBottom: '2px' }}>低い利点</div>
            <div className="py-3 px-2 text-center" style={{ backgroundColor: '#f5e6d3' }}>低いコスト</div>
          </div>
          
          {/* 右側：5つのカード */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {FIXED_ORDER.map((instinct) => {
            return (
              <div key={instinct} className="relative">
                <img 
                  src={`/rpg-characters/${instinct}.png`} 
                  alt={instinct}
                  className="w-full h-auto object-contain"
                />
              </div>
            );
          })}
          </div>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={onClose}
          className="w-[140px] h-12 rounded-lg font-semibold transition-all text-white border"
          style={{
            background: 'linear-gradient(rgb(34, 211, 238) 0%, rgb(8, 145, 178) 100%)',
            borderColor: 'rgb(103, 232, 249)',
            boxShadow: 'rgb(22, 78, 99) 0px 4px 0px 0px',
            cursor: 'pointer'
          }}
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
