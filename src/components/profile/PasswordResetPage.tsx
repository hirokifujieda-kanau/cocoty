'use client';

import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import styles from './InstagramProfilePage.module.css';

interface PasswordResetPageProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

const PasswordResetPage: React.FC<PasswordResetPageProps> = ({ isOpen, onClose, onBack }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSendReset = async () => {
    setError(null);

    if (!email) {
      setError('メールアドレスを入力してください');
      return;
    }

    // メールアドレスのバリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('有効なメールアドレスを入力してください');
      return;
    }

    try {
      setLoading(true);
      // TODO: パスワードリセットAPIを呼び出し
      console.log('Sending password reset email to:', email);
      
      // 成功時
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError('パスワードリセットリンクの送信に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex flex-col h-screen max-h-screen overflow-hidden">
      {/* Top Header */}
      <div className="sticky top-0 border-b border-gray-200 z-50 bg-[#FFD26A]">
        <div className="mx-auto h-[30px] flex items-center" style={{ maxWidth: '750px', paddingLeft: 'clamp(26px, 8vw, 106px)', paddingRight: 'clamp(26px, 8vw, 106px)' }}>
          <div className="flex items-center justify-between w-full">
            <h1 className="text-white text-[16px] leading-[100%] align-middle" style={{ fontFamily: '"Noto Sans JP"', fontWeight: 500, lineHeight: '100%', verticalAlign: 'middle' }}>ここてぃ</h1>
            <div className="flex gap-2 items-center">
              <div className="my-1 ml-[9px]">
                <div className="relative flex items-center">
                  <img alt="search" src="/人物アイコン　チーム 1.svg" style={{ position: 'absolute', left: '8px', width: '20px', height: '20px', pointerEvents: 'none' }} />
                  <input placeholder="ユーザー一覧" type="text" style={{ fontSize: '10px', fontFamily: '"Noto Sans JP"', fontWeight: 500, marginTop: '5px', marginBottom: '5px', paddingLeft: '32px', boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px', lineHeight: '100%' }} className={`px-4 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 ${styles.searchInput}`} />
                  <style>{`
                    input::placeholder {
                      font-family: Noto Sans JP;
                      font-weight: 500;
                      font-size: 10px;
                      line-height: 100%;
                      letter-spacing: 0%;
                      color: #5C5C5C;
                    }
                  `}</style>
                </div>
              </div>
              <button className="hover:bg-gray-100 rounded-full transition-colors" title="設定">
                <img alt="設定" className="w-5 h-5" src="/歯車.svg" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between px-4 bg-white shrink-0 py-[26px]">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="戻る"
        >
          <ChevronLeft className="h-6 w-6 text-gray-800" />
        </button>
        <h1 className="flex-1 text-center font-bold text-[20px] leading-[20px] text-[#1A1A1A]" style={{ fontFamily: '"Noto Sans JP"' }}>パスワードの再設定</h1>
        <div className="w-8" />
      </div>

      {/* Content Wrapper with white background */}
      <div className="flex-1 bg-white overflow-y-auto">
        {/* Content */}
        <div className="mx-auto py-6 px-[37.5px] max-w-[448px] w-full">
          <div className="space-y-6">
            {!success ? (
              <>
                <div>
                  <p style={{ fontFamily: '"Noto Sans JP"', fontWeight: 700, fontSize: '12px', lineHeight: '20px', letterSpacing: '0%', color: '#1A1A1A' }}>
                    パスワードの再設定リンクをお送りします。
                  </p>
                  <p className="mb-6" style={{ fontFamily: '"Noto Sans JP"', fontWeight: 700, fontSize: '12px', lineHeight: '20px', letterSpacing: '0%', color: '#1A1A1A' }}>
                    登録されているメールアドレスを入力してください。
                  </p>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block mb-[6px] font-bold text-[12px] leading-[20px] text-[#1A1A1A]" style={{ fontFamily: '"Noto Sans JP"', letterSpacing: '0%' }}>
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=""
                    className="w-full bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 h-[28px] px-2 font-['Inter'] font-medium text-[14px] leading-[130%] text-[#1A1A1A]"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-[#dc2626] text-sm" style={{ fontFamily: 'Inter' }}>{error}</p>
                  </div>
                )}

                {/* Send Button */}
                <div className="flex justify-center pt-4 ml-20 mr-20">
                  <button
                    type="submit"
                    onClick={handleSendReset}
                    disabled={loading || !email}
                    className="w-full gap-2 rounded-[12px] border-none font-['Inter'] font-medium text-[16px] leading-[150%] min-h-[48px] flex items-center justify-center transition-colors duration-300"
                    style={{
                      backgroundColor: email ? '#FFBA48' : '#F8E8AA',
                      cursor: loading || !email ? 'not-allowed' : 'pointer',
                      color: email ? '#FFFFFF' : '#FFFFFFB2',
                      boxShadow: '0px 1px 2px 0px #0000000D',
                    }}
                  >
                    {loading ? '送信中...' : '送信'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="font-bold text-[14px] leading-[20px] text-[#1A1A1A] mb-4" style={{ fontFamily: '"Noto Sans JP"' }}>
                  パスワードリセットリンクを送信しました。
                </p>
                <p className="font-bold text-[12px] leading-[20px] text-[#828282] mb-6" style={{ fontFamily: '"Noto Sans JP"' }}>
                  メールを確認して、リンクをクリックしてください。
                </p>
                <div className="px-[80px]">
                  <button
                    onClick={onBack}
                    className="w-full gap-2 rounded-[12px] border-none font-['Inter'] font-medium text-[16px] leading-[150%] min-h-[48px] flex items-center justify-center transition-colors duration-300 bg-[#FFBA48] text-white cursor-pointer shadow-[0px_1px_2px_0px_#0000000D]"
                  >
                    戻る
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
