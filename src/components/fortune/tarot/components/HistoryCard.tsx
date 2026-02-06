import React from 'react';
import type { TarotReading } from '@/lib/api/tarot';
import { formatDate, getMentalStateLabel, getTargetLabel } from '../utils';

interface HistoryCardProps {
  reading: TarotReading;
  onClick: () => void;
  showDivider?: boolean;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({
  reading,
  onClick,
  showDivider = false,
}) => {
  return (
    <div>
      <button
        onClick={onClick}
        className="w-full p-4 transition-all text-left"
        style={{ background: 'transparent' }}
      >
        <div style={{ display: 'flex', gap: '12px' }}>
          {/* 左側: カード画像 */}
          <div style={{ flexShrink: 0 }}>
            <img
              alt="カード"
              width={30}
              height={49}
              src={reading.card.image_url}
            />
          </div>

          {/* 右側: テキスト情報 */}
          <div style={{ flex: 1 }}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  style={{
                    fontFamily: 'Noto Sans JP',
                    fontWeight: 700,
                    fontSize: '8px',
                    lineHeight: '1',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    color: '#FFFFFF',
                    background: reading.target === 'self' ? '#3A84C9' : '#C93A67',
                    padding: '3px 5px',
                    borderRadius: '10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {getTargetLabel(reading.target)}
                </span>
                <span
                  style={{
                    fontFamily: 'Noto Sans JP',
                    fontWeight: 700,
                    fontSize: '10px',
                    lineHeight: '20px',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    color: '#AEAEAE',
                  }}
                >
                  {formatDate(reading.created_at)}
                </span>
                <span
                  style={{
                    fontFamily: 'Noto Sans JP',
                    fontWeight: 700,
                    fontSize: '12px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    color: '#C4C46D',
                    margin: 0,
                  }}
                >
                  {reading.card.name}
                </span>
                <span
                  style={{
                    fontFamily: 'Noto Sans JP',
                    fontWeight: 700,
                    fontSize: '12px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    color: '#C4C46D',
                    margin: 0,
                  }}
                >
                  ({reading.is_reversed ? '逆位置' : '正位置'})
                </span>
              </div>
              <div className="flex gap-2"></div>
            </div>

            {reading.user_comment && (
              <p
                style={{
                  fontFamily: 'Noto Sans JP',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '112.99999999999999%',
                  letterSpacing: '0%',
                  color: '#FFFFFF',
                  marginTop: '8px',
                  marginBottom: 0,
                }}
              >
                {reading.user_comment}
              </p>
            )}
          </div>
        </div>
      </button>
      {/* 区切り線 */}
      {showDivider && (
        <div
          style={{
            borderBottom: '1px solid #73732F',
            width: '169px',
            margin: '0 auto',
          }}
        />
      )}
    </div>
  );
};
