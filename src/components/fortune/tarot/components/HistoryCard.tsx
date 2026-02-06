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
        className="w-full p-4 transition-all text-left bg-transparent"
      >
        <div className="flex gap-3">
          {/* 左側: カード画像 */}
          <div className="flex-shrink-0">
            <img
              alt="カード"
              width={30}
              height={49}
              src={reading.card.image_url}
            />
          </div>

          {/* 右側: テキスト情報 */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`font-bold text-[8px] leading-none text-center text-white font-noto-sans-jp px-[5px] py-[3px] rounded-[10px] inline-flex items-center justify-center ${
                  reading.target === 'self' ? 'bg-[#3A84C9]' : 'bg-[#C93A67]'
                }`}>
                  {getTargetLabel(reading.target)}
                </span>
                <span className="font-bold text-[10px] leading-5 text-center text-[#AEAEAE] font-noto-sans-jp">
                  {formatDate(reading.created_at)}
                </span>
                <span className="font-bold text-xs leading-none text-center text-[#C4C46D] font-noto-sans-jp m-0">
                  {reading.card.name}
                </span>
                <span className="font-bold text-xs leading-none text-center text-[#C4C46D] font-noto-sans-jp m-0">
                  ({reading.is_reversed ? '逆位置' : '正位置'})
                </span>
              </div>
              <div className="flex gap-2"></div>
            </div>

            {reading.user_comment && (
              <p className="font-normal text-xs leading-[113%] text-white font-noto-sans-jp mt-2 mb-0">
                {reading.user_comment}
              </p>
            )}
          </div>
        </div>
      </button>
      {/* 区切り線 */}
      {showDivider && (
        <div className="border-b border-[#73732F] w-[169px] mx-auto" />
      )}
    </div>
  );
};
