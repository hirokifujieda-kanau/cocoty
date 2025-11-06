'use client';

import React from 'react';
import { Calendar, Users, MessageSquare } from 'lucide-react';

interface CommunityStats {
  name: string;
  memberCount: number;
  recentPosts: number;
  upcomingEvents: number;
}

interface DashboardProps {
  communities: CommunityStats[];
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
    community: string;
  }>;
  recentPosts: Array<{
    id: string;
    title: string;
    author: string;
    community: string;
    timestamp: string;
  }>;
}

const Dashboard: React.FC<DashboardProps> = ({
  communities,
  upcomingEvents,
  recentPosts
}) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ココティ・ダッシュボード
          </h1>
          <p className="text-gray-600">
            各部活の最新情報と次のイベント予定を確認しましょう
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {communities.map((community) => (
            <div
              key={community.name}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {community.name}
                </h3>
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  メンバー: {community.memberCount}人
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  新着投稿: {community.recentPosts}件
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  予定: {community.upcomingEvents}件
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <Calendar className="h-6 w-6 text-green-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                次のイベント予定
              </h2>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {event.title}
                    </h3>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <span>{event.community}</span>
                      <span className="mx-2">•</span>
                      <span>{event.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Posts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <MessageSquare className="h-6 w-6 text-purple-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                新着投稿
              </h2>
            </div>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {post.title}
                    </h3>
                    <div className="mt-1 text-sm text-gray-500">
                      <span>{post.author}</span>
                      <span className="mx-2">•</span>
                      <span>{post.community}</span>
                      <span className="mx-2">•</span>
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;