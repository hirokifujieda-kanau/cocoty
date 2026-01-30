'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ChevronLeft, Camera, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile, UpdateProfileParams, getCurrentUser, Profile } from '@/lib/api/client';
import { validateImageFile, AVATAR_VALIDATION_OPTIONS } from '@/lib/utils/imageValidation';
import { ValidationErrorModal } from '@/components/common/ValidationErrorModal';

interface ProfileEditPageProps {
  onClose: () => void;
  onSave?: () => void;
  userId?: string;
}

interface ProfileFormData {
  name: string;
  bio: string;
  birthplace: string;
  birthday: string;
  bloodType: string;
  mbtiType: string;
  hobbies: string[];
  favoriteFoods: string[];
}

const ProfileEditPage: React.FC<ProfileEditPageProps> = ({ onClose, onSave, userId }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isGenderPublic, setIsGenderPublic] = useState(true);

  const { control, handleSubmit, setValue, watch, reset } = useForm<ProfileFormData>({
    defaultValues: {
      name: '',
      bio: '',
      birthplace: '',
      birthday: '',
      bloodType: '',
      mbtiType: '',
      hobbies: [''],
      favoriteFoods: ['']
    }
  });

  const hobbies = watch('hobbies');
  const favoriteFoods = watch('favoriteFoods');

  // プロフィールデータを取得
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await getCurrentUser();
        if (response.profile) {
          setProfile(response.profile);
          
          // React Hook Form にデータを設定
          reset({
            name: response.profile.name || '',
            bio: response.profile.bio || '',
            birthplace: response.profile.birthplace || '',
            birthday: response.profile.birthday || '',
            bloodType: response.profile.blood_type || '',
            mbtiType: response.profile.mbti_type || '',
            hobbies: Array.isArray(response.profile.hobbies) && response.profile.hobbies.length > 0 
              ? response.profile.hobbies 
              : [''],
            favoriteFoods: Array.isArray(response.profile.favorite_food) && response.profile.favorite_food.length > 0
              ? response.profile.favorite_food
              : ['']
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, reset]);

  // 趣味の追加
  const addHobby = () => {
    if (hobbies.length < 10) {
      setValue('hobbies', [...hobbies, '']);
    }
  };

  // 趣味の削除
  const removeHobby = (index: number) => {
    setValue('hobbies', hobbies.filter((_, i) => i !== index));
  };

  // 趣味の更新
  const updateHobby = (index: number, value: string) => {
    const newHobbies = [...hobbies];
    newHobbies[index] = value;
    setValue('hobbies', newHobbies);
  };

  // 好きな食べ物の追加
  const addFood = () => {
    if (favoriteFoods.length < 10) {
      setValue('favoriteFoods', [...favoriteFoods, '']);
    }
  };

  // 好きな食べ物の削除
  const removeFood = (index: number) => {
    setValue('favoriteFoods', favoriteFoods.filter((_, i) => i !== index));
  };

  // 好きな食べ物の更新
  const updateFood = (index: number, value: string) => {
    const newFoods = [...favoriteFoods];
    newFoods[index] = value;
    setValue('favoriteFoods', newFoods);
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) {
      alert('ログインが必要です');
      return;
    }

    try {
      setUploading(true);

      if (!profile?.id) {
        alert('プロフィールIDが見つかりません');
        return;
      }

      const bloodType = data.bloodType as 'A' | 'B' | 'O' | 'AB' | undefined;
      const updateData: UpdateProfileParams = {
        name: data.name,
        bio: data.bio,
        social_link: '',
        birthplace: data.birthplace,
        birthday: data.birthday || undefined,
        hobbies: data.hobbies.filter(Boolean),
        favorite_food: data.favoriteFoods.filter(Boolean),
        mbti_type: data.mbtiType || undefined,
        blood_type: bloodType,
      };

      await updateProfile(profile.id, updateData);
      
      if (onSave) {
        await onSave();
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('プロフィールの更新に失敗しました');
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      validateImageFile(file, AVATAR_VALIDATION_OPTIONS);
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        if (!profile?.id) {
          alert('プロフィールIDが見つかりません');
          return;
        }
        
        try {
          setUploading(true);
          await updateProfile(profile.id, { avatar_url: base64String });
          
          const response = await getCurrentUser();
          if (response.profile) {
            setProfile(response.profile);
          }
          
          if (onSave) {
            await onSave();
          }
        } catch (error) {
          console.error('Failed to upload avatar:', error);
          alert('アバター画像のアップロードに失敗しました');
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      setValidationError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 上部の黄色いヘッダー */}
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

      {/* ヘッダー（ユーザー一覧と同じレイアウト） */}
      <div className="sticky top-[30px] bg-white py-8 px-4 border-b border-gray-200 z-10">
        <div className="flex items-center justify-center gap-4 relative">
          <button
            onClick={onClose}
            className="absolute left-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-gray-900" />
          </button>
          <h1 className="font-noto font-bold text-[20px] leading-5 text-center text-[#1A1A1A]">
            プロフィール編集
          </h1>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="max-w-2xl mx-auto pb-6 px-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 自己紹介 */}
          <div className="rounded-lg py-4 mb-[13px] px-[21.5px]">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              自己紹介文
            </label>
            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  className="w-full px-3 py-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#E6E6E6] border border-[#E0E0E0] font-noto font-bold text-xs leading-5 text-[#5C5C5C]"
                  rows={3}
                  placeholder="写真が好きな大学生です。風景をポートレートを撮っています"
                />
              )}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={uploading}
                className="mt-3 px-7 py-[5px] font-noto font-bold text-xs leading-5 text-white bg-[#FFBA48] rounded-xl shadow-[0px_1px_2px_0px_#0000000D] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? '保存中...' : '保存'}
              </button>
            </div>
          </div>

          {/* 基本情報 */}
          <div className="space-y-4 px-[21.5px]">
            <h2 className="font-noto font-bold text-xs leading-5 text-[#1A1A1A]">
              基本情報
            </h2>
            
            {/* 性別 */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="font-inter font-medium text-sm leading-[130%] text-[#1A1A1A]">
                年齢
              </span>
              <label className="flex items-center gap-2 ml-auto cursor-pointer relative">
                <span className="font-['Noto_Sans_JP'] font-bold text-[12px] leading-[12px] text-[#1A1A1A]">
                  {isGenderPublic ? '公開' : '非公開'}
                </span>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={isGenderPublic}
                  onChange={(e) => setIsGenderPublic(e.target.checked)}
                />
                <div 
                  className={`w-12 h-5 rounded-full transition-colors duration-300 flex items-center relative px-1 py-2 ${
                    isGenderPublic ? 'bg-yellow-400' : 'bg-gray-300'
                  }`}
                >
                  <img 
                    src="/circlecheck.svg" 
                    alt="toggle" 
                    className={`w-4 h-4 rounded-full transition-all duration-300 absolute ${
                      isGenderPublic ? 'right-1' : 'left-1'
                    }`}
                  />
                </div>
              </label>
            </div>

            {/* 居住地 */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="font-inter font-medium text-sm leading-[130%] text-[#1A1A1A]">
                居住地
              </span>
              <div className="flex items-center gap-2">
                <Controller
                  name="birthplace"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="東京都渋谷区"
                      className="text-sm text-gray-600 text-right border-none focus:outline-none bg-transparent w-40"
                    />
                  )}
                />
                <span className="text-[#828282]">&gt;</span>
              </div>
            </div>

            {/* 血液型 */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="font-inter font-medium text-sm leading-[130%] text-[#1A1A1A]">
                血液型
              </span>
              <div className="flex items-center gap-2">
                <Controller
                  name="bloodType"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="text-sm text-gray-600 text-right border-none focus:outline-none bg-transparent w-20"
                      placeholder="A"
                      maxLength={2}
                    />
                  )}
                />
                <span className="text-[#828282]">&gt;</span>
              </div>
            </div>

            {/* MBTI */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="font-inter font-medium text-sm leading-[130%] text-[#1A1A1A]">
                MBTI
              </span>
              <div className="flex items-center gap-2">
                <Controller
                  name="mbtiType"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      className="text-sm text-gray-600 text-right border-none focus:outline-none bg-transparent w-24"
                      placeholder="ENTP"
                      maxLength={4}
                    />
                  )}
                />
                <span className="text-[#828282]">&gt;</span>
              </div>
            </div>
          </div>

          {/* 趣味 */}
          <div className="space-y-4 px-2">
            <h2 className="font-noto font-bold text-xs leading-5 text-[#1A1A1A]">
              趣味<span className="font-noto font-bold text-[10px] leading-3 text-[#828282] ml-3">最大10個まで</span>
            </h2>
            <div className="flex flex-col gap-4">
              {hobbies.map((hobby, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={hobby}
                    onChange={(e) => updateHobby(index, e.target.value)}
                    className="flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 py-[5px] px-2 font-inter font-medium text-sm leading-[130%] text-[#1A1A1A] bg-[#E6E6E6] border border-[#E0E0E0]"
                  />
                  <button
                    type="button"
                    onClick={() => removeHobby(index)}
                    className="hover:opacity-70 transition-opacity ml-4 text-[#828282]"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              ))}
              {hobbies.length < 10 && (
                <button
                  type="button"
                  onClick={addHobby}
                  className="w-10 h-10 flex items-center justify-center"
                >
                  <img src="/plus.svg" alt="追加" className="w-8 h-8" />
                </button>
              )}
            </div>
          </div>

          {/* 好きな食べ物 */}
          <div className="space-y-4">
            <h2 className="font-noto font-bold text-xs leading-5 text-[#1A1A1A]">
              好きな食べ物<span className="font-noto font-bold text-[10px] leading-3 text-[#828282] ml-3">最大10個まで</span>
            </h2>
            <div className="flex flex-col gap-4">
              {favoriteFoods.map((food, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={food}
                    onChange={(e) => updateFood(index, e.target.value)}
                    className="flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 py-[5px] px-2 font-inter font-medium text-sm leading-[130%] text-[#1A1A1A] bg-[#E6E6E6] border border-[#E0E0E0]"
                  />
                  <button
                    type="button"
                    onClick={() => removeFood(index)}
                    className="hover:opacity-70 transition-opacity ml-4 text-[#828282]"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              ))}
              {favoriteFoods.length < 10 && (
                <button
                  type="button"
                  onClick={addFood}
                  className="w-10 h-10 flex items-center justify-center"
                >
                  <img src="/plus.svg" alt="追加" className="w-8 h-8" />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* 画像検証エラーモーダル */}
      <ValidationErrorModal
        isOpen={!!validationError}
        error={validationError || ''}
        onClose={() => setValidationError(null)}
      />
    </div>
  );
};

export default ProfileEditPage;
