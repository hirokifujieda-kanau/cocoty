'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import styles from './SignupPage.module.css';

// 生年月日のバリデーション関数
const validateBirthday = (year: string, month: string, day: string): { isValid: boolean; errorMessage?: string } => {
  // 入力値をチェック
  if (!year || !month || !day) {
    return { isValid: true }; // 空の場合はバリデーション対象外
  }

  const y = parseInt(year, 10);
  const m = parseInt(month, 10);
  const d = parseInt(day, 10);

  // 年月日が数値として有効か確認
  if (isNaN(y) || isNaN(m) || isNaN(d)) {
    return { isValid: false, errorMessage: '生年月日を正しく入力してください' };
  }

  // 月が1-12の範囲か確認
  if (m < 1 || m > 12) {
    return { isValid: false, errorMessage: '月は1〜12で入力してください' };
  }

  // その月の最大日数を取得
  const maxDaysInMonth = new Date(y, m, 0).getDate();

  // 日が有効な範囲か確認
  if (d < 1 || d > maxDaysInMonth) {
    return { isValid: false, errorMessage: `${m}月は1〜${maxDaysInMonth}日で入力してください` };
  }

  // 実際の日付として有効か確認（負の日付など）
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return { isValid: false, errorMessage: '生年月日を正しく入力してください' };
  }

  return { isValid: true };
};

