'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface CommonHeaderProps {
  showSearch?: boolean;
  showSettings?: boolean;
  showBackButton?: boolean;
  backButtonPath?: string;
  onSettingsClick?: () => void;
  onBackClick?: () => void;
}

export default function CommonHeader({ 
  showSearch = true, 
  showSettings = true,
  showBackButton = false,
  backButtonPath,
  onSettingsClick,
  onBackClick
}: CommonHeaderProps) {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else if (backButtonPath) {
      router.push(backButtonPath);
    } else {
      router.back();
    }
  };

  return (
    <div className="sticky top-0 z-50 h-[30px] bg-[#FFD26A] flex items-center">
      <div className="mx-auto flex w-full items-center justify-between px-[clamp(26px,8vw,106px)]" style={{ maxWidth: '750px' }}>
        {/* Left side: Back button or Logo */}
        <div className="flex items-center gap-2">
          {showBackButton && (
            <button
              onClick={handleBackClick}
              className="p-1 hover:bg-yellow-500/30 rounded-full transition-colors"
              title="戻る"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          )}
          <div className="font-noto text-base font-medium text-white leading-none">
            ここてぃ
          </div>
        </div>
        
        {/* Search & Settings */}
        <div className="flex gap-2 items-center">
          {showSearch && (
            <div className="relative flex items-center my-1 ml-[9px]">
              <img 
                src="/人物アイコン　チーム 1.svg" 
                alt="search" 
                className="absolute left-2 w-5 h-5 pointer-events-none"
              />
              <input
                type="text"
                placeholder="ユーザー一覧"
                onClick={() => router.push('/users')}
                className="w-[clamp(120px,30vw,200px)] h-5 pl-8 pr-3 text-[10px] font-noto font-medium bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer shadow-sm placeholder:text-[#5C5C5C] placeholder:font-medium placeholder:text-[10px]"
                readOnly
              />
            </div>
          )}
          {showSettings && (
            <button
              onClick={onSettingsClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="設定"
            >
              <img src="/歯車.svg" alt="設定" className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
