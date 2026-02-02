'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile, UpdateProfileParams, getCurrentUser, Profile } from '@/lib/api/client';
import { ProfileBioSection } from '@/components/profile/edit/ProfileBioSection';
import { BasicInfoSection } from '@/components/profile/edit/BasicInfoSection';
import { HobbyListEditor } from '@/components/profile/edit/HobbyListEditor';
import { FavoriteFoodListEditor } from '@/components/profile/edit/FavoriteFoodListEditor';

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
  const [currentUserProfile, setCurrentUserProfile] = useState<Profile | null>(null);
  const [isProfileDataLoading, setIsProfileDataLoading] = useState(true);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isAgeVisibleToPublic, setIsAgeVisibleToPublic] = useState(true);

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

  const currentHobbyList = watch('hobbies');
  const currentFavoriteFoodList = watch('favoriteFoods');

  // プロフィールデータを取得
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        setIsProfileDataLoading(true);
        const response = await getCurrentUser();
        if (response.profile) {
          setCurrentUserProfile(response.profile);
          
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
        setIsProfileDataLoading(false);
      }
    };

    fetchProfile();
  }, [user, reset]);

  // 趣味の更新ハンドラー
  const handleHobbyTextChange = (hobbyIndex: number, newHobbyText: string) => {
    const updatedHobbyList = [...currentHobbyList];
    updatedHobbyList[hobbyIndex] = newHobbyText;
    setValue('hobbies', updatedHobbyList);
  };

  const handleAddNewHobbyField = () => {
    if (currentHobbyList.length < 10) {
      setValue('hobbies', [...currentHobbyList, '']);
    }
  };

  const handleRemoveHobbyField = (hobbyIndexToRemove: number) => {
    setValue('hobbies', currentHobbyList.filter((_, index) => index !== hobbyIndexToRemove));
  };

  // 好きな食べ物の更新ハンドラー
  const handleFoodTextChange = (foodIndex: number, newFoodText: string) => {
    const updatedFoodList = [...currentFavoriteFoodList];
    updatedFoodList[foodIndex] = newFoodText;
    setValue('favoriteFoods', updatedFoodList);
  };

  const handleAddNewFoodField = () => {
    if (currentFavoriteFoodList.length < 10) {
      setValue('favoriteFoods', [...currentFavoriteFoodList, '']);
    }
  };

  const handleRemoveFoodField = (foodIndexToRemove: number) => {
    setValue('favoriteFoods', currentFavoriteFoodList.filter((_, index) => index !== foodIndexToRemove));
  };

  const handleProfileFormSubmission = async (data: ProfileFormData) => {
    if (!user) {
      alert('ログインが必要です');
      return;
    }

    try {
      setIsFormSubmitting(true);

      if (!currentUserProfile?.id) {
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

      await updateProfile(currentUserProfile.id, updateData);
      
      if (onSave) {
        await onSave();
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('プロフィールの更新に失敗しました');
    } finally {
      setIsFormSubmitting(false);
    }
  };

  if (isProfileDataLoading) {
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
        <form onSubmit={handleSubmit(handleProfileFormSubmission)} className="space-y-6">
          {/* 自己紹介セクション */}
          <ProfileBioSection
            control={control}
            isFormSubmitting={isFormSubmitting}
          />

          {/* 基本情報セクション */}
          <BasicInfoSection
            control={control}
            isAgeVisibleToPublic={isAgeVisibleToPublic}
            onAgeVisibilityToggle={setIsAgeVisibleToPublic}
          />

          {/* 趣味セクション */}
          <HobbyListEditor
            currentHobbyList={currentHobbyList}
            onHobbyTextChange={handleHobbyTextChange}
            onAddNewHobbyField={handleAddNewHobbyField}
            onRemoveHobbyField={handleRemoveHobbyField}
          />

          {/* 好きな食べ物セクション */}
          <FavoriteFoodListEditor
            currentFavoriteFoodList={currentFavoriteFoodList}
            onFoodTextChange={handleFoodTextChange}
            onAddNewFoodField={handleAddNewFoodField}
            onRemoveFoodField={handleRemoveFoodField}
          />
        </form>
      </div>
    </div>
  );
};

export default ProfileEditPage;
