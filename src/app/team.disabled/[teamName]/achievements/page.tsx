'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Award, TrendingUp, Star, Trophy, Target, Zap } from 'lucide-react';
import { AuthProvider } from '@/context/AuthContext';

const TeamAchievementsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const teamName = decodeURIComponent(params.teamName as string);

  const teamAchievements = {
    '写真部': {
      summary: '今月の投稿数: 24件',
      stats: [
        { label: '総投稿数', value: '342', icon: TrendingUp, color: 'purple' },
        { label: 'コンテスト受賞', value: '12', icon: Trophy, color: 'amber' },
        { label: 'メンバー数', value: '23', icon: Star, color: 'blue' },
        { label: '写真展開催', value: '3', icon: Award, color: 'green' },
      ],
      achievements: [
        { id: 1, title: '地域写真コンテスト金賞', date: '2024-10-15', description: 'メンバーの山田花子さんが「都市の夕暮れ」で金賞を受賞しました。', icon: Trophy, color: 'from-amber-400 to-yellow-500' },
        { id: 2, title: '初の写真展開催成功', date: '2024-09-20', description: 'メンバー全員の作品を展示。来場者数は200名を超えました。', icon: Award, color: 'from-purple-400 to-pink-500' },
        { id: 3, title: '月間投稿数100件達成', date: '2024-08-31', description: 'チーム全体で月間100件の投稿を達成。活動が活発化しています。', icon: Zap, color: 'from-green-400 to-emerald-500' },
        { id: 4, title: '新メンバー10名加入', date: '2024-07-01', description: '新学期に10名の新メンバーが加入。チームが大きく成長しました。', icon: Star, color: 'from-blue-400 to-cyan-500' },
        { id: 5, title: 'プロカメラマン講習会開催', date: '2024-06-15', description: 'プロカメラマンを招いて技術講習会を開催。30名が参加しました。', icon: Target, color: 'from-orange-400 to-red-500' },
      ]
    },
    'プログラミング部': {
      summary: '完成プロジェクト数: 8件',
      stats: [
        { label: 'プロジェクト完成', value: '8', icon: Trophy, color: 'green' },
        { label: 'ハッカソン参加', value: '5', icon: Zap, color: 'blue' },
        { label: 'メンバー数', value: '18', icon: Star, color: 'purple' },
        { label: 'コード貢献', value: '1.2k', icon: TrendingUp, color: 'amber' },
      ],
      achievements: [
        { id: 1, title: 'ハッカソン優勝', date: '2024-10-22', description: '地域ハッカソンで最優秀賞を獲得。開発したアプリが評価されました。', icon: Trophy, color: 'from-amber-400 to-yellow-500' },
        { id: 2, title: 'Webアプリケーション公開', date: '2024-09-10', description: 'チームで開発したWebアプリを一般公開。ユーザー数500人突破。', icon: Award, color: 'from-blue-400 to-cyan-500' },
        { id: 3, title: 'オープンソース貢献', date: '2024-08-05', description: 'メンバーが有名OSSプロジェクトにコントリビュート。PRがマージされました。', icon: Star, color: 'from-green-400 to-emerald-500' },
        { id: 4, title: '技術勉強会シリーズ開始', date: '2024-07-20', description: '週次の技術勉強会を開始。React, Node.js, Pythonなど様々なテーマで実施。', icon: Target, color: 'from-purple-400 to-pink-500' },
      ]
    },
    '料理部': {
      summary: '新レシピ開発: 15種類',
      stats: [
        { label: '新レシピ開発', value: '15', icon: Award, color: 'orange' },
        { label: '調理実習回数', value: '28', icon: TrendingUp, color: 'green' },
        { label: 'メンバー数', value: '20', icon: Star, color: 'purple' },
        { label: '料理イベント', value: '4', icon: Trophy, color: 'amber' },
      ],
      achievements: [
        { id: 1, title: '学園祭出店大盛況', date: '2024-10-28', description: '学園祭での出店が大成功。2日間で500食を完売しました。', icon: Trophy, color: 'from-amber-400 to-yellow-500' },
        { id: 2, title: 'オリジナルレシピ本制作', date: '2024-09-15', description: 'メンバーのレシピを集めた小冊子を制作。学内で配布しました。', icon: Award, color: 'from-orange-400 to-red-500' },
        { id: 3, title: '地元農家とコラボ', date: '2024-08-20', description: '地元農家と協力し、地産地消の料理イベントを開催しました。', icon: Star, color: 'from-green-400 to-emerald-500' },
        { id: 4, title: '料理コンテスト入賞', date: '2024-07-10', description: '地域料理コンテストで3名が入賞。部の実力が評価されました。', icon: Zap, color: 'from-purple-400 to-pink-500' },
      ]
    },
    '音楽部': {
      summary: 'ライブ開催数: 6回',
      stats: [
        { label: 'ライブ開催', value: '6', icon: Trophy, color: 'purple' },
        { label: '演奏曲数', value: '42', icon: TrendingUp, color: 'blue' },
        { label: 'メンバー数', value: '25', icon: Star, color: 'amber' },
        { label: '観客動員', value: '850', icon: Award, color: 'green' },
      ],
      achievements: [
        { id: 1, title: '定期ライブ大成功', date: '2024-10-30', description: '秋の定期ライブに200名が来場。過去最高の動員数を記録しました。', icon: Trophy, color: 'from-amber-400 to-yellow-500' },
        { id: 2, title: 'オリジナル曲制作', date: '2024-09-25', description: 'メンバーがオリジナル曲を5曲制作。ライブで披露して好評でした。', icon: Star, color: 'from-purple-400 to-pink-500' },
        { id: 3, title: '学外ライブ出演', date: '2024-08-15', description: '地域の音楽フェスティバルに出演。他校との交流も深まりました。', icon: Award, color: 'from-blue-400 to-cyan-500' },
        { id: 4, title: '楽器寄贈受領', date: '2024-07-05', description: 'OBから高級楽器3台の寄贈を受け、練習環境が向上しました。', icon: Zap, color: 'from-green-400 to-emerald-500' },
      ]
    },
    '読書会': {
      summary: '読破冊数: 42冊',
      stats: [
        { label: '読破冊数', value: '42', icon: Award, color: 'indigo' },
        { label: '読書会開催', value: '16', icon: TrendingUp, color: 'purple' },
        { label: 'メンバー数', value: '15', icon: Star, color: 'blue' },
        { label: '著者対談', value: '3', icon: Trophy, color: 'amber' },
      ],
      achievements: [
        { id: 1, title: '有名作家との対談実現', date: '2024-10-20', description: '芥川賞作家をゲストに迎えてトークイベントを開催。満員御礼でした。', icon: Trophy, color: 'from-amber-400 to-yellow-500' },
        { id: 2, title: 'ブックレビュー冊子発行', date: '2024-09-10', description: 'メンバーのレビューをまとめた冊子を季刊で発行開始しました。', icon: Award, color: 'from-indigo-400 to-purple-500' },
        { id: 3, title: '読書マラソン達成', date: '2024-08-31', description: '夏休みに全員で100冊読破チャレンジを達成しました。', icon: Star, color: 'from-green-400 to-emerald-500' },
        { id: 4, title: '図書館とコラボ企画', date: '2024-07-15', description: '地域図書館とコラボし、おすすめ本の展示コーナーを設置しました。', icon: Zap, color: 'from-blue-400 to-cyan-500' },
      ]
    },
  };

  const team = teamAchievements[teamName as keyof typeof teamAchievements] || teamAchievements['写真部'];

  const getColorClass = (color: string) => {
    const colors: { [key: string]: string } = {
      purple: 'bg-purple-100 text-purple-600',
      amber: 'bg-amber-100 text-amber-600',
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600',
      indigo: 'bg-indigo-100 text-indigo-600',
    };
    return colors[color] || colors['purple'];
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
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
                <h1 className="text-2xl font-bold text-gray-900">{teamName}の実績</h1>
                <p className="text-sm text-gray-500">{team.summary}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {team.stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`${getColorClass(stat.color)} rounded-2xl p-6 text-center`}
                >
                  <Icon className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Achievements Timeline */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">主な実績</h2>
            {team.achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${achievement.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{achievement.title}</h3>
                        <span className="text-sm text-gray-500 whitespace-nowrap ml-4">{achievement.date}</span>
                      </div>
                      <p className="text-gray-700">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="mt-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white text-center">
            <Trophy className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">一緒に新しい実績を作りませんか？</h3>
            <p className="mb-6 opacity-90">チームに参加して、あなたも実績作りに貢献しましょう！</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-white text-amber-600 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              チームページに戻る
            </button>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
};

export default TeamAchievementsPage;
