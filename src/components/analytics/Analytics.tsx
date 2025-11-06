'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, MessageSquare, Eye, Download } from 'lucide-react';

interface AnalyticsData {
  communityGrowth: Array<{ month: string; members: number; posts: number; events: number }>;
  topCommunities: Array<{ name: string; engagement: number; growth: number }>;
  memberActivity: Array<{ day: string; activeUsers: number; posts: number }>;
  eventStats: Array<{ name: string; attendance: number; satisfaction: number }>;
}

interface AnalyticsProps {
  data: AnalyticsData;
}

const Analytics: React.FC<AnalyticsProps> = ({ data }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('month');

  const exportData = () => {
    // CSV export functionality would go here
    alert('データをCSVファイルとしてエクスポートします');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              活動分析
            </h1>
            <p className="text-gray-600">
              ココティ活動のデータ分析とインサイト
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as 'week' | 'month' | 'year')}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">過去1週間</option>
              <option value="month">過去1ヶ月</option>
              <option value="year">過去1年</option>
            </select>
            
            <button
              onClick={exportData}
              className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>エクスポート</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">総エンゲージメント</p>
                <p className="text-2xl font-bold text-gray-900">87.5%</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12% vs 先月
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">アクティブユーザー</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8% vs 先月
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">平均イベント参加率</p>
                <p className="text-2xl font-bold text-gray-900">72%</p>
                <p className="text-sm text-orange-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1 rotate-180" />
                  -3% vs 先月
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">月間投稿数</p>
                <p className="text-2xl font-bold text-gray-900">342</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +25% vs 先月
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Community Growth Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ココティ成長トレンド
            </h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">チャートプレースホルダー</p>
                <p className="text-sm text-gray-400">実装時にChart.jsやRechartsを使用</p>
              </div>
            </div>
          </div>

          {/* Top Communities */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              エンゲージメント上位ココティ
            </h3>
            <div className="space-y-4">
              {data.topCommunities.map((community, index) => (
                <div key={community.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-500' :
                      'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{community.name}</p>
                      <p className="text-sm text-gray-500">エンゲージメント: {community.engagement}%</p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    community.growth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {community.growth > 0 ? '+' : ''}{community.growth}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              日別アクティビティ
            </h3>
            <div className="space-y-3">
              {data.memberActivity.map((day) => (
                <div key={day.day} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">{day.day}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{day.activeUsers}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{day.posts}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Event Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              イベントパフォーマンス
            </h3>
            <div className="space-y-4">
              {data.eventStats.map((event) => (
                <div key={event.name} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{event.name}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">参加者数</p>
                      <p className="font-semibold text-gray-900">{event.attendance}名</p>
                    </div>
                    <div>
                      <p className="text-gray-500">満足度</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${event.satisfaction}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-gray-900">{event.satisfaction}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Eye className="h-6 w-6 text-blue-500 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                今月のインサイト
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 写真部のエンゲージメントが先月比20%向上しました</li>
                <li>• 平日の投稿数が週末より30%多い傾向があります</li>
                <li>• イベント参加率の高いメンバーは投稿も活発です</li>
                <li>• 新規メンバーの定着率を向上させるため、オンボーディングイベントの開催を推奨します</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;