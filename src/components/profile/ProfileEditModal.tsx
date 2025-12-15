'use client';

import React, { useState, useEffect } from 'react';
import { X, Camera, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile, UpdateProfileParams, getCurrentUser, Profile } from '@/lib/api/client';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void; // 保存成功時のコールバック
  userId?: string;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose, onSave, userId }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    email: user?.email || '',
    phone: '090-1234-5678',
    website: '',
    location: '東京都',
    birthday: '',
    birthplace: '',
    age: '',
    hobbies: '',
    favoriteFood: '',
    mbtiType: '',
    bloodType: ''
  });

  // プロフィールデータを取得
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isOpen || !user) return;

      try {
        setLoading(true);
        const response = await getCurrentUser();
        if (response.profile) {
          setProfile(response.profile);
          setFormData({
            name: response.profile.name || '',
            bio: response.profile.bio || '',
            email: user.email || '',
            phone: '090-1234-5678',
            website: '',
            location: '東京都',
            birthday: response.profile.birthday || '',
            birthplace: response.profile.birthplace || '',
            age: response.profile.age?.toString() || '',
            hobbies: response.profile.hobbies?.join(', ') || '',
            favoriteFood: response.profile.favorite_food?.join(', ') || '',
            mbtiType: response.profile.mbti_type || '',
            bloodType: response.profile.blood_type || ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isOpen, user]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-center">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setUploading(true);
      console.log('📤 Uploading avatar...');

      // Cloudinaryにアップロード
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');
      formData.append('public_id', `${user.uid}_avatar_${Date.now()}`);

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!cloudinaryResponse.ok) {
        throw new Error('Cloudinary upload failed');
      }

      const cloudinaryData = await cloudinaryResponse.json();
      const avatarUrl = cloudinaryData.secure_url;
      console.log('✅ Avatar uploaded to Cloudinary:', avatarUrl);

      // プロフィールを更新
      await updateProfile(profile.id, { avatar_url: avatarUrl });
      console.log('✅ Avatar URL saved to profile');

      // プロフィールを再読み込み
      if (onSave) {
        await onSave();
      }

      alert('プロフィール画像を更新しました！');
    } catch (error) {
      console.error('❌ Avatar upload failed:', error);
      alert('画像のアップロードに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const params: UpdateProfileParams = {
        name: formData.name, // nickname ではなく name を送信
        bio: formData.bio,
        hobbies: formData.hobbies ? formData.hobbies.split(',').map((h: string) => h.trim()) : [],
        favorite_food: formData.favoriteFood ? formData.favoriteFood.split(',').map((f: string) => f.trim()) : [],
        mbti_type: formData.mbtiType,
        blood_type: formData.bloodType as 'A' | 'B' | 'O' | 'AB',
        birthday: formData.birthday,
        birthplace: formData.birthplace,
      };

      await updateProfile(profile.id, params); 
      console.log('✅ Profile updated successfully');
      console.log('📞 Calling onSave callback...');
      
      // 親コンポーネントに保存成功を通知
      if (onSave) {
        console.log('✅ onSave callback exists, calling it...');
        await onSave();
        console.log('✅ onSave callback completed');
      } else {
        console.warn('⚠️ onSave callback is not provided');
      }
      
      alert('プロフィールを更新しました！');
      onClose();
    } catch (error) {
      console.error('❌ Failed to update profile:', error);
      alert('プロフィールの更新に失敗しました');
    }
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
                src={profile.avatar_url || 'https://via.placeholder.com/150'}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                id="avatar-upload"
                disabled={uploading}
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-lg cursor-pointer"
              >
                {uploading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </label>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">{profile.name}</h3>
              <label
                htmlFor="avatar-upload"
                className="text-sm text-purple-600 font-semibold hover:text-purple-700 cursor-pointer"
              >
                {uploading ? 'アップロード中...' : 'プロフィール写真を変更'}
              </label>
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

          {/* Self Introduction Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              自己紹介
            </h3>
            
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

            {/* Birthplace (都道府県) */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                出身地
              </label>
              <select
                value={formData.birthplace}
                onChange={(e) => setFormData({ ...formData, birthplace: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">選択してください</option>
                <option value="北海道">北海道</option>
                <option value="青森県">青森県</option>
                <option value="岩手県">岩手県</option>
                <option value="宮城県">宮城県</option>
                <option value="秋田県">秋田県</option>
                <option value="山形県">山形県</option>
                <option value="福島県">福島県</option>
                <option value="茨城県">茨城県</option>
                <option value="栃木県">栃木県</option>
                <option value="群馬県">群馬県</option>
                <option value="埼玉県">埼玉県</option>
                <option value="千葉県">千葉県</option>
                <option value="東京都">東京都</option>
                <option value="神奈川県">神奈川県</option>
                <option value="新潟県">新潟県</option>
                <option value="富山県">富山県</option>
                <option value="石川県">石川県</option>
                <option value="福井県">福井県</option>
                <option value="山梨県">山梨県</option>
                <option value="長野県">長野県</option>
                <option value="岐阜県">岐阜県</option>
                <option value="静岡県">静岡県</option>
                <option value="愛知県">愛知県</option>
                <option value="三重県">三重県</option>
                <option value="滋賀県">滋賀県</option>
                <option value="京都府">京都府</option>
                <option value="大阪府">大阪府</option>
                <option value="兵庫県">兵庫県</option>
                <option value="奈良県">奈良県</option>
                <option value="和歌山県">和歌山県</option>
                <option value="鳥取県">鳥取県</option>
                <option value="島根県">島根県</option>
                <option value="岡山県">岡山県</option>
                <option value="広島県">広島県</option>
                <option value="山口県">山口県</option>
                <option value="徳島県">徳島県</option>
                <option value="香川県">香川県</option>
                <option value="愛媛県">愛媛県</option>
                <option value="高知県">高知県</option>
                <option value="福岡県">福岡県</option>
                <option value="佐賀県">佐賀県</option>
                <option value="長崎県">長崎県</option>
                <option value="熊本県">熊本県</option>
                <option value="大分県">大分県</option>
                <option value="宮崎県">宮崎県</option>
                <option value="鹿児島県">鹿児島県</option>
                <option value="沖縄県">沖縄県</option>
                <option value="海外">海外</option>
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

          {/* Bio (一言) */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              一言
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="自己紹介や今の気分など..."
              rows={3}
            />
          </div>

          {/* Hobbies Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              趣味
            </h3>
            
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
