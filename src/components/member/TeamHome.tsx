'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Pin, Clock, Calendar, FileText, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getTeamMembers, 
  type TeamMember,
  getAllEvents,
  getAllSurveys,
  getAllPosts
} from '@/lib/mock/mockSocialData';
import EventDetailModal from '@/components/social/EventDetailModal';
import SurveyAnswerModal from '@/components/social/SurveyAnswerModal';
import PostDetailModal from '@/components/social/PostDetailModal';
import TeamTimeline from './TeamTimeline';

interface TeamHomeProps {
  teamName: string;
}

const TeamHome: React.FC<TeamHomeProps> = ({ teamName }) => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [importantItems, setImportantItems] = useState<Array<{
    id: string;
    type: 'event' | 'survey' | 'post';
    title: string;
    date: string;
    deadline?: string;
    icon: any;
  }>>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [showAllItems, setShowAllItems] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'checked'>('all');
  const itemsPerPage = 10;

  useEffect(() => {
    if (teamName) {
      const members = getTeamMembers(teamName);
      setTeamMembers(members);
      loadImportantItems(teamName);
      loadCheckedItems(teamName);
    }
  }, [teamName]);

  const loadCheckedItems = (team: string) => {
    if (!currentUser) return;
    const storageKey = 'team_' + team + '_checked_' + currentUser.id;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setCheckedItems(new Set(JSON.parse(stored)));
    }
  };

  const markAsChecked = (itemId: string) => {
    if (!currentUser) return;
    const newChecked = new Set(checkedItems);
    newChecked.add(itemId);
    setCheckedItems(newChecked);
    
    const storageKey = 'team_' + teamName + '_checked_' + currentUser.id;
    localStorage.setItem(storageKey, JSON.stringify(Array.from(newChecked)));
  };

  const loadImportantItems = (team: string) => {
    const events = getAllEvents();
    const surveys = getAllSurveys();
    const posts = getAllPosts();

    const teamEvents = events
      .filter(event => event.community === team)
      .map(event => ({
        id: event.id,
        type: 'event' as const,
        title: event.title,
        date: event.date,
        deadline: event.date,
        icon: Calendar
      }));

    const teamSurveys = surveys
      .filter(survey => survey.community === team)
      .map(survey => ({
        id: survey.id,
        type: 'survey' as const,
        title: survey.title,
        date: survey.timestamp,
        deadline: '回答期限: 未設定',
        icon: FileText
      }));

    const managerPosts = posts
      .filter(post => post.author.community === team && post.author.id === 'user_001')
      .map(post => ({
        id: post.id,
        type: 'post' as const,
        title: post.content.text.substring(0, 50) + '...',
        date: post.timestamp,
        icon: MessageCircle
      }));

    const allImportant = [...teamEvents, ...teamSurveys, ...managerPosts]
      .sort((a, b) => {
        // 簡易的なソート（実際はタイムスタンプで）
        return 0;
      });

    setImportantItems(allImportant);
  };

  const handleItemClick = (item: { id: string; type: 'event' | 'survey' | 'post' }) => {
    markAsChecked(item.id);
    
    if (item.type === 'event') {
      setSelectedEventId(item.id);
    } else if (item.type === 'survey') {
      setSelectedSurveyId(item.id);
    } else if (item.type === 'post') {
      setSelectedPostId(item.id);
    }
  };

  const teamInfo = {
    '写真部': {
      description: '写真撮影を通じて表現力を磨き、思い出を共有するコミュニティです。',
      color: 'from-slate-500 to-slate-600'
    },
    'プログラミング部': {
      description: 'プログラミングスキルを学び、チームでプロジェクトを進めるコミュニティです。',
      color: 'from-stone-600 to-stone-700'
    },
    '料理部': {
      description: '料理を通じて創造性を育み、美味しい時間を共有するコミュニティです。',
      color: 'from-amber-600 to-amber-700'
    },
    '音楽部': {
      description: '音楽を楽しみ、演奏技術を高め合うコミュニティです。',
      color: 'from-purple-600 to-purple-700'
    },
    '読書会': {
      description: '本を読み、意見を交換し、知識を深めるコミュニティです。',
      color: 'from-indigo-600 to-indigo-700'
    }
  };

  const currentTeamInfo = teamInfo[teamName as keyof typeof teamInfo] || teamInfo['写真部'];
  const headerColorClass = 'bg-gradient-to-r ' + currentTeamInfo.color + ' rounded-2xl p-8 text-white shadow-lg';

  return (
    <div className="space-y-6">
      <div className={headerColorClass}>
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
            <Users className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{teamName}</h1>
            <p className="text-white/90 mt-1">{teamMembers.length}人のメンバー</p>
          </div>
        </div>
        <p className="text-white/90 text-lg">{currentTeamInfo.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* タイムライン */}
          <TeamTimeline teamName={teamName} />
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* メンバー */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">メンバー</h2>
              <span className="text-sm text-gray-500">{teamMembers.length}人</span>
            </div>
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => {
                    const profileUrl = '/profile?userId=' + member.id;
                    router.push(profileUrl);
                  }}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-50 hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-purple-200"
                >
                  <div className="relative flex-shrink-0">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    {member.role === 'manager' && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-xs">★</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {member.name}
                      </p>
                      {member.role === 'manager' && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                          管理者
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{member.diagnosis}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* お知らせ */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Pin className="h-5 w-5 text-amber-600" />
                <h2 className="text-xl font-bold text-gray-900">お知らせ</h2>
              </div>
              <span className="text-xs text-gray-500">見逃し防止</span>
            </div>

            {/* タブナビゲーション */}
            <div className="flex space-x-2 mb-4 border-b border-gray-200">
              <button
                onClick={() => {
                  setActiveTab('all');
                  setCurrentPage(1);
                }}
                className={
                  'px-4 py-2 text-sm font-medium border-b-2 transition-colors ' +
                  (activeTab === 'all'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700')
                }
              >
                すべて
                <span className="ml-1 text-xs">({importantItems.length})</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('unread');
                  setCurrentPage(1);
                }}
                className={
                  'px-4 py-2 text-sm font-medium border-b-2 transition-colors ' +
                  (activeTab === 'unread'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700')
                }
              >
                未確認
                <span className="ml-1 text-xs">
                  ({importantItems.filter(item => !checkedItems.has(item.id)).length})
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('checked');
                  setCurrentPage(1);
                }}
                className={
                  'px-4 py-2 text-sm font-medium border-b-2 transition-colors ' +
                  (activeTab === 'checked'
                    ? 'border-gray-600 text-gray-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700')
                }
              >
                確認済み
                <span className="ml-1 text-xs">
                  ({importantItems.filter(item => checkedItems.has(item.id)).length})
                </span>
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              管理者の投稿、イベント、アンケートなどの重要事項をピックアップ
            </p>

            {importantItems.length > 0 ? (
              <>
                <div className="space-y-2">
                  {(() => {
                    // タブによるフィルタリング
                    let filteredItems = importantItems;
                    if (activeTab === 'unread') {
                      filteredItems = importantItems.filter(item => !checkedItems.has(item.id));
                    } else if (activeTab === 'checked') {
                      filteredItems = importantItems.filter(item => checkedItems.has(item.id));
                    }

                    const displayItems = showAllItems ? filteredItems : filteredItems.slice(0, 5);
                    const startIndex = (currentPage - 1) * itemsPerPage;
                    const endIndex = startIndex + itemsPerPage;
                    const paginatedItems = showAllItems ? displayItems.slice(startIndex, endIndex) : displayItems;
                    const totalPages = showAllItems ? Math.ceil(filteredItems.length / itemsPerPage) : 1;

                    return (
                      <>
                        {paginatedItems.map((item) => {
                          const IconComponent = item.icon;
                          let bgColor = 'bg-blue-50';
                          let borderColor = 'border-blue-200';
                          let textColor = 'text-blue-700';
                          const isChecked = checkedItems.has(item.id);
                          
                          if (item.type === 'event') {
                            bgColor = 'bg-green-50';
                            borderColor = 'border-green-200';
                            textColor = 'text-green-700';
                          } else if (item.type === 'survey') {
                            bgColor = 'bg-purple-50';
                            borderColor = 'border-purple-200';
                            textColor = 'text-purple-700';
                          }

                          if (isChecked) {
                            bgColor = 'bg-gray-50';
                            borderColor = 'border-gray-200';
                          }
                          
                          return (
                            <div
                              key={item.id}
                              onClick={() => handleItemClick(item)}
                              className={'p-3 rounded-lg border transition-all hover:shadow-md cursor-pointer ' + bgColor + ' ' + borderColor}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={'p-2 rounded-lg ' + bgColor}>
                                  <IconComponent className={'h-4 w-4 ' + (isChecked ? 'text-gray-400' : textColor)} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1 flex-wrap">
                                    <span className={'text-xs font-semibold uppercase ' + (isChecked ? 'text-gray-500' : textColor)}>
                                      {item.type === 'event' ? 'イベント' : item.type === 'survey' ? 'アンケート' : '管理者投稿'}
                                    </span>
                                    {isChecked ? (
                                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold">
                                        確認済み
                                      </span>
                                    ) : (
                                      <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
                                        未確認
                                      </span>
                                    )}
                                  </div>
                                  <p className={'text-sm font-medium line-clamp-2 ' + (isChecked ? 'text-gray-500' : 'text-gray-900')}>
                                    {item.title}
                                  </p>
                                  <div className="flex items-center space-x-3 mt-2 text-xs">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3 text-gray-400" />
                                      <span className="text-gray-500">{item.date}</span>
                                    </div>
                                    {item.deadline && (
                                      <div className="flex items-center space-x-1">
                                        <span className="text-orange-600 font-semibold">📅 {item.deadline}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* ページネーション */}
                        {showAllItems && totalPages > 1 && (
                          <div className="flex items-center justify-center space-x-2 mt-4 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              disabled={currentPage === 1}
                              className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              前へ
                            </button>
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                  key={page}
                                  onClick={() => setCurrentPage(page)}
                                  className={
                                    'w-8 h-8 text-sm rounded-md transition-colors ' +
                                    (page === currentPage
                                      ? 'bg-blue-600 text-white font-bold'
                                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700')
                                  }
                                >
                                  {page}
                                </button>
                              ))}
                            </div>
                            <button
                              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                              disabled={currentPage === totalPages}
                              className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              次へ
                            </button>
                            <span className="text-xs text-gray-500 ml-2">
                              {currentPage} / {totalPages} ページ
                            </span>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
                
                {(() => {
                  // タブによるフィルタリング
                  let filteredItems = importantItems;
                  if (activeTab === 'unread') {
                    filteredItems = importantItems.filter(item => !checkedItems.has(item.id));
                  } else if (activeTab === 'checked') {
                    filteredItems = importantItems.filter(item => checkedItems.has(item.id));
                  }

                  return filteredItems.length > 5 && (
                    <button
                      onClick={() => {
                        setShowAllItems(!showAllItems);
                        setCurrentPage(1);
                      }}
                      className="w-full mt-3 py-3 text-sm text-blue-600 hover:text-blue-800 font-semibold hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                    >
                      {showAllItems ? '最初の5件のみ表示 ↑' : 'すべて表示 (' + filteredItems.length + '件) ↓'}
                    </button>
                  );
                })()}
              </>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Pin className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">現在、お知らせはありません</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEventId && (
        <EventDetailModal
          eventId={selectedEventId}
          isOpen={!!selectedEventId}
          onClose={() => {
            setSelectedEventId(null);
            loadImportantItems(teamName);
          }}
        />
      )}

      {/* Survey Answer Modal */}
      {selectedSurveyId && (
        <SurveyAnswerModal
          surveyId={selectedSurveyId}
          isOpen={!!selectedSurveyId}
          onClose={() => {
            setSelectedSurveyId(null);
            loadImportantItems(teamName);
          }}
        />
      )}

      {/* Post Detail Modal */}
      {selectedPostId && (
        <PostDetailModal
          postId={selectedPostId}
          isOpen={!!selectedPostId}
          onClose={() => {
            setSelectedPostId(null);
            loadImportantItems(teamName);
          }}
        />
      )}
    </div>
  );
};

export default TeamHome;
