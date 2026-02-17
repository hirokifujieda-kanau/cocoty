'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// 全角数字を半角に変換する関数
const toHalfWidth = (str: string) => {
  return str.replace(/[０-９]/g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  // フォームが有効かどうかをチェック
  const isFormValid = email.trim() && password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 全角数字を半角に変換してからログイン
      const halfWidthEmail = toHalfWidth(email);
      const halfWidthPassword = toHalfWidth(password);
      
      await login(halfWidthEmail, halfWidthPassword);
      router.push('/profile');
    } catch (err: any) {
      console.error('❌ 認証エラー:', err);
      console.error('エラーコード:', err.code);
      console.error('エラーメッセージ:', err.message);
      
      let errorMessage = '認証に失敗しました';
      
      if (err.code === 'auth/invalid-credential') {
        errorMessage = 'メールアドレスまたはパスワードが間違っています';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'メールアドレスの形式が正しくありません';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'このメールアドレスは登録されていません';
      } else {
        errorMessage = `${err.message || '認証に失敗しました'}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <div className="sticky top-0 bg-white py-8 px-4">
        <div className="flex items-center justify-center gap-4 relative">
          <h1 className="font-['Noto_Sans_JP'] font-bold text-[20px] leading-[20px] text-center align-middle text-[#1A1A1A]">
            ログイン
          </h1>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-y-auto px-[37.5px]">
        <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-noto-sans">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block font-['Noto_Sans_JP'] font-bold text-[12px] leading-[12px] text-[#1A1A1A] mb-[10px]"
            >
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(toHalfWidth(e.target.value))}
              required
              className="w-full bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 h-[28px] mb-[14px] px-2 font-['Inter'] font-medium text-[14px] leading-[130%] text-[#1A1A1A]"
              placeholder=""
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block font-['Noto_Sans_JP'] font-bold text-[12px] leading-[12px] text-[#1A1A1A] mb-[10px]"
            >
              パスワード
            </label>
            <div className="relative mb-[14px]">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(toHalfWidth(e.target.value))}
                required
                className="w-full bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10 h-[28px] px-2 font-['Inter'] font-medium text-[14px] leading-[130%] text-[#1A1A1A]"
                placeholder=""
                minLength={6}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="w-[calc(100%-161px)] ml-[80.5px] mr-[80.5px] gap-2 rounded-[12px] border-none mt-[32px] font-['Inter'] font-medium text-[16px] leading-[150%] min-h-[48px] flex items-center justify-center transition-colors duration-300"
            style={{
              backgroundColor: (isFormValid && !loading) ? '#FFBA48' : '#F8E8AA',
              cursor: (isFormValid && !loading) ? 'pointer' : 'not-allowed',
              color: (isFormValid && !loading) ? '#FFFFFF' : '#FFFFFFB2',
              boxShadow: (isFormValid && !loading) ? 'none' : '0px 1px 2px 0px #0000000D'
            }}
          >
            {loading ? '処理中...' : 'ログイン'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="font-['Noto_Sans_JP'] text-[14px] text-gray-600">アカウントをお持ちでない方は</span>{' '}
          <button
            onClick={() => router.push('/signup')}
            className="font-['Noto_Sans_JP'] font-semibold text-[14px] transition-colors"
            style={{ color: '#FFBA48' }}
          >
            アカウント作成
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
