'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { getProfiles } from '@/lib/api/client';
import type { Profile } from '@/lib/api/client';
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
  const router = useRouter();
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-[#FFD26A] h-[30px] z-50 flex items-center">
        <div className="mx-auto flex items-center justify-between w-full max-w-[750px] px-[clamp(26px,8vw,106px)]">
          <h1 className="font-noto text-base font-medium text-white leading-none">
            ここてぃ
          </h1>
          <div className="flex gap-2 items-center">
            <div className="relative flex items-center">
              <img 
                src="/人物アイコン　チーム 1.svg" 
                alt="search" 
                className="absolute left-2 w-5 h-5 pointer-events-none"
              />
              <input
                type="text"
                placeholder="ユーザー一覧"
                className="w-[clamp(120px,30vw,200px)] h-5 pl-8 pr-3 text-[10px] font-noto font-medium bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer shadow-sm placeholder:text-[#5C5C5C] placeholder:font-medium placeholder:text-[10px]"
                readOnly
              />
            </div>
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="設定"
            >
              <img src="/歯車.svg" alt="設定" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Page Title Header */}
      <div className="sticky top-[30px] bg-white py-8 px-4 border-b border-gray-200">
        <div className="flex items-center justify-center gap-4 relative">
          <button
            onClick={() => router.back()}
            className="absolute left-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-gray-900" />
          </button>
          <h1 className="font-noto font-bold text-[20px] leading-5 text-center text-[#1A1A1A]">
            ユーザー一覧
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[812px] mx-auto px-4 pc:px-[106px]">
        {/* User List */}
        <div className="grid grid-cols-1 pc:grid-cols-2">
          {data.profiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => router.push(`/profile/${profile.id}`)}
              className="flex items-start gap-2 px-4 py-[19px] border-b border-gray-200 pc:border-r pc:last:border-r-0 pc:odd:border-r hover:bg-gray-100 transition cursor-pointer"
              style={{ gap: '8px' }}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={profile.avatar_url || 'https://via.placeholder.com/48'}
                  alt={profile.name}
                  className="rounded-full object-cover"
                  style={{ width: '65.66px', height: '62.85px' }}
                />
              </div>
              {/* User Info */}
              <div className="flex-grow">
                <h3 className="font-inter font-medium text-base leading-[130%] text-[#1A1A1A] mb-[3px]">
                  {profile.name || profile.nickname || 'Unknown User'}
                </h3>
                <p className="font-noto font-medium text-sm leading-[130%] text-[#828282]">
                  {profile.bio || '説明なし'}
                </p>
              </div>
            </div>
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
