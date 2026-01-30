import { NextResponse } from 'next/server';

/**
 * RPG診断質問データ（一時的なモックデータ）
 * TODO: 後でRailsバックエンドから取得するように変更
 */
const mockQuestions = [
  {
    id: 1,
    text: "知らない人とすぐに会話ができる",
    factor: "fencer",
    is_reversed: false,
    order: 1
  },
  {
    id: 2,
    text: "人が快適で幸せかどうか、気になる",
    factor: "healer",
    is_reversed: false,
    order: 2
  },
  {
    id: 3,
    text: "絵画・映像・小説・音楽などの創作活動をしている",
    factor: "schemer",
    is_reversed: false,
    order: 3
  },
  {
    id: 4,
    text: "メカ・乗り物などに興味がある",
    factor: "gunner",
    is_reversed: false,
    order: 4
  },
  {
    id: 5,
    text: "体調・怪我・病気に敏感",
    factor: "shielder",
    is_reversed: false,
    order: 5
  },
  {
    id: 6,
    text: "家にいるより外出したい",
    factor: "fencer",
    is_reversed: false,
    order: 6
  },
  {
    id: 7,
    text: "人との深い繋がりは苦手",
    factor: "healer",
    is_reversed: true,
    order: 7
  },
  {
    id: 8,
    text: "細部よりも全体像を重視する",
    factor: "schemer",
    is_reversed: false,
    order: 8
  },
  {
    id: 9,
    text: "結果重視で過程は気にしない",
    factor: "gunner",
    is_reversed: true,
    order: 9
  },
  {
    id: 10,
    text: "リスクを避けて安全策を選ぶ",
    factor: "shielder",
    is_reversed: false,
    order: 10
  },
  {
    id: 11,
    text: "新しいアイデアを考えるのが好き",
    factor: "schemer",
    is_reversed: false,
    order: 11
  },
  {
    id: 12,
    text: "他人の感情に敏感",
    factor: "healer",
    is_reversed: false,
    order: 12
  },
  {
    id: 13,
    text: "単独行動が好き",
    factor: "fencer",
    is_reversed: true,
    order: 13
  },
  {
    id: 14,
    text: "手順やマニュアルを重視する",
    factor: "gunner",
    is_reversed: false,
    order: 14
  }
];

export async function GET() {
  return NextResponse.json({
    questions: mockQuestions
  });
}
