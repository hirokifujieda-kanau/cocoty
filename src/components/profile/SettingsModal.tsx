'use client';

import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ChangePasswordModal from './ChangePasswordModal';
import styles from './InstagramProfilePage.module.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

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
      onClick: () => setShowChangePassword(true),
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
      <div className="sticky top-0 border-b border-gray-200 z-50 bg-[#FFD26A]">
        <div className="mx-auto h-[30px] flex items-center" style={{ maxWidth: '750px', paddingLeft: 'clamp(26px, 8vw, 106px)', paddingRight: 'clamp(26px, 8vw, 106px)' }}>
          <div className="flex items-center justify-between w-full">
            <h1 className="text-white text-[16px] leading-[100%] align-middle" style={{ fontFamily: '"Noto Sans JP"', fontWeight: 500, lineHeight: '100%', verticalAlign: 'middle' }}>ここてぃ</h1>
            <div className="flex gap-2 items-center">
              <div className="my-1 ml-[9px]">
                <div className="relative flex items-center">
                  <img alt="search" src="/人物アイコン　チーム 1.svg" style={{ position: 'absolute', left: '8px', width: '20px', height: '20px', pointerEvents: 'none' }} />
                  <input placeholder="ユーザー一覧" type="text" style={{ fontSize: '10px', fontFamily: '"Noto Sans JP"', fontWeight: 500, marginTop: '5px', marginBottom: '5px', paddingLeft: '32px', boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px', lineHeight: '100%' }} className={`px-4 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 ${styles.searchInput}`} />
                  <style>{`
                    input::placeholder {
                      font-family: Noto Sans JP;
                      font-weight: 500;
                      font-size: 10px;
                      line-height: 100%;
                      letter-spacing: 0%;
                      color: #5C5C5C;
                    }
                  `}</style>
                </div>
              </div>
              <button className="hover:bg-gray-100 rounded-full transition-colors" title="設定">
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

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={onClose}
        onBack={() => setShowChangePassword(false)}
      />
    </div>
  );
};

export default SettingsModal;
