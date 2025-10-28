'use client';

import React, { useState, useEffect } from 'react';
import { X, Bell, Check, Trash2, Settings } from 'lucide-react';
import { PH1, PH2, PH3 } from '@/lib/placeholders';

interface Notification {
  id: string;
  type: 'friend_request' | 'message' | 'profile_visit' | 'like' | 'comment';
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (url: string) => void;
}

const NOTIFICATIONS_KEY = 'cocoty_notifications_v1';
const NOTIFICATION_SETTINGS_KEY = 'cocoty_notification_settings_v1';

const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  isOpen, 
  onClose,
  onNavigate 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    friendRequests: true,
    messages: true,
    profileVisits: true,
    likes: true,
    comments: true,
    emailNotifications: false,
    pushNotifications: true
  });

  useEffect(() => {
    if (!isOpen) return;
    loadNotifications();
    loadSettings();
  }, [isOpen]);

  const loadNotifications = () => {
    const dummyNotifications: Notification[] = [
      {
        id: 'n1',
        type: 'friend_request',
        userId: 'user_006',
        userName: '山本 健一',
        userAvatar: PH1,
        content: 'さんから友達リクエストが届いています',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        isRead: false,
        actionUrl: '/friends?tab=pending'
      },
      {
        id: 'n2',
        type: 'message',
        userId: 'user_002',
        userName: '田中 太郎',
        userAvatar: PH2,
        content: 'さんからメッセージが届きました',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        isRead: false,
        actionUrl: '/messages?user=user_002'
      },
      {
        id: 'n3',
        type: 'profile_visit',
        userId: 'user_003',
        userName: '佐藤 美咲',
        userAvatar: PH3,
        content: 'さんがあなたのプロフィールを訪問しました',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isRead: true,
        actionUrl: '/profile?userId=user_003'
      },
      {
        id: 'n4',
        type: 'like',
        userId: 'user_005',
        userName: '高橋 さくら',
        userAvatar: PH1,
        content: 'さんがあなたの投稿にいいねしました',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        isRead: true,
        actionUrl: '/profile?tab=gallery'
      },
      {
        id: 'n5',
        type: 'comment',
        userId: 'user_002',
        userName: '田中 太郎',
        userAvatar: PH2,
        content: 'さんがあなたの写真にコメントしました：「素晴らしい構図ですね！」',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        isRead: true,
        actionUrl: '/profile?tab=gallery&id=photo_123'
      },
      {
        id: 'n6',
        type: 'message',
        userId: 'user_005',
        userName: '高橋 さくら',
        userAvatar: PH3,
        content: 'さんからメッセージが届きました',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        isRead: true,
        actionUrl: '/messages?user=user_005'
      },
      {
        id: 'n7',
        type: 'profile_visit',
        userId: 'user_004',
        userName: '鈴木 健太',
        userAvatar: PH1,
        content: 'さんがあなたのプロフィールを訪問しました',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        isRead: true,
        actionUrl: '/profile?userId=user_004'
      }
    ];

    try {
      const notificationsRaw = localStorage.getItem(NOTIFICATIONS_KEY);
      if (notificationsRaw) {
        setNotifications(JSON.parse(notificationsRaw));
      } else {
        setNotifications(dummyNotifications);
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(dummyNotifications));
      }
    } catch (e) {
      setNotifications(dummyNotifications);
    }
  };

  const loadSettings = () => {
    try {
      const settingsRaw = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (settingsRaw) {
        setSettings(JSON.parse(settingsRaw));
      }
    } catch (e) {
      // Use default settings
    }
  };

  const saveSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(newSettings));
  };

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(n =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
  };

  const deleteNotification = (notificationId: string) => {
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    setNotifications(updatedNotifications);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl && onNavigate) {
      onNavigate(notification.actionUrl);
      onClose();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return '今';
    if (diffMins < 60) return `${diffMins}分前`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}時間前`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}日前`;
    
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'friend_request': return '👥';
      case 'message': return '💬';
      case 'profile_visit': return '👀';
      case 'like': return '❤️';
      case 'comment': return '💭';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'friend_request': return 'bg-blue-50 border-blue-200';
      case 'message': return 'bg-purple-50 border-purple-200';
      case 'profile_visit': return 'bg-green-50 border-green-200';
      case 'like': return 'bg-pink-50 border-pink-200';
      case 'comment': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {!showSettings ? (
          <>
            {/* ヘッダー */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Bell size={28} className="text-purple-600" />
                  通知
                  {unreadCount > 0 && (
                    <span className="text-sm bg-red-500 text-white px-2.5 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
                    title="設定"
                  >
                    <Settings size={20} />
                  </button>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* フィルター */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      filter === 'all'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    すべて ({notifications.length})
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      filter === 'unread'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    未読 ({unreadCount})
                  </button>
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
                  >
                    <Check size={16} />
                    すべて既読にする
                  </button>
                )}
              </div>
            </div>

            {/* 通知一覧 */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.isRead ? 'bg-blue-50/30' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        {/* アバター */}
                        <div className="relative flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={notification.userAvatar} 
                            alt={notification.userName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="absolute -bottom-1 -right-1 text-lg">
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>

                        {/* コンテンツ */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">
                            <span className="font-bold">{notification.userName}</span>
                            <span className="text-gray-700">{notification.content}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>

                        {/* 未読インジケーター & 削除ボタン */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
                  <Bell size={64} className="mb-4 opacity-30" />
                  <p className="text-lg font-medium">通知はありません</p>
                  <p className="text-sm">新しい通知があるとここに表示されます</p>
                </div>
              )}
            </div>

            {/* フッター */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={clearAllNotifications}
                  className="w-full py-2 text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  すべての通知を削除
                </button>
              </div>
            )}
          </>
        ) : (
          /* 設定画面 */
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">通知設定</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-4">通知の種類</h3>
                <div className="space-y-3">
                  {[
                    { key: 'friendRequests', label: '友達リクエスト', icon: '👥' },
                    { key: 'messages', label: 'メッセージ', icon: '💬' },
                    { key: 'profileVisits', label: 'プロフィール訪問', icon: '👀' },
                    { key: 'likes', label: 'いいね', icon: '❤️' },
                    { key: 'comments', label: 'コメント', icon: '💭' }
                  ].map(({ key, label, icon }) => (
                    <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                      <span className="flex items-center gap-2 font-medium">
                        <span className="text-xl">{icon}</span>
                        {label}
                      </span>
                      <input
                        type="checkbox"
                        checked={settings[key as keyof typeof settings] as boolean}
                        onChange={(e) => saveSettings({ ...settings, [key]: e.target.checked })}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">配信方法</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <span className="flex items-center gap-2 font-medium">
                      <span className="text-xl">📧</span>
                      メール通知
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => saveSettings({ ...settings, emailNotifications: e.target.checked })}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <span className="flex items-center gap-2 font-medium">
                      <span className="text-xl">🔔</span>
                      プッシュ通知
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => saveSettings({ ...settings, pushNotifications: e.target.checked })}
                      className="w-5 h-5 text-purple-600 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  通知設定はいつでも変更できます。重要な通知を見逃さないよう、必要な通知は有効にしておくことをおすすめします。
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowSettings(false)}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                設定を保存
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
