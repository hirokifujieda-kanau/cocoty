/**
 * ソーシャル機能のモックデータ
 * イベント、アンケート、投稿、いいね、コメントなどを管理
 */

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  community: string;
  organizer: string;
  capacity: number;
  participants: string[]; // ユーザーID
  comments: Comment[]; // コメント
  timestamp: string;
  coverImage?: string; // イベントカバー画像
  teamPhoto?: string; // チーム集合写真
  requiresApproval?: boolean; // 承認制かどうか
  status?: 'open' | 'closed' | 'cancelled' | 'full'; // イベントステータス
  attendees?: string[]; // participants のエイリアス（互換性のため）
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  community: string;
  author: string;
  questions: SurveyQuestion[];
  timestamp: string;
}

export interface SurveyQuestion {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'text';
  options?: string[];
  votes?: { [option: string]: string[] }; // option -> userId[]
}

export interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    community: string;
    avatar: string;
    diagnosis: string;
  };
  content: {
    text: string;
    images?: string[];
  };
  timestamp: string;
  likes: string[]; // ユーザーID
  comments: Comment[];
  shares: number;
}

export interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
  likes: string[]; // ユーザーID
}

const STORAGE_KEY_EVENTS = 'cocoty_events_v1';
const STORAGE_KEY_SURVEYS = 'cocoty_surveys_v1';
const STORAGE_KEY_POSTS = 'cocoty_posts_v1';

// チーム（コミュニティ）のメンバー管理
export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  diagnosis: string;
  community: string;
  role?: 'member' | 'manager';
  joinedAt?: string;
}

// コミュニティ別のメンバーマッピング
const communityMembers: { [community: string]: string[] } = {
  '写真部': ['user_001', 'user_002', 'user_003', 'user_006', 'user_008', 'user_011', 'user_012'],
  'プログラミング部': ['user_002', 'user_004', 'user_009', 'user_013', 'user_015', 'user_017'],
  '料理部': ['user_003', 'user_005', 'user_007', 'user_010', 'user_014', 'user_016'],
  '音楽部': ['user_001', 'user_006', 'user_011', 'user_018', 'user_019', 'user_020'],
  '読書会': ['user_012', 'user_013', 'user_014', 'user_015', 'user_016'],
};

