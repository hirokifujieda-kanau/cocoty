/**
 * タロット占いモックデータ
 * 開発・テスト用
 */

export interface MockTarotCard {
  id: number;
  name: string;
  name_en: string;
  meaning: string;
  reverse_meaning: string;
  description: string;
  image_url: string;
}

export const MOCK_TAROT_CARDS: MockTarotCard[] = [
  {
    id: 0,
    name: '愚者',
    name_en: 'The Fool',
    meaning: '新しい始まり、自由、冒険',
    reverse_meaning: '無謀、軽率、方向性の喪失',
    description: '新しい旅の始まり。自由な精神で未知の世界へ踏み出す時。',
    image_url: 'https://via.placeholder.com/300x500/9333EA/FFFFFF?text=The+Fool'
  },
  {
    id: 1,
    name: '魔術師',
    name_en: 'The Magician',
    meaning: '創造性、スキル、意志の力',
    reverse_meaning: '操作、欺瞞、未発達の才能',
    description: 'あなたには必要なすべてのツールが揃っています。創造の力を使いましょう。',
    image_url: 'https://via.placeholder.com/300x500/7C3AED/FFFFFF?text=The+Magician'
  },
  {
    id: 2,
    name: '女教皇',
    name_en: 'The High Priestess',
    meaning: '直感、神秘、内なる声',
    reverse_meaning: '秘密、隠された動機、表面的な知識',
    description: '内なる叡智に耳を傾けましょう。直感があなたを導きます。',
    image_url: 'https://via.placeholder.com/300x500/6366F1/FFFFFF?text=High+Priestess'
  },
  {
    id: 3,
    name: '女帝',
    name_en: 'The Empress',
    meaning: '豊穣、母性、自然との調和',
    reverse_meaning: '依存、窒息、創造性の停滞',
    description: '豊かさと美が溢れる時期。育み、成長させる力があります。',
    image_url: 'https://via.placeholder.com/300x500/EC4899/FFFFFF?text=The+Empress'
  },
  {
    id: 4,
    name: '皇帝',
    name_en: 'The Emperor',
    meaning: '権威、構造、リーダーシップ',
    reverse_meaning: '支配、硬直性、専制',
    description: '秩序と安定をもたらす時。確固たる基盤の上に立ちましょう。',
    image_url: 'https://via.placeholder.com/300x500/EF4444/FFFFFF?text=The+Emperor'
  },
  {
    id: 5,
    name: '教皇',
    name_en: 'The Hierophant',
    meaning: '伝統、教育、精神的指導',
    reverse_meaning: '反抗、型破り、個人的信念',
    description: '伝統的な知恵と教えに学ぶ時。メンターを見つけましょう。',
    image_url: 'https://via.placeholder.com/300x500/F59E0B/FFFFFF?text=The+Hierophant'
  },
  {
    id: 6,
    name: '恋人',
    name_en: 'The Lovers',
    meaning: '愛、調和、選択',
    reverse_meaning: '不調和、誤った選択、自己愛',
    description: '心からの選択をする時。愛と調和を大切にしましょう。',
    image_url: 'https://via.placeholder.com/300x500/F472B6/FFFFFF?text=The+Lovers'
  },
  {
    id: 7,
    name: '戦車',
    name_en: 'The Chariot',
    meaning: '意志、勝利、自己統制',
    reverse_meaning: '暴走、方向性の欠如、侵略性',
    description: '目標に向かって突き進む時。意志の力で困難を克服できます。',
    image_url: 'https://via.placeholder.com/300x500/3B82F6/FFFFFF?text=The+Chariot'
  },
  {
    id: 8,
    name: '力',
    name_en: 'Strength',
    meaning: '勇気、忍耐、思いやり',
    reverse_meaning: '弱さ、自己疑念、虐待',
    description: '内なる強さで立ち向かう時。優しさと勇気を持って。',
    image_url: 'https://via.placeholder.com/300x500/10B981/FFFFFF?text=Strength'
  },
  {
    id: 9,
    name: '隠者',
    name_en: 'The Hermit',
    meaning: '内省、孤独、導き',
    reverse_meaning: '孤立、引きこもり、拒絶',
    description: '一人の時間を大切に。内なる光を見つける旅です。',
    image_url: 'https://via.placeholder.com/300x500/8B5CF6/FFFFFF?text=The+Hermit'
  },
  {
    id: 10,
    name: '運命の輪',
    name_en: 'Wheel of Fortune',
    meaning: '変化、運命、サイクル',
    reverse_meaning: '悪い運、抵抗、停滞',
    description: '変化の時。運命の流れに身を任せましょう。',
    image_url: 'https://via.placeholder.com/300x500/F59E0B/FFFFFF?text=Wheel+of+Fortune'
  },
  {
    id: 11,
    name: '正義',
    name_en: 'Justice',
    meaning: '公正、真実、法則',
    reverse_meaning: '不公正、不誠実、責任回避',
    description: '真実と公正が求められる時。因果応報を信じましょう。',
    image_url: 'https://via.placeholder.com/300x500/14B8A6/FFFFFF?text=Justice'
  },
  {
    id: 12,
    name: '吊るされた男',
    name_en: 'The Hanged Man',
    meaning: '犠牲、手放すこと、新しい視点',
    reverse_meaning: '無駄な犠牲、停滞、抵抗',
    description: '視点を変える時。手放すことで新しい理解が得られます。',
    image_url: 'https://via.placeholder.com/300x500/06B6D4/FFFFFF?text=Hanged+Man'
  },
  {
    id: 13,
    name: '死神',
    name_en: 'Death',
    meaning: '終わり、変容、再生',
    reverse_meaning: '抵抗、停滞、恐れ',
    description: '終わりは新しい始まり。変容を恐れないで。',
    image_url: 'https://via.placeholder.com/300x500/6B7280/FFFFFF?text=Death'
  },
  {
    id: 14,
    name: '節制',
    name_en: 'Temperance',
    meaning: 'バランス、調和、癒し',
    reverse_meaning: '不均衡、過剰、不調和',
    description: 'バランスと調和を保つ時。中庸の道を歩みましょう。',
    image_url: 'https://via.placeholder.com/300x500/8B5CF6/FFFFFF?text=Temperance'
  },
  {
    id: 15,
    name: '悪魔',
    name_en: 'The Devil',
    meaning: '束縛、執着、物質主義',
    reverse_meaning: '解放、気づき、鎖を断ち切る',
    description: '何があなたを縛っているのか。解放への第一歩です。',
    image_url: 'https://via.placeholder.com/300x500/DC2626/FFFFFF?text=The+Devil'
  },
  {
    id: 16,
    name: '塔',
    name_en: 'The Tower',
    meaning: '崩壊、啓示、解放',
    reverse_meaning: '回避、恐れ、災害の延期',
    description: '突然の変化。古いものを壊して新しく築く時です。',
    image_url: 'https://via.placeholder.com/300x500/F97316/FFFFFF?text=The+Tower'
  },
  {
    id: 17,
    name: '星',
    name_en: 'The Star',
    meaning: '希望、インスピレーション、平穏',
    reverse_meaning: '絶望、失望、幻滅',
    description: '希望の光が見えてきました。夢を信じて進みましょう。',
    image_url: 'https://via.placeholder.com/300x500/22D3EE/FFFFFF?text=The+Star'
  },
  {
    id: 18,
    name: '月',
    name_en: 'The Moon',
    meaning: '幻想、不安、潜在意識',
    reverse_meaning: '混乱の解消、真実の発見、解放',
    description: '曖昧さと幻想の時。直感を信じて霧を抜けましょう。',
    image_url: 'https://via.placeholder.com/300x500/A78BFA/FFFFFF?text=The+Moon'
  },
  {
    id: 19,
    name: '太陽',
    name_en: 'The Sun',
    meaning: '成功、喜び、活力',
    reverse_meaning: '遅延、失望、悲観主義',
    description: '明るい未来が待っています。成功と喜びの時です。',
    image_url: 'https://via.placeholder.com/300x500/FDE047/1F2937?text=The+Sun'
  },
  {
    id: 20,
    name: '審判',
    name_en: 'Judgement',
    meaning: '再生、覚醒、内なる呼びかけ',
    reverse_meaning: '自己疑念、後悔、変化への抵抗',
    description: '過去を振り返り、新しい自分へと生まれ変わる時です。',
    image_url: 'https://via.placeholder.com/300x500/A855F7/FFFFFF?text=Judgement'
  },
  {
    id: 21,
    name: '世界',
    name_en: 'The World',
    meaning: '完成、達成、統合',
    reverse_meaning: '未完成、遅延、空虚な成功',
    description: 'サイクルの完成。目標達成と新しい始まりの時です。',
    image_url: 'https://via.placeholder.com/300x500/10B981/FFFFFF?text=The+World'
  }
];

