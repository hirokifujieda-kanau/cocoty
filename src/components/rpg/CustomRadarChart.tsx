'use client';

import React from 'react';

interface CustomRadarChartProps {
  labels: string[];
  values: number[];
  maxValue: number;
  size?: number; // SVGのサイズ（デフォルト300）
}

export const CustomRadarChart: React.FC<CustomRadarChartProps> = ({
  labels,
  values,
  maxValue,
  size = 300,
}) => {
  const center = size / 2;
  const maxRadius = (size / 2) * 0.7; // チャートの最大半径（余白を確保）
  
  // 五角形の頂点を計算
  const points = labels.map((_, index) => {
    const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
    const value = values[index];
    const radius = (value / maxValue) * maxRadius;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y, value };
  });

  // 背景グリッドの円
  const gridLevels = [1, 2, 3, 4];
  const gridCircles = gridLevels.map(level => {
    return (level / maxValue) * maxRadius;
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
      {/* 背景グリッド */}
      {gridCircles.map((radius, i) => (
        <circle
          key={i}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(156, 163, 175, 0.2)"
          strokeWidth="1"
        />
      ))}

      {/* グリッドライン */}
      {labels.map((_, index) => {
        const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
        const x = center + maxRadius * Math.cos(angle);
        const y = center + maxRadius * Math.sin(angle);
        return (
          <line
            key={index}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke="rgba(156, 163, 175, 0.2)"
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
        const labelRadius = maxRadius + 20;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        return (
          <text
            key={index}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#6b7280"
            fontSize="12"
            fontWeight="600"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
};
