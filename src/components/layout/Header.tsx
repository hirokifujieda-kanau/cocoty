'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * アプリケーションヘッダー
 * - ログイン済みユーザー情報の表示
 * - ログアウトボタン
 */
export default function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) return null;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <Link href="/profile" className="flex items-center">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Cocoty
            </h1>
          </Link>

          {/* ナビゲーション */}
          <nav className="flex items-center space-x-4">
            <Link
              href="/profile"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              プロフィール
            </Link>
            
            {/* ユーザー情報 */}
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-300">
              <span className="text-sm text-gray-600">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-white bg-gray-100 hover:bg-purple-600 rounded-lg transition-colors"
              >
                ログアウト
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
