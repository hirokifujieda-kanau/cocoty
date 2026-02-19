'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/api/client';
import styles from './InstagramProfilePage.module.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { signOut, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // 管理者チェック
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;
      
      try {
        const data = await getCurrentUser();
        setIsAdmin(data.user.admin || false);
      } catch (error) {
        console.error('Failed to check admin status:', error);
      }
    };

    if (isOpen && user) {
      checkAdmin();
    }
  }, [isOpen, user]);

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
    ...(isAdmin ? [{
      label: 'ユーザー管理（管理者）',
      onClick: () => {
        router.push('/admin/users');
        onClose();
      },
      hasArrow: true,
      isDanger: false,
      isAdmin: true,
    }] : []),
    {
      label: 'パスワードの変更',
      onClick: () => {
        router.push('/profile/change-password');
        onClose();
      },
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
      <div className="sticky top-0 z-50 h-[30px] bg-[#FFD26A] flex items-center">
        <div className="mx-auto flex w-full items-center justify-between px-[clamp(26px,8vw,106px)]" style={{ maxWidth: '750px' }}>
          <h1 className="font-noto text-base font-medium text-white leading-none">ここてぃ</h1>
          <div className="flex gap-2 items-center">
            <div className="relative flex items-center my-1 ml-[9px]">
              <img alt="search" src="/人物アイコン　チーム 1.svg" className="absolute left-2 w-5 h-5 pointer-events-none" />
              <input placeholder="ユーザー一覧" type="text" className={`w-[clamp(120px,30vw,200px)] h-5 pl-8 pr-3 text-[10px] font-noto font-medium bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer shadow-sm placeholder:text-[#5C5C5C] placeholder:font-medium placeholder:text-[10px] ${styles.searchInput}`} readOnly />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="設定">
              <img alt="設定" className="w-5 h-5" src="/歯車.svg" />
            </button>
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
                item.isDanger ? 'text-red-600' : item.isAdmin ? 'text-purple-600 font-semibold' : 'text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.isAdmin && <span className="text-lg">👤</span>}
                <span style={{ fontFamily: 'Inter', fontWeight: item.isAdmin ? 600 : 500, fontSize: '14px', lineHeight: '130%' }}>{item.label}</span>
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

export default SettingsModal;
