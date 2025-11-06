// 活動タイプの定義
export type ActivityType = 
  | 'photo_upload' 
  | 'album_created' 
  | 'friend_added' 
  | 'goal_updated' 
  | 'milestone_completed'
  | 'comment_posted'
  | 'like_given'
  | 'event_joined';

// 活動の型定義
export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  title: string;
  description: string;
  targetId?: string; // 関連する写真、アルバム、ユーザーなどのID
  targetName?: string;
  imageUrl?: string;
  createdAt: string;
}

// ダミー活動データ
export const mockActivities: Activity[] = [
  // user_001の活動
  {
    id: 'act_001',
    userId: 'user_001',
    type: 'photo_upload',
    title: '新しい写真を投稿しました',
    description: '今日の夕焼け🌅 最高のロケーションでした',
    targetId: 'photo_001',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    createdAt: '2024-11-01T18:30:00Z'
  },
  {
    id: 'act_002',
    userId: 'user_001',
    type: 'milestone_completed',
    title: 'マイルストーンを達成しました',
    description: 'ポスター・チラシ作成が完了しました！',
    createdAt: '2024-10-10T15:00:00Z'
  },
  {
    id: 'act_003',
    userId: 'user_001',
    type: 'friend_added',
    title: '新しい友達ができました',
    description: '伊藤 舞さんと友達になりました',
    targetId: 'user_009',
    targetName: '伊藤 舞',
    createdAt: '2024-11-01T18:00:00Z'
  },
  {
    id: 'act_004',
    userId: 'user_001',
    type: 'album_created',
    title: '新しいアルバムを作成しました',
    description: '夕焼けコレクション - 全国各地で撮影した夕焼けの写真集',
    targetId: 'album_001',
    targetName: '夕焼けコレクション',
    createdAt: '2024-09-01T10:00:00Z'
  },
  
  // user_002の活動
  {
    id: 'act_005',
    userId: 'user_002',
    type: 'photo_upload',
    title: '新しい写真を投稿しました',
    description: '山岳風景の撮影に行ってきました⛰️',
    targetId: 'photo_004',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    createdAt: '2024-10-30T08:00:00Z'
  },
  {
    id: 'act_006',
    userId: 'user_002',
    type: 'goal_updated',
    title: 'ゴールの進捗を更新しました',
    description: 'プロカメラマンとして独立する - 45%達成',
    createdAt: '2024-10-15T12:00:00Z'
  },
  {
    id: 'act_007',
    userId: 'user_002',
    type: 'milestone_completed',
    title: 'マイルストーンを達成しました',
    description: '初の有料撮影依頼を完了しました！',
    createdAt: '2024-09-15T14:00:00Z'
  },
  
  // user_003の活動
  {
    id: 'act_008',
    userId: 'user_003',
    type: 'photo_upload',
    title: '新しい写真を投稿しました',
    description: '今日のランチプレート🍽️ スタイリングにこだわりました',
    targetId: 'photo_007',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    createdAt: '2024-11-02T12:00:00Z'
  },
  {
    id: 'act_009',
    userId: 'user_003',
    type: 'comment_posted',
    title: 'コメントしました',
    description: '山田 花子さんの写真にコメントしました',
    targetId: 'photo_001',
    createdAt: '2024-11-02T13:00:00Z'
  },
  {
    id: 'act_010',
    userId: 'user_003',
    type: 'friend_added',
    title: '新しい友達ができました',
    description: '高橋 さくらさんと友達になりました',
    targetId: 'user_005',
    targetName: '高橋 さくら',
    createdAt: '2024-10-20T16:00:00Z'
  },
  
  // user_004の活動
  {
    id: 'act_011',
    userId: 'user_004',
    type: 'photo_upload',
    title: '新しい写真を投稿しました',
    description: 'サッカーの決定的瞬間⚽',
    targetId: 'photo_010',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018',
    createdAt: '2024-11-01T19:00:00Z'
  },
  {
    id: 'act_012',
    userId: 'user_004',
    type: 'album_created',
    title: '新しいアルバムを作成しました',
    description: 'スポーツ決定的瞬間 - 各種スポーツのベストショット',
    targetId: 'album_007',
    targetName: 'スポーツ決定的瞬間',
    createdAt: '2024-03-01T10:00:00Z'
  },
  
  // user_005の活動
  {
    id: 'act_013',
    userId: 'user_005',
    type: 'photo_upload',
    title: '新しい写真を投稿しました',
    description: '今日の結婚式💐 素敵なカップルでした',
    targetId: 'photo_013',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552',
    createdAt: '2024-11-02T17:00:00Z'
  },
  {
    id: 'act_014',
    userId: 'user_005',
    type: 'milestone_completed',
    title: 'マイルストーンを達成しました',
    description: '年間30組達成しました！残りあと少し✨',
    createdAt: '2024-09-30T20:00:00Z'
  },
  {
    id: 'act_015',
    userId: 'user_005',
    type: 'like_given',
    title: 'いいねしました',
    description: '佐藤 美咲さんの写真にいいねしました',
    targetId: 'photo_007',
    createdAt: '2024-11-02T15:30:00Z'
  },
  
  // user_006の活動
  {
    id: 'act_016',
    userId: 'user_006',
    type: 'photo_upload',
    title: '新しい写真を投稿しました',
    description: 'ノルウェーのオーロラ🌌',
    targetId: 'photo_018',
    imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7',
    createdAt: '2024-10-18T22:00:00Z'
  },
  {
    id: 'act_017',
    userId: 'user_006',
    type: 'goal_updated',
    title: 'ゴールの進捗を更新しました',
    description: '世界50カ国を撮影する - 42%達成（21カ国）',
    createdAt: '2024-10-01T10:00:00Z'
  },
  
  // user_007の活動
  {
    id: 'act_018',
    userId: 'user_007',
    type: 'photo_upload',
    title: '新しい写真を投稿しました',
    description: '今日撮影したわんちゃん🐶 可愛すぎる！',
    targetId: 'photo_019',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb',
    createdAt: '2024-11-02T11:00:00Z'
  },
  {
    id: 'act_019',
    userId: 'user_007',
    type: 'milestone_completed',
    title: 'マイルストーンを達成しました',
    description: 'ペット撮影100件達成しました！🎉',
    createdAt: '2024-08-15T16:00:00Z'
  },
  
  // user_008の活動
  {
    id: 'act_020',
    userId: 'user_008',
    type: 'photo_upload',
    title: '新しい写真を投稿しました',
    description: '新宿の夜景🌃',
    targetId: 'photo_022',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
    createdAt: '2024-11-01T20:00:00Z'
  },
  {
    id: 'act_021',
    userId: 'user_008',
    type: 'album_created',
    title: '新しいアルバムを作成しました',
    description: '東京ストリートスナップ - 都市の日常を切り取る',
    targetId: 'album_011',
    targetName: '東京ストリートスナップ',
    createdAt: '2024-01-10T10:00:00Z'
  },
  
  // user_009の活動
  {
    id: 'act_022',
    userId: 'user_009',
    type: 'photo_upload',
    title: '新しい写真を投稿しました',
    description: '新作コレクションの撮影👗',
    targetId: 'photo_025',
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea3c0296',
    createdAt: '2024-11-02T14:00:00Z'
  },
  {
    id: 'act_023',
    userId: 'user_009',
    type: 'milestone_completed',
    title: 'マイルストーンを達成しました',
    description: 'ファッション誌掲載が実現しました！✨',
    createdAt: '2024-09-15T12:00:00Z'
  },
  
  // user_010の活動
  {
    id: 'act_024',
    userId: 'user_010',
    type: 'photo_upload',
    title: '新しい写真を投稿しました',
    description: 'オオタカの撮影に成功🦅',
    targetId: 'photo_028',
    imageUrl: 'https://images.unsplash.com/photo-1444464666168-49d633b86797',
    createdAt: '2024-11-01T07:00:00Z'
  },
  {
    id: 'act_025',
    userId: 'user_010',
    type: 'milestone_completed',
    title: 'マイルストーンを達成しました',
    description: '野鳥撮影100種達成しました！🎊',
    createdAt: '2024-08-20T18:00:00Z'
  },
];

