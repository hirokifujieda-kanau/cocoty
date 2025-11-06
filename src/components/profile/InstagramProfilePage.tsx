'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings, Grid, Bookmark, Sparkles, TrendingUp, Heart as HeartIcon, Users, Calendar, BookOpen, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PH1, PH2, PH3 } from '@/lib/placeholders';
import DailyTarot from '@/components/fortune/DailyTarot';
import SeasonalDiagnosisHub from '@/components/fortune/SeasonalDiagnosisHub';
import MentalStatsAdmin from '@/components/fortune/MentalStatsAdmin';
import ProfileSettings from '@/components/profile/ProfileSettings';
import ProfileEditModal from '@/components/profile/ProfileEditModal';
import ShareProfileModal from '@/components/profile/ShareProfileModal';
import { getUserTasks, getTaskStats } from '@/lib/mock/mockLearningTasks';
import { getUserCourseProgress } from '@/lib/mock/mockLearningCourses';

const InstagramProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'fortune'>('posts');
  
  // Fortune機能の状態
  const [showDailyTarot, setShowDailyTarot] = useState(false);
  const [showSeasonalDiagnosis, setShowSeasonalDiagnosis] = useState(false);
  const [showMentalStats, setShowMentalStats] = useState(false);
  
  // プロフィール機能の状態
  const [showSettings, setShowSettings] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showShareProfile, setShowShareProfile] = useState(false);
  
  // アクティビティカレンダー用の状態
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activityData, setActivityData] = useState<{ [key: string]: any[] }>({});

  // 過去28日間のアクティビティデータを生成
  useEffect(() => {
    const generateActivityData = () => {
      const data: { [key: string]: any[] } = {};
      const today = new Date();
      
      for (let i = 0; i < 28; i++) {
        const date = new Date();
        date.setDate(today.getDate() - (27 - i));
        const dateKey = date.toDateString();
        
        // ランダムにアクティビティを生成
        const activityCount = Math.random() > 0.6 ? Math.floor(Math.random() * 4) : 0;
        
        if (activityCount > 0) {
          data[dateKey] = Array.from({ length: activityCount }, (_, j) => ({
            id: `${dateKey}-${j}`,
            type: ['upload', 'event', 'comment'][j % 3],
            text: ['写真を3枚アップロード', 'イベントに参加', 'コメントを投稿'][j % 3],
            time: `${10 + j}:00`,
            image: j % 3 === 0 ? [PH1, PH2, PH3][j % 3] : undefined
          }));
        }
      }
      
      setActivityData(data);
    };
    
    generateActivityData();
  }, []);

  // サンプル投稿データ（6枚表示）
  const allPosts = Array.from({ length: 24 }, (_, i) => ({
    id: `post-${i}`,
    image: [PH1, PH2, PH3][i % 3],
    likes: Math.floor(Math.random() * 100) + 10,
    comments: Math.floor(Math.random() * 20) + 1
  }));

  const displayedPosts = allPosts.slice(0, 6);
  const hasMorePosts = allPosts.length > 6;

  // 過去28日間の日付配列
  const last28Days = Array.from({ length: 28 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (27 - i));
    return date;
  });

  // アクティビティ合計
  const totalActivities = Object.values(activityData).reduce((sum, activities) => sum + activities.length, 0);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold">{currentUser.name}</h1>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Profile Section */}
        <div className="px-4 py-6">
          <div className="flex items-start gap-6 mb-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-2 ring-gray-200">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1">
              <div className="flex items-center gap-6 mb-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-semibold">{displayedPosts.length}</div>
                  <div className="text-xs sm:text-sm text-gray-500">投稿</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-semibold">245</div>
                  <div className="text-xs sm:text-sm text-gray-500">フォロワー</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-semibold">180</div>
                  <div className="text-xs sm:text-sm text-gray-500">フォロー中</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-sm transition-colors"
                >
                  プロフィールを編集
                </button>
                <button
                  onClick={() => setShowShareProfile(true)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-sm transition-colors"
                >
                  プロフィールをシェア
                </button>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <div className="font-semibold">{currentUser.name}</div>
            <div className="text-sm">{currentUser.bio}</div>
          </div>

          {/* 学習進捗サマリー - プロフィール内 */}
          {currentUser && (() => {
            const stats = getTaskStats(currentUser.id);
            const courseProgress = getUserCourseProgress(currentUser.id);
            
            return (
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-2xl border border-purple-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    学習進捗
                  </h3>
                  <button
                    onClick={() => router.push('/learning')}
                    className="text-sm text-purple-600 font-semibold hover:text-purple-700"
                  >
                    詳細 →
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.completionRate}%</div>
                    <div className="text-xs text-gray-600 mt-1">達成率</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                    <div className="text-xs text-gray-600 mt-1">完了</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                    <div className="text-xs text-gray-600 mt-1">進行中</div>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-700">総合進捗</span>
                    <span className="font-bold text-purple-600">{stats.completed} / {stats.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${stats.completionRate}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                    <span>📚 {courseProgress.length}コース受講中</span>
                    {stats.overdue > 0 && (
                      <span className="text-red-600 font-semibold">⚠️ 期限切れ {stats.overdue}件</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Highlights */}
          <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
            <button
              onClick={() => setShowDailyTarot(true)}
              className="flex flex-col items-center gap-2 flex-shrink-0"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="text-xs text-gray-600">タロット</div>
            </button>
            <button
              onClick={() => setShowSeasonalDiagnosis(true)}
              className="flex flex-col items-center gap-2 flex-shrink-0"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-400 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-2xl">
                  🌸
                </div>
              </div>
              <div className="text-xs text-gray-600">季節診断</div>
            </button>
            <button
              onClick={() => setShowMentalStats(true)}
              className="flex flex-col items-center gap-2 flex-shrink-0"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="text-xs text-gray-600">メンタル</div>
            </button>
            <button
              onClick={() => router.push('/learning')}
              className="flex flex-col items-center gap-2 flex-shrink-0"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="text-xs text-gray-600">学習</div>
            </button>
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="text-xs text-gray-600">イベント</div>
            </div>
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-violet-400 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div className="text-xs text-gray-600">写真部</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 border-t-2 transition-colors ${
                activeTab === 'posts'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <Grid className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase hidden sm:inline">投稿</span>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 border-t-2 transition-colors ${
                activeTab === 'saved'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <Bookmark className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase hidden sm:inline">保存済み</span>
            </button>
            <button
              onClick={() => setActiveTab('fortune')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 border-t-2 transition-colors ${
                activeTab === 'fortune'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase hidden sm:inline">占い</span>
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="px-1">
          {activeTab === 'posts' && (
            <>
              <div className="grid grid-cols-3 gap-1">
                {displayedPosts.map((post) => (
                  <div key={post.id} className="aspect-square relative group cursor-pointer">
                    <img
                      src={post.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center gap-4">
                      <div className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <HeartIcon className="h-5 w-5 fill-white" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <span>💬</span>
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {hasMorePosts && (
                <div className="mt-4 p-6 text-center border-t">
                  <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                    すべての投稿を見る →
                  </button>
                </div>
              )}

              {/* アクティビティカレンダー */}
              <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">活動カレンダー</h4>
                    <div className="text-xs text-gray-500 mt-1">過去28日間の活動履歴</div>
                  </div>
                  <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
                    合計: {totalActivities}
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {last28Days.map((date, idx) => {
                    const dateKey = date.toDateString();
                    const activities = activityData[dateKey] || [];
                    const isSelected = selectedDate === dateKey;
                    const hasActivity = activities.length > 0;
                    
                    return (
                      <button 
                        key={idx} 
                        onClick={() => setSelectedDate(isSelected ? null : dateKey)}
                        className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-all cursor-pointer
                          ${hasActivity ? 'bg-purple-200 hover:bg-purple-300 text-purple-900' : 'bg-white hover:bg-gray-100 text-gray-500'}
                          ${isSelected ? 'ring-2 ring-purple-500 ring-offset-2' : ''}
                        `}
                        title={`${date.toLocaleDateString('ja-JP')}: ${activities.length} 活動`}
                      >
                        <div className="font-medium">{date.getDate()}</div>
                        {hasActivity && <div className="text-xs">●</div>}
                      </button>
                    );
                  })}
                </div>

                {/* 選択された日のアクティビティ詳細 */}
                {selectedDate && (
                  <div className="mt-4 p-4 bg-white rounded-xl border border-purple-200">
                    <h5 className="font-semibold text-gray-900 mb-3">
                      {new Date(selectedDate).toLocaleDateString('ja-JP', { 
                        month: 'long', 
                        day: 'numeric', 
                        weekday: 'short' 
                      })} のアクティビティ
                    </h5>
                    <div className="space-y-2">
                      {activityData[selectedDate]?.length > 0 ? (
                        activityData[selectedDate].map((activity: any) => (
                          <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white flex-shrink-0 flex items-center justify-center border">
                              {activity.image ? (
                                <img src={activity.image} alt="activity" className="w-full h-full object-cover" />
                              ) : (
                                <div className="text-lg">
                                  {activity.type === 'upload' ? '📸' : 
                                   activity.type === 'event' ? '🎯' : '💬'}
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-gray-900">{activity.text}</div>
                                <div className="text-xs text-gray-500">{activity.time}</div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 text-center py-4">この日はアクティビティがありませんでした</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'saved' && (
            <div className="py-20 text-center">
              <Bookmark className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">保存済みの投稿はありません</h3>
              <p className="text-gray-500 text-sm">気に入った投稿を保存しましょう</p>
            </div>
          )}

          {activeTab === 'fortune' && (
            <div className="py-6 px-4">
              <div className="space-y-4">
                {/* タロット占い */}
                <button
                  onClick={() => setShowDailyTarot(true)}
                  className="w-full p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-gray-900">今日のタロット占い</div>
                      <div className="text-sm text-gray-600">1日1回引けます</div>
                    </div>
                  </div>
                </button>

                {/* 季節診断 */}
                <button
                  onClick={() => setShowSeasonalDiagnosis(true)}
                  className="w-full p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-100 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-2xl">
                      🌸
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-gray-900">季節の性格診断</div>
                      <div className="text-sm text-gray-600">あなたはどの季節タイプ？</div>
                    </div>
                  </div>
                </button>

                {/* メンタル統計 */}
                <button
                  onClick={() => setShowMentalStats(true)}
                  className="w-full p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-gray-900">メンタル統計</div>
                      <div className="text-sm text-gray-600">心の健康度をチェック</div>
                    </div>
                  </div>
                </button>

                {/* 季節診断履歴 */}
                <div className="mt-6 p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-100">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">🌺</span>
                    季節診断の履歴
                  </h4>
                  <div className="space-y-3">
                    <div className="p-4 bg-white rounded-xl border border-amber-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">🌸</span>
                        <span className="text-xs text-gray-500">2024年11月1日</span>
                      </div>
                      <div className="font-semibold text-gray-900">春タイプ</div>
                      <div className="text-sm text-gray-600 mt-1">明るく活発で新しいことに挑戦するのが好き</div>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-amber-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">☀️</span>
                        <span className="text-xs text-gray-500">2024年10月15日</span>
                      </div>
                      <div className="font-semibold text-gray-900">夏タイプ</div>
                      <div className="text-sm text-gray-600 mt-1">エネルギッシュで情熱的、リーダーシップがある</div>
                    </div>
                  </div>
                </div>

                {/* 今月のTODO - 実データ連携 */}
                <div 
                  className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => router.push('/learning')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      <span className="text-xl">✅</span>
                      学習タスク & TODO
                    </h4>
                    <span className="text-sm text-green-600 font-semibold">詳細を見る →</span>
                  </div>
                  
                  {currentUser && (() => {
                    const tasks = getUserTasks(currentUser.id);
                    const stats = getTaskStats(currentUser.id);
                    const recentTasks = tasks.slice(0, 3);
                    
                    return (
                      <>
                        <div className="space-y-2 mb-4">
                          {recentTasks.map(task => (
                            <div key={task.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                              {task.status === 'completed' ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                              ) : (
                                <div className="h-5 w-5 rounded border-2 border-gray-300 flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <span className={`text-sm block truncate ${
                                  task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                                }`}>
                                  {task.title}
                                </span>
                                {task.progress > 0 && task.status !== 'completed' && (
                                  <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                                    <div 
                                      className="bg-green-500 h-1 rounded-full" 
                                      style={{ width: `${task.progress}%` }}
                                    />
                                  </div>
                                )}
                              </div>
                              {task.category === 'video-learning' && (
                                <BookOpen className="h-4 w-4 text-green-600 flex-shrink-0" />
                              )}
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">達成率</span>
                          <span className="font-bold text-green-600">{stats.completionRate}%</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full" 
                            style={{ width: `${stats.completionRate}%` }}
                          />
                        </div>
                        <div className="mt-3 text-xs text-gray-600 text-center">
                          {stats.completed} / {stats.total} タスク完了
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fortune Modals */}
      {showDailyTarot && (
        <DailyTarot 
          isOpen={showDailyTarot}
          onClose={() => setShowDailyTarot(false)}
          userId={currentUser.id}
          userName={currentUser.name}
        />
      )}
      
      {showSeasonalDiagnosis && (
        <SeasonalDiagnosisHub 
          isOpen={showSeasonalDiagnosis}
          onClose={() => setShowSeasonalDiagnosis(false)}
          userId={currentUser.id}
        />
      )}
      
      {showMentalStats && (
        <MentalStatsAdmin 
          isOpen={showMentalStats}
          onClose={() => setShowMentalStats(false)}
          userId={currentUser.id}
        />
      )}
      
      {/* Profile Modals */}
      <ProfileSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      
      <ProfileEditModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />
      
      <ShareProfileModal
        isOpen={showShareProfile}
        onClose={() => setShowShareProfile(false)}
      />
    </div>
  );
};

export default InstagramProfilePage;
