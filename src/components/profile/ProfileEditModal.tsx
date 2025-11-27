'use client';

import React, { useState } from 'react';
import { X, Camera, Upload } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    bio: currentUser?.bio || '',
    email: currentUser?.email || '',
    phone: '090-1234-5678',
    website: '',
    location: '東京都',
    birthday: (currentUser as any)?.birthday || '',
    birthplace: (currentUser as any)?.birthplace || '',
    hobbies: (currentUser as any)?.hobbies?.join(', ') || '',
    favoriteFood: (currentUser as any)?.favoriteFood?.join(', ') || '',
    mbtiType: (currentUser as any)?.mbtiType || '',
    bloodType: (currentUser as any)?.bloodType || ''
  });

  if (!isOpen || !currentUser) return null;

  const handleSave = () => {
    // TODO: 実際の保存処理
    console.log('Saving profile:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">プロフィール編集</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-lg">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">{currentUser.name}</h3>
              <button className="text-sm text-purple-600 font-semibold hover:text-purple-700">
                プロフィール写真を変更
              </button>
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              カバー画像
            </label>
            <div className="relative h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl overflow-hidden">
              <button className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-white mx-auto mb-2" />
                  <span className="text-white text-sm font-semibold">カバー画像をアップロード</span>
                </div>
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="あなたの名前"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              自己紹介
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="自己紹介を入力してください"
              maxLength={150}
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {formData.bio.length} / 150
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="email@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              電話番号
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="090-1234-5678"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              ウェブサイト
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              所在地
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="東京都"
            />
          </div>

          {/* Birthday */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              生年月日
            </label>
            <input
              type="date"
              value={formData.birthday}
              onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Birthplace */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              出身地
            </label>
            <input
              type="text"
              value={formData.birthplace}
              onChange={(e) => setFormData({ ...formData, birthplace: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="例: 大阪府大阪市"
            />
          </div>

          {/* Hobbies */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              趣味（カンマ区切り）
            </label>
            <input
              type="text"
              value={formData.hobbies}
              onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="例: 写真, カフェ巡り, 映画鑑賞"
            />
          </div>

          {/* Favorite Food */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              好きな食べ物（カンマ区切り）
            </label>
            <input
              type="text"
              value={formData.favoriteFood}
              onChange={(e) => setFormData({ ...formData, favoriteFood: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="例: パスタ, タピオカ, パンケーキ"
            />
          </div>

          {/* MBTI Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              MBTIタイプ
            </label>
            <select
              value={formData.mbtiType}
              onChange={(e) => setFormData({ ...formData, mbtiType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">選択してください</option>
              <option value="INTJ">INTJ - 建築家</option>
              <option value="INTP">INTP - 論理学者</option>
              <option value="ENTJ">ENTJ - 指揮官</option>
              <option value="ENTP">ENTP - 討論者</option>
              <option value="INFJ">INFJ - 提唱者</option>
              <option value="INFP">INFP - 仲介者</option>
              <option value="ENFJ">ENFJ - 主人公</option>
              <option value="ENFP">ENFP - 広報運動家</option>
              <option value="ISTJ">ISTJ - 管理者</option>
              <option value="ISFJ">ISFJ - 擁護者</option>
              <option value="ESTJ">ESTJ - 幹部</option>
              <option value="ESFJ">ESFJ - 領事官</option>
              <option value="ISTP">ISTP - 巨匠</option>
              <option value="ISFP">ISFP - 冒険家</option>
              <option value="ESTP">ESTP - 起業家</option>
              <option value="ESFP">ESFP - エンターテイナー</option>
            </select>
          </div>

          {/* Blood Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              血液型
            </label>
            <select
              value={formData.bloodType}
              onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">選択してください</option>
              <option value="A">A型</option>
              <option value="B">B型</option>
              <option value="O">O型</option>
              <option value="AB">AB型</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            保存する
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
