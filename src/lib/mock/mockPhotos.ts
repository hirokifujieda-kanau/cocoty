import { PH1, PH2, PH3 } from '../placeholders';

// 写真の型定義
export interface Photo {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  createdAt: string;
  albumId?: string;
  tags?: string[];
}

// アルバムの型定義
export interface Album {
  id: string;
  userId: string;
  title: string;
  description: string;
  coverImage: string;
  photoCount: number;
  createdAt: string;
  updatedAt: string;
}

// ダミー写真データ（各ユーザーの代表的な写真）
export const mockPhotos: Photo[] = [
  // user_001 (はなちゃん) の写真
  { id: 'photo_001', userId: 'user_001', imageUrl: PH1, caption: '今日の夕焼け🌅 最高のロケーションでした', likes: 245, comments: 32, createdAt: '2024-11-01T18:30:00Z', albumId: 'album_001', tags: ['風景', '夕焼け'] },
  { id: 'photo_002', userId: 'user_001', imageUrl: PH2, caption: '友達のポートレート撮影📷', likes: 189, comments: 24, createdAt: '2024-10-28T14:00:00Z', albumId: 'album_001', tags: ['ポートレート'] },
  { id: 'photo_003', userId: 'user_001', imageUrl: PH3, caption: '写真展の準備中✨', likes: 321, comments: 45, createdAt: '2024-10-25T10:00:00Z', tags: ['展示', '準備'] },
  
  // user_002 (たろさん) の写真
  { id: 'photo_004', userId: 'user_002', imageUrl: PH2, caption: '山岳風景の撮影に行ってきました⛰️', likes: 412, comments: 56, createdAt: '2024-10-30T08:00:00Z', albumId: 'album_002', tags: ['風景', '山'] },
  { id: 'photo_005', userId: 'user_002', imageUrl: PH3, caption: 'クライアントさんのプロフィール撮影', likes: 198, comments: 28, createdAt: '2024-10-26T16:00:00Z', tags: ['ポートレート', '仕事'] },
  { id: 'photo_006', userId: 'user_002', imageUrl: PH1, caption: 'Pythonで画像処理のスクリプト作成💻', likes: 156, comments: 19, createdAt: '2024-10-22T20:00:00Z', tags: ['技術', 'プログラミング'] },
  
  // user_003 (みさきん) の写真
  { id: 'photo_007', userId: 'user_003', imageUrl: PH1, caption: '今日のランチプレート🍽️ スタイリングにこだわりました', likes: 534, comments: 67, createdAt: '2024-11-02T12:00:00Z', albumId: 'album_003', tags: ['フード', 'ランチ'] },
  { id: 'photo_008', userId: 'user_003', imageUrl: PH2, caption: 'カフェの新メニュー撮影☕', likes: 423, comments: 52, createdAt: '2024-10-29T15:00:00Z', albumId: 'album_003', tags: ['フード', 'カフェ'] },
  { id: 'photo_009', userId: 'user_003', imageUrl: PH3, caption: '手作りケーキのテーブルフォト🍰', likes: 612, comments: 78, createdAt: '2024-10-24T14:30:00Z', tags: ['スイーツ', 'フード'] },
  
  // user_004 (けんちゃん) の写真
  { id: 'photo_010', userId: 'user_004', imageUrl: PH3, caption: 'サッカーの決定的瞬間⚽', likes: 789, comments: 94, createdAt: '2024-11-01T19:00:00Z', albumId: 'album_004', tags: ['スポーツ', 'サッカー'] },
  { id: 'photo_011', userId: 'user_004', imageUrl: PH1, caption: 'バスケの試合撮影🏀', likes: 567, comments: 71, createdAt: '2024-10-27T18:00:00Z', albumId: 'album_004', tags: ['スポーツ', 'バスケ'] },
  { id: 'photo_012', userId: 'user_004', imageUrl: PH2, caption: 'マラソン大会のフィニッシュシーン🏃', likes: 445, comments: 58, createdAt: '2024-10-20T09:00:00Z', tags: ['スポーツ', 'マラソン'] },
  
  // user_005 (さくらん) の写真
  { id: 'photo_013', userId: 'user_005', imageUrl: PH2, caption: '今日の結婚式💐 素敵なカップルでした', likes: 923, comments: 112, createdAt: '2024-11-02T17:00:00Z', albumId: 'album_005', tags: ['ウェディング', '結婚式'] },
  { id: 'photo_014', userId: 'user_005', imageUrl: PH3, caption: '新郎新婦のポートレート👰🤵', likes: 834, comments: 98, createdAt: '2024-10-28T16:30:00Z', albumId: 'album_005', tags: ['ウェディング', 'ポートレート'] },
  { id: 'photo_015', userId: 'user_005', imageUrl: PH1, caption: 'ブーケトス💐✨', likes: 712, comments: 89, createdAt: '2024-10-23T15:00:00Z', tags: ['ウェディング'] },
  
  // user_006 (けんいち) の写真
  { id: 'photo_016', userId: 'user_006', imageUrl: PH1, caption: 'モロッコのサハラ砂漠🐪', likes: 1234, comments: 145, createdAt: '2024-10-31T10:00:00Z', albumId: 'album_006', tags: ['旅行', 'モロッコ'] },
  { id: 'photo_017', userId: 'user_006', imageUrl: PH2, caption: 'イタリアの古代遺跡🏛️', likes: 1089, comments: 123, createdAt: '2024-10-25T12:00:00Z', albumId: 'album_006', tags: ['旅行', 'イタリア'] },
  { id: 'photo_018', userId: 'user_006', imageUrl: PH3, caption: 'ノルウェーのオーロラ🌌', likes: 1567, comments: 178, createdAt: '2024-10-18T22:00:00Z', tags: ['旅行', 'オーロラ'] },
  
  // user_007 (ゆっきー) の写真
  { id: 'photo_019', userId: 'user_007', imageUrl: PH3, caption: '今日撮影したわんちゃん🐶 可愛すぎる！', likes: 678, comments: 84, createdAt: '2024-11-02T11:00:00Z', albumId: 'album_007', tags: ['ペット', '犬'] },
  { id: 'photo_020', userId: 'user_007', imageUrl: PH1, caption: '猫ちゃんのポートレート🐱', likes: 723, comments: 91, createdAt: '2024-10-29T13:00:00Z', albumId: 'album_007', tags: ['ペット', '猫'] },
  { id: 'photo_021', userId: 'user_007', imageUrl: PH2, caption: '多頭飼いのご家族撮影📷', likes: 589, comments: 67, createdAt: '2024-10-24T14:00:00Z', tags: ['ペット', '家族'] },
  
  // user_008 (ひろくん) の写真
  { id: 'photo_022', userId: 'user_008', imageUrl: PH2, caption: '新宿の夜景🌃', likes: 456, comments: 54, createdAt: '2024-11-01T20:00:00Z', albumId: 'album_008', tags: ['ストリート', '夜景'] },
  { id: 'photo_023', userId: 'user_008', imageUrl: PH3, caption: '渋谷スクランブル交差点🚶‍♂️', likes: 512, comments: 62, createdAt: '2024-10-27T18:30:00Z', albumId: 'album_008', tags: ['ストリート', '渋谷'] },
  { id: 'photo_024', userId: 'user_008', imageUrl: PH1, caption: '下町の路地裏スナップ', likes: 398, comments: 48, createdAt: '2024-10-21T15:00:00Z', tags: ['ストリート', 'スナップ'] },
  
  // user_009 (まいまい) の写真
  { id: 'photo_025', userId: 'user_009', imageUrl: PH1, caption: '新作コレクションの撮影👗', likes: 1012, comments: 134, createdAt: '2024-11-02T14:00:00Z', albumId: 'album_009', tags: ['ファッション', '撮影'] },
  { id: 'photo_026', userId: 'user_009', imageUrl: PH2, caption: 'モデルさんとのスタジオ撮影📸', likes: 934, comments: 118, createdAt: '2024-10-28T11:00:00Z', albumId: 'album_009', tags: ['ファッション', 'スタジオ'] },
  { id: 'photo_027', userId: 'user_009', imageUrl: PH3, caption: 'ストリートファッションスナップ', likes: 867, comments: 102, createdAt: '2024-10-23T16:00:00Z', tags: ['ファッション', 'ストリート'] },
  
  // user_010 (しゅんくん) の写真
  { id: 'photo_028', userId: 'user_010', imageUrl: PH2, caption: 'オオタカの撮影に成功🦅', likes: 645, comments: 76, createdAt: '2024-11-01T07:00:00Z', albumId: 'album_010', tags: ['野鳥', '自然'] },
  { id: 'photo_029', userId: 'user_010', imageUrl: PH3, caption: '森の中のシカ🦌', likes: 578, comments: 68, createdAt: '2024-10-26T06:30:00Z', albumId: 'album_010', tags: ['野生動物', '自然'] },
  { id: 'photo_030', userId: 'user_010', imageUrl: PH1, caption: 'マクロレンズで撮った蝶🦋', likes: 512, comments: 61, createdAt: '2024-10-19T14:00:00Z', tags: ['マクロ', '昆虫'] },
];

