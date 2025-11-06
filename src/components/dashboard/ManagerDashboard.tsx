'use client';

import React from 'react';
import { BarChart3, Users, Calendar, MessageSquare, TrendingUp, Activity } from 'lucide-react';

interface ManagerDashboardProps {
  communities: Array<{
    name: string;
    memberCount: number;
    recentPosts: number;
    upcomingEvents: number;
    activeRate: number;
  }>;
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ communities }) => {
  const totalMembers = communities.reduce((sum, community) => sum + community.memberCount, 0);
  const totalPosts = communities.reduce((sum, community) => sum + community.recentPosts, 0);
  const totalEvents = communities.reduce((sum, community) => sum + community.upcomingEvents, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            マネージャーダッシュボード
          </h1>
          <p className="text-gray-600">
            ココティ全体の活動状況を管理・監視できます
          </p>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-slate-600">{totalMembers}</p>
              <p className="text-sm text-gray-500">メンバー</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-600">{totalPosts}</p>
              <p className="text-sm text-gray-500">今月の投稿</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-700">{totalEvents}</p>
              <p className="text-sm text-gray-500">開催予定</p>
            </div>
            <div className="relative group">
              <p className="text-2xl font-bold text-zinc-600">
                {Math.round(communities.reduce((sum, c) => sum + c.activeRate, 0) / communities.length)}%
              </p>
              <p className="text-sm text-gray-500">平均活性度</p>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                活性度 = (月間投稿数 + イベント参加率×2) ÷ メンバー数 × 100
              </div>
            </div>
          </div>
        </div>

        {/* Community Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Community List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <Users className="h-6 w-6 text-blue-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                ココティ管理
              </h2>
            </div>
            
            <div className="space-y-4">
              {communities.map((community) => (
                <div
                  key={community.name}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{community.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      community.activeRate >= 70 
                        ? 'bg-green-100 text-green-800'
                        : community.activeRate >= 40
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      活性度 {community.activeRate}%
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{community.memberCount}名</span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      <span>{community.recentPosts}投稿</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{community.upcomingEvents}予定</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <Activity className="h-6 w-6 text-green-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                最近の管理アクション
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { action: '写真部の桜撮影会イベントを承認', time: '2時間前', type: 'approve' },
                { action: 'プログラミング部にメンバー5名を追加', time: '1日前', type: 'member' },
                { action: '料理部のアンケート結果を確認', time: '2日前', type: 'survey' },
                { action: '映像制作部の成果物を公開', time: '3日前', type: 'content' }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'approve' ? 'bg-green-500' :
                    activity.type === 'member' ? 'bg-blue-500' :
                    activity.type === 'survey' ? 'bg-purple-500' :
                    'bg-orange-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">クイックアクション</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'イベントを作成', icon: Calendar, color: 'blue' },
              { title: 'アンケートを作成', icon: MessageSquare, color: 'purple' },
              { title: '告知ページ作成', icon: BarChart3, color: 'green' },
              { title: 'メンバー招待', icon: Users, color: 'orange' }
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  className={`p-4 rounded-lg border-2 border-dashed hover:bg-gray-50 transition-colors ${
                    action.color === 'blue' ? 'border-blue-300 text-blue-600' :
                    action.color === 'purple' ? 'border-purple-300 text-purple-600' :
                    action.color === 'green' ? 'border-green-300 text-green-600' :
                    'border-orange-300 text-orange-600'
                  }`}
                >
                  <Icon className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">{action.title}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;