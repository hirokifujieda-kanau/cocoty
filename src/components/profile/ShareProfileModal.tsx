'use client';

import React, { useState } from 'react';
import { X, Link as LinkIcon, Copy, Check, Facebook, Twitter, Instagram, MessageCircle, Mail, QrCode } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ShareProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareProfileModal: React.FC<ShareProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (!isOpen || !currentUser) return null;

  const profileUrl = `https://cocoty.app/profile/${currentUser.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-blue-400',
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${currentUser.name}のプロフィールをチェック！`)}&url=${encodeURIComponent(profileUrl)}`,
          '_blank'
        );
      }
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
          '_blank'
        );
      }
    },
    {
      name: 'LINE',
      icon: MessageCircle,
      color: 'bg-green-500',
      action: () => {
        window.open(
          `https://line.me/R/msg/text/?${encodeURIComponent(`${currentUser.name}のプロフィール ${profileUrl}`)}`,
          '_blank'
        );
      }
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500',
      action: () => {
        // Instagram doesn't have direct share API, copy link instead
        handleCopyLink();
      }
    },
    {
      name: 'メール',
      icon: Mail,
      color: 'bg-gray-600',
      action: () => {
        window.open(
          `mailto:?subject=${encodeURIComponent(`${currentUser.name}のプロフィール`)}&body=${encodeURIComponent(profileUrl)}`,
          '_blank'
        );
      }
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">プロフィールをシェア</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Preview */}
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-200"
            />
            <div>
              <div className="font-bold text-gray-900">{currentUser.name}</div>
              <div className="text-sm text-gray-600">{currentUser.bio}</div>
            </div>
          </div>

          {/* Copy Link */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              プロフィールリンク
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 truncate">
                {profileUrl}
              </div>
              <button
                onClick={handleCopyLink}
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {copied ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </button>
            </div>
            {copied && (
              <div className="mt-2 text-sm text-green-600 font-semibold flex items-center gap-1">
                <Check className="h-4 w-4" />
                リンクをコピーしました！
              </div>
            )}
          </div>

          {/* SNS Share */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              SNSでシェア
            </label>
            <div className="grid grid-cols-5 gap-3">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={option.action}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-14 h-14 rounded-full ${option.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg`}>
                    <option.icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-gray-600">{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* QR Code */}
          <div>
            <button
              onClick={() => setShowQR(!showQR)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <QrCode className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">QRコードで共有</div>
                  <div className="text-sm text-gray-600">カメラで読み取り可能</div>
                </div>
              </div>
              <div className="text-sm text-purple-600 font-semibold">
                {showQR ? '閉じる' : '表示'}
              </div>
            </button>

            {showQR && (
              <div className="mt-4 p-6 bg-white border border-gray-200 rounded-xl text-center">
                <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  {/* QRコードのプレースホルダー */}
                  <div className="text-center">
                    <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">QRコード</div>
                    <div className="text-xs text-gray-500">（実装予定）</div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                  QRコードをダウンロード
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareProfileModal;
