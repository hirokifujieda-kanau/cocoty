'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUsers, deleteUser, type AdminUser } from '@/lib/api/client';
import CommonHeader from '@/components/layout/CommonHeader';

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserData, setCurrentUserData] = useState<{ admin?: boolean } | null>(null);

  // 現在のユーザー情報を取得
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${await user.getIdToken()}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setCurrentUserData(data.user);
          
          // 管理者でない場合はリダイレクト
          if (!data.user.admin) {
            router.push('/profile');
          }
        }
      } catch (err) {
        console.error('Failed to fetch current user:', err);
      }
    };

    if (user) {
      fetchCurrentUser();
    }
  }, [user, router]);

  // ユーザー一覧取得
  useEffect(() => {
    if (currentUserData?.admin) {
      fetchUsers();
    }
  }, [currentUserData]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(data.users);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('ユーザー一覧の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number, email: string) => {
    if (!confirm(`${email} を削除しますか？\n\n※ Firebaseアカウントも削除され、復元できません。`)) {
      return;
    }

    try {
      await deleteUser(userId);
      alert('ユーザーを削除しました');
      fetchUsers(); // 再取得
    } catch (err: any) {
      console.error('Error deleting user:', err);
      alert(`削除に失敗しました: ${err.message || '不明なエラー'}`);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CommonHeader showSearch={false} showSettings={false} />
        <div className="flex items-center justify-center h-[calc(100vh-30px)]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUserData?.admin) {
    return null; // リダイレクト中
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader showSearch={false} showSettings={false} />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ユーザー管理</h1>
            <p className="mt-2 text-sm text-gray-600">
              管理者専用：全ユーザーの閲覧と削除
            </p>
          </div>
          <button
            onClick={() => router.push('/profile')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← プロフィールに戻る
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    メールアドレス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ニックネーム
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    権限
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    登録日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {u.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        {u.profile?.avatar_url && (
                          <img
                            src={u.profile.avatar_url}
                            alt={u.profile.nickname}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <span>{u.profile?.nickname || '未設定'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {u.admin ? (
                        <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">
                          管理者
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded">
                          一般
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(u.created_at).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {u.admin ? (
                        <span className="text-gray-400">削除不可</span>
                      ) : (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.email)}
                          className="text-red-600 hover:text-red-900 font-medium transition-colors"
                        >
                          削除
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div>
            総ユーザー数: <span className="font-semibold text-gray-900">{users.length}</span>名
          </div>
          <div>
            管理者: <span className="font-semibold text-red-600">{users.filter(u => u.admin).length}</span>名 / 
            一般: <span className="font-semibold text-gray-900">{users.filter(u => !u.admin).length}</span>名
          </div>
        </div>
      </div>
    </div>
  );
}
