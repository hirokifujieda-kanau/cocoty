'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        console.log('🔐 新規登録中...', email);
        await signup(email, password);
        console.log('✅ 新規登録成功！');
      } else {
        console.log('🔐 ログイン中...', email);
        await login(email, password);
        console.log('✅ ログイン成功！');
      }
      router.push('/profile');
    } catch (err: any) {
      console.error('❌ 認証エラー:', err);
      console.error('エラーコード:', err.code);
      console.error('エラーメッセージ:', err.message);
      
      let errorMessage = '認証に失敗しました';
      
      if (err.code === 'auth/invalid-credential') {
        errorMessage = isSignup 
          ? 'このアカウントは既に存在するか、パスワードが間違っています'
          : 'メールアドレスまたはパスワードが間違っています。まだ登録していない場合は「アカウントを作成する」をクリックしてください。';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'このメールアドレスは既に使用されています。ログインしてください。';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'パスワードは6文字以上にしてください';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'メールアドレスの形式が正しくありません';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'このメールアドレスは登録されていません。「アカウントを作成する」から新規登録してください。';
      } else {
        errorMessage = `${err.message || '認証に失敗しました'} (エラーコード: ${err.code})`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isSignup ? '新規登録' : 'ログイン'}
          </h1>
          <p className="text-gray-600">Cocotyへようこそ</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              minLength={6}
            />
            {isSignup && (
              <p className="text-xs text-gray-500 mt-1">6文字以上で入力してください</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '処理中...' : isSignup ? '登録する' : 'ログイン'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
            }}
            className="text-purple-600 hover:text-purple-700 font-medium text-sm"
          >
            {isSignup ? '既にアカウントをお持ちの方はこちら' : 'アカウントを作成する'}
          </button>
        </div>
      </div>
    </div>
  );
}
