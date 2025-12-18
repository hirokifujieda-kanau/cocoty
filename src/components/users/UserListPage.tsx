'use client';

import { useEffect, useState } from 'react';
import { getProfiles } from '@/lib/api/client';
import type { Profile } from '@/lib/api/client';
import { UserCard } from './UserCard';
import { Pagination } from './Pagination';

interface ProfilesResponse {
  profiles: Profile[];
  pagination: {
    total_count: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

export function UserListPage() {
  const [data, setData] = useState<ProfilesResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getProfiles(currentPage, 20);
        
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'プロフィールの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-500 text-5xl mb-4 text-center">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">エラーが発生しました</h2>
          <p className="text-gray-600 text-center">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  if (!data || data.profiles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">ユーザーが見つかりません</h2>
          <p className="text-gray-600">まだ登録されているユーザーがいません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            メンバー一覧 👥
          </h1>
          <p className="text-gray-600">
            全 {data.pagination.total_count} 人のメンバー
          </p>
        </div>

        {/* ユーザーカードグリッド */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {data.profiles.map((profile) => (
            <UserCard key={profile.id} profile={profile} />
          ))}
        </div>

        {/* ページネーション */}
        {data.pagination.total_pages > 1 && (
          <Pagination
            currentPage={data.pagination.page}
            totalPages={data.pagination.total_pages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
