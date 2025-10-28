'use client';

import React, { useEffect, useState } from 'react';
import { PH1, PH2, PH3 } from '@/lib/placeholders';

interface ProfileData {
  nickname: string;
  bio: string;
  goal: string;
  teamName?: string;
  teamGoal?: string;
  diagnosis?: string;
  avatar?: string;
  cover?: string;
  skills?: string;
  socialLink?: string;
}

const STORAGE_KEY = 'cocoty_profile_v1';

const PublicProfile: React.FC<{ onClose: () => void; profileData?: ProfileData }> = ({ onClose, profileData }) => {
  const [profile, setProfile] = useState<ProfileData | null>(profileData || null);

  useEffect(() => {
    if (profileData) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProfile(JSON.parse(raw));
    } catch (e) {}
  }, [profileData]);

  if (!profile) {
    return (
      <div className="fixed inset-0 z-70 flex items-center justify-center bg-black bg-opacity-40 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">プロフィール</h3>
            <button onClick={onClose} className="text-sm text-gray-500">閉じる</button>
          </div>
          <p className="text-sm text-gray-600">プロフィールがまだ設定されていません。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="relative">
          <div className="h-40 w-full bg-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.cover || PH2} alt="cover" className="w-full h-full object-cover" />
          </div>
          <div className="absolute left-6 -bottom-12">
            <div className="w-24 h-24 rounded-full ring-4 ring-white overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profile.avatar || PH1} alt="avatar" className="w-full h-full object-cover" />
            </div>
          </div>
          <button onClick={onClose} className="absolute right-4 top-4 text-sm text-gray-500">閉じる</button>
        </div>

        <div className="px-6 pt-16 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">{profile.nickname}</h2>
              <div className="text-sm text-gray-600 mt-2">{profile.bio}</div>
              {profile.socialLink && (
                <div className="mt-2"><a href={profile.socialLink} target="_blank" rel="noreferrer" className="text-sm text-blue-600">外部リンク</a></div>
              )}
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="font-bold text-lg">{(function(){ try { const raw = localStorage.getItem('cocoty_albums_v1'); if(!raw) return 0; return JSON.parse(raw).reduce((s:any,a:any)=>s+(a.images?.length||0),0); } catch(e){ return 0; } })()}</div>
                <div className="text-sm text-gray-500">写真</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">{profile.teamName || '-'}</div>
                <div className="text-sm text-gray-500">チーム</div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium mb-2">ギャラリー</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {(function(){
                try {
                  const raw = localStorage.getItem('cocoty_albums_v1');
                  if (!raw) return [] as string[];
                  const albums = JSON.parse(raw) as any[];
                  const imgs: string[] = [];
                  albums.forEach(a => { if (a.images && a.images.length) imgs.push(...a.images); });
                  return imgs;
                } catch (e) { return [] as string[]; }
              })().slice(0,12).map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={img} alt={`pf-${i}`} className="w-full h-24 object-cover rounded" />
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button onClick={() => { onClose(); window.location.href = '/profile'; }} className="px-4 py-2 bg-slate-600 text-white rounded-md">プロフィールページへ</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
