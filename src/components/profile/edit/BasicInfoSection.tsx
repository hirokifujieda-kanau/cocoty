'use client';

import React from 'react';
import { Control, Controller } from 'react-hook-form';

interface BasicInfoSectionProps {
  control: Control<any>;
  isAgeVisibleToPublic: boolean;
  onAgeVisibilityToggle: (isVisible: boolean) => void;
}

/**
 * プロフィール編集ページの基本情報セクション
 * 年齢公開設定、居住地、血液型、MBTI診断結果の入力フィールドを提供
 */
export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  control,
  isAgeVisibleToPublic,
  onAgeVisibilityToggle,
}) => {
  return (
    <div className="space-y-4 px-[21.5px]">
      <h2 className="font-noto font-bold text-xs leading-5 text-[#1A1A1A]">
        基本情報
      </h2>
      
      {/* 年齢公開設定 */}
      <div className="flex items-center justify-between py-3 border-b border-gray-200">
        <span className="font-inter font-medium text-sm leading-[130%] text-[#1A1A1A]">
          年齢
        </span>
        <label className="flex items-center gap-2 ml-auto cursor-pointer relative">
          <span className="font-noto font-bold text-xs leading-3 text-[#1A1A1A]">
            {isAgeVisibleToPublic ? '公開' : '非公開'}
          </span>
          <input 
            type="checkbox" 
            className="hidden" 
            checked={isAgeVisibleToPublic}
            onChange={(e) => onAgeVisibilityToggle(e.target.checked)}
          />
          <div 
            className={`w-12 h-5 rounded-full transition-colors duration-300 flex items-center relative px-1 py-2 ${
              isAgeVisibleToPublic ? 'bg-yellow-400' : 'bg-gray-300'
            }`}
          >
            <img 
              src="/circlecheck.svg" 
              alt="toggle" 
              className={`w-4 h-4 rounded-full transition-all duration-300 absolute ${
                isAgeVisibleToPublic ? 'right-1' : 'left-1'
              }`}
            />
          </div>
        </label>
      </div>

      {/* 居住地入力フィールド */}
      <div className="flex items-center justify-between py-3 border-b border-gray-200">
        <span className="font-inter font-medium text-sm leading-[130%] text-[#1A1A1A]">
          居住地
        </span>
        <div className="flex items-center gap-2">
          <Controller
            name="birthplace"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="東京都渋谷区"
                className="text-sm text-gray-600 text-right border-none focus:outline-none bg-transparent w-40"
              />
            )}
          />
          <span className="text-[#828282]">&gt;</span>
        </div>
      </div>

      {/* 血液型入力フィールド */}
      <div className="flex items-center justify-between py-3 border-b border-gray-200">
        <span className="font-inter font-medium text-sm leading-[130%] text-[#1A1A1A]">
          血液型
        </span>
        <div className="flex items-center gap-2">
          <Controller
            name="bloodType"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="text-sm text-gray-600 text-right border-none focus:outline-none bg-transparent w-20"
                placeholder="A"
                maxLength={2}
              />
            )}
          />
          <span className="text-[#828282]">&gt;</span>
        </div>
      </div>

      {/* MBTI診断結果入力フィールド */}
      <div className="flex items-center justify-between py-3 border-b border-gray-200">
        <span className="font-inter font-medium text-sm leading-[130%] text-[#1A1A1A]">
          MBTI
        </span>
        <div className="flex items-center gap-2">
          <Controller
            name="mbtiType"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                className="text-sm text-gray-600 text-right border-none focus:outline-none bg-transparent w-24"
                placeholder="ENTP"
                maxLength={4}
              />
            )}
          />
          <span className="text-[#828282]">&gt;</span>
        </div>
      </div>
    </div>
  );
};
