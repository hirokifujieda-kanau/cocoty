import { PH1, PH2, PH3 } from './placeholders';

// ダミーユーザーデータ
export const dummyUsers = {
  'user_001': {
    id: 'user_001',
    nickname: '山田 花子',
    bio: '週末は写真を撮ったり、写真展を企画しています。',
    diagnosis: 'ENFP',
    avatar: PH1,
    cover: PH2,
    goal: '今年は写真展を1回開催する',
    goalProgress: 75,
    workingOn: ['展示の企画', 'ポートフォリオ整理', '写真教室の企画'],
    skills: '写真,レタッチ,構図',
    socialLink: 'https://twitter.com/example'
  },
  'user_002': {
    id: 'user_002',
    nickname: '田中 太郎',
    bio: 'フォトグラファー兼デザイナー。自然風景と街角スナップが好きです。',
    diagnosis: 'INTJ',
    avatar: PH2,
    cover: PH3,
    goal: 'プロカメラマンとして独立する',
    goalProgress: 45,
    workingOn: ['ポートレート撮影の練習', 'クライアント開拓', 'SNS発信強化'],
    skills: '風景写真,ポートレート,Lightroom',
    socialLink: 'https://instagram.com/tanaka'
  },
  'user_003': {
    id: 'user_003',
    nickname: '佐藤 美咲',
    bio: '料理とテーブルフォトが大好き。カフェ巡りも趣味です。',
    diagnosis: 'ESFJ',
    avatar: PH3,
    cover: PH1,
    goal: 'フードフォトグラファーになる',
    goalProgress: 60,
    workingOn: ['料理撮影の技術向上', 'スタイリング勉強', 'レシピブログ運営'],
    skills: 'フードフォト,スタイリング,Photoshop',
    socialLink: 'https://instagram.com/misaki_food'
  },
  'user_004': {
    id: 'user_004',
    nickname: '鈴木 健太',
    bio: 'スポーツフォトグラファー。動きのある瞬間を切り取るのが得意です。',
    diagnosis: 'ISTP',
    avatar: PH1,
    cover: PH2,
    goal: 'オリンピックの公式カメラマンになる',
    goalProgress: 30,
    workingOn: ['スポーツ撮影の実践', '高速シャッター技術', 'スポンサー探し'],
    skills: 'スポーツ撮影,動体撮影,望遠レンズ',
    socialLink: 'https://twitter.com/kenta_sports'
  },
  'user_005': {
    id: 'user_005',
    nickname: '高橋 さくら',
    bio: 'ウェディングフォトグラファー。幸せな瞬間を記録するお手伝いをしています。',
    diagnosis: 'ENFP',
    avatar: PH2,
    cover: PH3,
    goal: '年間50組のウェディング撮影',
    goalProgress: 85,
    workingOn: ['新しい演出の提案', 'アルバムデザイン', 'SNSマーケティング'],
    skills: 'ウェディング,ポートレート,ストロボ撮影',
    socialLink: 'https://www.sakura-wedding.com'
  }
};

// 現在のログインユーザー（デフォルト）
export const currentUserId = 'user_001';

// ユーザーIDからユーザー情報を取得
export const getUserById = (userId: string) => {
  return dummyUsers[userId as keyof typeof dummyUsers] || dummyUsers['user_001'];
};

// 全ユーザーのリストを取得
export const getAllUsers = () => {
  return Object.values(dummyUsers);
};

// ランダムなユーザーを取得（共通の友達用）
export const getRandomUsers = (excludeId: string, count: number) => {
  const users = Object.values(dummyUsers).filter(u => u.id !== excludeId);
  const shuffled = users.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// 友達リストのダミーデータ
export const friendships = {
  'user_001': ['user_002', 'user_003', 'user_005'],
  'user_002': ['user_001', 'user_004'],
  'user_003': ['user_001', 'user_005'],
  'user_004': ['user_002'],
  'user_005': ['user_001', 'user_003']
};

// 共通の友達を取得
export const getCommonFriends = (currentUserId: string, targetUserId: string) => {
  const currentFriends = friendships[currentUserId as keyof typeof friendships] || [];
  const targetFriends = friendships[targetUserId as keyof typeof friendships] || [];
  
  const commonIds = currentFriends.filter(id => targetFriends.includes(id));
  return commonIds.map(id => getUserById(id));
};
