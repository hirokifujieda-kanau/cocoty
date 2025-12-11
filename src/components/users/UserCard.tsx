'use client';

import Link from 'next/link';
import type { Profile } from '@/lib/api/client';
import { PH1 } from '@/lib/placeholders';

interface UserCardProps {
  profile: Profile;
}

export function UserCard({ profile }: UserCardProps) {
  return (
    <Link href={`/profile/${profile.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group">
        {/* カバー画像 */}
        <div className="h-24 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 relative">
          {profile.cover_url && (
            <img
              src={profile.cover_url}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* プロフィール情報 */}
        <div className="p-4 relative">
          {/* アバター */}
          <div className="absolute -top-12 left-4">
            <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
              <img
                src={profile.avatar_url || PH1}
                alt={profile.name || 'User'}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 名前とバッジ */}
          <div className="mt-10">
            <h3 className="text-lg font-bold text-gray-800 truncate group-hover:text-purple-600 transition">
              {profile.name || profile.nickname || 'Unknown User'}
            </h3>
            
            {profile.nickname && profile.name !== profile.nickname && (
              <p className="text-sm text-gray-500">@{profile.nickname}</p>
            )}
          </div>

          {/* 一言 */}
          {profile.bio && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {profile.bio}
            </p>
          )}

          {/* 追加情報 */}
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
            {profile.age && (
              <span className="flex items-center gap-1">
                🎂 {profile.age}歳
              </span>
            )}
            {profile.birthplace && (
              <span className="flex items-center gap-1">
                📍 {profile.birthplace}
              </span>
            )}
            {profile.blood_type && (
              <span className="flex items-center gap-1">
                🩸 {profile.blood_type}型
              </span>
            )}
          </div>

          {/* タグ */}
          {profile.hobbies && profile.hobbies.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {profile.hobbies.slice(0, 3).map((hobby, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                >
                  #{hobby}
                </span>
              ))}
              {profile.hobbies.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{profile.hobbies.length - 3}
                </span>
              )}
            </div>
          )}

          {/* MBTI */}
          {profile.mbti_type && (
            <div className="mt-3">
              <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                {profile.mbti_type}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
