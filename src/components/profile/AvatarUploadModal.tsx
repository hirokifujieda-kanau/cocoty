'use client';

import React from 'react';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadClick: () => void;
}

const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({ 
  isOpen, 
  onClose, 
  onUploadClick 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl mx-4 relative" style={{ width: '300px', height: '340px' }}>
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="閉じる"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="#828282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* コンテンツ */}
        <div className="p-8 flex flex-col items-center h-full justify-center">
          <h2 className="font-noto font-bold text-xl text-gray-900 mb-8" style={{ marginTop: '20px' }}>
            プロフィール画像を変更
          </h2>

          {/* カメラアイコン */}
          <div className="rounded-full flex items-center justify-center" style={{ width: '81px', height: '81px' }}>
            <img src="/camera.svg" alt="カメラ" style={{ width: '81px', height: '81px' }} />
          </div>

          <p 
            className="mb-8"
            style={{
              fontFamily: 'Noto Sans JP',
              fontWeight: 700,
              fontSize: '12px',
              lineHeight: '20px',
              letterSpacing: '0%',
              color: '#5C5C5C'
            }}
          >
            アップロード
          </p>

          {/* 設定ボタン */}
          <button
            onClick={() => {
              onUploadClick();
              onClose();
            }}
            className="bg-[#FFBA48] hover:bg-[#F0AC3C] text-white font-bold transition-colors"
            style={{ 
              width: '140px', 
              height: '48px', 
              borderRadius: '12px',
              boxShadow: '0px 1px 2px 0px #0000000D'
            }}
          >
            設定
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarUploadModal;
