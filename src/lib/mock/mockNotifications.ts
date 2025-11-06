// 通知の型定義
export type NotificationType = 
  | 'like' 
  | 'comment' 
  | 'follow' 
  | 'friend_request' 
  | 'friend_accepted' 
  | 'mention' 
  | 'album_shared'
  | 'event_invite';

export interface Notification {
  id: string;
  userId: string; // 通知を受け取るユーザー
  type: NotificationType;
  actorId: string; // アクションを起こしたユーザー
  actorName: string;
  actorAvatar: string;
  content: string;
  targetId?: string; // 写真ID、アルバムID、イベントIDなど
  createdAt: string;
  read: boolean;
}

// ダミー通知データ
export const mockNotifications: Notification[] = [
  // user_001への通知
  {
    id: 'notif_001',
    userId: 'user_001',
    type: 'like',
    actorId: 'user_002',
    actorName: '田中 太郎',
    actorAvatar: 'https://i.pravatar.cc/150?img=12',
    content: 'があなたの写真にいいねしました',
    targetId: 'photo_001',
    createdAt: '2024-11-02T14:30:00Z',
    read: false
  },
  {
    id: 'notif_002',
    userId: 'user_001',
    type: 'comment',
    actorId: 'user_003',
    actorName: '佐藤 美咲',
    actorAvatar: 'https://i.pravatar.cc/150?img=5',
    content: 'があなたの写真にコメントしました',
    targetId: 'photo_001',
    createdAt: '2024-11-02T13:00:00Z',
    read: false
  },
  {
    id: 'notif_003',
    userId: 'user_001',
    type: 'friend_request',
    actorId: 'user_007',
    actorName: '中村 ゆき',
    actorAvatar: 'https://i.pravatar.cc/150?img=10',
    content: 'から友達リクエストが届いています',
    createdAt: '2024-11-02T10:00:00Z',
    read: false
  },
  {
    id: 'notif_004',
    userId: 'user_001',
    type: 'friend_accepted',
    actorId: 'user_009',
    actorName: '伊藤 舞',
    actorAvatar: 'https://i.pravatar.cc/150?img=20',
    content: 'があなたの友達リクエストを承認しました',
    createdAt: '2024-11-01T18:00:00Z',
    read: true
  },
  {
    id: 'notif_005',
    userId: 'user_001',
    type: 'album_shared',
    actorId: 'user_005',
    actorName: '高橋 さくら',
    actorAvatar: 'https://i.pravatar.cc/150?img=9',
    content: 'があなたとアルバムを共有しました',
    targetId: 'album_008',
    createdAt: '2024-11-01T15:00:00Z',
    read: true
  },
  {
    id: 'notif_006',
    userId: 'user_001',
    type: 'event_invite',
    actorId: 'user_011',
    actorName: '加藤 綾',
    actorAvatar: 'https://i.pravatar.cc/150?img=16',
    content: 'があなたをイベントに招待しました',
    targetId: 'event_001',
    createdAt: '2024-10-31T12:00:00Z',
    read: true
  },
  
  // user_002への通知
  {
    id: 'notif_007',
    userId: 'user_002',
    type: 'like',
    actorId: 'user_001',
    actorName: '山田 花子',
    actorAvatar: 'https://i.pravatar.cc/150?img=1',
    content: 'があなたの写真にいいねしました',
    targetId: 'photo_004',
    createdAt: '2024-11-02T16:00:00Z',
    read: false
  },
  {
    id: 'notif_008',
    userId: 'user_002',
    type: 'comment',
    actorId: 'user_004',
    actorName: '鈴木 健太',
    actorAvatar: 'https://i.pravatar.cc/150?img=13',
    content: 'があなたの写真にコメントしました: 「すごい構図ですね！」',
    targetId: 'photo_004',
    createdAt: '2024-11-02T11:00:00Z',
    read: false
  },
  {
    id: 'notif_009',
    userId: 'user_002',
    type: 'follow',
    actorId: 'user_012',
    actorName: '木村 大輔',
    actorAvatar: 'https://i.pravatar.cc/150?img=33',
    content: 'があなたをフォローしました',
    createdAt: '2024-11-01T20:00:00Z',
    read: true
  },
  
  // user_003への通知
  {
    id: 'notif_010',
    userId: 'user_003',
    type: 'like',
    actorId: 'user_005',
    actorName: '高橋 さくら',
    actorAvatar: 'https://i.pravatar.cc/150?img=9',
    content: 'があなたの写真にいいねしました',
    targetId: 'photo_007',
    createdAt: '2024-11-02T15:30:00Z',
    read: false
  },
  {
    id: 'notif_011',
    userId: 'user_003',
    type: 'comment',
    actorId: 'user_001',
    actorName: '山田 花子',
    actorAvatar: 'https://i.pravatar.cc/150?img=1',
    content: 'があなたの写真にコメントしました: 「美味しそう！スタイリング素敵✨」',
    targetId: 'photo_007',
    createdAt: '2024-11-02T12:30:00Z',
    read: false
  },
  
  // user_004への通知
  {
    id: 'notif_012',
    userId: 'user_004',
    type: 'like',
    actorId: 'user_002',
    actorName: '田中 太郎',
    actorAvatar: 'https://i.pravatar.cc/150?img=12',
    content: 'があなたの写真にいいねしました',
    targetId: 'photo_010',
    createdAt: '2024-11-02T19:30:00Z',
    read: false
  },
  {
    id: 'notif_013',
    userId: 'user_004',
    type: 'friend_request',
    actorId: 'user_010',
    actorName: '渡辺 俊',
    actorAvatar: 'https://i.pravatar.cc/150?img=17',
    content: 'から友達リクエストが届いています',
    createdAt: '2024-11-01T14:00:00Z',
    read: true
  },
  
  // user_005への通知
  {
    id: 'notif_014',
    userId: 'user_005',
    type: 'like',
    actorId: 'user_013',
    actorName: '松本 理恵',
    actorAvatar: 'https://i.pravatar.cc/150?img=24',
    content: 'があなたの写真にいいねしました',
    targetId: 'photo_013',
    createdAt: '2024-11-02T17:45:00Z',
    read: false
  },
  {
    id: 'notif_015',
    userId: 'user_005',
    type: 'comment',
    actorId: 'user_003',
    actorName: '佐藤 美咲',
    actorAvatar: 'https://i.pravatar.cc/150?img=5',
    content: 'があなたの写真にコメントしました: 「素敵な結婚式でしたね💐」',
    targetId: 'photo_013',
    createdAt: '2024-11-02T17:30:00Z',
    read: false
  },
  
  // user_006への通知
  {
    id: 'notif_016',
    userId: 'user_006',
    type: 'like',
    actorId: 'user_016',
    actorName: '岡田 敏',
    actorAvatar: 'https://i.pravatar.cc/150?img=52',
    content: 'があなたの写真にいいねしました',
    targetId: 'photo_018',
    createdAt: '2024-11-01T23:00:00Z',
    read: true
  },
  {
    id: 'notif_017',
    userId: 'user_006',
    type: 'comment',
    actorId: 'user_010',
    actorName: '渡辺 俊',
    actorAvatar: 'https://i.pravatar.cc/150?img=17',
    content: 'があなたの写真にコメントしました: 「オーロラ綺麗すぎます！🌌」',
    targetId: 'photo_018',
    createdAt: '2024-11-01T22:45:00Z',
    read: true
  },
  
  // user_007への通知
  {
    id: 'notif_018',
    userId: 'user_007',
    type: 'like',
    actorId: 'user_001',
    actorName: '山田 花子',
    actorAvatar: 'https://i.pravatar.cc/150?img=1',
    content: 'があなたの写真にいいねしました',
    targetId: 'photo_019',
    createdAt: '2024-11-02T11:30:00Z',
    read: false
  },
  {
    id: 'notif_019',
    userId: 'user_007',
    type: 'friend_accepted',
    actorId: 'user_013',
    actorName: '松本 理恵',
    actorAvatar: 'https://i.pravatar.cc/150?img=24',
    content: 'があなたの友達リクエストを承認しました',
    createdAt: '2024-11-01T16:00:00Z',
    read: true
  },
  
  // user_008への通知
  {
    id: 'notif_020',
    userId: 'user_008',
    type: 'like',
    actorId: 'user_020',
    actorName: '藤田 浩二',
    actorAvatar: 'https://i.pravatar.cc/150?img=60',
    content: 'があなたの写真にいいねしました',
    targetId: 'photo_022',
    createdAt: '2024-11-02T20:30:00Z',
    read: false
  },
];

