'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  UserCog, 
  User, 
  Plus,
  Bell,
  Search,
  Calendar,
  Users
} from 'lucide-react';
import SimpleFeed from '@/components/social/SimpleFeed';
import Profile from '@/components/profile/Profile';
import Store from '@/components/store/Store';
import TeamView from '@/components/member/TeamView';
import MemberTimeline from '@/components/member/MemberTimeline';
import EventDetailModal from '@/components/social/EventDetailModal';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getAllEvents, 
  joinEvent, 
  leaveEvent, 
  isUserJoined,
  getAllSurveys,
  getAllPosts
} from '@/lib/mock/mockSocialData';
import Link from 'next/link';

interface MemberAppProps {
  communities?: Array<{
    name: string;
    memberCount: number;
    recentPosts: number;
    upcomingEvents: number;
    activeRate: number;
  }>;
  upcomingEvents?: Array<{
    id: string;
    title: string;
    date: string;
    community: string;
    status?: string;
    participants?: number;
    capacity?: number;
    description?: string;
  }>;
  recentPosts?: Array<{
    id: string;
    title: string;
    author: string;
    community: string;
    timestamp: string;
  }>;
  onSwitchToManager?: () => void;
}

const MemberApp: React.FC<MemberAppProps> = ({
  communities,
  upcomingEvents,
  recentPosts,
  onSwitchToManager
}) => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'store' | 'team'>('timeline');
  const [profile, setProfile] = useState<{
    nickname?: string;
    diagnosis?: string;
  } | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [events, setEvents] = useState(getAllEvents());
  const [showTeamSelector, setShowTeamSelector] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [teamUnreadCounts, setTeamUnreadCounts] = useState<{[key: string]: number}>({});

  const STORAGE_KEY = 'cocoty_profile_v1';

  const refreshData = () => {
    setEvents(getAllEvents());
  };

  const handleJoinEvent = (eventId: string) => {
    if (!currentUser) return;
    
    if (isUserJoined(eventId, currentUser.id)) {
      leaveEvent(eventId, currentUser.id);
    } else {
      if (!joinEvent(eventId, currentUser.id)) {
        alert('定員に達しているため参加できません');
      }
    }
    refreshData();
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setProfile(parsed);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // ユーザーの所属チームを取得
  const getUserTeams = () => {
    if (!currentUser) return [];
    // mockSocialDataのcommunityMembersから所属チームを取得
    const teams = ['写真部', 'プログラミング部', '料理部', '音楽部', '読書会'];
    return teams.filter(team => {
      // 簡易的にuser_001は写真部と音楽部、user_002はプログラミング部に所属とする
      if (currentUser.id === 'user_001') return team === '写真部' || team === '音楽部';
      if (currentUser.id === 'user_002') return team === 'プログラミング部';
      if (currentUser.id === 'user_003') return team === '料理部';
      return team === '写真部'; // デフォルト
    });
  };

  // 未読メッセージ数と重要なお知らせ数を計算
  useEffect(() => {
    if (!currentUser) return;
    
    const teams = getUserTeams();
    const counts: {[key: string]: number} = {};
    
    teams.forEach(team => {
      // 重要なお知らせの数を計算
      const events = getAllEvents();
      const surveys = getAllSurveys();
      const posts = getAllPosts();
      
      const teamEventsCount = events.filter(event => event.community === team).length;
      const teamSurveysCount = surveys.filter(survey => survey.community === team).length;
      const managerPostsCount = posts.filter(post => 
        post.author.community === team && post.author.id === 'user_001'
      ).length;
      
      const importantCount = teamEventsCount + teamSurveysCount + managerPostsCount;
      counts[team] = importantCount;
    });
    
    setTeamUnreadCounts(counts);
  }, [currentUser, activeTab]);

  // チームタブクリック時の処理
  const handleTeamTabClick = () => {
    const teams = getUserTeams();
    
    if (teams.length === 0) {
      alert('所属しているチームがありません');
      return;
    }
    
    if (teams.length === 1) {
      // 1つだけなら直接遷移
      setSelectedTeam(teams[0]);
      setActiveTab('team');
    } else {
      // 複数ある場合はモーダル表示
      setShowTeamSelector(true);
    }
  };

  // チーム選択
  const handleSelectTeam = (team: string) => {
    setSelectedTeam(team);
    setShowTeamSelector(false);
    setActiveTab('team');
  };

  // 総未読数を計算
  const totalUnreadCount = Object.values(teamUnreadCounts).reduce((sum, count) => sum + count, 0);

  const getInitials = (name?: string) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-800">ココティ</h1>

            <div className="flex items-center space-x-4">
              <button className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <Search className="h-5 w-5" />
              </button>

              <button className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell className="h-5 w-5" />
              </button>

              {/* プロフィールリンク */}
              <Link 
                href="/profile"
                className="flex items-center space-x-2 p-2.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
              >
                {currentUser && (
                  <>
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium hidden md:inline">{currentUser.name}</span>
                  </>
                )}
                {!currentUser && <User className="h-5 w-5" />}
              </Link>

              {currentUser?.role === 'manager' && (
                <button 
                  onClick={onSwitchToManager}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors border border-gray-200"
                >
                  <UserCog className="h-4 w-4" />
                  <span className="text-sm font-medium hidden md:inline">管理画面</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Simple Tab Navigation */}
      <nav className="bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center space-x-2 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'timeline'
                  ? 'border-slate-600 text-slate-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>タイムライン</span>
            </button>
            
            <button
              onClick={() => setActiveTab('store')}
              className={`flex items-center space-x-2 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'store'
                  ? 'border-slate-600 text-slate-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>ストア</span>
            </button>
            
            <button
              onClick={handleTeamTabClick}
              className={`flex items-center space-x-2 py-4 text-sm font-medium border-b-2 transition-colors relative ${
                activeTab === 'team'
                  ? 'border-slate-600 text-slate-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>チーム</span>
              {totalUnreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5">
                  {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-6">
          {activeTab === 'timeline' ? (
          <MemberTimeline />
        ) : activeTab === 'store' ? (
          <div className="py-6">
            <h2 className="text-xl font-bold mb-4">ストア / ショーケース</h2>
            <Store />
          </div>
        ) : activeTab === 'team' && selectedTeam ? (
          <TeamView teamName={selectedTeam} />
        ) : null}
        </div>
      </main>

      <Profile isOpen={profileOpen} onClose={() => setProfileOpen(false)} onSave={() => {}} />
      
      {/* Event Detail Modal */}
      {selectedEventId && (
        <EventDetailModal
          eventId={selectedEventId}
          isOpen={!!selectedEventId}
          onClose={() => {
            setSelectedEventId(null);
            refreshData();
          }}
        />
      )}

      {/* チーム選択モーダル */}
      {showTeamSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">チームを選択</h2>
              <button
                onClick={() => setShowTeamSelector(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {getUserTeams().map((team) => (
                <button
                  key={team}
                  onClick={() => handleSelectTeam(team)}
                  className="w-full p-4 bg-gray-50 hover:bg-purple-50 rounded-xl text-left transition-all hover:shadow-md border border-gray-200 hover:border-purple-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{team}</p>
                        <p className="text-sm text-gray-500">タップして開く</p>
                      </div>
                    </div>
                    {teamUnreadCounts[team] > 0 && (
                      <span className="min-w-[24px] h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-2">
                        {teamUnreadCounts[team] > 99 ? '99+' : teamUnreadCounts[team]}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-110 flex items-center justify-center z-50">
        <Plus className="h-7 w-7" />
      </button>
    </div>
  );
};

export default MemberApp;