// 月の最大日数を取得する関数
const getMaxDayInMonth = (year: string, month: string): number => {
  if (!year || !month) {
    return 31;
  }

  const y = parseInt(year, 10);
  const m = parseInt(month, 10);

  if (isNaN(y) || isNaN(m) || m < 1 || m > 12) {
    return 31;
  }

  return new Date(y, m, 0).getDate();
};

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    year: '',
    month: '',
    day: '',
    isPrivate: true,
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [birthdayError, setBirthdayError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = formData.name.trim() && formData.email.trim() && formData.password.length >= 8 && formData.confirmPassword.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPasswordErrors([]);
    setBirthdayError('');

    // Validation
    if (!formData.name.trim()) {
      setError('名前を入力してください');
      return;
    }

    // 生年月日のバリデーション
    if (formData.year || formData.month || formData.day) {
      const birthdayValidation = validateBirthday(formData.year, formData.month, formData.day);
      if (!birthdayValidation.isValid) {
        setBirthdayError(birthdayValidation.errorMessage || '生年月日を正しく入力してください');
        return;
      }
    }

    if (!formData.email.trim()) {
      setError('メールアドレスを入力してください');
      return;
    }

    if (formData.password.length < 8) {
      setError('パスワードは8文字以上で設定してください');
      return;
    }

    const errors: string[] = [];
    
    if (formData.password !== formData.confirmPassword) {
      errors.push('パスワードが一致しません');
    }

    if (!/[0-9]/.test(formData.password) || !/[a-zA-Z]/.test(formData.password)) {
      errors.push('パスワードには英語も使用してください');
    }

    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      // TODO: 実際のサインアップ処理
      console.log('Signing up:', formData);
      
      // デモ用: 登録後にログイン画面へ
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch {
      setError('登録エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white py-8 px-4">
        <div className="flex items-center justify-center gap-4 relative">
          <button
            onClick={() => router.back()}
            className="absolute left-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-gray-900" />
          </button>
          <h1
            className="font-['Noto_Sans_JP'] font-bold text-[20px] leading-[20px] text-center align-middle text-[#1A1A1A]"
          >
            アカウント作成
          </h1>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 overflow-y-auto px-[37.5px]">
        <div className="max-w-md mx-auto">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label
                className="block font-['Noto_Sans_JP'] font-bold text-[12px] leading-[12px] text-[#1A1A1A] mb-[10px]"
              >
                名前
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 h-[28px] mb-[14px] px-2 font-['Inter'] font-medium text-[14px] leading-[130%] text-[#1A1A1A]"
                placeholder=""
                required
              />
            </div>

            {/* Birthday */}
            <div>
              <label
                className="block font-['Noto_Sans_JP'] font-bold text-[12px] leading-[12px] text-[#1A1A1A] mb-[10px]"
              >
                生年月日
              </label>
              <div className="flex items-center mb-[14px] gap-1">
                <input
                  type="number"
                  min="1900"
                  max="2024"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-center placeholder-gray-400 w-[60px] h-[28px] font-['Inter'] font-medium text-[14px] leading-[130%] text-[#1A1A1A]"
                  placeholder="1999"
                />
                <span className="font-['Noto_Sans_JP'] font-bold text-[12px] leading-[12px] text-[#5C5C5C]">年</span>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={formData.month}
                  onChange={(e) => {
                    const newMonth = e.target.value;
                    setFormData({ ...formData, month: newMonth });
                    // 月が変わった時に日を検証
                    if (newMonth && formData.year && formData.day) {
                      const maxDay = getMaxDayInMonth(formData.year, newMonth);
                      if (parseInt(formData.day, 10) > maxDay) {
                        setFormData(prev => ({ ...prev, month: newMonth, day: '' }));
                      }
                    }
                  }}
                  className={`bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 w-[35px] h-[28px] px-[8.5px] font-['Inter'] font-medium text-[14px] leading-[130%] text-[#1A1A1A] ${styles.birthdayInput}`}
                  placeholder="1"
                />
                <span className="font-['Noto_Sans_JP'] font-bold text-[12px] leading-[12px] text-[#5C5C5C]">月</span>
                <input
                  type="number"
                  min="1"
                  max={getMaxDayInMonth(formData.year, formData.month)}
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  className={`bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 w-[35px] h-[28px] px-[8.5px] font-['Inter'] font-medium text-[14px] leading-[130%] text-[#1A1A1A] ${styles.birthdayInput}`}
                  placeholder="1"
                />
                <span className="font-['Noto_Sans_JP'] font-bold text-[12px] leading-[12px] text-[#5C5C5C]">日</span>
                <label className="flex items-center gap-2 ml-auto cursor-pointer relative">
                  <span className="font-['Noto_Sans_JP'] font-bold text-[12px] leading-[12px] text-[#1A1A1A]">
                    {formData.isPrivate ? '公開' : '非公開'}
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.isPrivate}
                    onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                    style={{ display: 'none' }}
                  />
                  <div
                    style={{
                      width: '50px',
                      height: '20px',
                      borderRadius: '50px',
                      backgroundColor: formData.isPrivate ? '#FFD26A' : '#CDCDCD',
                      transition: 'background-color 0.3s',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      paddingTop: '8px',
                      paddingRight: '3px',
                      paddingBottom: '8px',
                      paddingLeft: '3px',
                      boxSizing: 'border-box',
                      opacity: 1
                    }}
                  >
                    <img
                      src="/circlecheck.svg"
                      alt="toggle"
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '10px',
                        opacity: 1,
                        transition: 'all 0.3s',
                        position: 'absolute',
                        left: formData.isPrivate ? '31px' : '3px'
                      }}
                    />
                  </div>
                </label>
              </div>
              {birthdayError && (
                <p className="text-red-600 text-[12px] font-['Noto_Sans_JP'] mb-[14px]">
                  {birthdayError}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                className="block font-['Noto_Sans_JP'] font-bold text-[12px] leading-[12px] text-[#1A1A1A] mb-[10px]"
              >
                メールアドレス
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 h-[28px] mb-[14px] px-2 font-['Inter'] font-medium text-[14px] leading-[130%] text-[#1A1A1A]"
                placeholder=""
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block font-['Noto_Sans_JP'] font-bold text-[12px] leading-[12px] text-[#1A1A1A] mb-[10px]"
              >
                パスワード <span className="font-['Noto_Sans_JP'] font-bold text-[10px] leading-[12px] text-[#828282] ml-[7px]">8文字以上・数字混合 必須</span>
              </label>
              <div className="relative mb-[14px]">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10 h-[28px] px-2 font-['Inter'] font-medium text-[14px] leading-[130%] text-[#1A1A1A]"
                  placeholder=""
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-[20px] h-[16.62px]"
                >
                  {showPassword ? (
                    <img src="/open.svg" alt="Hide password" style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <img src="/close.svg" alt="Show password" style={{ width: '100%', height: '100%' }} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                className="block font-['Noto_Sans_JP'] font-bold text-[12px] leading-[12px] text-[#1A1A1A] mb-[10px]"
              >
                パスワード再入力 <span className="font-['Noto_Sans_JP'] font-bold text-[10px] leading-[12px] text-[#828282] ml-[7px]">8文字以上・英数字混合 必須</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    setPasswordErrors([]);
                  }}
                  className={`w-full bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10 h-[28px] px-2 font-['Inter'] font-medium text-[14px] leading-[130%] text-[#1A1A1A] ${passwordErrors.length > 0 ? 'border border-[#FF0000]' : ''}`}
                  placeholder=""
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-[20px] h-[16.62px]"
                >
                  {showConfirmPassword ? (
                    <img src="/open.svg" alt="Hide password" style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <img src="/close.svg" alt="Show password" style={{ width: '100%', height: '100%' }} />
                  )}
                </button>
              </div>
              {passwordErrors.length > 0 && (
                <div className="mt-[2px]">
                  {passwordErrors.map((err, idx) => (
                    <div
                      key={idx}
                      className="font-['Noto_Sans_JP'] font-bold text-[10px] leading-[12px] text-[#FF383C]"
                      style={{
                        marginBottom: idx < passwordErrors.length - 1 ? '4px' : '0'
                      }}
                    >
                      {err}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-[calc(100%-161px)] ml-[80.5px] mr-[80.5px] gap-2 rounded-[12px] border-none mt-[32px] font-['Inter'] font-medium text-[16px] leading-[150%] min-h-[48px] flex items-center justify-center transition-colors duration-300"
              style={{
                backgroundColor: isFormValid ? '#FFBA48' : '#F8E8AA',
                cursor: isFormValid ? 'pointer' : 'not-allowed',
                color: isFormValid ? '#FFFFFF' : '#FFFFFFB2',
                boxShadow: isFormValid ? 'none' : '0px 1px 2px 0px #0000000D'
              }}
            >
              {isLoading ? '登録中...' : '登録'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
