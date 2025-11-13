'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MockUser, getCurrentUser, login as mockLogin, logout as mockLogout, initializeSession } from '@/lib/mock/mockAuth';

interface AuthContextType {
  currentUser: MockUser | null;
  login: (userId: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初期化: セッションから復元（なければnullのまま = ゲストとして閲覧可能）
  useEffect(() => {
    try {
      const user = initializeSession();
      setCurrentUser(user);
    } catch (e) {
      console.error('Failed to initialize session:', e);
      // エラーが発生してもゲストとして続行
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ログイン処理
  const login = (userId: string) => {
    const user = mockLogin(userId);
    if (user) {
      setCurrentUser(user);
      // ページをリロードしてすべての状態を更新
      window.location.reload();
    }
  };

  // ログアウト処理
  const logout = () => {
    mockLogout();
    setCurrentUser(null);
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * 認証状態を取得するカスタムフック
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