// ダミーアルバムデータ
export const mockAlbums: Album[] = [
  { id: 'album_001', userId: 'user_001', title: '夕焼けコレクション', description: '全国各地で撮影した夕焼けの写真集', coverImage: PH1, photoCount: 45, createdAt: '2024-09-01T00:00:00Z', updatedAt: '2024-11-01T00:00:00Z' },
  { id: 'album_002', userId: 'user_001', title: 'ポートレート作品集', description: '友人や知人を撮影したポートレート', coverImage: PH2, photoCount: 28, createdAt: '2024-08-15T00:00:00Z', updatedAt: '2024-10-28T00:00:00Z' },
  
  { id: 'album_003', userId: 'user_002', title: '山岳写真コレクション', description: '日本アルプスを中心とした山岳風景', coverImage: PH2, photoCount: 67, createdAt: '2024-07-01T00:00:00Z', updatedAt: '2024-10-30T00:00:00Z' },
  { id: 'album_004', userId: 'user_002', title: 'クライアントワーク', description: 'プロとして撮影した作品集', coverImage: PH3, photoCount: 52, createdAt: '2024-06-01T00:00:00Z', updatedAt: '2024-10-26T00:00:00Z' },
  
  { id: 'album_005', userId: 'user_003', title: 'フードフォトアーカイブ', description: '料理とテーブルフォトのコレクション', coverImage: PH1, photoCount: 123, createdAt: '2024-05-01T00:00:00Z', updatedAt: '2024-11-02T00:00:00Z' },
  { id: 'album_006', userId: 'user_003', title: 'カフェ巡り', description: '全国のカフェで撮影した写真', coverImage: PH2, photoCount: 89, createdAt: '2024-04-01T00:00:00Z', updatedAt: '2024-10-29T00:00:00Z' },
  
  { id: 'album_007', userId: 'user_004', title: 'スポーツ決定的瞬間', description: '各種スポーツのベストショット', coverImage: PH3, photoCount: 156, createdAt: '2024-03-01T00:00:00Z', updatedAt: '2024-11-01T00:00:00Z' },
  
  { id: 'album_008', userId: 'user_005', title: 'ウェディングハイライト2024', description: '今年撮影した結婚式のベストシーン', coverImage: PH2, photoCount: 234, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-11-02T00:00:00Z' },
  
  { id: 'album_009', userId: 'user_006', title: '世界一周フォトジャーニー', description: '訪れた国々の風景と文化', coverImage: PH1, photoCount: 412, createdAt: '2023-12-01T00:00:00Z', updatedAt: '2024-10-31T00:00:00Z' },
  
  { id: 'album_010', userId: 'user_007', title: 'ペットポートレートコレクション', description: '可愛いペットたちの表情', coverImage: PH3, photoCount: 98, createdAt: '2024-02-15T00:00:00Z', updatedAt: '2024-11-02T00:00:00Z' },
  
  { id: 'album_011', userId: 'user_008', title: '東京ストリートスナップ', description: '都市の日常を切り取る', coverImage: PH2, photoCount: 167, createdAt: '2024-01-10T00:00:00Z', updatedAt: '2024-11-01T00:00:00Z' },
  
  { id: 'album_012', userId: 'user_009', title: 'ファッション撮影作品集', description: 'モデル・ブランド撮影の記録', coverImage: PH1, photoCount: 145, createdAt: '2024-03-20T00:00:00Z', updatedAt: '2024-11-02T00:00:00Z' },
  
  { id: 'album_013', userId: 'user_010', title: '野鳥図鑑プロジェクト', description: '日本の野鳥100種撮影', coverImage: PH2, photoCount: 103, createdAt: '2024-02-01T00:00:00Z', updatedAt: '2024-11-01T00:00:00Z' },
];

// ユーザーIDから写真を取得
export const getPhotosByUserId = (userId: string, limit?: number): Photo[] => {
  const photos = mockPhotos.filter(p => p.userId === userId);
  return limit ? photos.slice(0, limit) : photos;
};

// ユーザーIDからアルバムを取得
export const getAlbumsByUserId = (userId: string): Album[] => {
  return mockAlbums.filter(a => a.userId === userId);
};

// 写真IDから写真を取得
export const getPhotoById = (photoId: string): Photo | undefined => {
  return mockPhotos.find(p => p.id === photoId);
};

// アルバムIDからアルバムを取得
export const getAlbumById = (albumId: string): Album | undefined => {
  return mockAlbums.find(a => a.id === albumId);
};

// アルバムIDから写真を取得
export const getPhotosByAlbumId = (albumId: string): Photo[] => {
  return mockPhotos.filter(p => p.albumId === albumId);
};

// 最新の写真を取得
export const getRecentPhotos = (limit: number = 20): Photo[] => {
  return [...mockPhotos]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

// 人気の写真を取得（いいね数順）
export const getPopularPhotos = (limit: number = 20): Photo[] => {
  return [...mockPhotos]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, limit);
};
