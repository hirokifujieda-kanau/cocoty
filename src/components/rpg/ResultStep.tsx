'use client';

import React from 'react';
import type { InstinctLevels } from '@/lib/rpg/calculator';
import { INSTINCT_DESCRIPTIONS } from '@/lib/rpg/constants';
import { saveRpgDiagnosis } from '@/lib/api/client';

// グラデーション背景付きレーダーチャートコンポーネント
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
  
  // 表示名のマッピング
  const labelDisplayNames: Record<keyof InstinctLevels, string> = {
    '狩猟本能': '狩猟本能',
    '共感本能': '共感本能',
    '飛躍本能': '飛躍本能',
    '職人魂': '職人魂',
    '防衛本能': '防御本能',
  };
  
  // アイコン画像のマッピング
  const iconPaths: Record<keyof InstinctLevels, string> = {
    '職人魂': '/rpg-images/Icon_tamashii.png',
    '狩猟本能': '/rpg-images/Icon_syuryou.png',
    '共感本能': '/rpg-images/Icon_kyoukan.png',
    '防衛本能': '/rpg-images/Icon_bougyo.png',
    '飛躍本能': '/rpg-images/Icon_hiyaku.png',
  };
  
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
    <div className="relative w-full h-full">
      <svg viewBox="-30 -60 360 390" className="w-full h-full" style={{ display: 'block' }}>
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
          // 一番外側の五角形の少し内側に配置(半径80付近)
          const labelX = 150 + 80 * Math.cos(angle);
          const labelY = 150 + 80 * Math.sin(angle);
          
          // 数値に応じて色を変更
          let numberColor = '#f59e0b'; // デフォルトはオレンジ(2-4用)
          if (point.value === 1) {
            numberColor = '#9ca3af'; // グレー
          } else if (point.value === 5) {
            numberColor = '#dc2626'; // 赤
          }
          
          return (
            <g key={index}>
              {/* 数値ラベル（五角形の内側） */}
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={numberColor}
                stroke="#fff"
                strokeWidth="3"
                fontSize="14"
                fontWeight="bold"
                paintOrder="stroke"
              >
                {point.value}
              </text>
            </g>
          );
        })}

        {/* アイコンとラベルテキスト */}
        {labels.map((label, index) => {
          const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
          let x = 150 + 130 * Math.cos(angle);
          let y = 150 + 130 * Math.sin(angle);
          
          // 個別調整：防御本能を左に、共感本能を右に
          if (label === '防衛本能') {
            x -= 25;
            y -= 30;
          } else if (label === '共感本能') {
            x += 25;
            y -= 30;
          }
          
          return (
            <g key={index}>
              {/* アイコン画像 */}
              <image
                href={iconPaths[label]}
                x={x - 25}
                y={y - 40}
                width="50"
                height="50"
              />
              {/* ラベルテキスト */}
              <text
                x={x}
                y={y + 20}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#395d9f"
                stroke="#ffffff"
                strokeWidth="3"
                fontSize="13"
                fontWeight="500"
                fontFamily="Noto Sans JP"
                paintOrder="stroke"
              >
                {labelDisplayNames[label]}
              </text>
            </g>
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

  // 因子の順序を固定（時計回り）
  const FIXED_ORDER: (keyof typeof INSTINCT_DESCRIPTIONS)[] = [
    '職人魂',
    '狩猟本能',
    '共感本能',
    '防衛本能',
    '飛躍本能',
  ];

  return (
    <div className="space-y-8">
      {/* 右上：ホームに戻るリンク */}
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-base font-medium transition-colors cursor-pointer"
        >
          ホームに戻る
        </button>
      </div>

      {/* メインコンテンツエリア（上部：レーダーチャート + スコア + キャラクター） */}
      <div className="rounded-2xl mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* 左：スコア表示 */}
          <div>
            {/* タイトル画像 */}
            <div className="text-center mb-4">
              <img 
                src="/tarot-images/result.png" 
                alt="あなたの適性診断結果" 
                className="mx-auto"
              />
            </div>
            
            <div className="overflow-hidden shadow-lg border-[6px] max-w-[280px] mx-auto" style={{ borderColor: '#4d97da' }}>
              {FIXED_ORDER.map((instinct, index) => {
                const info = INSTINCT_DESCRIPTIONS[instinct];
                const level = instinctLevels[instinct];
                const isEven = index % 2 === 0;
                return (
                  <div 
                    key={instinct} 
                    className="flex justify-between items-center px-3 border-b-[3px] gap-2"
                    style={{ 
                      backgroundColor: isEven ? '#e0efff' : '#c3d6fc',
                      borderColor: '#4d97da',
                      paddingBlock: 'calc(var(--spacing) * 1)'
                    }}
                  >
                    <span className="text-sm font-noto-sans-jp font-light" style={{ color: '#3567a5' }}>{instinct}</span>
                    <span className="text-lg">
                      <span className="font-noto-sans-jp font-light" style={{ color: '#3567a5' }}>{level}</span>
                      <span className="text-xs font-noto-sans-jp font-light" style={{ color: '#3567a5' }}> ポイント</span>
                    </span>
                  </div>
                );
              })}
              <div className="px-3 py-2" style={{ backgroundColor: '#4eb8ef' }}>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-base font-noto-sans-jp font-light" style={{ color: '#ffffff' }}>トータル</span>
                  <span className="text-xl font-noto-sans-jp font-light">
                    <span style={{ color: '#ffffff' }}>{Object.values(instinctLevels).reduce((a, b) => a + b, 0)}</span>
                    <span className="text-xs" style={{ color: '#ffffff' }}>ポイント</span>
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-center mt-2 font-noto-sans-jp font-light" style={{ color: '#555555' }}>
              ※ポイントの大小は、
              <br />
              直接的な評価や優劣を示すものではありません。
            </p>
          </div>

          {/* 中央：レーダーチャート */}
          <div className="flex justify-center items-center">
            <div className="w-full max-w-[450px] aspect-square relative">
              <RadarChart data={instinctLevels} />
            </div>
          </div>

          {/* 右：キャラクターイラスト + 吹き出し */}
          <div className="flex flex-col items-center mt-8">
            {/* 吹き出し画像 */}
            <img 
              src="/rpg-images/Fukidashi_01.png" 
              alt="診断結果の説明" 
              className="w-64 h-auto"
            />
            {/* キャラクター画像 */}
            <img 
              src="/rpg-images/Healer_Girl.png" 
              alt="キャラクター" 
              className="w-64 h-auto"
            />
          </div>
        </div>
      </div>

      {/* 下部：5つのカード - ゲームカード風デザイン */}
      <div className="border-2 rounded-lg" style={{ borderColor: '#e7d4b6', padding: 'calc(var(--spacing) * 2)' }}>
        <div className="flex gap-6">
          {/* 左側：項目リスト */}
          <div className="flex-shrink-0 flex flex-col font-noto-sans-jp font-demilight" style={{ fontSize: '0.65rem', color: '#9c773e' }}>
            <div className="px-2 text-center font-bold whitespace-nowrap" style={{ backgroundColor: '#e7d4b6', marginBottom: '2px', paddingBlock: 'calc(var(--spacing) * 2)' }}>名称</div>
            <div className="px-2 text-center font-bold whitespace-nowrap" style={{ backgroundColor: '#e7d4b6', marginBottom: '2px', paddingBlock: 'calc(var(--spacing) * 2)' }}>適性名</div>
            <div className="text-center font-bold flex flex-1 items-center justify-center whitespace-nowrap" style={{ backgroundColor: '#ffffff', marginBottom: '2px', writingMode: 'horizontal-tb', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
              職業イメージ
            </div>
            <div className="text-center font-bold flex items-center justify-center whitespace-nowrap" style={{ backgroundColor: '#f8ebd8', marginBottom: '2px', minHeight: '2.5rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>高い人の特徴</div>
            <div className="text-center font-bold flex items-center justify-center whitespace-nowrap" style={{ backgroundColor: '#f8ebd8', marginBottom: '2px', minHeight: '2.5rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>高い利点</div>
            <div className="text-center font-bold flex items-center justify-center whitespace-nowrap" style={{ backgroundColor: '#f8ebd8', marginBottom: '2px', minHeight: '2.5rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>高いコスト</div>
            <div className="text-center font-bold flex items-center justify-center whitespace-nowrap" style={{ backgroundColor: '#e7d4b6', marginBottom: '2px', minHeight: '2.5rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>低い人の特徴</div>
            <div className="text-center font-bold flex items-center justify-center whitespace-nowrap" style={{ backgroundColor: '#e7d4b6', marginBottom: '2px', minHeight: '2.5rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>低い利点</div>
            <div className="text-center font-bold flex items-center justify-center whitespace-nowrap" style={{ backgroundColor: '#e7d4b6', minHeight: '2.5rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>低いコスト</div>
          </div>
          
          {/* 右側：5つのカード */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: 'calc(var(--spacing) * 3)' }}>
            {FIXED_ORDER.map((instinct) => {
            // 本能名から職業画像へのマッピング
            const jobImageMap: Record<keyof InstinctLevels, string> = {
              '職人魂': '/rpg-images/Job_gunner.png',
              '狩猟本能': '/rpg-images/Job_fencer.png',
              '共感本能': '/rpg-images/Job_healer.png',
              '防衛本能': '/rpg-images/Job_Shielder.png',
              '飛躍本能': '/rpg-images/Job_Schemer.png',
            };
            
            // 本能名から枠線の色へのマッピング
            const borderColorMap: Record<keyof InstinctLevels, string> = {
              '狩猟本能': '#dc2626', // 赤（フェンサー）
              '防衛本能': '#2563eb', // 青（シールダー）
              '職人魂': '#f59e0b', // オレンジ（ガンナー）
              '共感本能': '#10b981', // 緑（ヒーラー）
              '飛躍本能': '#8b5cf6', // 紫（スキーマー）
            };
            
            // 高い人の特徴用の薄い背景色
            const lightBgColorMap: Record<keyof InstinctLevels, string> = {
              '狩猟本能': '#fee2e2', // 薄い赤
              '防衛本能': '#dbeafe', // 薄い青
              '職人魂': '#fed7aa', // 薄いオレンジ
              '共感本能': '#d1fae5', // 薄い緑
              '飛躍本能': '#ede9fe', // 薄い紫
            };
            
            // 低い人の特徴用の濃い背景色
            const darkBgColorMap: Record<keyof InstinctLevels, string> = {
              '狩猟本能': '#fecaca', // 濃い赤
              '防衛本能': '#bfdbfe', // 濃い青
              '職人魂': '#fdba74', // 濃いオレンジ
              '共感本能': '#a7f3d0', // 濃い緑
              '飛躍本能': '#ddd6fe', // 濃い紫
            };
            
            const desc = INSTINCT_DESCRIPTIONS[instinct];
            const score = instinctLevels[instinct];
            
            return (
              <div key={instinct} className="relative flex flex-col h-full border-2 rounded-lg" style={{ borderColor: borderColorMap[instinct] }}>
                <div className="p-0.5 rounded-t-md" style={{ backgroundColor: borderColorMap[instinct] }}>
                  <img 
                    src={jobImageMap[instinct]}
                    alt={instinct}
                    className="w-full h-auto object-contain rounded-t-md"
                  />
                </div>
                <div className="flex flex-col flex-1 font-noto-sans-jp font-demilight" style={{ fontSize: '0.8rem', color: '#000000' }}>
                  <div className="px-2 text-center flex-1 flex items-center justify-center" style={{ backgroundColor: lightBgColorMap[instinct], borderBottom: `3px solid ${borderColorMap[instinct]}`, borderLeft: `3px solid ${borderColorMap[instinct]}`, borderRight: `3px solid ${borderColorMap[instinct]}`, minHeight: '2.5rem', whiteSpace: 'pre-line' }}>
                    {instinct === '防衛本能' && desc['高い人の特徴'] === '危機察知性が高く、高ストレス・心配性の傾向' 
                      ? '危機察知性が高く、\n高ストレス・心配性の傾向'
                      : instinct === '飛躍本能' && desc['高い人の特徴'] === '独創的・創造力に富む・エキセントリック'
                      ? '独創的・想像力に富む\nエキセントリック'
                      : desc['高い人の特徴']}
                  </div>
                  <div className="px-2 text-center flex-1 flex items-center justify-center" style={{ backgroundColor: lightBgColorMap[instinct], borderBottom: `3px solid ${borderColorMap[instinct]}`, borderLeft: `3px solid ${borderColorMap[instinct]}`, borderRight: `3px solid ${borderColorMap[instinct]}`, minHeight: '2.5rem', whiteSpace: 'pre-line' }}>
                    {instinct === '防衛本能' && desc['高い利点'] === 'ミスを回避、事前努力が苦なくできる'
                      ? 'ミスを回避、事前努力が\n苦なくできる'
                      : instinct === '狩猟本能' && desc['高い利点'] === '金銭・快楽の成功を得やすい → 行動が積極的'
                      ? '金銭・快楽の成功を得やすい\n→ 行動が積極的'
                      : desc['高い利点']}
                  </div>
                  <div className="px-2 text-center flex-1 flex items-center justify-center" style={{ backgroundColor: lightBgColorMap[instinct], borderBottom: `3px solid ${borderColorMap[instinct]}`, borderLeft: `3px solid ${borderColorMap[instinct]}`, borderRight: `3px solid ${borderColorMap[instinct]}`, minHeight: '2.5rem' }}>{desc['高いコスト']}</div>
                  <div className="px-2 text-center flex-1 flex items-center justify-center" style={{ backgroundColor: darkBgColorMap[instinct], borderBottom: `3px solid ${borderColorMap[instinct]}`, borderLeft: `3px solid ${borderColorMap[instinct]}`, borderRight: `3px solid ${borderColorMap[instinct]}`, minHeight: '2.5rem' }}>{desc['低い人の特徴']}</div>
                  <div className="px-2 text-center flex-1 flex items-center justify-center" style={{ backgroundColor: darkBgColorMap[instinct], borderBottom: `3px solid ${borderColorMap[instinct]}`, borderLeft: `3px solid ${borderColorMap[instinct]}`, borderRight: `3px solid ${borderColorMap[instinct]}`, minHeight: '2.5rem' }}>{desc['低い利点']}</div>
                  <div className="px-2 text-center flex-1 flex items-center justify-center" style={{ backgroundColor: darkBgColorMap[instinct], borderBottom: `3px solid ${borderColorMap[instinct]}`, borderLeft: `3px solid ${borderColorMap[instinct]}`, borderRight: `3px solid ${borderColorMap[instinct]}`, minHeight: '2.5rem' }}>{desc['低いコスト']}</div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      {isCompleted && (
        <p className="text-center text-purple-200 text-sm mt-4">
          この診断は完了済みです。診断は1回のみ実施可能です。
        </p>
      )}
    </div>
  );
};
