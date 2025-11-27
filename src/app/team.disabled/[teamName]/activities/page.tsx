'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { AuthProvider } from '@/context/AuthContext';

const TeamActivitiesPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const teamName = decodeURIComponent(params.teamName as string);

  const teamActivities = {
    '写真部': [
      { id: 1, title: '週1回の撮影会', schedule: '毎週土曜日 14:00-17:00', location: '公園・街中', participants: 8, description: 'メンバーで撮影スポットを巡り、撮影技術を磨きます。テーマは毎週変わります。' },
      { id: 2, title: '月例フォトコンテスト', schedule: '毎月最終日曜日', location: 'オンライン', participants: 15, description: '月ごとにテーマを設定し、ベストショットを競います。優秀作品は掲示されます。' },
      { id: 3, title: '技術共有セッション', schedule: '月2回 水曜日 19:00-20:30', location: '部室', participants: 12, description: 'レタッチ技術、構図の取り方、ライティングなど、メンバー同士で技術を教え合います。' },
    ],
    'プログラミング部': [
      { id: 1, title: '週2回のコーディング会', schedule: '火・木曜日 18:00-21:00', location: 'PC室', participants: 10, description: '各自プロジェクトを進めながら、分からないことは助け合います。' },
      { id: 2, title: 'ハッカソン参加', schedule: '年4回（季節ごと）', location: '外部会場', participants: 6, description: '外部のハッカソンイベントに参加し、実践経験を積みます。' },
      { id: 3, title: 'コードレビュー会', schedule: '月1回 土曜日', location: 'オンライン', participants: 8, description: 'メンバーのコードをレビューし、より良いコーディング方法を学びます。' },
    ],
    '料理部': [
      { id: 1, title: '週1回の調理実習', schedule: '金曜日 16:00-19:00', location: '調理室', participants: 12, description: '様々なジャンルの料理に挑戦します。作った料理はみんなで試食。' },
      { id: 2, title: 'レシピ共有会', schedule: '月2回 日曜日', location: 'オンライン', participants: 15, description: '自分のオリジナルレシピを共有し、アレンジアイデアを出し合います。' },
      { id: 3, title: '食材研究', schedule: '月1回', location: '市場・農園見学', participants: 8, description: '食材の産地を訪問し、生産者の話を聞きながら食材について学びます。' },
    ],
    '音楽部': [
      { id: 1, title: '週2回の練習', schedule: '月・木曜日 17:00-19:00', location: '音楽室', participants: 14, description: '各パート練習と合奏練習。基礎から応用まで丁寧に指導します。' },
      { id: 2, title: '月例ライブ', schedule: '毎月第3土曜日', location: 'ライブハウス', participants: 20, description: '月に一度の発表の場。観客を前に演奏し、実践力を磨きます。' },
      { id: 3, title: '楽器ワークショップ', schedule: '不定期', location: '部室', participants: 10, description: '楽器のメンテナンス方法や、演奏テクニックを学ぶワークショップ。' },
    ],
    '読書会': [
      { id: 1, title: '月2回の読書会', schedule: '第2・4日曜日 14:00-16:00', location: 'カフェ・図書館', participants: 10, description: '課題図書について意見交換。様々な視点から本を深く読み解きます。' },
      { id: 2, title: 'ブックレビュー', schedule: '随時オンライン投稿', location: 'オンライン', participants: 18, description: '読んだ本のレビューをSNSで共有。おすすめ本を紹介し合います。' },
      { id: 3, title: '著者トークイベント', schedule: '年3-4回', location: '書店・イベント会場', participants: 12, description: '著者を招いてトークイベントを開催。本の背景や執筆秘話を聞きます。' },
    ],
  };

  const activities = teamActivities[teamName as keyof typeof teamActivities] || teamActivities['写真部'];

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{teamName}の活動内容</h1>
                <p className="text-sm text-gray-500">定期的な活動とイベント</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-3">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{activity.title}</h3>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start space-x-3 text-sm">
                    <Clock className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{activity.schedule}</span>
                  </div>
                  <div className="flex items-start space-x-3 text-sm">
                    <MapPin className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{activity.location}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Users className="h-4 w-4 text-purple-600 flex-shrink-0" />
                    <span className="text-gray-700">{activity.participants}人参加</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">{activity.description}</p>

                <button className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                  参加する
                </button>
              </div>
            ))}
          </div>

          {/* 参加方法 */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">参加方法</h2>
            <div className="space-y-3 text-gray-700">
              <p>📝 各活動への参加は自由です。興味のある活動に気軽に参加してください。</p>
              <p>💬 初めての方は、活動前にチームの管理者に一声かけてください。</p>
              <p>📅 活動スケジュールは変更される場合があります。最新情報はチームページで確認してください。</p>
              <p>🤝 見学も大歓迎！まずは雰囲気を見に来てください。</p>
            </div>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
};

export default TeamActivitiesPage;
