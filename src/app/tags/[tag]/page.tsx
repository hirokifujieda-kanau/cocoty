'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Users, Filter } from 'lucide-react';
import { getAllUsers } from '@/lib/dummyUsers';

type SortType = 'relevance' | 'followers' | 'recent';

const TagUsersPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const tag = decodeURIComponent(params.tag as string);
  
  const [sortBy, setSortBy] = useState<SortType>('relevance');

  // タグを持つユーザーをフィルタリング
  const usersWithTag = useMemo(() => {
    const allUsers = getAllUsers();
    return allUsers.filter((user: any) => {
      const hobbies = user.hobbies || [];
      const favoriteFood = user.favoriteFood || [];
      const mbtiType = user.mbtiType || '';
      
      return (
        hobbies.includes(tag) ||
        favoriteFood.includes(tag) ||
        mbtiType === tag
      );
    });
  }, [tag]);

  // ソート処理
  const sortedUsers = useMemo(() => {
    const users = [...usersWithTag];
    
    switch (sortBy) {
      case 'followers':
        return users.sort((a, b) => {
          // フォロワー数でソート（ダミーデータなのでランダム）
          return Math.random() - 0.5;
        });
      case 'recent':
        return users.sort((a, b) => {
          // 最近の順（ダミーデータなのでランダム）
          return Math.random() - 0.5;
        });
      case 'relevance':
      default:
        // 関連度順（タグの出現回数）
        return users.sort((a: any, b: any) => {
          const aCount = [
            ...(a.hobbies || []),
            ...(a.favoriteFood || []),
            a.mbtiType
          ].filter(t => t === tag).length;
          
          const bCount = [
            ...(b.hobbies || []),
            ...(b.favoriteFood || []),
            b.mbtiType
          ].filter(t => t === tag).length;
          
          return bCount - aCount;
        });
    }
  }, [usersWithTag, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold truncate max-w-[200px]">#{tag}</h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* タグ情報 */}
        <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl">
              🏷️
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">#{tag}</h2>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Users className="h-4 w-4" />
                {usersWithTag.length}人がこのタグを使用
              </p>
            </div>
          </div>
        </div>

        {/* ソート */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">ユーザー一覧</h3>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="relevance">関連度順</option>
              <option value="followers">フォロワー数順</option>
              <option value="recent">新着順</option>
            </select>
          </div>
        </div>

        {/* ユーザーリスト */}
        {sortedUsers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedUsers.map((user: any) => {
              // 共通タグをカウント
              const commonTags = [
                ...(user.hobbies || []),
                ...(user.favoriteFood || []),
                user.mbtiType
              ].filter(t => t === tag);

              return (
                <div
                  key={user.id}
                  onClick={() => router.push(`/profile?userId=${user.id}`)}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    {/* アバター */}
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                    />

                    {/* ユーザー情報 */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{user.name}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{user.bio}</p>

                      {/* 共通タグ */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {(user.hobbies || []).slice(0, 3).map((hobby: string, idx: number) => (
                          <span
                            key={idx}
                            className={`inline-flex items-center px-2 py-0.5 text-xs rounded-md ${
                              hobby === tag
                                ? 'bg-purple-100 text-purple-700 font-semibold'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {hobby}
                          </span>
                        ))}
                        {user.mbtiType && (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 text-xs rounded-md ${
                              user.mbtiType === tag
                                ? 'bg-purple-100 text-purple-700 font-semibold'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {user.mbtiType}
                          </span>
                        )}
                      </div>

                      {/* マッチ度 */}
                      {commonTags.length > 1 && (
                        <div className="mt-2 text-xs text-purple-600 font-semibold">
                          🎯 {commonTags.length}個の共通点
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              該当するユーザーが見つかりませんでした
            </h3>
            <p className="text-gray-600">別のタグで検索してみてください</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagUsersPage;