// ユーザーIDから通知を取得
export const getNotificationsByUserId = (userId: string): Notification[] => {
  return mockNotifications
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// 未読通知の数を取得
export const getUnreadNotificationsCount = (userId: string): number => {
  return mockNotifications.filter(n => n.userId === userId && !n.read).length;
};

// 通知を既読にする
export const markNotificationAsRead = (notificationId: string): void => {
  const notification = mockNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }
};

// 全ての通知を既読にする
export const markAllNotificationsAsRead = (userId: string): void => {
  mockNotifications
    .filter(n => n.userId === userId)
    .forEach(n => n.read = true);
};

// 通知タイプごとのアイコンを取得
export const getNotificationIcon = (type: NotificationType): string => {
  const icons = {
    like: '❤️',
    comment: '💬',
    follow: '👤',
    friend_request: '👥',
    friend_accepted: '✅',
    mention: '@',
    album_shared: '📁',
    event_invite: '📅'
  };
  return icons[type];
};

// 通知タイプごとの色を取得
export const getNotificationColor = (type: NotificationType): string => {
  const colors = {
    like: 'text-red-500',
    comment: 'text-blue-500',
    follow: 'text-purple-500',
    friend_request: 'text-green-500',
    friend_accepted: 'text-green-600',
    mention: 'text-orange-500',
    album_shared: 'text-indigo-500',
    event_invite: 'text-pink-500'
  };
  return colors[type];
};
