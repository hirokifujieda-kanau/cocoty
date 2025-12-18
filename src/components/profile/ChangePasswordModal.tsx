'use client';

import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose, onBack }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>({});

  if (!isOpen) return null;

  // 英数字混合をチェック
  const hasAlphabetAndNumbers = (password: string) => {
    const hasAlpha = /[a-zA-Z]/.test(password);
    const hasNum = /[0-9]/.test(password);
    return hasAlpha && hasNum;
  };

  // 各フィールドのバリデーション
  const validateFields = () => {
    const newFieldErrors: { [key: string]: string[] } = {};

    // 新しいパスワードフィールドのバリデーション
    if (newPassword) {
      const errors: string[] = [];
      if (newPassword.length < 8) {
        errors.push('8文字以上である必要があります');
      }
      if (!hasAlphabetAndNumbers(newPassword)) {
        errors.push('パスワードには英語も使用してください');
      }
      if (errors.length > 0) {
        newFieldErrors['newPassword'] = errors;
      }
    }

    // パスワード再入力フィールドのバリデーション
    if (confirmPassword) {
      const errors: string[] = [];
      if (confirmPassword !== newPassword) {
        errors.push('パスワードが一致しません');
      }
      if (confirmPassword.length < 8) {
        errors.push('8文字以上である必要があります');
      }
      if (!hasAlphabetAndNumbers(confirmPassword)) {
        errors.push('パスワードには英語も使用してください');
      }
      if (errors.length > 0) {
        newFieldErrors['confirmPassword'] = errors;
      }
    }

    setFieldErrors(newFieldErrors);
    return Object.keys(newFieldErrors).length === 0;
  };

  const handleSave = async () => {
    setError(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('すべてのフィールドを入力してください');
      return;
    }

    if (!validateFields()) {
      return;
    }

    try {
      setLoading(true);
      // TODO: パスワード変更APIを呼び出し
      console.log('Changing password...');
      
      // 成功時
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onBack();
    } catch (err) {
      setError('パスワードの変更に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex flex-col h-screen max-h-screen overflow-hidden">
      {/* Top Header */}
      <div className="sticky top-0 border-b border-gray-200 z-50" style={{ backgroundColor: '#FFD26A' }}>
        <div className="mx-auto h-[30px] flex items-center" style={{ maxWidth: '750px', paddingLeft: 'clamp(26px, 8vw, 106px)', paddingRight: 'clamp(26px, 8vw, 106px)' }}>
          <div className="flex items-center justify-between w-full">
            <h1 className="font-semibold text-base text-white" style={{ fontFamily: '"Noto Sans JP"' }}>ここてぃ</h1>
            <div className="flex gap-2 items-center">
              <div className="my-1 ml-[9px]">
                <div className="relative flex items-center">
                  <img alt="search" src="/人物アイコン　チーム 1.svg" className="absolute left-2 w-5 h-5 pointer-events-none" />
                  <input placeholder="ユーザー一覧" className="px-4 py-1 text-xs rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400" type="text" style={{ fontFamily: '"Noto Sans JP"', fontSize: '10px', paddingLeft: '32px' }} />
                </div>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded-full transition-colors" title="設定">
                <img alt="設定" className="w-5 h-5" src="/歯車.svg" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between px-4 bg-white shrink-0" style={{ paddingTop: '26px', paddingBottom: '26px' }}>
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="戻る"
        >
          <ChevronLeft className="h-6 w-6 text-gray-800" />
        </button>
        <h1 className="flex-1 text-center font-bold text-xl" style={{ fontFamily: '"Noto Sans JP"', fontSize: '20px', lineHeight: '20px', color: '#1A1A1A' }}>パスワードの変更</h1>
        <div className="w-8" />
      </div>

      {/* Content Wrapper with white background */}
      <div className="flex-1 bg-white overflow-y-auto">
        {/* Content */}
        <div className="mx-auto py-6" style={{ paddingLeft: '37.5px', paddingRight: '37.5px', maxWidth: '448px', width: '100%' }}>
          <div className="space-y-6">
          {/* Current Password Field */}
          <div>
            <div className="flex items-center gap-2.5 mb-[10px]">
              <label className="block font-bold text-[12px] leading-[20px]" style={{ fontFamily: '"Noto Sans JP"', color: '#1A1A1A' }}>
                現在のパスワード
              </label>
              <span className="font-bold text-[10px] leading-[12px]" style={{ fontFamily: '"Noto Sans JP"', color: '#828282' }}>
                8文字以上・英数字混合 必須
              </span>
            </div>
            <div className="relative mb-2">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder=""
                className="w-full bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10 h-[28px] px-2 font-['Inter'] font-medium text-[14px] leading-[130%] text-[#1A1A1A]"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-[20px] h-[20px]"
              >
                <img src={showCurrentPassword ? '/open.svg' : '/close.svg'} alt={showCurrentPassword ? 'Hide password' : 'Show password'} style={{ width: '100%', height: '100%' }} />
              </button>
            </div>
            <p className="font-bold text-[10px] leading-[12px] mt-2" style={{ fontFamily: '"Noto Sans JP"', color: '#5C5C5C' }}>パスワードを忘れた方</p>
          </div>

          {/* New Password Field */}
          <div>
            <div className="flex items-center gap-2.5 mb-[10px]">
              <label className="block font-bold text-[12px] leading-[20px]" style={{ fontFamily: '"Noto Sans JP"', color: '#1A1A1A' }}>
                新しいパスワード
              </label>
              <span className="font-bold text-[10px] leading-[12px]" style={{ fontFamily: '"Noto Sans JP"', color: '#828282' }}>
                8文字以上・英数字混合 必須
              </span>
            </div>
            <div className="relative mb-2">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder=""
                className={`w-full bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10 h-[28px] px-2 font-['Inter'] font-medium text-[14px] leading-[130%] text-[#1A1A1A] ${fieldErrors['newPassword'] ? 'border border-[#FF0000]' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-[20px] h-[20px]"
              >
                <img src={showNewPassword ? '/open.svg' : '/close.svg'} alt={showNewPassword ? 'Hide password' : 'Show password'} style={{ width: '100%', height: '100%' }} />
              </button>
            </div>
            {fieldErrors['newPassword'] && (
              <div className="mt-[2px]">
                {fieldErrors['newPassword'].map((err, idx) => (
                  <div key={idx} className="font-bold text-[10px] leading-[12px]" style={{ fontFamily: '"Noto Sans JP"', color: '#FF383C', marginBottom: idx === fieldErrors['newPassword'].length - 1 ? '0px' : '4px' }}>
                    {err}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <div className="flex items-center gap-2.5 mb-[10px]">
              <label className="block font-bold text-[12px] leading-[20px]" style={{ fontFamily: '"Noto Sans JP"', color: '#1A1A1A' }}>
                パスワード再入力
              </label>
              <span className="font-bold text-[10px] leading-[12px]" style={{ fontFamily: '"Noto Sans JP"', color: '#828282' }}>
                8文字以上・英数字混合 必須
              </span>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder=""
                className={`w-full bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10 h-[28px] px-2 font-['Inter'] font-medium text-[14px] leading-[130%] text-[#1A1A1A] ${fieldErrors['confirmPassword'] ? 'border border-[#FF0000]' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-[20px] h-[20px]"
              >
                <img src={showConfirmPassword ? '/open.svg' : '/close.svg'} alt={showConfirmPassword ? 'Hide password' : 'Show password'} style={{ width: '100%', height: '100%' }} />
              </button>
            </div>
            {fieldErrors['confirmPassword'] && (
              <div className="mt-[2px]">
                {fieldErrors['confirmPassword'].map((err, idx) => (
                  <div key={idx} className="font-bold text-[10px] leading-[12px]" style={{ fontFamily: '"Noto Sans JP"', color: '#FF383C', marginBottom: idx === fieldErrors['confirmPassword'].length - 1 ? '0px' : '4px' }}>
                    {err}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p style={{ color: '#dc2626', fontFamily: 'Inter', fontSize: '14px' }}>{error}</p>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-center pt-4" style={{ marginLeft: '80px', marginRight: '80px' }}>
            <button
              type="submit"
              onClick={handleSave}
              disabled={loading || !currentPassword || !newPassword || !confirmPassword || Object.keys(fieldErrors).length > 0}
              className="w-full gap-2 rounded-[12px] border-none font-['Inter'] font-medium text-[16px] leading-[150%] min-h-[48px] flex items-center justify-center transition-colors duration-300"
              style={{
                backgroundColor: currentPassword && newPassword && confirmPassword && Object.keys(fieldErrors).length === 0 ? '#FFBA48' : '#FFD26A',
                cursor: loading || !currentPassword || !newPassword || !confirmPassword || Object.keys(fieldErrors).length > 0 ? 'not-allowed' : 'pointer',
                color: currentPassword && newPassword && confirmPassword && Object.keys(fieldErrors).length === 0 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.698)',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px',
              }}
            >
              {loading ? '保存中...' : '保存'}
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
