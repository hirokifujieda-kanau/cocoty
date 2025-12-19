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
      <div className="sticky top-0 bg-white border-b border-gray-200 z-50" style={{ backgroundColor: '#FFD26A' }}>
        <div className="mx-auto h-[30px] flex items-center" style={{ maxWidth: '750px', paddingLeft: 'clamp(26px, 8vw, 106px)', paddingRight: 'clamp(26px, 8vw, 106px)' }}>
          <div className="flex items-center justify-between w-full">
            <h1 
              className="font-semibold text-base text-white"
              style={{
                fontFamily: 'Noto Sans JP',
                fontWeight: 500,
                lineHeight: '100%',
                letterSpacing: '0%',
                verticalAlign: 'middle'
              }}
            >
              ここてぃ
            </h1>
            <div className="flex gap-2 items-center">
              <div className="my-1 ml-[9px]">
              <div className="relative flex items-center">
                <img 
                  src="/人物アイコン　チーム 1.svg" 
                  alt="search" 
                  style={{ 
                    position: 'absolute', 
                    left: '8px',
                    width: '20px',
                    height: '20px',
                    pointerEvents: 'none'
                  }} 
                />
                <input
                  type="text"
                  placeholder="ユーザー一覧"
                  className="px-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer"
                  style={{
                    width: 'clamp(120px, 30vw, 200px)',
                    height: '20px',
                    fontSize: '10px',
                    fontFamily: 'Noto Sans JP',
                    fontWeight: 500,
                    backgroundColor: '#FFFFFF',
                    marginTop: '5px',
                    marginBottom: '5px',
                    paddingLeft: '32px',
                    borderRadius: '8px',
                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px',
                    lineHeight: '100%'
                  }}
                  readOnly
                />
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
              <button
                className="hover:bg-gray-100 rounded-full transition-colors"
                title="設定"
              >
                <img src="/歯車.svg" alt="設定" className="w-5 h-5" />
              </button>
            </div>
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
          <h1
            className="font-['Noto_Sans_JP'] font-bold text-[20px] leading-[20px] text-center align-middle text-[#1A1A1A]"
          >
            ユーザー一覧
          </h1>
        </div>
      </div>

      {/* Content */}
      <div>
        {/* ユーザーカードグリッド */}
        <div>
          {data.profiles.map((profile) => (
            <div key={profile.id} className="flex items-start hover:bg-gray-100 transition cursor-pointer border-b border-gray-200 px-4" style={{ gap: '8px', paddingBottom: '19px', paddingTop: '19px' }}>
              {/* アバター */}
              <div className="flex-shrink-0">
                <img
                  src={profile.avatar_url || 'https://via.placeholder.com/48'}
                  alt={profile.name}
                  className="rounded-full object-cover"
                  style={{ width: '65.66px', height: '62.85px' }}
                />
              </div>
              {/* ユーザー情報 */}
              <div className="flex-grow">
                <h3
                  style={{
                    fontFamily: 'Inter',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '130%',
                    letterSpacing: '0%',
                    color: '#1A1A1A',
                    marginBottom: '3px'
                  }}
                >
                  {profile.name || profile.nickname || 'Unknown User'}
                </h3>
                <p
                  style={{
                    fontFamily: 'Noto Sans JP',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '130%',
                    letterSpacing: '0%',
                    verticalAlign: 'middle',
                    color: '#828282'
                  }}
                >
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