// 初期イベントデータ
const initialEvents: Event[] = [
  {
    id: 'event_001',
    title: '春の撮影会 - 参加者募集中！',
    description: '桜の季節に合わせて屋外撮影を行います。カメラの基本操作から構図のコツまで、初心者の方も安心してご参加ください！',
    date: '2024年4月10日',
    time: '10:00-16:00',
    location: '上野公園',
    community: '写真部',
    organizer: 'コミュニティマネージャー',
    capacity: 20,
    participants: [],
    attendees: [],
    comments: [],
    timestamp: '30分前',
    coverImage: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800',
    teamPhoto: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400',
    requiresApproval: false,
    status: 'open'
  },
  {
    id: 'event_002',
    title: 'プログラミング勉強会',
    description: 'React + TypeScriptでハッカソンに挑戦！チーム開発の楽しさを体験しましょう。',
    date: '2024年4月15日',
    time: '14:00-18:00',
    location: 'オンライン（Zoom）',
    community: 'プログラミング部',
    organizer: 'コミュニティマネージャー',
    capacity: 30,
    participants: [],
    attendees: [],
    comments: [],
    timestamp: '1時間前',
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    requiresApproval: false,
    status: 'open'
  },
  {
    id: 'event_003',
    title: '料理コンテスト - 春の食材を使って',
    description: '旬の春野菜を使った創作料理コンテスト！みんなでアイデアを競い合いましょう🍳',
    date: '2024年4月20日',
    time: '13:00-17:00',
    location: 'コミュニティキッチン',
    community: '料理部',
    organizer: 'コミュニティマネージャー',
    capacity: 15,
    participants: [],
    attendees: [],
    comments: [],
    timestamp: '2時間前',
    coverImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
    teamPhoto: 'https://images.unsplash.com/photo-1577219491135-ce391730fb4c?w=400',
    requiresApproval: false,
    status: 'open'
  },
  {
    id: 'event_004',
    title: '夜景撮影ツアー',
    description: '東京タワー周辺で夜景撮影を楽しみましょう。三脚持参推奨！',
    date: '2024年4月12日',
    time: '18:00-21:00',
    location: '東京タワー周辺',
    community: '写真部',
    organizer: 'コミュニティマネージャー',
    capacity: 15,
    participants: [],
    comments: [],
    timestamp: '3時間前'
  },
  {
    id: 'event_005',
    title: 'Python基礎講座',
    description: 'プログラミング初心者向けのPython入門講座です。',
    date: '2024年4月18日',
    time: '14:00-17:00',
    location: 'オンライン',
    community: 'プログラミング部',
    organizer: 'コミュニティマネージャー',
    capacity: 50,
    participants: [],
    comments: [],
    timestamp: '4時間前'
  },
  {
    id: 'event_006',
    title: 'イタリアン料理教室',
    description: '本格的なパスタとピザの作り方を学びます！',
    date: '2024年4月22日',
    time: '11:00-15:00',
    location: 'コミュニティキッチン',
    community: '料理部',
    organizer: 'コミュニティマネージャー',
    capacity: 12,
    participants: [],
    comments: [],
    timestamp: '5時間前'
  },
  {
    id: 'event_007',
    title: 'ジャズセッション',
    description: '楽器を持ち寄ってジャズセッションを楽しみましょう♪',
    date: '2024年4月25日',
    time: '19:00-22:00',
    location: 'スタジオA',
    community: '音楽部',
    organizer: 'コミュニティマネージャー',
    capacity: 20,
    participants: [],
    comments: [],
    timestamp: '6時間前'
  },
  {
    id: 'event_008',
    title: '読書会：村上春樹を語る',
    description: '村上春樹作品について熱く語り合いましょう！',
    date: '2024年4月28日',
    time: '15:00-17:00',
    location: 'カフェ・ブックス',
    community: '読書会',
    organizer: 'コミュニティマネージャー',
    capacity: 15,
    participants: [],
    comments: [],
    timestamp: '1日前'
  },
  {
    id: 'event_009',
    title: 'ポートレート撮影会',
    description: 'モデルさんを招いてポートレート撮影の練習をします。',
    date: '2024年5月3日',
    time: '10:00-15:00',
    location: 'スタジオB',
    community: '写真部',
    organizer: 'コミュニティマネージャー',
    capacity: 10,
    participants: [],
    comments: [],
    timestamp: '1日前'
  },
  {
    id: 'event_010',
    title: 'Webアプリ開発ハッカソン',
    description: '24時間でWebアプリを作り上げるハッカソン！',
    date: '2024年5月10日',
    time: '10:00-翌10:00',
    location: 'オンライン',
    community: 'プログラミング部',
    organizer: 'コミュニティマネージャー',
    capacity: 40,
    participants: [],
    comments: [],
    timestamp: '2日前'
  },
  {
    id: 'event_011',
    title: '和菓子作り体験',
    description: '職人さんを招いて本格的な和菓子作りを学びます。',
    date: '2024年5月15日',
    time: '13:00-16:00',
    location: 'コミュニティキッチン',
    community: '料理部',
    organizer: 'コミュニティマネージャー',
    capacity: 10,
    participants: [],
    comments: [],
    timestamp: '2日前'
  },
  {
    id: 'event_012',
    title: 'バンド練習セッション',
    description: '新曲の練習をしましょう！初心者も歓迎です。',
    date: '2024年5月18日',
    time: '18:00-21:00',
    location: 'スタジオC',
    community: '音楽部',
    organizer: 'コミュニティマネージャー',
    capacity: 15,
    participants: [],
    comments: [],
    timestamp: '3日前'
  },
  {
    id: 'event_013',
    title: 'SF小説を読む会',
    description: '最新のSF小説について意見交換しましょう。',
    date: '2024年5月20日',
    time: '14:00-16:00',
    location: 'オンライン',
    community: '読書会',
    organizer: 'コミュニティマネージャー',
    capacity: 30,
    participants: [],
    comments: [],
    timestamp: '3日前'
  },
  {
    id: 'event_014',
    title: 'マクロ撮影ワークショップ',
    description: '小さな世界を美しく撮る技術を学びます。',
    date: '2024年5月25日',
    time: '10:00-13:00',
    location: '植物園',
    community: '写真部',
    organizer: 'コミュニティマネージャー',
    capacity: 12,
    participants: [],
    comments: [],
    timestamp: '4日前'
  },
  {
    id: 'event_015',
    title: 'AI・機械学習勉強会',
    description: 'ChatGPT APIを使ったアプリ開発を学びます。',
    date: '2024年6月1日',
    time: '15:00-18:00',
    location: 'オンライン',
    community: 'プログラミング部',
    organizer: 'コミュニティマネージャー',
    capacity: 50,
    participants: [],
    comments: [],
    timestamp: '5日前'
  }
];

