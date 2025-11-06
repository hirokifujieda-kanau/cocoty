'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllUsers } from '@/lib/mock/mockAuth';

const UserSwitcher: React.FC = () => {
  const { currentUser, login, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const allUsers = getAllUsers();

  // 外部クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!currentUser) {
    return null;
  }

  const handleUserSwitch = (userId: string) => {
    if (userId !== currentUser.id) {
      login(userId);
    }
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 現在のユーザー表示ボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentUser.avatar}
          alt={currentUser.nickname}
          className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500"
        />
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-900">{currentUser.nickname}</div>
          <div className="text-xs text-gray-500">{currentUser.diagnosis}</div>
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* ドロップダウンメニュー */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
          {/* ヘッダー */}
          <div className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentUser.avatar}
                alt={currentUser.nickname}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
              />
              <div>
                <div className="font-bold text-lg">{currentUser.nickname}</div>
                <div className="text-xs opacity-90">{currentUser.email}</div>
              </div>
            </div>
          </div>

          {/* 現在のユーザー情報 */}
          <div className="px-4 py-3 bg-purple-50 border-b border-purple-100">
            <div className="text-xs text-purple-700 font-medium mb-1">現在のユーザー</div>
            <div className="text-sm text-gray-700">{currentUser.bio}</div>
          </div>

          {/* ユーザー切り替えセクション */}
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
            <div className="text-xs text-gray-500 font-medium px-2">
              ユーザーを切り替え（開発用）
            </div>
          </div>

          {/* ユーザーリスト */}
          <div className="max-h-96 overflow-y-auto">
            {allUsers.map((user) => {
              const isCurrent = user.id === currentUser.id;
              return (
                <button
                  key={user.id}
                  onClick={() => handleUserSwitch(user.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                    isCurrent ? 'bg-purple-50' : ''
                  }`}
                  disabled={isCurrent}
                >
                  {/* アバター */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatar}
                    alt={user.nickname}
                    className={`w-10 h-10 rounded-full object-cover ${
                      isCurrent ? 'ring-2 ring-purple-500' : ''
                    }`}
                  />

                  {/* ユーザー情報 */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium text-sm ${isCurrent ? 'text-purple-700' : 'text-gray-900'}`}>
                        {user.nickname}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {user.diagnosis}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-1">{user.bio}</div>
                  </div>

                  {/* チェックマーク */}
                  {isCurrent && (
                    <Check size={18} className="text-purple-600 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* フッター */}
          <div className="px-3 py-3 bg-gray-50 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
            >
              <LogOut size={16} />
              ログアウト
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSwitcher;
