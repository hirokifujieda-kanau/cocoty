'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true: ログイン必須, false: ログイン不要
}

/**
 * 認証ガードコンポーネント
 * - requireAuth=true: ログインしていない場合は /login にリダイレクト
 * - requireAuth=false: ログイン不要（デフォルト）
 */
export default function AuthGuard({ children, requireAuth = false }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      // 認証が必要だがログインしていない場合
      router.push('/login');
    }
  }, [user, loading, requireAuth, router]);

  // ローディング中は何も表示しない
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  // 認証が必要だがログインしていない場合は何も表示しない（リダイレクト中）
  if (requireAuth && !user) {
    return null;
  }

  // それ以外は子コンポーネントを表示
  return <>{children}</>;
}