// 初期アンケートデータ
const initialSurveys: Survey[] = [
  {
    id: 'survey_001',
    title: '料理部の次回企画についてアンケート',
    description: 'みんなで作ってみたい料理ジャンルを教えてください！回答期限は今週末までです。',
    community: '料理部',
    author: 'コミュニティマネージャー',
    questions: [
      {
        id: 'q1',
        text: '次回作ってみたい料理は？',
        type: 'single',
        options: ['和食', '洋食', 'イタリアン', 'デザート'],
        votes: {}
      }
    ],
    timestamp: '1時間前'
  },
  {
    id: 'survey_002',
    title: '次回の撮影テーマを決めよう',
    description: 'みんなで撮影したいテーマを投票で決めましょう！',
    community: '写真部',
    author: 'コミュニティマネージャー',
    questions: [
      {
        id: 'q1',
        text: '次回の撮影テーマは？',
        type: 'single',
        options: ['ポートレート', '風景写真', 'マクロ撮影', 'ストリート'],
        votes: {}
      }
    ],
    timestamp: '3時間前'
  },
  {
    id: 'survey_003',
    title: 'プログラミング言語の人気投票',
    description: '今後の勉強会で扱ってほしい言語を教えてください！',
    community: 'プログラミング部',
    author: 'コミュニティマネージャー',
    questions: [
      {
        id: 'q1',
        text: '学びたいプログラミング言語は？',
        type: 'multiple',
        options: ['Python', 'JavaScript', 'Go', 'Rust', 'TypeScript'],
        votes: {}
      }
    ],
    timestamp: '5時間前'
  },
  {
    id: 'survey_004',
    title: '音楽部の活動時間帯アンケート',
    description: '参加しやすい時間帯を教えてください。',
    community: '音楽部',
    author: 'コミュニティマネージャー',
    questions: [
      {
        id: 'q1',
        text: '参加しやすい時間帯は？',
        type: 'single',
        options: ['平日昼', '平日夜', '土日昼', '土日夜'],
        votes: {}
      }
    ],
    timestamp: '1日前'
  },
  {
    id: 'survey_005',
    title: '読書会のジャンル希望',
    description: '次回読みたい本のジャンルを教えてください。',
    community: '読書会',
    author: 'コミュニティマネージャー',
    questions: [
      {
        id: 'q1',
        text: '読みたいジャンルは？',
        type: 'single',
        options: ['ミステリー', '恋愛小説', 'ビジネス書', 'エッセイ'],
        votes: {}
      }
    ],
    timestamp: '1日前'
  },
  {
    id: 'survey_006',
    title: '撮影機材についてのアンケート',
    description: 'お持ちのカメラの種類を教えてください。',
    community: '写真部',
    author: 'コミュニティマネージャー',
    questions: [
      {
        id: 'q1',
        text: '使用しているカメラは？',
        type: 'single',
        options: ['一眼レフ', 'ミラーレス', 'コンデジ', 'スマホ'],
        votes: {}
      }
    ],
    timestamp: '2日前'
  },
  {
    id: 'survey_007',
    title: '料理のレベル調査',
    description: '料理経験について教えてください。',
    community: '料理部',
    author: 'コミュニティマネージャー',
    questions: [
      {
        id: 'q1',
        text: 'あなたの料理レベルは？',
        type: 'single',
        options: ['初心者', '中級者', '上級者', 'プロ級'],
        votes: {}
      }
    ],
    timestamp: '2日前'
  },
  {
    id: 'survey_008',
    title: 'フレームワーク人気投票',
    description: '使いたいWebフレームワークを教えてください。',
    community: 'プログラミング部',
    author: 'コミュニティマネージャー',
    questions: [
      {
        id: 'q1',
        text: '使いたいフレームワークは？',
        type: 'multiple',
        options: ['React', 'Vue', 'Angular', 'Svelte', 'Next.js'],
        votes: {}
      }
    ],
    timestamp: '3日前'
  },
  {
    id: 'survey_009',
    title: '楽器経験アンケート',
    description: '演奏できる楽器を教えてください。',
    community: '音楽部',
    author: 'コミュニティマネージャー',
    questions: [
      {
        id: 'q1',
        text: '演奏できる楽器は？',
        type: 'multiple',
        options: ['ギター', 'ベース', 'ドラム', 'キーボード', 'ボーカル'],
        votes: {}
      }
    ],
    timestamp: '3日前'
  },
  {
    id: 'survey_010',
    title: '次回のイベント希望日',
    description: '参加しやすい日程を教えてください。',
    community: '写真部',
    author: 'コミュニティマネージャー',
    questions: [
      {
        id: 'q1',
        text: '参加しやすい日は？',
        type: 'single',
        options: ['4月第1週', '4月第2週', '4月第3週', '4月第4週'],
        votes: {}
      }
    ],
    timestamp: '4日前'
  },
  {
    id: 'survey_011',
    title: 'デザート作りアンケート',
    description: '作ってみたいデザートを教えてください。',
    community: '料理部',
    author: 'コミュニティマネージャー',
    questions: [
      {
        id: 'q1',
        text: '作りたいデザートは？',
        type: 'single',
        options: ['ケーキ', 'クッキー', 'プリン', 'アイス'],
        votes: {}
      }
    ],
    timestamp: '4日前'
  },
  {
    id: 'survey_012',
    title: '開発環境アンケート',
    description: '使用している開発環境を教えてください。',
    community: 'プログラミング部',
    author: 'コミュニティマネージャー',
    questions: [
      {
        id: 'q1',
        text: '使っているエディタは？',
        type: 'single',
        options: ['VSCode', 'WebStorm', 'Vim', 'その他'],
        votes: {}
      }
    ],
    timestamp: '5日前'
  },
  {
    id: 'survey_013',
    title: '読書ペースアンケート',
    description: '月に何冊くらい本を読みますか？',
    community: '読書会',
    author: 'コミュニティマネージャー',
    questions: [
      {
        id: 'q1',
        text: '月の読書量は？',
        type: 'single',
        options: ['1-2冊', '3-5冊', '6-10冊', '10冊以上'],
        votes: {}
      }
    ],
    timestamp: '5日前'
  },
  {
    id: 'survey_014',
    title: 'ライブイベント希望調査',
    description: 'ライブをやるならどこがいい？',
    community: '音楽部',
    author: 'コミュニティマネージャー',
    questions: [
      {
        id: 'q1',
        text: 'ライブ会場の希望は？',
        type: 'single',
        options: ['ライブハウス', 'カフェ', '野外', 'オンライン'],
        votes: {}
      }
    ],
    timestamp: '6日前'
  },
  {
    id: 'survey_015',
    title: '撮影ロケーション希望',
    description: '行ってみたい撮影スポットを教えてください。',
    community: '写真部',
    author: 'コミュニティマネージャー',
    questions: [
      {
        id: 'q1',
        text: '撮影したい場所は？',
        type: 'multiple',
        options: ['都会', '自然', '神社仏閣', '水辺', '夜景'],
        votes: {}
      }
    ],
    timestamp: '1週間前'
  }
];

