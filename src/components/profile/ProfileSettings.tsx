'use client';

import React, { useState } from 'react';
import { 
  X, User, Lock, Bell, Shield, Globe, Moon, 
  ChevronRight, LogOut, Camera, Mail, Phone,
  Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ isOpen, onClose }) => {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'account' | 'privacy' | 'notifications' | 'security'>('account');

  if (!isOpen || !currentUser) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">設定</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 p-4 overflow-y-auto">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'account'
                    ? 'bg-purple-50 text-purple-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <User className="h-5 w-5" />
                <span>アカウント</span>
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'privacy'
                    ? 'bg-purple-50 text-purple-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Shield className="h-5 w-5" />
                <span>プライバシー</span>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'notifications'
                    ? 'bg-purple-50 text-purple-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Bell className="h-5 w-5" />
                <span>通知</span>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'security'
                    ? 'bg-purple-50 text-purple-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Lock className="h-5 w-5" />
                <span>セキュリティ</span>
              </button>
            </nav>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>ログアウト</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">アカウント情報</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-gray-600" />
                        <div>
                          <div className="text-sm text-gray-600">ユーザー名</div>
                          <div className="font-semibold text-gray-900">{currentUser.name}</div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-600" />
                        <div>
                          <div className="text-sm text-gray-600">メールアドレス</div>
                          <div className="font-semibold text-gray-900">{currentUser.email}</div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-600" />
                        <div>
                          <div className="text-sm text-gray-600">電話番号</div>
                          <div className="font-semibold text-gray-900">090-1234-5678</div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Camera className="h-5 w-5 text-gray-600" />
                        <div>
                          <div className="text-sm text-gray-600">プロフィール画像</div>
                          <div className="text-sm text-purple-600 font-semibold">変更する</div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <button className="text-red-600 hover:text-red-700 font-semibold">
                    アカウントを削除
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">プライバシー設定</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-900">非公開アカウント</div>
                        <div className="text-sm text-gray-600">フォロワーのみがあなたのコンテンツを見られます</div>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-purple-600 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-900">アクティビティステータス</div>
                        <div className="text-sm text-gray-600">オンライン状態を表示</div>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-purple-600 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-900">検索結果に表示</div>
                        <div className="text-sm text-gray-600">他のユーザーがあなたを検索できます</div>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-purple-600 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-900">タグ付けを許可</div>
                        <div className="text-sm text-gray-600">他のユーザーがあなたをタグ付けできます</div>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-purple-600 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold">
                    <Shield className="h-5 w-5" />
                    ブロックリストを管理
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">通知設定</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-900">いいね</div>
                        <div className="text-sm text-gray-600">投稿にいいねされたとき</div>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-purple-600 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-900">コメント</div>
                        <div className="text-sm text-gray-600">投稿にコメントされたとき</div>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-purple-600 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-900">新しいフォロワー</div>
                        <div className="text-sm text-gray-600">フォローされたとき</div>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-purple-600 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-900">メッセージ</div>
                        <div className="text-sm text-gray-600">新しいメッセージを受信したとき</div>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-purple-600 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-900">学習リマインダー</div>
                        <div className="text-sm text-gray-600">タスクの期限が近づいたとき</div>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-purple-600 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-900">メール通知</div>
                        <div className="text-sm text-gray-600">メールで通知を受け取る</div>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-purple-600 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">セキュリティ</h3>
                  
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 text-gray-600" />
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">パスワードを変更</div>
                          <div className="text-sm text-gray-600">最終更新: 3ヶ月前</div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-900">2段階認証</div>
                        <div className="text-sm text-gray-600">ログイン時に追加の認証を要求</div>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-purple-600 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <Eye className="h-5 w-5 text-gray-600" />
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">ログイン履歴</div>
                          <div className="text-sm text-gray-600">最近のログイン記録を確認</div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-gray-600" />
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">連携アプリ</div>
                          <div className="text-sm text-gray-600">外部アプリとの連携を管理</div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex gap-3">
                    <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-blue-900 mb-1">セキュリティのヒント</div>
                      <div className="text-sm text-blue-700">
                        定期的にパスワードを変更し、2段階認証を有効にすることをお勧めします。
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
