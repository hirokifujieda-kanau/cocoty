'use client';

import React, { useState, useEffect } from 'react';
import { Users, Bell, MessageSquare, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserCommunities } from '@/lib/mock/mockSocialData';
import TeamHome from '@/components/member/TeamHome';

interface TeamViewProps {
  teamName?: string;
}

const TeamView: React.FC<TeamViewProps> = ({ teamName }) => {
  const { currentUser } = useAuth();
  const [myTeams, setMyTeams] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');

  // ユーザーの所属チーム一覧を取得
  useEffect(() => {
    if (currentUser) {
      const communities = getUserCommunities(currentUser.id);
      setMyTeams(communities);
      
      // teamNameが渡されていればそれを使用、なければ最初のチームを自動選択
      if (teamName) {
        setSelectedTeam(teamName);
      } else if (communities.length > 0) {
        setSelectedTeam(communities[0]);
      }
    }
  }, [currentUser, teamName]);

  // 各チームの新着メッセージ数（mockデータ）
  const getUnreadCount = (teamName: string): number => {
    const unreadCounts: { [key: string]: number } = {
      '写真部': 3,
      'プログラミング部': 0,
      '料理部': 5,
      '音楽部': 1,
      '読書会': 0,
    };
    return unreadCounts[teamName] || 0;
  };

  const teamColors: { [key: string]: string } = {
    '写真部': 'from-slate-500 to-slate-600',
    'プログラミング部': 'from-stone-600 to-stone-700',
    '料理部': 'from-amber-600 to-amber-700',
    '音楽部': 'from-purple-600 to-purple-700',
    '読書会': 'from-indigo-600 to-indigo-700',
  };

  if (selectedTeam) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* チーム選択ナビゲーション */}
        <div className="mb-6 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-3">
            <Users className="h-5 w-5 text-gray-600" />
            <h2 className="font-bold text-gray-900">所属チーム</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {myTeams.map((team) => {
              const unreadCount = getUnreadCount(team);
              const isSelected = team === selectedTeam;
              const colorClass = teamColors[team] || 'from-gray-500 to-gray-600';
              
              return (
                <button
                  key={team}
                  onClick={() => setSelectedTeam(team)}
                  className={`relative flex-shrink-0 px-6 py-3 rounded-xl font-semibold transition-all ${
                    isSelected
                      ? `bg-gradient-to-r ${colorClass} text-white shadow-lg scale-105`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{team}</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 選択されたチームの詳細 */}
        <TeamHome teamName={selectedTeam} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="text-center py-12 text-gray-400">
          <Users className="h-16 w-16 mx-auto mb-3 opacity-50" />
          <p className="text-base mb-2">所属しているチームがありません</p>
          <p className="text-sm">コミュニティに参加してチームメンバーと交流しましょう</p>
        </div>
      </div>
    </div>
  );
};

export default TeamView;
