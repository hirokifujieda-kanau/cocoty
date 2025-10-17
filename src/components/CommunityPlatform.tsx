'use client';

import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  FolderOpen, 
  Users, 
  Settings,
  Menu,
  X,
  UserCog,
  User,
  BarChart3,
  MessageSquare,
  MessageCircle
} from 'lucide-react';

// Import components
import ManagerDashboard from '@/components/dashboard/ManagerDashboard';
import MemberApp from '@/components/member/MemberApp';
import EventManagement from '@/components/events/EventManagement';
import EventSurvey from '@/components/events/EventSurvey';
import EventPageBuilder from '@/components/events/EventPageBuilder';
import MemberManagement from '@/components/management/MemberManagement';
import Analytics from '@/components/analytics/Analytics';
import AIAssistant from '@/components/ai/AIAssistant';

type PageType = 'dashboard' | 'events' | 'survey' | 'event-builder' | 'manager-dashboard' | 'member-management' | 'analytics';
type UserRole = 'member' | 'manager';

const CommunityPlatform: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('member');
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  // Sample data for demonstration
  const sampleData = {
    communities: [
      { name: '写真部', memberCount: 25, recentPosts: 8, upcomingEvents: 2, activeRate: 85 },
      { name: 'プログラミング部', memberCount: 18, recentPosts: 12, upcomingEvents: 1, activeRate: 92 },
      { name: '料理部', memberCount: 30, recentPosts: 6, upcomingEvents: 3, activeRate: 78 },
      { name: '映像制作部', memberCount: 15, recentPosts: 4, upcomingEvents: 1, activeRate: 65 }
    ],
    upcomingEvents: [
      {
        id: '1',
        title: '春の撮影会',
        date: '2024年4月10日',
        community: '写真部',
        status: 'open',
        participants: 12,
        capacity: 20,
        description: '桜の季節に合わせて屋外撮影を行います。基本操作から構図のコツまで丁寧に指導します。'
      },
      {
        id: '2', 
        title: 'プログラミング勉強会',
        date: '2024年4月15日',
        community: 'プログラミング部',
        status: 'open',
        participants: 25,
        capacity: 30,
        description: 'React入門をテーマにハンズオン形式で進めます。パソコンをお持ちください。'
      },
      {
        id: '3',
        title: '料理コンテスト',
        date: '2024年4月20日', 
        community: '料理部',
        status: 'open',
        participants: 8,
        capacity: 15,
        description: 'テーマは「春野菜を使った創作料理」。みんなでアイデアを競い合いましょう！'
      }
    ],
    recentPosts: [
      {
        id: '1',
        title: '今日の撮影成果',
        author: '田中さん',
        community: '写真部',
        timestamp: '2時間前'
      },
      {
        id: '2',
        title: 'React入門講座開催しました',
        author: '山田さん',
        community: 'プログラミング部',
        timestamp: '4時間前'
      }
    ],

    socialEvents: [
      {
        id: '1',
        title: '春の撮影会',
        description: '桜の季節に合わせて屋外撮影を行います。カメラの基本操作から構図のコツまで、初心者の方も安心してご参加ください！',
        date: '2024年4月10日',
        time: '10:00-16:00',
        location: '上野公園',
        organizer: '田中花子',
        community: '写真部',
        category: 'workshop' as const,
        capacity: 20,
        attendees: 12,
        tags: ['撮影', '初心者歓迎', '屋外'],
        price: 500,
        isLiked: false,
        isBookmarked: true,
        isAttending: false
      },
      {
        id: '2',
        title: 'プログラミング勉強会',
        description: 'React入門をテーマにハンズオン形式で進めます。パソコンをお持ちください。',
        date: '2024年4月15日',
        time: '14:00-17:00',
        location: 'オンライン（Zoom）',
        organizer: '山田太郎',
        community: 'プログラミング部',
        category: 'online' as const,
        capacity: 30,
        attendees: 25,
        tags: ['React', 'JavaScript', 'ハンズオン'],
        price: 0,
        isLiked: true,
        isBookmarked: false,
        isAttending: true
      }
    ],
    events: [
      {
        id: '1',
        title: '春の撮影会',
        description: '桜の季節に合わせて屋外撮影を行います',
        date: '2024年4月10日',
        time: '10:00',
        location: '上野公園',
        capacity: 20,
        organizer: '田中花子',
        community: '写真部',
        status: 'open' as const,
        participants: {
          attending: [
            { id: '1', name: '山田太郎', respondedAt: '昨日' }
          ],
          notAttending: [],
          pending: [
            { id: '2', name: '佐藤次郎' }
          ]
        },
        tasks: [
          {
            id: '1',
            title: '機材の準備',
            assignee: '田中花子',
            completed: true,
            dueDate: '4月9日'
          }
        ]
      }
    ],
    surveys: [
      {
        id: '1',
        title: '次回の撮影テーマを決めよう',
        description: 'みんなで撮影したいテーマを投票で決めましょう',
        type: 'single_choice' as const,
        options: [
          { id: '1', text: 'ポートレート', votes: 8 },
          { id: '2', text: '風景写真', votes: 12 },
          { id: '3', text: 'マクロ撮影', votes: 5 }
        ],
        createdAt: '2024年4月1日',
        createdBy: '田中花子',
        community: '写真部',
        status: 'active' as const,
        totalResponses: 25
      }
    ],
    members: [
      {
        id: '1',
        name: '田中花子',
        email: 'hanako@example.com',
        community: '写真部',
        role: 'leader' as const,
        joinDate: '2024年1月',
        lastActive: '2時間前',
        postsCount: 25,
        eventsAttended: 8,
        status: 'active' as const
      },
      {
        id: '2',
        name: '山田太郎',
        email: 'taro@example.com',
        community: 'プログラミング部',
        role: 'manager' as const,
        joinDate: '2023年12月',
        lastActive: '1日前',
        postsCount: 42,
        eventsAttended: 12,
        status: 'active' as const
      },
      {
        id: '3',
        name: '佐藤次郎',
        email: 'jiro@example.com',
        community: '料理部',
        role: 'member' as const,
        joinDate: '2024年2月',
        lastActive: '3日前',
        postsCount: 15,
        eventsAttended: 5,
        status: 'active' as const
      }
    ],
    analyticsData: {
      communityGrowth: [
        { month: '1月', members: 45, posts: 120, events: 8 },
        { month: '2月', members: 52, posts: 150, events: 10 },
        { month: '3月', members: 61, posts: 180, events: 12 }
      ],
      topCommunities: [
        { name: 'プログラミング部', engagement: 92, growth: 15 },
        { name: '写真部', engagement: 85, growth: 12 },
        { name: '料理部', engagement: 78, growth: 8 },
        { name: '映像制作部', engagement: 65, growth: -2 }
      ],
      memberActivity: [
        { day: '月曜日', activeUsers: 45, posts: 12 },
        { day: '火曜日', activeUsers: 38, posts: 8 },
        { day: '水曜日', activeUsers: 52, posts: 15 },
        { day: '木曜日', activeUsers: 48, posts: 11 },
        { day: '金曜日', activeUsers: 41, posts: 9 }
      ],
      eventStats: [
        { name: '春の撮影会', attendance: 20, satisfaction: 95 },
        { name: 'ハッカソン', attendance: 15, satisfaction: 88 },
        { name: '料理コンテスト', attendance: 25, satisfaction: 92 }
      ]
    }
  };

  // マネージャー向けナビゲーション
  const managerNavigation = [
    { 
      id: 'manager-dashboard', 
      label: 'マネージャーダッシュボード', 
      icon: BarChart3, 
      description: '管理概要'
    },
    { 
      id: 'events', 
      label: 'イベント管理', 
      icon: Calendar, 
      description: '出欠・企画管理'
    },
    { 
      id: 'survey', 
      label: 'アンケート管理', 
      icon: MessageSquare, 
      description: '意見収集'
    },
    { 
      id: 'event-builder', 
      label: '告知ページ作成', 
      icon: Settings, 
      description: 'イベント告知'
    },
    { 
      id: 'member-management', 
      label: 'メンバー管理', 
      icon: Users, 
      description: 'メンバー情報'
    },
    { 
      id: 'analytics', 
      label: '活動分析', 
      icon: BarChart3, 
      description: 'データ分析'
    }
  ];

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'manager-dashboard':
        return (
          <ManagerDashboard
            communities={sampleData.communities}
          />
        );
      case 'events':
        return (
          <EventManagement
            events={sampleData.events}
            onCreateEvent={() => {}}
            onUpdateAttendance={() => {}}
            onSendReminder={() => {}}
            onUpdateTask={() => {}}
          />
        );
      case 'survey':
        return (
          <EventSurvey
            surveys={sampleData.surveys}
            onCreateSurvey={() => {}}
            onVote={() => {}}
            onCloseSurvey={() => {}}
          />
        );
      case 'event-builder':
        return (
          <EventPageBuilder
            onSave={() => {}}
            onPublish={() => {}}
            onPreview={() => {}}
          />
        );
      case 'member-management':
        return (
          <MemberManagement
            members={sampleData.members}
            onInviteMember={() => alert('メンバー招待機能は今後実装予定です')}
            onEditMember={() => alert('メンバー編集機能は今後実装予定です')}
            onRemoveMember={() => alert('メンバー削除機能は今後実装予定です')}
          />
        );
      case 'analytics':
        return (
          <Analytics
            data={sampleData.analyticsData}
          />
        );
      default:
        return (
          <ManagerDashboard
            communities={sampleData.communities}
          />
        );
    }
  };

  // 部員の場合は専用のMemberAppを表示
  if (userRole === 'member') {
    return (
      <MemberApp
        communities={sampleData.communities}
        upcomingEvents={sampleData.upcomingEvents}
        recentPosts={sampleData.recentPosts}
        onSwitchToManager={() => {
          setUserRole('manager');
          setCurrentPage('manager-dashboard');
        }}
      />
    );
  }

  // マネージャーの場合は従来のサイドバー形式
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">
              マネージャー管理画面
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* AI Assistant Button */}
          <button
            onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
            className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all shadow-lg hover:shadow-xl"
          >
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold">AIアシスタント</p>
              <p className="text-xs text-slate-200">活動促進のサポート</p>
            </div>
            <div className="ml-auto">
              <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
            </div>
          </button>
        </div>

        {/* Role Toggle */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">現在の表示</span>
            <div className="flex items-center space-x-2">
              <UserCog className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-gray-600">マネージャー</span>
            </div>
          </div>
          <button
            onClick={() => {
              setUserRole('member');
              setCurrentPage('dashboard');
            }}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200"
          >
            <User className="h-4 w-4" />
            <span>部員画面に切り替え</span>
          </button>
        </div>

        <nav className="mt-6">
          <div className="px-3">
            {managerNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id as PageType);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-3 text-left rounded-lg mb-1 transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-800 border-r-4 border-slate-600'
                      : 'text-gray-600 hover:bg-stone-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {managerNavigation.find(item => item.id === currentPage)?.label}
            </h1>
            <div className="w-10" />
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* AI Assistant for Managers */}
      <AIAssistant
        isOpen={aiAssistantOpen}
        onToggle={() => setAiAssistantOpen(!aiAssistantOpen)}
        onMinimize={() => setAiAssistantOpen(false)}
        communityData={{
          communities: sampleData.communities,
          upcomingEvents: sampleData.upcomingEvents,
          recentActivity: [
            { type: 'posts', count: sampleData.communities.reduce((sum, c) => sum + c.recentPosts, 0) },
            { type: 'events', count: sampleData.upcomingEvents.length }
          ]
        }}
      />
    </div>
  );
};

export default CommunityPlatform;