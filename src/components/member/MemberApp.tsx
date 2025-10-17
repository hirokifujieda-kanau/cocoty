'use client';

import React, { useState } from 'react';
import { 
  Home, 
  UserCog, 
  User, 
  Plus,
  Bell,
  Search,
  Calendar
} from 'lucide-react';
import SimpleFeed from '@/components/social/SimpleFeed';

interface MemberAppProps {
  communities: Array<{
    name: string;
    memberCount: number;
    recentPosts: number;
    upcomingEvents: number;
    activeRate: number;
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
    community: string;
    status?: string;
    participants?: number;
    capacity?: number;
    description?: string;
  }>;
  recentPosts: Array<{
    id: string;
    title: string;
    author: string;
    community: string;
    timestamp: string;
  }>;
  onSwitchToManager: () => void;
}

const MemberApp: React.FC<MemberAppProps> = ({
  communities,
  upcomingEvents,
  recentPosts,
  onSwitchToManager
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'events'>('home');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              コミュニティ
            </h1>
            
            <div className="flex items-center space-x-4">
              <button className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <button className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button 
                onClick={onSwitchToManager}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors border border-gray-200"
              >
                <UserCog className="h-4 w-4" />
                <span className="text-sm font-medium">管理画面</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Simple Tab Navigation */}
      <nav className="bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center space-x-2 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'home'
                  ? 'border-slate-600 text-slate-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>ホーム</span>
            </button>
            
            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center space-x-2 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'events'
                  ? 'border-slate-600 text-slate-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>イベント</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-6">
                {activeTab === 'home' ? (
          <SimpleFeed 
            communities={communities}
            upcomingEvents={upcomingEvents}
            recentPosts={recentPosts}
          />
        ) : activeTab === 'events' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">イベント一覧</h2>
              <span className="text-sm text-gray-500">
                CMが企画したイベントに参加できます
              </span>
            </div>
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-blue-600">{event.community}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {event.status === 'open' ? '募集中' : '終了'}
                    </span>
                    {event.participants && event.capacity && (
                      <span className="text-xs text-gray-500">
                        {event.participants}/{event.capacity}名参加
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">📅 {event.date}</p>
                  {event.description && (
                    <p className="text-sm text-gray-700">{event.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-slate-600 text-white rounded-md text-sm hover:bg-slate-700">
                    参加する
                  </button>
                  <button className="px-4 py-2 bg-stone-100 text-stone-700 rounded-md text-sm hover:bg-stone-200">
                    詳細を見る
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </main>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-110 flex items-center justify-center z-50">
        <Plus className="h-7 w-7" />
      </button>
    </div>
  );
};

export default MemberApp;