'use client';

import React, { useState } from 'react';
import { Control, Controller, useWatch } from 'react-hook-form';

interface BasicInfoSectionProps {
  control: Control<any>;
  isAgeVisibleToPublic: boolean;
  onAgeVisibilityToggle: (isVisible: boolean) => void;
}

/**
 * プロフィール編集ページの基本情報セクション
 * 年齢公開設定、居住地、血液型、MBTI診断結果の入力フィールドを提供
 */
export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  control,
  isAgeVisibleToPublic,
  onAgeVisibilityToggle,
}) => {
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>('');
  const [cityInput, setCityInput] = useState<string>('');
  
  // birthplaceフィールドの値を監視
  const birthplaceValue = useWatch({
    control,
    name: 'birthplace',
  });
  
  // コンポーネントマウント時に既存の値から都道府県と市区町村を抽出
  React.useEffect(() => {
    if (birthplaceValue) {
      // 都道府県リスト
      const prefectures = [
        '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
        '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
        '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
        '岐阜県', '静岡県', '愛知県', '三重県',
        '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
        '鳥取県', '島根県', '岡山県', '広島県', '山口県',
        '徳島県', '香川県', '愛媛県', '高知県',
        '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
      ];
      
      // 既存の値から都道府県を検出
      const matchedPrefecture = prefectures.find(pref => birthplaceValue.includes(pref));
      
      if (matchedPrefecture) {
        setSelectedPrefecture(matchedPrefecture);
        // 市区町村部分を抽出
        const cityPart = birthplaceValue.replace(matchedPrefecture, '');
        setCityInput(cityPart);
      }
    }
  }, [birthplaceValue]);
  
  const handlePrefectureChange = (prefecture: string, onChange: (value: string) => void) => {
    setSelectedPrefecture(prefecture);
    // 都道府県のみで更新（市区町村が入力されていればそれも含める）
    const fullAddress = cityInput ? prefecture + cityInput : prefecture;
    onChange(fullAddress);
  };
  
  const handleCityChange = (city: string, onChange: (value: string) => void) => {
    setCityInput(city);
    // 都道府県 + 市区町村で更新
    const fullAddress = selectedPrefecture + city;
    onChange(fullAddress);
  };
  
  return (
    <div className="space-y-4 px-[21.5px]">
      <h2 className="font-noto font-bold text-xs leading-5 text-[#1A1A1A]">
        基本情報
      </h2>
      
      {/* 年齢公開設定 */}
      <div className="flex items-center justify-between py-3 border-b border-gray-200">
        <span className="font-inter font-medium text-sm leading-[130%] text-[#1A1A1A]">
          年齢
        </span>
        <label className="flex items-center gap-2 ml-auto cursor-pointer relative">
          <span className="font-noto font-bold text-xs leading-3 text-[#1A1A1A]">
            {isAgeVisibleToPublic ? '公開' : '非公開'}
          </span>
          <input 
            type="checkbox" 
            className="hidden" 
            checked={isAgeVisibleToPublic}
            onChange={(e) => onAgeVisibilityToggle(e.target.checked)}
          />
          <div 
            className={`w-12 h-5 rounded-full transition-colors duration-300 flex items-center relative px-1 py-2 ${
              isAgeVisibleToPublic ? 'bg-yellow-400' : 'bg-gray-300'
            }`}
          >
            <img 
              src="/circlecheck.svg" 
              alt="toggle" 
              className={`w-4 h-4 rounded-full transition-all duration-300 absolute ${
                isAgeVisibleToPublic ? 'right-1' : 'left-1'
              }`}
            />
          </div>
        </label>
      </div>

      {/* 居住地選択フィールド（2段階選択） */}
      <div className="space-y-3">
        {/* 都道府県選択 */}
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <span className="font-inter font-medium text-sm leading-[130%] text-[#1A1A1A]">
            都道府県
          </span>
          <div className="flex items-center gap-2">
            <Controller
              name="birthplace"
              control={control}
              render={({ field }) => (
                <select
                  value={selectedPrefecture}
                  onChange={(e) => handlePrefectureChange(e.target.value, field.onChange)}
                  className="text-sm text-gray-600 text-right border-none focus:outline-none bg-transparent cursor-pointer appearance-none"
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
                </select>
              )}
            />
            <span className="text-[#828282]">&gt;</span>
          </div>
        </div>

        {/* 市区町村入力（都道府県が選ばれている場合のみ表示） */}
        {selectedPrefecture && (
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <span className="font-inter font-medium text-sm leading-[130%] text-[#1A1A1A]">
              市区町村
            </span>
            <div className="flex items-center gap-2">
              <Controller
                name="birthplace"
                control={control}
                render={({ field }) => (
                  <input
                    type="text"
                    value={cityInput}
                    onChange={(e) => handleCityChange(e.target.value, field.onChange)}
                    placeholder="渋谷区"
                    className="text-sm text-gray-600 text-right border-none focus:outline-none bg-transparent w-32"
                  />
                )}
              />
              <span className="text-[#828282]">&gt;</span>
            </div>
          </div>
        )}
      </div>

      {/* 血液型選択フィールド */}
      <div className="flex items-center justify-between py-3 border-b border-gray-200">
        <span className="font-inter font-medium text-sm leading-[130%] text-[#1A1A1A]">
          血液型
        </span>
        <div className="flex items-center gap-2">
          <Controller
            name="bloodType"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="text-sm text-gray-600 text-right border-none focus:outline-none bg-transparent cursor-pointer appearance-none"
              >
                <option value="">選択してください</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="O">O</option>
                <option value="AB">AB</option>
              </select>
            )}
          />
          <span className="text-[#828282]">&gt;</span>
        </div>
      </div>

      {/* MBTI診断結果選択フィールド */}
      <div className="flex items-center justify-between py-3 border-b border-gray-200">
        <span className="font-inter font-medium text-sm leading-[130%] text-[#1A1A1A]">
          MBTI
        </span>
        <div className="flex items-center gap-2">
          <Controller
            name="mbtiType"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="text-sm text-gray-600 text-right border-none focus:outline-none bg-transparent cursor-pointer appearance-none"
              >
                <option value="">選択してください</option>
                <option value="INTJ">INTJ</option>
                <option value="INTP">INTP</option>
                <option value="ENTJ">ENTJ</option>
                <option value="ENTP">ENTP</option>
                <option value="INFJ">INFJ</option>
                <option value="INFP">INFP</option>
                <option value="ENFJ">ENFJ</option>
                <option value="ENFP">ENFP</option>
                <option value="ISTJ">ISTJ</option>
                <option value="ISFJ">ISFJ</option>
                <option value="ESTJ">ESTJ</option>
                <option value="ESFJ">ESFJ</option>
                <option value="ISTP">ISTP</option>
                <option value="ISFP">ISFP</option>
                <option value="ESTP">ESTP</option>
                <option value="ESFP">ESFP</option>
              </select>
            )}
          />
          <span className="text-[#828282]">&gt;</span>
        </div>
      </div>
    </div>
  );
};
