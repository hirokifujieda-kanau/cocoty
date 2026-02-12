'use client';

import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

interface RpgResultChartProps {
  labels: string[];
  values: number[];
  maxValue: number;
  height?: number;
}

export default function RpgResultChart({ labels, values, maxValue, height = 400 }: RpgResultChartProps) {
  const data = labels.map((label, index) => ({
    subject: label,
    value: values[index],
    fullMark: maxValue,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsRadar data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 14, fontWeight: 600 }} />
        <PolarRadiusAxis angle={90} domain={[0, maxValue]} tick={{ fill: '#6b7280' }} />
        <Radar
          name="RPG診断"
          dataKey="value"
          stroke="#8b5cf6"
          fill="#8b5cf6"
          fillOpacity={0.6}
          strokeWidth={2}
        />
      </RechartsRadar>
    </ResponsiveContainer>
  );
}
