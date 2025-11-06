/**
 * モック認証システム
 * 開発用に複数ユーザーでの動作をシミュレート
 */

export interface MockUser {
  id: string;
  email: string;
  name: string;
  nickname: string;
  avatar: string;
  bio: string;
  diagnosis: string;
  createdAt: string;
}

// 20人分のモックユーザーデータ
export const mockUsers: MockUser[] = [
  {
    id: 'user_001',
    email: 'yamada.hanako@example.com',
    name: '山田 花子',
    nickname: 'はなちゃん',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: '写真が好きな大学生です📷 風景とポートレートを撮っています',
    diagnosis: 'ENFP',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'user_002',
    email: 'tanaka.taro@example.com',
    name: '田中 太郎',
    nickname: 'たろさん',
    avatar: 'https://i.pravatar.cc/150?img=12',
    bio: 'プログラマー兼フォトグラファー💻📸 技術とアートの融合を目指してます',
    diagnosis: 'INTP',
    createdAt: '2024-01-20T11:30:00Z'
  },
  {
    id: 'user_003',
    email: 'sato.misaki@example.com',
    name: '佐藤 美咲',
    nickname: 'みさきん',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: '料理とテーブルフォト🍽️✨ おいしい瞬間を記録しています',
    diagnosis: 'ISFP',
    createdAt: '2024-02-01T09:15:00Z'
  },
  {
    id: 'user_004',
    email: 'suzuki.kenta@example.com',
    name: '鈴木 健太',
    nickname: 'けんちゃん',
    avatar: 'https://i.pravatar.cc/150?img=13',
    bio: 'スポーツフォトグラファー⚽🏀 動きのある瞬間を切り取ります',
    diagnosis: 'ESTP',
    createdAt: '2024-02-10T14:20:00Z'
  },
  {
    id: 'user_005',
    email: 'takahashi.sakura@example.com',
    name: '高橋 さくら',
    nickname: 'さくらん',
    avatar: 'https://i.pravatar.cc/150?img=9',
    bio: 'ウェディングフォトグラファー💐👰 幸せな瞬間をお手伝い',
    diagnosis: 'ENFP',
    createdAt: '2024-02-15T16:45:00Z'
  },
  {
    id: 'user_006',
    email: 'yamamoto.kenichi@example.com',
    name: '山本 健一',
    nickname: 'けんいち',
    avatar: 'https://i.pravatar.cc/150?img=14',
    bio: '旅行写真家🌍✈️ 世界中の風景を撮影しています',
    diagnosis: 'ISFJ',
    createdAt: '2024-03-01T08:00:00Z'
  },
  {
    id: 'user_007',
    email: 'nakamura.yuki@example.com',
    name: '中村 ゆき',
    nickname: 'ゆっきー',
    avatar: 'https://i.pravatar.cc/150?img=10',
    bio: 'ペットフォトグラファー🐶🐱 大切な家族を可愛く撮影',
    diagnosis: 'ESFJ',
    createdAt: '2024-03-05T13:30:00Z'
  },
  {
    id: 'user_008',
    email: 'kobayashi.hiroshi@example.com',
    name: '小林 浩',
    nickname: 'ひろくん',
    avatar: 'https://i.pravatar.cc/150?img=15',
    bio: 'ストリートフォトグラファー🏙️ 都市の日常を切り取ります',
    diagnosis: 'ISTP',
    createdAt: '2024-03-10T10:00:00Z'
  },
  {
    id: 'user_009',
    email: 'ito.mai@example.com',
    name: '伊藤 舞',
    nickname: 'まいまい',
    avatar: 'https://i.pravatar.cc/150?img=20',
    bio: 'ファッションフォトグラファー👗💄 スタイリングと光を楽しんでます',
    diagnosis: 'ENTJ',
    createdAt: '2024-03-15T15:20:00Z'
  },
  {
    id: 'user_010',
    email: 'watanabe.shun@example.com',
    name: '渡辺 俊',
    nickname: 'しゅんくん',
    avatar: 'https://i.pravatar.cc/150?img=17',
    bio: 'ネイチャーフォトグラファー🌲🦅 自然の美しさを伝えたい',
    diagnosis: 'INFP',
    createdAt: '2024-03-20T09:45:00Z'
  },
  {
    id: 'user_011',
    email: 'kato.ayumi@example.com',
    name: '加藤 あゆみ',
    nickname: 'あゆちゃん',
    avatar: 'https://i.pravatar.cc/150?img=23',
    bio: 'コスプレイヤー&セルフポートレート📸✨ 表現することが好き',
    diagnosis: 'ENFJ',
    createdAt: '2024-04-01T11:00:00Z'
  },
  {
    id: 'user_012',
    email: 'yoshida.ryo@example.com',
    name: '吉田 涼',
    nickname: 'りょうちゃん',
    avatar: 'https://i.pravatar.cc/150?img=18',
    bio: 'フィルムカメラ愛好家📷🎞️ アナログな質感が好き',
    diagnosis: 'INFJ',
    createdAt: '2024-04-05T14:15:00Z'
  },
  {
    id: 'user_013',
    email: 'yamada.kenji@example.com',
    name: '山田 賢二',
    nickname: 'けんじ',
    avatar: 'https://i.pravatar.cc/150?img=19',
    bio: '建築写真家🏛️🌆 建物の美しさを追求しています',
    diagnosis: 'ISTJ',
    createdAt: '2024-04-10T16:30:00Z'
  },
  {
    id: 'user_014',
    email: 'sasaki.nana@example.com',
    name: '佐々木 菜々',
    nickname: 'ななちゃん',
    avatar: 'https://i.pravatar.cc/150?img=24',
    bio: 'ベビーフォトグラファー👶💕 かわいい笑顔を撮るのが幸せ',
    diagnosis: 'ESFP',
    createdAt: '2024-04-15T12:00:00Z'
  },
  {
    id: 'user_015',
    email: 'matsumoto.daiki@example.com',
    name: '松本 大輝',
    nickname: 'だいちゃん',
    avatar: 'https://i.pravatar.cc/150?img=21',
    bio: 'ドローンパイロット🚁📸 空からの景色を撮影してます',
    diagnosis: 'ENTP',
    createdAt: '2024-04-20T10:30:00Z'
  },
  {
    id: 'user_016',
    email: 'inoue.kaori@example.com',
    name: '井上 かおり',
    nickname: 'かおりん',
    avatar: 'https://i.pravatar.cc/150?img=26',
    bio: 'マタニティフォトグラファー🤰✨ 幸せな瞬間を残します',
    diagnosis: 'ISFP',
    createdAt: '2024-05-01T13:45:00Z'
  },
  {
    id: 'user_017',
    email: 'kimura.takeshi@example.com',
    name: '木村 武',
    nickname: 'たけし',
    avatar: 'https://i.pravatar.cc/150?img=22',
    bio: 'スポーツカーフォトグラファー🏎️💨 スピード感を表現',
    diagnosis: 'ESTJ',
    createdAt: '2024-05-05T15:00:00Z'
  },
  {
    id: 'user_018',
    email: 'hayashi.rina@example.com',
    name: '林 里奈',
    nickname: 'りなちゃん',
    avatar: 'https://i.pravatar.cc/150?img=27',
    bio: 'カフェ巡り📸☕ おしゃれな空間とスイーツを撮影',
    diagnosis: 'ENFP',
    createdAt: '2024-05-10T11:20:00Z'
  },
  {
    id: 'user_019',
    email: 'shimizu.masato@example.com',
    name: '清水 雅人',
    nickname: 'まさくん',
    avatar: 'https://i.pravatar.cc/150?img=25',
    bio: '天体写真家🌌⭐ 星空の美しさに魅了されています',
    diagnosis: 'INTJ',
    createdAt: '2024-05-15T09:00:00Z'
  },
  {
    id: 'user_020',
    email: 'mori.yuka@example.com',
    name: '森 由香',
    nickname: 'ゆかちゃん',
    avatar: 'https://i.pravatar.cc/150?img=28',
    bio: 'フラワーアレンジメント🌸💐 お花の美しさを写真で表現',
    diagnosis: 'INFP',
    createdAt: '2024-05-20T14:00:00Z'
  }
];

