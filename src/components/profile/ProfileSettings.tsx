'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, User, Lock, Bell, Shield, Globe, Moon, 
  ChevronRight, LogOut, Camera, Mail, Phone,
  Eye, EyeOff, Check
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  getUserSettings,
  updateAccountInfo,
  updatePrivacySettings,
  updateNotificationSettings,
  updateSecuritySettings,
  changePassword,
  deleteAccount,
  UserSettings
} from '@/lib/mock/mockUserSettings';

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ isOpen, onClose }) => {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'account' | 'privacy' | 'notifications' | 'security'>('account');
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [deletePassword, setDeletePassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen && currentUser) {
      const userSettings = getUserSettings(currentUser.id, currentUser.name, currentUser.email, currentUser.avatar);
      setSettings(userSettings);
    }
  }, [isOpen, currentUser]);

  if (!isOpen || !currentUser || !settings) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
    onClose();
  };

  const handlePrivacyToggle = (key: keyof UserSettings['privacy']) => {
    const updated = !settings.privacy[key];
    if (updatePrivacySettings(currentUser.id, { [key]: updated })) {
      setSettings({
        ...settings,
        privacy: { ...settings.privacy, [key]: updated }
      });
      showMessage('success', '設定を更新しました');
    }
  };

  const handleNotificationToggle = (key: keyof UserSettings['notifications']) => {
    const updated = !settings.notifications[key];
    if (updateNotificationSettings(currentUser.id, { [key]: updated })) {
      setSettings({
        ...settings,
        notifications: { ...settings.notifications, [key]: updated }
      });
      showMessage('success', '設定を更新しました');
    }
  };

  const handleSecurityToggle = (key: keyof UserSettings['security']) => {
    if (key === 'twoFactorEnabled') {
      const updated = !settings.security[key];
      if (updateSecuritySettings(currentUser.id, { [key]: updated })) {
        setSettings({
          ...settings,
          security: { ...settings.security, [key]: updated }
        });
        showMessage('success', updated ? '2段階認証を有効にしました' : '2段階認証を無効にしました');
      }
    }
  };

  const handlePasswordChange = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      showMessage('error', '新しいパスワードが一致しません');
      return;
    }

    const result = changePassword(currentUser.id, passwordForm.current, passwordForm.new);
    
    if (result.success) {
      showMessage('success', result.message);
      setPasswordForm({ current: '', new: '', confirm: '' });
      setShowPasswordChange(false);
      // 設定を再読み込み
      const updatedSettings = getUserSettings(currentUser.id, currentUser.name, currentUser.email, currentUser.avatar);
      setSettings(updatedSettings);
    } else {
      showMessage('error', result.message);
    }
  };

  const handleDeleteAccount = () => {
    const result = deleteAccount(currentUser.id, deletePassword);
    
    if (result.success) {
      showMessage('success', result.message);
      setTimeout(() => {
        logout();
        router.push('/login');
      }, 1500);
    } else {
      showMessage('error', result.message);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const getPasswordChangeTime = () => {
    const lastChange = new Date(settings.security.lastPasswordChange);
    const now = new Date();
    const diffMonths = Math.floor((now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    if (diffMonths === 0) return '今月';
    if (diffMonths === 1) return '1ヶ月前';
    return `${diffMonths}ヶ月前`;
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

        {/* Success/Error Message */}
        {message && (
          <div className={`mx-6 mt-4 p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.type === 'success' && <Check className="h-5 w-5" />}
            <span>{message.text}</span>
          </div>
        )}

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
                          <div className="font-semibold text-gray-900">{settings.account.name}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">変更不可</div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-600" />
                        <div>
                          <div className="text-sm text-gray-600">メールアドレス</div>
                          <div className="font-semibold text-gray-900">{settings.account.email}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">変更不可</div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-600" />
                        <div>
                          <div className="text-sm text-gray-600">電話番号</div>
                          <div className="font-semibold text-gray-900">{settings.account.phone}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">モックデータ</div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Camera className="h-5 w-5 text-gray-600" />
                        <div>
                          <div className="text-sm text-gray-600">プロフィール画像</div>
                          <div className="text-sm text-gray-400">プロフィール編集から変更できます</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-red-600 hover:text-red-700 font-semibold"
                  >
                    アカウントを削除
                  </button>
                </div>

                {/* アカウント削除確認モーダル */}
                {showDeleteConfirm && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">アカウントを削除しますか？</h3>
                      <p className="text-gray-600 mb-4">
                        この操作は取り消せません。すべてのデータが削除されます。
                      </p>
                      <input
                        type="password"
                        placeholder="パスワードを入力して確認"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setShowDeleteConfirm(false);
                            setDeletePassword('');
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          キャンセル
                        </button>
                        <button
                          onClick={handleDeleteAccount}
                          disabled={!deletePassword}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          削除する
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
                      <label className="relative inline-block w-12 h-6 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.privacy.isPrivateAccount}
                          onChange={() => handlePrivacyToggle('isPrivateAccount')}
                          className="sr-only peer" 
                        />
                        <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-purple-600 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-900">アクティビティステータス</div>
                        <div className="text-sm text-gray-600">オンライン状態を表示</div>
                      </div>
                      <label className="relative inline-block w-12 h-6 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.privacy.showActivityStatus}
                          onChange={() => handlePrivacyToggle('showActivityStatus')}
                          className="sr-only peer" 
                        />
                        <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-purple-600 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-900">検索結果に表示</div>
                        <div className="text-sm text-gray-600">他のユーザーがあなたを検索できます</div>
                      </div>
                      <label className="relative inline-block w-12 h-6 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.privacy.showInSearch}
                          onChange={() => handlePrivacyToggle('showInSearch')}
                          className="sr-only peer" 
                        />
                        <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-purple-600 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-900">タグ付けを許可</div>
                        <div className="text-sm text-gray-600">他のユーザーがあなたをタグ付けできます</div>
                      </div>
                      <label className="relative inline-block w-12 h-6 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.privacy.allowTagging}
                          onChange={() => handlePrivacyToggle('allowTagging')}
                          className="sr-only peer" 
                        />
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
                  <p className="text-sm text-gray-500 mt-2">※ 機能は今後実装予定です</p>
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
                      <label className="relative inline-block w-12 h-6 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.notifications.likes}
                          onChange={() => handleNotificationToggle('likes')}
                          className="sr-only peer" 
                        />
                        <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-purple-600 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-900">コメント</div>
                        <div className="text-sm text-gray-600">投稿にコメントされたとき</div>
                      </div>
                      <label className="relative inline-block w-12 h-6 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.notifications.comments}
                          onChange={() => handleNotificationToggle('comments')}
                          className="sr-only peer" 
                        />
                        <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-purple-600 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-900">新しいフォロワー</div>
                        <div className="text-sm text-gray-600">フォローされたとき</div>
                      </div>
                      <label className="relative inline-block w-12 h-6 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.notifications.followers}
                          onChange={() => handleNotificationToggle('followers')}
                          className="sr-only peer" 
                        />
                        <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-purple-600 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-900">メッセージ</div>
                        <div className="text-sm text-gray-600">新しいメッセージを受信したとき</div>
                      </div>
                      <label className="relative inline-block w-12 h-6 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.notifications.messages}
                          onChange={() => handleNotificationToggle('messages')}
                          className="sr-only peer" 
                        />
                        <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-purple-600 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-900">学習リマインダー</div>
                        <div className="text-sm text-gray-600">タスクの期限が近づいたとき</div>
                      </div>
                      <label className="relative inline-block w-12 h-6 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.notifications.learningReminders}
                          onChange={() => handleNotificationToggle('learningReminders')}
                          className="sr-only peer" 
                        />
                        <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-purple-600 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-900">メール通知</div>
                        <div className="text-sm text-gray-600">メールで通知を受け取る</div>
                      </div>
                      <label className="relative inline-block w-12 h-6 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.notifications.emailNotifications}
                          onChange={() => handleNotificationToggle('emailNotifications')}
                          className="sr-only peer" 
                        />
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
                    <button 
                      onClick={() => setShowPasswordChange(true)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 text-gray-600" />
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">パスワードを変更</div>
                          <div className="text-sm text-gray-600">最終更新: {getPasswordChangeTime()}</div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-900">2段階認証</div>
                        <div className="text-sm text-gray-600">ログイン時に追加の認証を要求</div>
                      </div>
                      <label className="relative inline-block w-12 h-6 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.security.twoFactorEnabled}
                          onChange={() => handleSecurityToggle('twoFactorEnabled')}
                          className="sr-only peer" 
                        />
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
                      <div className="text-xs text-gray-400">実装予定</div>
                    </button>

                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-gray-600" />
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">連携アプリ</div>
                          <div className="text-sm text-gray-600">外部アプリとの連携を管理</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">実装予定</div>
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

                {/* パスワード変更モーダル */}
                {showPasswordChange && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">パスワードを変更</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">現在のパスワード</label>
                          <input
                            type="password"
                            value={passwordForm.current}
                            onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="現在のパスワード"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">新しいパスワード</label>
                          <input
                            type="password"
                            value={passwordForm.new}
                            onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="新しいパスワード（8文字以上）"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">パスワード（確認）</label>
                          <input
                            type="password"
                            value={passwordForm.confirm}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="もう一度入力"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={() => {
                            setShowPasswordChange(false);
                            setPasswordForm({ current: '', new: '', confirm: '' });
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          キャンセル
                        </button>
                        <button
                          onClick={handlePasswordChange}
                          disabled={!passwordForm.current || !passwordForm.new || !passwordForm.confirm}
                          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          変更する
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
