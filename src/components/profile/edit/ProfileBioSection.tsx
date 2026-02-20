'use client';

import React from 'react';
import { Control, Controller } from 'react-hook-form';

interface ProfileBioSectionProps {
  control: Control<any>;
  isFormSubmitting: boolean;
}

/**
 * プロフィール編集ページの自己紹介文セクション
 * ユーザーの自己紹介テキストを編集するためのテキストエリアと保存ボタンを提供
 */
export const ProfileBioSection: React.FC<ProfileBioSectionProps> = ({
  control,
  isFormSubmitting,
}) => {
  return (
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
          disabled={isFormSubmitting}
          className="mt-3 px-7 py-[5px] font-noto font-bold text-xs leading-5 text-white bg-[#FFBA48] rounded-xl shadow-[0px_1px_2px_0px_#0000000D] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isFormSubmitting ? '保存中...' : '保存'}
      </button>
    </div>
  </div>
);
};