// ユーザーIDから活動を取得
export const getActivitiesByUserId = (userId: string, limit?: number): Activity[] => {
  const activities = mockActivities
    .filter(a => a.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  return limit ? activities.slice(0, limit) : activities;
};

// 友達の活動を取得（タイムライン用）
export const getFriendsActivities = (friendIds: string[], limit: number = 20): Activity[] => {
  return mockActivities
    .filter(a => friendIds.includes(a.userId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

// 全ての活動を取得（最新順）
export const getRecentActivities = (limit: number = 20): Activity[] => {
  return [...mockActivities]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

// 活動タイプごとのアイコンを取得
export const getActivityIcon = (type: ActivityType): string => {
  const icons = {
    photo_upload: '📷',
    album_created: '📁',
    friend_added: '👥',
    goal_updated: '🎯',
    milestone_completed: '✅',
    comment_posted: '💬',
    like_given: '❤️',
    event_joined: '📅'
  };
  return icons[type];
};

// 活動タイプごとの色を取得
export const getActivityColor = (type: ActivityType): string => {
  const colors = {
    photo_upload: 'text-blue-500',
    album_created: 'text-purple-500',
    friend_added: 'text-green-500',
    goal_updated: 'text-orange-500',
    milestone_completed: 'text-emerald-500',
    comment_posted: 'text-indigo-500',
    like_given: 'text-red-500',
    event_joined: 'text-pink-500'
  };
  return colors[type];
};