// 初期投稿データ
const initialPosts: Post[] = [
  {
    id: 'post_001',
    author: {
      id: 'user_001',
      name: '山田 花子',
      community: '写真部',
      avatar: 'https://i.pravatar.cc/150?img=1',
      diagnosis: 'ENFP'
    },
    content: {
      text: '今日の撮影会、天気に恵まれて素晴らしい写真がたくさん撮れました！新しいメンバーの皆さんも上達が早くて驚きです 📸✨',
      images: ['https://picsum.photos/800/600?random=1', 'https://picsum.photos/800/600?random=2']
    },
    timestamp: '2時間前',
    likes: [],
    comments: [],
    shares: 3
  },
  {
    id: 'post_002',
    author: {
      id: 'user_002',
      name: '田中 太郎',
      community: 'プログラミング部',
      avatar: 'https://i.pravatar.cc/150?img=12',
      diagnosis: 'INTP'
    },
    content: {
      text: 'ハッカソン完了！React + TypeScriptで作ったアプリがついに形になりました 🎉 チーム開発の面白さを実感できた3日間でした。',
      images: []
    },
    timestamp: '4時間前',
    likes: [],
    comments: [],
    shares: 5
  },
  {
    id: 'post_003',
    author: {
      id: 'user_003',
      name: '佐藤 美咲',
      community: '料理部',
      avatar: 'https://i.pravatar.cc/150?img=5',
      diagnosis: 'ISFP'
    },
    content: {
      text: '今日はパスタ作りに挑戦！手打ちは難しいけど、みんなでワイワイ作ると楽しいですね 🍝 来週はピザ作りの予定です！',
      images: ['https://picsum.photos/800/600?random=3']
    },
    timestamp: '6時間前',
    likes: [],
    comments: [],
    shares: 2
  }
];

