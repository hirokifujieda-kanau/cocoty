/**
 * RPG診断のMockデータ
 */

export interface RpgQuestion {
  id: number;
  text: string;
  factor: 'fencer' | 'healer' | 'schemer' | 'gunner' | 'shielder' | 'other';
  isReversed: boolean; // 逆転項目かどうか
}

// 12問の質問データ（実際に使用する質問のみ）
// Q13, Q14は将来的な拡張用のため含めない
export const RPG_QUESTIONS: RpgQuestion[] = [
  {
    id: 1,
    text: '知らない人とすぐに会話ができる',
    factor: 'fencer',
    isReversed: false,
  },
  {
    id: 2,
    text: '人が快適で幸せかどうか、気になる',
    factor: 'healer',
    isReversed: false,
  },
  {
    id: 3,
    text: '絵画・映像・小説・音楽などの創作活動をしている',
    factor: 'schemer',
    isReversed: false,
  },
  {
    id: 4,
    text: '事前準備は、余裕を持って入念にする方だ',
    factor: 'gunner',
    isReversed: false,
  },
  {
    id: 5,
    text: '気分が落ち込んだり、憂うつになったりする',
    factor: 'shielder',
    isReversed: false,
  },
  {
    id: 6,
    text: 'パーティや交流イベントを企画するのが好き',
    factor: 'fencer',
    isReversed: false,
  },
  {
    id: 7,
    text: '人と議論を起こしやすい。批判をすることが得意',
    factor: 'healer',
    isReversed: true, // 逆転項目
  },
  {
    id: 8,
    text: '哲学的、精神的なテーマを考えるのが好き',
    factor: 'schemer',
    isReversed: false,
  },
  {
    id: 9,
    text: 'ものごとを整理して考えるのが苦手',
    factor: 'gunner',
    isReversed: true, // 逆転項目
  },
  {
    id: 10,
    text: 'ストレスを感じたり、不安になったりする',
    factor: 'shielder',
    isReversed: false,
  },
  {
    id: 11,
    text: 'カタカナ語や、むずかしい言葉を使うことが多い',
    factor: 'schemer',
    isReversed: false,
  },
  {
    id: 12,
    text: '他の人の気持ちを思いやり、優先する',
    factor: 'healer',
    isReversed: false,
  },
];

// 因子から本能への対応
export const FACTOR_TO_INSTINCT = {
  fencer: '狩猟本能',
  healer: '共感本能',
  schemer: '飛躍本能',
  gunner: '職人魂',
  shielder: '防衛本能',
} as const;

// 本能レベルの説明
export const INSTINCT_LEVEL_DESCRIPTIONS = {
  1: '弱い',
  2: '標準的',
  3: '強い',
  4: '最も強い',
} as const;

// 各本能の詳細説明
export const INSTINCT_DESCRIPTIONS = {
  狩猟本能: {
    emoji: '⚔️',
    素質名: 'フェンサー素質',
    description: '積極的に行動し、新しい人や環境に飛び込む力',
    高い人の特徴: '社交的・物事に熱中する',
    高い利点: '金銭・快楽の成功を得やすい → 行動が積極的',
    高いコスト: '波乱万丈、家庭的な安定欠如',
    低い人の特徴: 'よそよそしい・物静か',
    低い利点: '浮動性が低く安定・熟慮できる',
    低いコスト: 'チャンスを逃しがち',
  },
  防衛本能: {
    emoji: '�️',
    素質名: 'シールダー素質',
    description: 'リスクを察知し、慎重に判断する力',
    高い人の特徴: '危機察知性が高く、高ストレス・心配性の傾向',
    高い利点: 'ミスを回避、事前努力が苦なくできる',
    高いコスト: '不安症・うつになりやすい',
    低い人の特徴: '情緒的に安定',
    低い利点: 'プレッシャーに強い',
    低いコスト: 'リスクを冒しすぎる',
  },
  職人魂: {
    emoji: '🔧',
    素質名: 'ガンナー素質',
    description: '計画的に準備し、丁寧に物事を仕上げる力',
    高い人の特徴: '有能・自己管理できる',
    高い利点: '組織内での成功、自己抑制',
    高いコスト: '融通のなさ、変化にストレス',
    低い人の特徴: '衝動的・不注意な行動',
    低い利点: '臨機応変',
    低いコスト: '自制できない・破滅的',
  },
  共感本能: {
    emoji: '�',
    素質名: 'ヒーラー素質',
    description: '他者の感情を理解し、思いやる力',
    高い人の特徴: '人を信頼する・共感できる',
    高い利点: '社会で良い人間関係を築ける',
    高いコスト: '自己犠牲で損をする・出世しにくい',
    低い人の特徴: '非協力的・自己中心的',
    低い利点: '周りに振り回されず集中できる',
    低いコスト: '孤立無援になりがち',
  },
  飛躍本能: {
    emoji: '🎨',
    素質名: 'スキーマー素質',
    description: '創造的に発想し、新しいアイデアを生み出す力',
    高い人の特徴: '独創的・創造力に富む・エキセントリック',
    高い利点: '芸術的感受性、拡散的思考',
    高いコスト: '異常な信念、精神病傾向',
    低い人の特徴: '冒険しない・先例主義',
    低い利点: '現実思考で着実',
    低いコスト: '陳腐化・埋没しがち',
  },
} as const;
