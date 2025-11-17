import { PH1, PH2, PH3 } from './placeholders';

// ダミーユーザーデータ（mockAuth.tsの20人と統合）
export const dummyUsers = {
  'user_001': {
    id: 'user_001',
    nickname: 'はなちゃん',
    name: '山田 花子',
    bio: '写真が好きな大学生です📷 風景とポートレートを撮っています',
    diagnosis: 'ENFP',
    avatar: 'https://i.pravatar.cc/150?img=1',
    cover: PH2,
    birthday: '2001-04-15',
    age: 23,
    birthplace: '東京都渋谷区',
    hobbies: ['写真', 'カフェ巡り', '映画鑑賞'],
    favoriteFood: ['パスタ', 'タピオカ', 'パンケーキ'],
    mbtiType: 'ENFP',
    bloodType: 'A',
    goal: '今年は写真展を1回開催する',
    goalProgress: 75,
    milestones: [
      { id: 1, title: '会場の確保', completed: true, date: '2024-09-15' },
      { id: 2, title: '作品選定（30点）', completed: true, date: '2024-10-01' },
      { id: 3, title: 'ポスター・チラシ作成', completed: true, date: '2024-10-10' },
      { id: 4, title: '展示準備・搬入', completed: false, targetDate: '2024-11-20' },
      { id: 5, title: '写真展開催', completed: false, targetDate: '2024-12-01' }
    ],
    workingOn: ['展示の企画', 'ポートフォリオ整理', '写真教室の企画'],
    skills: '写真,レタッチ,構図',
    socialLink: 'https://twitter.com/hanachan_photo',
    postsCount: 156,
    albumsCount: 12,
    friendsCount: 23
  },
  'user_002': {
    id: 'user_002',
    nickname: 'たろさん',
    name: '田中 太郎',
    bio: 'プログラマー兼フォトグラファー💻📸 技術とアートの融合を目指してます',
    diagnosis: 'INTP',
    avatar: 'https://i.pravatar.cc/150?img=12',
    cover: PH3,
    birthday: '1998-11-22',
    age: 25,
    birthplace: '神奈川県横浜市',
    hobbies: ['プログラミング', '写真', 'アニメ'],
    favoriteFood: ['ラーメン', 'カレー', 'ピザ'],
    mbtiType: 'INTP',
    bloodType: 'B',
    goal: 'プロカメラマンとして独立する',
    goalProgress: 45,
    milestones: [
      { id: 1, title: 'ポートフォリオサイト作成', completed: true, date: '2024-08-01' },
      { id: 2, title: '初の有料撮影依頼', completed: true, date: '2024-09-15' },
      { id: 3, title: 'クライアント10件獲得', completed: false, targetDate: '2024-12-31' }
    ],
    workingOn: ['ポートレート撮影の練習', 'クライアント開拓', 'SNS発信強化'],
    skills: '風景写真,ポートレート,Lightroom,Python',
    socialLink: 'https://taro-photo.com',
    postsCount: 89,
    albumsCount: 8,
    friendsCount: 18
  },
  'user_003': {
    id: 'user_003',
    nickname: 'みさきん',
    name: '佐藤 美咲',
    bio: '料理とテーブルフォト🍽️✨ おいしい瞬間を記録しています',
    diagnosis: 'ISFP',
    avatar: 'https://i.pravatar.cc/150?img=5',
    cover: PH1,
    birthday: '2000-07-08',
    age: 24,
    birthplace: '大阪府大阪市',
    hobbies: ['料理', '食べ歩き', 'カメラ'],
    favoriteFood: ['寿司', 'スイーツ', 'イタリアン'],
    mbtiType: 'ISFP',
    bloodType: 'O',
    goal: 'フードフォトグラファーになる',
    goalProgress: 60,
    milestones: [
      { id: 1, title: 'フードスタイリング講座修了', completed: true, date: '2024-07-20' },
      { id: 2, title: 'レストラン撮影10件', completed: false, targetDate: '2024-11-30' },
      { id: 3, title: '料理本の撮影', completed: false, targetDate: '2025-03-31' }
    ],
    workingOn: ['料理撮影の技術向上', 'スタイリング勉強', 'レシピブログ運営'],
    skills: 'フードフォト,スタイリング,Photoshop',
    socialLink: 'https://instagram.com/misaki_food',
    postsCount: 234,
    albumsCount: 15,
    friendsCount: 31
  },
  'user_004': {
    id: 'user_004',
    nickname: 'けんちゃん',
    name: '鈴木 健太',
    bio: 'スポーツフォトグラファー⚽🏀 動きのある瞬間を切り取ります',
    diagnosis: 'ESTP',
    avatar: 'https://i.pravatar.cc/150?img=13',
    cover: PH2,
    goal: 'オリンピックの公式カメラマンになる',
    goalProgress: 30,
    milestones: [
      { id: 1, title: '地域スポーツ大会の撮影', completed: true, date: '2024-06-10' },
      { id: 2, title: '全国大会の撮影', completed: false, targetDate: '2024-12-15' },
      { id: 3, title: 'スポーツメディアと契約', completed: false, targetDate: '2025-04-01' }
    ],
    workingOn: ['スポーツ撮影の実践', '高速シャッター技術', 'スポンサー探し'],
    skills: 'スポーツ撮影,動体撮影,望遠レンズ',
    socialLink: 'https://twitter.com/kenta_sports',
    postsCount: 178,
    albumsCount: 20,
    friendsCount: 42
  },
  'user_005': {
    id: 'user_005',
    nickname: 'さくらん',
    name: '高橋 さくら',
    bio: 'ウェディングフォトグラファー💐👰 幸せな瞬間をお手伝い',
    diagnosis: 'ENFP',
    avatar: 'https://i.pravatar.cc/150?img=9',
    cover: PH3,
    goal: '年間50組のウェディング撮影',
    goalProgress: 85,
    milestones: [
      { id: 1, title: '認定ウェディングフォトグラファー資格取得', completed: true, date: '2023-12-01' },
      { id: 2, title: '年間30組達成', completed: true, date: '2024-09-30' },
      { id: 3, title: '年間50組達成', completed: false, targetDate: '2024-12-31' }
    ],
    workingOn: ['新しい演出の提案', 'アルバムデザイン', 'SNSマーケティング'],
    skills: 'ウェディング,ポートレート,ストロボ撮影',
    socialLink: 'https://www.sakura-wedding.com',
    postsCount: 412,
    albumsCount: 35,
    friendsCount: 67
  },
  'user_006': {
    id: 'user_006',
    nickname: 'けんいち',
    name: '山本 健一',
    bio: '旅行写真家🌍✈️ 世界中の風景を撮影しています',
    diagnosis: 'ISFJ',
    avatar: 'https://i.pravatar.cc/150?img=14',
    cover: PH1,
    goal: '世界50カ国を撮影する',
    goalProgress: 42,
    milestones: [
      { id: 1, title: 'アジア10カ国撮影', completed: true, date: '2024-05-20' },
      { id: 2, title: 'ヨーロッパ10カ国撮影', completed: false, targetDate: '2025-06-30' },
      { id: 3, title: '写真集出版', completed: false, targetDate: '2025-12-31' }
    ],
    workingOn: ['海外撮影旅行', '写真集の企画', '旅行ブログ運営'],
    skills: '風景写真,トラベルフォト,動画撮影',
    socialLink: 'https://kenichi-travel.com',
    postsCount: 523,
    albumsCount: 28,
    friendsCount: 89
  },
  'user_007': {
    id: 'user_007',
    nickname: 'ゆっきー',
    name: '中村 ゆき',
    bio: 'ペットフォトグラファー🐶🐱 大切な家族を可愛く撮影',
    diagnosis: 'ESFJ',
    avatar: 'https://i.pravatar.cc/150?img=10',
    cover: PH2,
    goal: 'ペット写真専門スタジオを開く',
    goalProgress: 55,
    milestones: [
      { id: 1, title: 'ペット撮影100件達成', completed: true, date: '2024-08-15' },
      { id: 2, title: 'スタジオ物件探し', completed: false, targetDate: '2024-12-31' },
      { id: 3, title: 'スタジオオープン', completed: false, targetDate: '2025-04-01' }
    ],
    workingOn: ['ペット撮影技術向上', 'スタジオ資金準備', 'SNS集客'],
    skills: 'ペット撮影,動物写真,スタジオ撮影',
    socialLink: 'https://instagram.com/yuki_pet_photo',
    postsCount: 298,
    albumsCount: 18,
    friendsCount: 54
  },
  'user_008': {
    id: 'user_008',
    nickname: 'ひろくん',
    name: '小林 浩',
    bio: 'ストリートフォトグラファー🏙️ 都市の日常を切り取ります',
    diagnosis: 'ISTP',
    avatar: 'https://i.pravatar.cc/150?img=15',
    cover: PH3,
    goal: 'ストリート写真集を出版する',
    goalProgress: 38,
    milestones: [
      { id: 1, title: '1000枚撮影', completed: true, date: '2024-07-01' },
      { id: 2, title: '写真展開催', completed: false, targetDate: '2024-11-30' },
      { id: 3, title: '写真集出版', completed: false, targetDate: '2025-03-31' }
    ],
    workingOn: ['街歩き撮影', '作品選定', '出版社探し'],
    skills: 'ストリートフォト,スナップ,白黒写真',
    socialLink: 'https://hiroshi-street.com',
    postsCount: 445,
    albumsCount: 22,
    friendsCount: 36
  },
  'user_009': {
    id: 'user_009',
    nickname: 'まいまい',
    name: '伊藤 舞',
    bio: 'ファッションフォトグラファー👗💄 スタイリングと光を楽しんでます',
    diagnosis: 'ENTJ',
    avatar: 'https://i.pravatar.cc/150?img=20',
    cover: PH1,
    goal: 'ファッション誌の専属カメラマンになる',
    goalProgress: 62,
    milestones: [
      { id: 1, title: 'モデル撮影50件', completed: true, date: '2024-06-30' },
      { id: 2, title: 'ファッション誌掲載', completed: true, date: '2024-09-15' },
      { id: 3, title: '専属契約獲得', completed: false, targetDate: '2025-01-31' }
    ],
    workingOn: ['ファッション撮影', 'ライティング研究', 'ブランドコラボ'],
    skills: 'ファッション,ポートレート,スタジオ撮影',
    socialLink: 'https://instagram.com/mai_fashion',
    postsCount: 367,
    albumsCount: 25,
    friendsCount: 78
  },
  'user_010': {
    id: 'user_010',
    nickname: 'しゅんくん',
    name: '渡辺 俊',
    bio: 'ネイチャーフォトグラファー🌲🦅 自然の美しさを伝えたい',
    diagnosis: 'INFP',
    avatar: 'https://i.pravatar.cc/150?img=17',
    cover: PH2,
    goal: '自然保護写真展を開催する',
    goalProgress: 48,
    milestones: [
      { id: 1, title: '野鳥撮影100種', completed: true, date: '2024-08-20' },
      { id: 2, title: '環境団体とコラボ', completed: false, targetDate: '2024-12-31' },
      { id: 3, title: '写真展開催', completed: false, targetDate: '2025-06-01' }
    ],
    workingOn: ['野生動物撮影', '環境保護活動', '写真展企画'],
    skills: 'ネイチャーフォト,野鳥撮影,マクロ撮影',
    socialLink: 'https://shun-nature.com',
    postsCount: 389,
    albumsCount: 19,
    friendsCount: 45
  },
  'user_011': {
    id: 'user_011',
    nickname: 'あやちゃん',
    name: '加藤 綾',
    bio: 'コンサート・ライブフォトグラファー🎸🎤 音楽と光を写真に',
    diagnosis: 'ESFP',
    avatar: 'https://i.pravatar.cc/150?img=16',
    cover: PH3,
    goal: '大型音楽フェスの公式カメラマンになる',
    goalProgress: 52,
    milestones: [
      { id: 1, title: 'ライブハウス撮影50件', completed: true, date: '2024-07-15' },
      { id: 2, title: '中規模フェス撮影', completed: false, targetDate: '2024-11-30' },
      { id: 3, title: '大型フェス公式契約', completed: false, targetDate: '2025-07-01' }
    ],
    workingOn: ['ライブ撮影', '暗所撮影技術', 'アーティストコネクション'],
    skills: 'ライブフォト,暗所撮影,動体撮影',
    socialLink: 'https://instagram.com/aya_live',
    postsCount: 267,
    albumsCount: 14,
    friendsCount: 52
  },
  'user_012': {
    id: 'user_012',
    nickname: 'だいすけ',
    name: '木村 大輔',
    bio: 'ドローンフォトグラファー🚁 空から見た世界を撮影',
    diagnosis: 'ENTP',
    avatar: 'https://i.pravatar.cc/150?img=33',
    cover: PH1,
    goal: 'ドローン撮影の第一人者になる',
    goalProgress: 68,
    milestones: [
      { id: 1, title: 'ドローン操縦ライセンス取得', completed: true, date: '2024-03-10' },
      { id: 2, title: '企業案件50件達成', completed: true, date: '2024-09-20' },
      { id: 3, title: 'TV番組撮影協力', completed: false, targetDate: '2024-12-31' }
    ],
    workingOn: ['ドローン撮影技術', '映像制作', '安全管理'],
    skills: 'ドローン撮影,空撮,動画編集',
    socialLink: 'https://daisuke-drone.com',
    postsCount: 189,
    albumsCount: 16,
    friendsCount: 38
  },
  'user_013': {
    id: 'user_013',
    nickname: 'りえちゃん',
    name: '松本 理恵',
    bio: 'マタニティ・ニューボーンフォトグラファー👶💕 新しい命の記録',
    diagnosis: 'ISFJ',
    avatar: 'https://i.pravatar.cc/150?img=24',
    cover: PH2,
    goal: 'ニューボーンフォト専門スタジオ開設',
    goalProgress: 72,
    milestones: [
      { id: 1, title: '認定資格取得', completed: true, date: '2024-02-15' },
      { id: 2, title: '撮影100家族達成', completed: true, date: '2024-10-01' },
      { id: 3, title: 'スタジオ開設', completed: false, targetDate: '2025-02-01' }
    ],
    workingOn: ['安全撮影技術', 'スタジオデザイン', '集客戦略'],
    skills: 'ニューボーン,マタニティ,ベビーフォト',
    socialLink: 'https://rie-newborn.com',
    postsCount: 312,
    albumsCount: 21,
    friendsCount: 61
  },
  'user_014': {
    id: 'user_014',
    nickname: 'のりお',
    name: '井上 紀夫',
    bio: '建築フォトグラファー🏢🏛️ 建物の美しさを表現します',
    diagnosis: 'ISTJ',
    avatar: 'https://i.pravatar.cc/150?img=51',
    cover: PH3,
    goal: '建築写真集を出版する',
    goalProgress: 41,
    milestones: [
      { id: 1, title: '有名建築100棟撮影', completed: true, date: '2024-08-01' },
      { id: 2, title: '建築家とコラボ', completed: false, targetDate: '2024-12-31' },
      { id: 3, title: '写真集出版', completed: false, targetDate: '2025-09-01' }
    ],
    workingOn: ['建築撮影', 'パース補正技術', '建築家ネットワーク'],
    skills: '建築写真,インテリア,広角レンズ',
    socialLink: 'https://norio-architecture.com',
    postsCount: 156,
    albumsCount: 11,
    friendsCount: 29
  },
  'user_015': {
    id: 'user_015',
    nickname: 'なおちゃん',
    name: '森田 直子',
    bio: '商品撮影フォトグラファー📦✨ ECサイト・広告撮影が得意',
    diagnosis: 'ESTJ',
    avatar: 'https://i.pravatar.cc/150?img=27',
    cover: PH1,
    goal: '大手企業の専属カメラマンになる',
    goalProgress: 64,
    milestones: [
      { id: 1, title: '商品撮影500点達成', completed: true, date: '2024-06-30' },
      { id: 2, title: '企業クライアント20社', completed: false, targetDate: '2024-12-31' },
      { id: 3, title: '専属契約獲得', completed: false, targetDate: '2025-03-31' }
    ],
    workingOn: ['商品撮影技術', 'ライティング', 'レタッチ効率化'],
    skills: '商品撮影,ライティング,Capture One',
    socialLink: 'https://naoko-product.com',
    postsCount: 423,
    albumsCount: 27,
    friendsCount: 44
  },
  'user_016': {
    id: 'user_016',
    nickname: 'としくん',
    name: '岡田 敏',
    bio: '天体写真家🌌⭐ 星空と宇宙の神秘を撮影',
    diagnosis: 'INTP',
    avatar: 'https://i.pravatar.cc/150?img=52',
    cover: PH2,
    goal: '天体写真コンテストで入賞する',
    goalProgress: 58,
    milestones: [
      { id: 1, title: '星景写真100枚撮影', completed: true, date: '2024-07-20' },
      { id: 2, title: '天体望遠鏡購入', completed: true, date: '2024-08-15' },
      { id: 3, title: 'コンテスト入賞', completed: false, targetDate: '2025-01-31' }
    ],
    workingOn: ['天体撮影技術', '画像処理', 'タイムラプス'],
    skills: '天体写真,星景写真,長時間露光',
    socialLink: 'https://toshi-astro.com',
    postsCount: 234,
    albumsCount: 13,
    friendsCount: 33
  },
  'user_017': {
    id: 'user_017',
    nickname: 'めぐみん',
    name: '清水 恵',
    bio: 'ダンス・パフォーマンスフォトグラファー💃🎭 動きの美しさを',
    diagnosis: 'ENFJ',
    avatar: 'https://i.pravatar.cc/150?img=26',
    cover: PH3,
    goal: 'プロダンスカンパニーの専属になる',
    goalProgress: 56,
    milestones: [
      { id: 1, title: '舞台撮影30公演', completed: true, date: '2024-09-10' },
      { id: 2, title: 'ダンサーポートレート100人', completed: false, targetDate: '2024-12-31' },
      { id: 3, title: 'カンパニー専属契約', completed: false, targetDate: '2025-04-01' }
    ],
    workingOn: ['舞台撮影', '動きの捉え方', 'アーティスト関係構築'],
    skills: 'ダンス撮影,舞台写真,高速シャッター',
    socialLink: 'https://megumi-dance.com',
    postsCount: 278,
    albumsCount: 17,
    friendsCount: 59
  },
  'user_018': {
    id: 'user_018',
    nickname: 'ゆうた',
    name: '吉田 悠太',
    bio: '水中フォトグラファー🐠🌊 海の世界を記録します',
    diagnosis: 'ISFP',
    avatar: 'https://i.pravatar.cc/150?img=68',
    cover: PH1,
    goal: '水中写真の個展を開催する',
    goalProgress: 44,
    milestones: [
      { id: 1, title: 'ダイビングライセンス取得', completed: true, date: '2023-11-15' },
      { id: 2, title: '水中撮影200本', completed: false, targetDate: '2024-12-31' },
      { id: 3, title: '個展開催', completed: false, targetDate: '2025-08-01' }
    ],
    workingOn: ['水中撮影技術', 'ダイビングスキル', '海洋保護活動'],
    skills: '水中写真,ダイビング,マリンフォト',
    socialLink: 'https://yuta-underwater.com',
    postsCount: 301,
    albumsCount: 20,
    friendsCount: 47
  },
  'user_019': {
    id: 'user_019',
    nickname: 'かおりん',
    name: '橋本 香織',
    bio: 'フィルムフォトグラファー📷🎞️ アナログの温かみを大切に',
    diagnosis: 'INFJ',
    avatar: 'https://i.pravatar.cc/150?img=29',
    cover: PH2,
    goal: 'フィルム写真教室を開講する',
    goalProgress: 67,
    milestones: [
      { id: 1, title: 'フィルムカメラ10台コレクション', completed: true, date: '2024-05-20' },
      { id: 2, title: '暗室技術習得', completed: true, date: '2024-07-10' },
      { id: 3, title: '写真教室開講', completed: false, targetDate: '2025-01-15' }
    ],
    workingOn: ['フィルム撮影', '暗室作業', 'カリキュラム作成'],
    skills: 'フィルム写真,暗室,アナログカメラ',
    socialLink: 'https://kaori-film.com',
    postsCount: 198,
    albumsCount: 15,
    friendsCount: 41
  },
  'user_020': {
    id: 'user_020',
    nickname: 'こうじ',
    name: '藤田 浩二',
    bio: 'ドキュメンタリーフォトグラファー📰 社会問題を写真で伝える',
    diagnosis: 'INTJ',
    avatar: 'https://i.pravatar.cc/150?img=60',
    cover: PH3,
    goal: 'フォトジャーナリストとして活動する',
    goalProgress: 39,
    milestones: [
      { id: 1, title: '社会問題の取材10件', completed: true, date: '2024-06-15' },
      { id: 2, title: 'メディア掲載5件', completed: false, targetDate: '2024-12-31' },
      { id: 3, title: 'ドキュメンタリー写真集出版', completed: false, targetDate: '2025-10-01' }
    ],
    workingOn: ['取材活動', 'ストーリーテリング', 'メディアネットワーク'],
    skills: 'ドキュメンタリー,報道写真,ストーリー構成',
    socialLink: 'https://koji-documentary.com',
    postsCount: 167,
    albumsCount: 9,
    friendsCount: 28
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

// 友達リストのダミーデータ（20人の相互関係）
export const friendships = {
  'user_001': ['user_002', 'user_003', 'user_005', 'user_007', 'user_009', 'user_011', 'user_013', 'user_015', 'user_017', 'user_019'],
  'user_002': ['user_001', 'user_004', 'user_006', 'user_008', 'user_012', 'user_014', 'user_016', 'user_020'],
  'user_003': ['user_001', 'user_005', 'user_007', 'user_009', 'user_013', 'user_015', 'user_017'],
  'user_004': ['user_002', 'user_006', 'user_008', 'user_010', 'user_012', 'user_018'],
  'user_005': ['user_001', 'user_003', 'user_007', 'user_009', 'user_011', 'user_013', 'user_015', 'user_017', 'user_019'],
  'user_006': ['user_002', 'user_004', 'user_008', 'user_010', 'user_014', 'user_016', 'user_018', 'user_020'],
  'user_007': ['user_001', 'user_003', 'user_005', 'user_009', 'user_011', 'user_013'],
  'user_008': ['user_002', 'user_004', 'user_006', 'user_010', 'user_012', 'user_014', 'user_020'],
  'user_009': ['user_001', 'user_003', 'user_005', 'user_007', 'user_011', 'user_013', 'user_015', 'user_017', 'user_019'],
  'user_010': ['user_004', 'user_006', 'user_008', 'user_012', 'user_016', 'user_018'],
  'user_011': ['user_001', 'user_005', 'user_007', 'user_009', 'user_013', 'user_015', 'user_017'],
  'user_012': ['user_002', 'user_004', 'user_008', 'user_010', 'user_014', 'user_016'],
  'user_013': ['user_001', 'user_003', 'user_005', 'user_007', 'user_009', 'user_011', 'user_015', 'user_017', 'user_019'],
  'user_014': ['user_002', 'user_006', 'user_008', 'user_012', 'user_016', 'user_020'],
  'user_015': ['user_001', 'user_003', 'user_005', 'user_009', 'user_011', 'user_013', 'user_017', 'user_019'],
  'user_016': ['user_002', 'user_006', 'user_010', 'user_012', 'user_014', 'user_018', 'user_020'],
  'user_017': ['user_001', 'user_003', 'user_005', 'user_009', 'user_011', 'user_013', 'user_015', 'user_019'],
  'user_018': ['user_004', 'user_006', 'user_010', 'user_016', 'user_020'],
  'user_019': ['user_001', 'user_005', 'user_009', 'user_013', 'user_015', 'user_017'],
  'user_020': ['user_002', 'user_006', 'user_008', 'user_014', 'user_016', 'user_018']
};

// 共通の友達を取得
export const getCommonFriends = (currentUserId: string, targetUserId: string) => {
  const currentFriends = friendships[currentUserId as keyof typeof friendships] || [];
  const targetFriends = friendships[targetUserId as keyof typeof friendships] || [];
  
  const commonIds = currentFriends.filter(id => targetFriends.includes(id));
  return commonIds.map(id => getUserById(id));
};
