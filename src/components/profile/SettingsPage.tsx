'use client';

import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface SettingsPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ isOpen, onClose }) => {
  const { signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut();
      router.push('/login');
      onClose();
    } catch (error) {
      console.error('ログアウトエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      label: 'パスワードの変更',
      onClick: () => console.log('パスワード変更'),
      hasArrow: true,
      isDanger: false,
    },
    {
      label: 'ログアウト',
      onClick: handleLogout,
      hasArrow: false,
      isDanger: true,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex flex-col h-screen max-h-screen overflow-hidden">
      {/* Top Header - プロフィール画面と同じヘッダー */}
      <div className="sticky top-0 border-b border-gray-200 z-50" style={{ backgroundColor: '#FFD26A' }}>
        <div className="mx-auto h-[30px] flex items-center" style={{ maxWidth: '750px', paddingLeft: 'clamp(26px, 8vw, 106px)', paddingRight: 'clamp(26px, 8vw, 106px)' }}>
          <div className="flex items-center justify-between w-full">
            <h1 className="font-semibold text-base text-white" style={{ fontFamily: '"Noto Sans JP"' }}>ここてぃ</h1>
            <div className="flex gap-2 items-center">
              <div className="my-1 ml-[9px]">
                <div className="relative flex items-center">
                  <img alt="search" src="/人物アイコン　チーム 1.svg" className="absolute left-2 w-5 h-5 pointer-events-none" />
                  <input placeholder="ユーザー一覧" className="px-4 py-1 text-xs rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400" type="text" style={{ fontFamily: '"Noto Sans JP"', fontSize: '10px', paddingLeft: '32px' }} />
                </div>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded-full transition-colors" title="設定">
                <img alt="設定" className="w-5 h-5" src="/歯車.svg" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Header - 設定画面のヘッダー */}
      <div className="flex items-center justify-between px-4 bg-white shrink-0" style={{ paddingTop: '26px', paddingBottom: '26px' }}>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="戻る"
        >
          <ChevronLeft className="h-6 w-6 text-gray-800" />
        </button>
        <h1 className="flex-1 text-center font-bold text-xl" style={{ fontFamily: '"Noto Sans JP"', fontSize: '20px', lineHeight: '20px', color: '#1A1A1A' }}>設定</h1>
        <div className="w-8" />
      </div>

      {/* Menu Content */}
      <div className="flex-1 bg-white overflow-y-auto">
        <div>
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              disabled={loading && item.isDanger}
              className={`w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                item.isDanger ? 'text-red-600' : 'text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', lineHeight: '130%', color: '#1A1A1A' }}>{item.label}</span>
              </div>
              {item.hasArrow && (
                <ChevronLeft className="h-5 w-5 rotate-180 text-gray-400" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
