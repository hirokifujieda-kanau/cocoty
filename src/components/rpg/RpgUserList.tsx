'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRpgDiagnosedUsers, searchRpgUsers, type RpgUser } from '@/lib/api/rpg';
import { CustomRadarChart } from './CustomRadarChart';
import RpgExportButton from './RpgExportButton';

export default function RpgUserList() {
  const router = useRouter();
  const [users, setUsers] = useState<RpgUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getRpgDiagnosedUsers();
      setUsers(response.users);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadUsers();
      return;
    }

    setLoading(true);
    try {
      const response = await searchRpgUsers(searchQuery);
      setUsers(response.users);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              RPG診断ユーザー一覧
            </h1>
            <p className="text-gray-600">診断を完了したユーザーの結果を一覧で確認できます</p>
          </div>
          <RpgExportButton searchQuery={searchQuery} filteredUsers={users} />
        </div>
        
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="名前で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
            >
              検索
            </button>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  loadUsers();
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
              >
                クリア
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">読み込み中...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <p className="text-gray-500 text-lg">
              {searchQuery ? '検索結果が見つかりませんでした' : '診断済みのユーザーがいません'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => {
              const roles = [
                { name: '職人魂', value: user.rpg_diagnosis.gunner, color: 'text-blue-600', label: '職人魂', key: 'gunner' },
                { name: '狩猟本能', value: user.rpg_diagnosis.fencer, color: 'text-red-600', label: '狩猟本能', key: 'fencer' },
                { name: '共感本能', value: user.rpg_diagnosis.healer, color: 'text-green-600', label: '共感本能', key: 'healer' },
                { name: '防衛本能', value: user.rpg_diagnosis.shielder, color: 'text-yellow-600', label: '防衛本能', key: 'shielder' },
                { name: '飛躍本能', value: user.rpg_diagnosis.schemer, color: 'text-purple-600', label: '飛躍本能', key: 'schemer' },
              ];

              const chartLabels = roles.map(r => r.label);
              const chartValues = roles.map(r => r.value);
              const maxValue = 4;

              return (
                <div
                  key={user.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
                >
                  <div 
                    className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 -m-2 p-4 rounded-t-xl transition-colors"
                    onClick={() => router.push(`/profile/${user.id}`)}
                  >
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-purple-200"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-3xl font-bold">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-800 hover:text-purple-600 transition-colors">{user.name}</h3>
                      {user.gender && (
                        <span className="text-sm text-gray-500">
                          {user.gender === 'male' ? '👨 男性' : user.gender === 'female' ? '👩 女性' : '👤 その他'}
                        </span>
                      )}
                    </div>
                    <div className="text-gray-400 text-sm">
                      プロフィールを見る →
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">能力チャート</h4>
                    <div className="w-full max-w-sm mx-auto">
                      <CustomRadarChart labels={chartLabels} values={chartValues} maxValue={maxValue} size={350} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {roles.map((role) => (
                      <div key={role.name} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {role.name}
                        </span>
                        <div className="flex items-center gap-2 flex-1 ml-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                              style={{ width: `${(role.value / maxValue) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-gray-700 w-12 text-right">
                            Lv.{role.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