const SESSION_KEY = 'cocoty_session_v2';

/**
 * ログイン処理（モック）
 */
export const login = (userId: string): MockUser | null => {
  const user = mockUsers.find(u => u.id === userId);
  if (user && typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  }
  return null;
};

/**
 * ログアウト処理
 */
export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
};

/**
 * 現在のログインユーザーを取得
 */
export const getCurrentUser = (): MockUser | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      return JSON.parse(session);
    }
  } catch (e) {
    console.error('Failed to get current user:', e);
  }
  return null;
};

/**
 * ユーザーIDでユーザー情報を取得
 */
export const getUserById = (userId: string): MockUser | null => {
  return mockUsers.find(u => u.id === userId) || null;
};

/**
 * 全ユーザーを取得
 */
export const getAllUsers = (): MockUser[] => {
  return mockUsers;
};

/**
 * ランダムなユーザーを取得（指定したIDを除外）
 */
export const getRandomUsers = (excludeId: string, count: number): MockUser[] => {
  const filtered = mockUsers.filter(u => u.id !== excludeId);
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * セッションを初期化（初回訪問時）
 */
export const initializeSession = (): MockUser => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    return currentUser;
  }
  
  // デフォルトユーザーでログイン
  const defaultUser = mockUsers[0];
  if (typeof window !== 'undefined') {
    login(defaultUser.id);
  }
  return defaultUser;
};
