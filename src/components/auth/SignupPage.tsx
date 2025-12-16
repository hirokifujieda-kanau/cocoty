'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    year: '1999',
    month: '1',
    day: '1',
    isPrivate: true,
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('名前を入力してください');
      return;
    }

    if (!formData.email.trim()) {
      setError('メールアドレスを入力してください');
      return;
    }

    if (formData.password.length < 8) {
      setError('パスワードは8文字以上で設定してください');
      return;
    }

    if (!/[0-9]/.test(formData.password) || !/[a-zA-Z]/.test(formData.password)) {
      setError('パスワードは英字と数字を混合させてください');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
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
            style={{
              fontFamily: 'Noto Sans JP',
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: '20px',
              letterSpacing: '0%',
              textAlign: 'center',
              verticalAlign: 'middle',
              color: '#1A1A1A'
            }}
          >
            アカウント作成
          </h1>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 overflow-y-auto" style={{ paddingLeft: '37.5px', paddingRight: '37.5px' }}>
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
                style={{
                  display: 'block',
                  fontFamily: 'Noto Sans JP',
                  fontWeight: 700,
                  fontSize: '12px',
                  lineHeight: '12px',
                  letterSpacing: '0%',
                  color: '#1A1A1A',
                  marginBottom: '10px'
                }}
              >
                名前
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder=""
                required
                style={{
                  height: '28px',
                  marginBottom: '14px',
                  paddingLeft: '8px',
                  paddingRight: '8px',
                  fontFamily: 'Inter',
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '130%',
                  letterSpacing: '0%',
                  color: '#1A1A1A'
                }}
              />
            </div>

            {/* Birthday */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'Noto Sans JP',
                  fontWeight: 700,
                  fontSize: '12px',
                  lineHeight: '12px',
                  letterSpacing: '0%',
                  color: '#1A1A1A',
                  marginBottom: '10px'
                }}
              >
                生年月日
              </label>
              <div className="flex items-center gap-2" style={{ marginBottom: '14px' }}>
                <input
                  type="number"
                  min="1900"
                  max="2024"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="flex-1 px-3 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-center"
                  style={{
                    height: '28px',
                    fontFamily: 'Inter',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '130%',
                    letterSpacing: '0%',
                    color: '#1A1A1A'
                  }}
                />
                <span className="text-gray-600">年</span>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  className="bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  style={{
                    height: '28px',
                    paddingLeft: '8.5px',
                    paddingRight: '8.5px',
                    fontFamily: 'Inter',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '130%',
                    letterSpacing: '0%',
                    color: '#1A1A1A'
                  }}
                />
                <span className="text-gray-600">月</span>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  className="bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  style={{
                    height: '28px',
                    paddingLeft: '8.5px',
                    paddingRight: '8.5px',
                    fontFamily: 'Inter',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '130%',
                    letterSpacing: '0%',
                    color: '#1A1A1A'
                  }}
                />
                <span className="text-gray-600">日</span>
                <label className="flex items-center gap-2 ml-auto cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPrivate}
                    onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-xs text-gray-600">非公開</span>
                </label>
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'Noto Sans JP',
                  fontWeight: 700,
                  fontSize: '12px',
                  lineHeight: '12px',
                  letterSpacing: '0%',
                  color: '#1A1A1A',
                  marginBottom: '10px'
                }}
              >
                メールアドレス
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder=""
                required
                style={{
                  height: '28px',
                  marginBottom: '14px',
                  paddingLeft: '8px',
                  paddingRight: '8px',
                  fontFamily: 'Inter',
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '130%',
                  letterSpacing: '0%',
                  color: '#1A1A1A'
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'Noto Sans JP',
                  fontWeight: 700,
                  fontSize: '12px',
                  lineHeight: '12px',
                  letterSpacing: '0%',
                  color: '#1A1A1A',
                  marginBottom: '10px'
                }}
              >
                パスワード <span className="text-xs text-gray-600">8文字以上・数字混合 必須</span>
              </label>
              <div className="relative" style={{ marginBottom: '14px' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10"
                  placeholder=""
                  required
                  style={{
                    height: '28px',
                    paddingLeft: '8px',
                    fontFamily: 'Inter',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '130%',
                    letterSpacing: '0%',
                    color: '#1A1A1A'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ width: '20px', height: '16.62px' }}
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
                style={{
                  display: 'block',
                  fontFamily: 'Noto Sans JP',
                  fontWeight: 700,
                  fontSize: '12px',
                  lineHeight: '12px',
                  letterSpacing: '0%',
                  color: '#1A1A1A',
                  marginBottom: '10px'
                }}
              >
                パスワード再入力 <span className="text-xs text-gray-600">8文字以上・英数字混合 必須</span>
              </label>
              <div className="relative" style={{ marginBottom: '14px' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10"
                  placeholder=""
                  required
                  style={{
                    height: '28px',
                    paddingLeft: '8px',
                    fontFamily: 'Inter',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '130%',
                    letterSpacing: '0%',
                    color: '#1A1A1A'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ width: '20px', height: '16.62px' }}
                >
                  {showConfirmPassword ? (
                    <img src="/open.svg" alt="Hide password" style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <img src="/close.svg" alt="Show password" style={{ width: '100%', height: '100%' }} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-yellow-300 hover:bg-yellow-400 disabled:bg-gray-300 text-gray-900 font-bold rounded-lg transition-colors mt-8"
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
