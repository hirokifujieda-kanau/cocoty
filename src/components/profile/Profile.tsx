 'use client';

import React, { useEffect, useState } from 'react';
import { PH1 } from '@/lib/placeholders';
import { X } from 'lucide-react';
import Diagnosis from './Diagnosis';
import PublicProfile from './PublicProfile';

interface ProfileData {
  nickname: string;
  bio: string;
  goal: string;
  teamName?: string;
  teamGoal?: string;
  diagnosis?: string;
  avatar?: string;
}

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: ProfileData) => void;
}

const STORAGE_KEY = 'cocoty_profile_v1';

const Profile: React.FC<ProfileProps> = ({ isOpen, onClose, onSave }) => {
  const [profile, setProfile] = useState<ProfileData>({
    nickname: '',
    bio: '',
    goal: '',
    teamName: '',
    teamGoal: ''
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProfile(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const el = document.querySelector<HTMLInputElement>('#profile-nickname');
    el?.focus();
  }, [isOpen]);

  const handleChange = (k: keyof ProfileData, v: string) => {
    setProfile((p) => ({ ...p, [k]: v }));
  };

  const handleAvatar = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      setProfile((p) => ({ ...p, avatar: data }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      // ignore
    }
    onSave?.(profile);
    onClose();
  };

  const [diagOpen, setDiagOpen] = useState(false);
  const [publicOpen, setPublicOpen] = useState(false);

  const handleDiagComplete = (result: string) => {
    const updated: ProfileData = { ...profile, diagnosis: result };
    setProfile(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
    onSave?.(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">プロフィール</h3>
          <button onClick={onClose} className="p-1 text-gray-600 hover:text-gray-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">ニックネーム</label>
            <input id="profile-nickname" value={profile.nickname} onChange={(e) => handleChange('nickname', e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" />
          </div>

          <div>
            <label className="text-sm text-gray-600">写真（プロフィール画像）</label>
            <div className="mt-2 flex items-center gap-3">
              <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center ring-2 ring-white shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profile.avatar || PH1} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <input type="file" accept="image/*" onChange={(e) => handleAvatar(e.target.files?.[0])} />
                <div className="text-xs text-gray-500 mt-1">画像はブラウザに保存されます（デモ）</div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">自己紹介</label>
            <textarea value={profile.bio} onChange={(e) => handleChange('bio', e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" rows={3} />
          </div>

          <div>
            <label className="text-sm text-gray-600">今年の目標</label>
            <input value={profile.goal} onChange={(e) => handleChange('goal', e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" />
          </div>

          <hr />

          <div>
            <label className="text-sm text-gray-600">チーム名（任意）</label>
            <input value={profile.teamName} onChange={(e) => handleChange('teamName', e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" />
          </div>

          <div>
            <label className="text-sm text-gray-600">チーム目標（任意）</label>
            <input value={profile.teamGoal} onChange={(e) => handleChange('teamGoal', e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" />
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <button onClick={() => setDiagOpen(true)} className="px-3 py-2 bg-amber-100 text-amber-800 rounded-md">診断を受ける</button>
              <button onClick={() => setPublicOpen(true)} className="px-3 py-2 bg-stone-100 text-stone-700 rounded-md">公開プレビュー</button>
            </div>
            <div>
              <button onClick={onClose} className="px-4 py-2 bg-stone-100 text-stone-700 rounded-md">キャンセル</button>
              <button onClick={handleSave} className="px-4 py-2 bg-slate-600 text-white rounded-md">保存</button>
            </div>
          </div>
        </div>
      </div>
      {diagOpen && <Diagnosis onClose={() => setDiagOpen(false)} onComplete={handleDiagComplete} />}
      {publicOpen && <PublicProfile onClose={() => setPublicOpen(false)} />}
    </div>
  );
};

export default Profile;