// ストレージからデータを読み込む
const loadFromStorage = <T>(key: string, initialData: T): T => {
  if (typeof window === 'undefined') return initialData;
  
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error(`Failed to load ${key}:`, e);
  }
  
  // 初回アクセス時は初期データを保存
  saveToStorage(key, initialData);
  return initialData;
};

// ストレージにデータを保存する
const saveToStorage = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key}:`, e);
  }
};

// ====================
// イベント関連の関数
// ====================

export const getAllEvents = (): Event[] => {
  const events = loadFromStorage(STORAGE_KEY_EVENTS, initialEvents);
  
  // 古いデータ形式を修正（participants と comments が無い場合）
  return events.map(event => ({
    ...event,
    participants: event.participants || [],
    comments: event.comments || []
  }));
};

export const getEventById = (eventId: string): Event | null => {
  const events = getAllEvents();
  return events.find(e => e.id === eventId) || null;
};

export const joinEvent = (eventId: string, userId: string): boolean => {
  const events = getAllEvents();
  const event = events.find(e => e.id === eventId);
  
  if (!event) return false;
  if (event.participants.includes(userId)) return false; // すでに参加済み
  if (event.participants.length >= event.capacity) return false; // 定員オーバー
  
  event.participants.push(userId);
  saveToStorage(STORAGE_KEY_EVENTS, events);
  return true;
};

export const leaveEvent = (eventId: string, userId: string): boolean => {
  const events = getAllEvents();
  const event = events.find(e => e.id === eventId);
  
  if (!event) return false;
  
  event.participants = event.participants.filter(id => id !== userId);
  saveToStorage(STORAGE_KEY_EVENTS, events);
  return true;
};

export const isUserJoined = (eventId: string, userId: string): boolean => {
  const event = getEventById(eventId);
  return event && event.participants ? event.participants.includes(userId) : false;
};

// ====================
// アンケート関連の関数
// ====================

export const getAllSurveys = (): Survey[] => {
  return loadFromStorage(STORAGE_KEY_SURVEYS, initialSurveys);
};

export const getSurveyById = (surveyId: string): Survey | null => {
  const surveys = getAllSurveys();
  return surveys.find(s => s.id === surveyId) || null;
};

export const answerSurvey = (
  surveyId: string,
  questionId: string,
  option: string,
  userId: string
): boolean => {
  const surveys = getAllSurveys();
  const survey = surveys.find(s => s.id === surveyId);
  
  if (!survey) return false;
  
  const question = survey.questions.find(q => q.id === questionId);
  if (!question || !question.options?.includes(option)) return false;
  
  if (!question.votes) question.votes = {};
  
  // シングルチョイスの場合は既存の投票を削除
  if (question.type === 'single') {
    Object.keys(question.votes).forEach(opt => {
      question.votes![opt] = question.votes![opt].filter(id => id !== userId);
    });
  }
  
  if (!question.votes[option]) {
    question.votes[option] = [];
  }
  
  if (!question.votes[option].includes(userId)) {
    question.votes[option].push(userId);
  }
  
  saveToStorage(STORAGE_KEY_SURVEYS, surveys);
  return true;
};

export const getSurveyResults = (surveyId: string, questionId: string): { [option: string]: number } => {
  const survey = getSurveyById(surveyId);
  if (!survey) return {};
  
  const question = survey.questions.find(q => q.id === questionId);
  if (!question || !question.votes) return {};
  
  const results: { [option: string]: number } = {};
  Object.keys(question.votes).forEach(option => {
    results[option] = question.votes![option].length;
  });
  
  return results;
};

export const hasUserAnswered = (surveyId: string, userId: string): boolean => {
  const survey = getSurveyById(surveyId);
  if (!survey) return false;
  
  return survey.questions.some(q => {
    if (!q.votes) return false;
    return Object.values(q.votes).some(voters => voters.includes(userId));
  });
};

// ====================
// 投稿関連の関数
// ====================

export const getAllPosts = (): Post[] => {
  const posts = loadFromStorage(STORAGE_KEY_POSTS, initialPosts);
  
  // 古いデータ形式を修正（likes と comments が配列でない場合）
  return posts.map(post => ({
    ...post,
    likes: Array.isArray(post.likes) ? post.likes : [],
    comments: Array.isArray(post.comments) ? post.comments : []
  }));
};

export const getPostById = (postId: string): Post | null => {
  const posts = getAllPosts();
  return posts.find(p => p.id === postId) || null;
};

export const likePost = (postId: string, userId: string): boolean => {
  const posts = getAllPosts();
  const post = posts.find(p => p.id === postId);
  
  if (!post) return false;
  
  if (post.likes.includes(userId)) {
    // すでにいいね済みの場合は解除
    post.likes = post.likes.filter(id => id !== userId);
  } else {
    // いいねを追加
    post.likes.push(userId);
  }
  
  saveToStorage(STORAGE_KEY_POSTS, posts);
  return true;
};

export const isPostLiked = (postId: string, userId: string): boolean => {
  const post = getPostById(postId);
  return post ? post.likes.includes(userId) : false;
};

// ====================
// コメント関連の関数
// ====================

export const addComment = (
  postId: string,
  userId: string,
  userName: string,
  userAvatar: string,
  text: string
): Comment | null => {
  // 投稿へのコメントを試す
  const posts = getAllPosts();
  const post = posts.find(p => p.id === postId);
  
  if (post && text.trim()) {
    const comment: Comment = {
      id: `comment_${Date.now()}`,
      postId,
      author: {
        id: userId,
        name: userName,
        avatar: userAvatar
      },
      text: text.trim(),
      timestamp: '今',
      likes: []
    };
    
    post.comments.push(comment);
    saveToStorage(STORAGE_KEY_POSTS, posts);
    return comment;
  }
  
  // イベントへのコメントを試す
  const events = getAllEvents();
  const event = events.find(e => e.id === postId);
  
  if (event && text.trim()) {
    const comment: Comment = {
      id: `comment_${Date.now()}`,
      postId,
      author: {
        id: userId,
        name: userName,
        avatar: userAvatar
      },
      text: text.trim(),
      timestamp: '今',
      likes: []
    };
    
    event.comments.push(comment);
    saveToStorage(STORAGE_KEY_EVENTS, events);
    return comment;
  }
  
  return null;
};

export const likeComment = (commentId: string, userId: string): boolean => {
  const posts = getAllPosts();
  
  for (const post of posts) {
    const comment = post.comments.find(c => c.id === commentId);
    if (comment) {
      if (comment.likes.includes(userId)) {
        comment.likes = comment.likes.filter(id => id !== userId);
      } else {
        comment.likes.push(userId);
      }
      saveToStorage(STORAGE_KEY_POSTS, posts);
      return true;
    }
  }
  
  return false;
};

export const getCommentsForPost = (postId: string): Comment[] => {
  const post = getPostById(postId);
  return post ? post.comments : [];
};

/**
 * 新しい投稿を作成
 */
export const createPost = (
  userId: string,
  userName: string,
  userCommunity: string,
  userAvatar: string,
  userDiagnosis: string,
  text: string,
  images: string[]
): Post | null => {
  if (!text.trim()) return null;
  
  const posts = getAllPosts();
  
  const newPost: Post = {
    id: `post_${Date.now()}`,
    author: {
      id: userId,
      name: userName,
      community: userCommunity,
      avatar: userAvatar,
      diagnosis: userDiagnosis
    },
    content: {
      text: text.trim(),
      images: images
    },
    timestamp: '今',
    likes: [],
    comments: [],
    shares: 0
  };
  
  // 新しい投稿を先頭に追加
  posts.unshift(newPost);
  saveToStorage(STORAGE_KEY_POSTS, posts);
  
  return newPost;
};

/**
 * localStorageをクリアして初期データで再初期化
 * データ構造の変更時に使用
 */
export const resetSocialData = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(STORAGE_KEY_EVENTS);
  localStorage.removeItem(STORAGE_KEY_SURVEYS);
  localStorage.removeItem(STORAGE_KEY_POSTS);
  
  // 初期データを保存
  saveToStorage(STORAGE_KEY_EVENTS, initialEvents);
  saveToStorage(STORAGE_KEY_SURVEYS, initialSurveys);
  saveToStorage(STORAGE_KEY_POSTS, initialPosts);
};

/**
 * 指定したコミュニティのメンバー一覧を取得
 */
export const getTeamMembers = (community: string): TeamMember[] => {
  const memberIds = communityMembers[community] || [];
  
  // ユーザーIDから簡易的に情報を生成
  const names = [
    '山田 花子', '田中 太郎', '佐藤 美咲', '鈴木 健太', '高橋 さくら',
    '山本 健一', '中村 ゆき', '小林 浩', '伊藤 舞', '渡辺 俊',
    '加藤 あゆみ', '吉田 涼', '松本 翔太', '井上 里奈', '木村 大輔',
    '林 優子', '清水 健', '山崎 美穂', '森田 拓海', '池田 愛'
  ];
  const diagnoses = [
    'ENFP', 'INTP', 'ISFP', 'ESTP', 'ENFP',
    'ISFJ', 'ESFJ', 'ISTP', 'ENTJ', 'INFP',
    'ENFJ', 'INFJ', 'ENTP', 'ISTJ', 'ESFP',
    'INTJ', 'ISFP', 'ESTJ', 'INFP', 'ENFJ'
  ];
  
  return memberIds.map(userId => {
    const userNumber = parseInt(userId.split('_')[1]);
    
    return {
      id: userId,
      name: names[userNumber - 1],
      avatar: `https://i.pravatar.cc/150?img=${userNumber}`,
      diagnosis: diagnoses[userNumber - 1],
      community,
      role: userNumber <= 2 ? 'manager' : 'member',
      joinedAt: `2024-0${Math.min(userNumber, 9)}-01`
    };
  });
};

/**
 * ユーザーが所属する全コミュニティを取得
 */
export const getUserCommunities = (userId: string): string[] => {
  const communities: string[] = [];
  
  Object.entries(communityMembers).forEach(([community, members]) => {
    if (members.includes(userId)) {
      communities.push(community);
    }
  });
  
  return communities;
};

/**
 * ユーザーIDからユーザー情報を取得
 */
export const getUserById = (userId: string): TeamMember | null => {
  // 全コミュニティを検索してユーザーを見つける
  for (const community of Object.keys(communityMembers)) {
    const members = getTeamMembers(community);
    const user = members.find(m => m.id === userId);
    if (user) {
      return user;
    }
  }
  return null;
};

/**
 * 特定ユーザーの投稿を取得
 */
export const getPostsByUserId = (userId: string): Post[] => {
  const allPosts = getAllPosts();
  return allPosts.filter(post => post.author.id === userId);
};