/**
 * モックタロット占い結果
 */
export interface MockTarotReading {
  id: number;
  user_id: number;
  target: 'self' | 'other';
  mental_state: 'sunny' | 'cloudy' | 'rainy';
  card_id: number;
  is_reversed: boolean;
  interpretation: string;
  user_feeling?: 'good' | 'soso' | 'bad';
  user_comment?: string;
  created_at: string;
  updated_at: string;
  card: MockTarotCard;
}

/**
 * モックタロット占い履歴を生成
 */
export function generateMockReadings(count: number = 10): MockTarotReading[] {
  const readings: MockTarotReading[] = [];
  
  for (let i = 0; i < count; i++) {
    const card = MOCK_TAROT_CARDS[Math.floor(Math.random() * MOCK_TAROT_CARDS.length)];
    const isReversed = Math.random() > 0.5;
    const target: 'self' | 'other' = Math.random() > 0.5 ? 'self' : 'other';
    const mentalStates: ('sunny' | 'cloudy' | 'rainy')[] = ['sunny', 'cloudy', 'rainy'];
    const mentalState = mentalStates[Math.floor(Math.random() * mentalStates.length)];
    const feelings: ('good' | 'soso' | 'bad')[] = ['good', 'soso', 'bad'];
    const feeling = i % 3 === 0 ? feelings[Math.floor(Math.random() * feelings.length)] : undefined;
    
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    readings.push({
      id: i + 1,
      user_id: 1,
      target,
      mental_state: mentalState,
      card_id: card.id,
      is_reversed: isReversed,
      interpretation: `${target === 'self' ? 'あなた' : '相手'}への今日のメッセージ。${card.description}`,
      user_feeling: feeling,
      user_comment: i % 3 === 0 ? '当たってました！' : undefined,
      created_at: date.toISOString(),
      updated_at: date.toISOString(),
      card
    });
  }
  
  return readings;
}
