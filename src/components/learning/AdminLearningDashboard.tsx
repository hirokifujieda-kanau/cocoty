'use client';

import React, { useState, useEffect } from 'react';
import {
  Users, TrendingUp, BookOpen, CheckCircle2, AlertCircle,
  Search, Filter, Plus, Calendar, Clock, BarChart3
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  getAllTasks,
  getAllUserStats,
  createTask,
  type LearningTask,
  type TaskStats
} from '@/lib/mock/mockLearningTasks';
import {
  getCourses,
  getAllUserProgress,
  getCourseCompletionStats,
  type Course,
  type UserCourseProgress
} from '@/lib/mock/mockLearningCourses';
import { getAllUsers, type MockUser } from '@/lib/mock/mockAuth';

const AdminLearningDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'courses' | 'users'>('overview');
  const [allTasks, setAllTasks] = useState<LearningTask[]>([]);
  const [userStats, setUserStats] = useState<{ [userId: string]: TaskStats }>({});
  const [courses, setCourses] = useState<Course[]>([]);
  const [allProgress, setAllProgress] = useState<UserCourseProgress[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAllTasks(getAllTasks());
    setUserStats(getAllUserStats());
    setCourses(getCourses());
    setAllProgress(getAllUserProgress());
  };

  const users = getAllUsers();

  // 全体統計
  const totalUsers = users.length;
  const totalTasks = allTasks.length;
  const totalCourses = courses.length;
  const averageCompletion = Object.values(userStats).length > 0
    ? Math.round(
        Object.values(userStats).reduce((sum, stat) => sum + stat.completionRate, 0) /
        Object.values(userStats).length
      )
    : 0;

  // ユーザー別タスク情報
  const getUserTaskInfo = (userId: string) => {
    const tasks = allTasks.filter(t => t.userId === userId);
    const stats = userStats[userId] || { total: 0, completed: 0, inProgress: 0, overdue: 0, completionRate: 0 };
    return { tasks, stats };
  };

  // ユーザー別コース進捗
  const getUserCourseInfo = (userId: string) => {
    const progress = allProgress.filter(p => p.userId === userId);
    const completedCount = progress.filter(p => p.isCompleted).length;
    const inProgressCount = progress.filter(p => !p.isCompleted).length;
    return { progress, completedCount, inProgressCount };
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!currentUser || currentUser.role !== 'manager') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">アクセス権限がありません</h2>
          <p className="text-gray-600">この画面は管理者のみ閲覧できます</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">学習進捗管理ダッシュボード</h1>
          <p className="text-gray-600">全メンバーの学習状況を一元管理</p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">総メンバー数</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">総タスク数</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalTasks}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">提供コース数</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalCourses}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">平均達成率</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{averageCompletion}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* タブ */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            概要
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'users'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            メンバー別進捗
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'courses'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            コース統計
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'tasks'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            全タスク
          </button>
        </div>

        {/* 概要タブ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">進捗上位メンバー</h3>
              <div className="space-y-3">
                {users
                  .map(user => ({
                    user,
                    stats: userStats[user.id] || { total: 0, completed: 0, inProgress: 0, overdue: 0, completionRate: 0 }
                  }))
                  .sort((a, b) => b.stats.completionRate - a.stats.completionRate)
                  .slice(0, 5)
                  .map(({ user, stats }) => (
                    <div key={user.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">
                          {stats.completed} / {stats.total} タスク完了
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{stats.completionRate}%</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">注意が必要なメンバー</h3>
              <div className="space-y-3">
                {users
                  .map(user => ({
                    user,
                    stats: userStats[user.id] || { total: 0, completed: 0, inProgress: 0, overdue: 0, completionRate: 0 }
                  }))
                  .filter(({ stats }) => stats.overdue > 0 || stats.completionRate < 30)
                  .slice(0, 5)
                  .map(({ user, stats }) => (
                    <div key={user.id} className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-200">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-red-600">
                          期限切れタスク: {stats.overdue}件 | 達成率: {stats.completionRate}%
                        </p>
                      </div>
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                  ))}
                {users.filter(user => {
                  const stats = userStats[user.id] || { total: 0, completed: 0, inProgress: 0, overdue: 0, completionRate: 0 };
                  return stats.overdue > 0 || stats.completionRate < 30;
                }).length === 0 && (
                  <p className="text-gray-500 text-center py-4">注意が必要なメンバーはいません</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* メンバー別進捗タブ */}
        {activeTab === 'users' && (
          <div>
            <div className="mb-6 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="メンバーを検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map(user => {
                const { stats } = getUserTaskInfo(user.id);
                const { completedCount, inProgressCount } = getUserCourseInfo(user.id);

                return (
                  <div
                    key={user.id}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">タスク達成率</span>
                        <span className="font-bold text-blue-600">{stats.completionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                          style={{ width: `${stats.completionRate}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-green-50 p-2 rounded-lg text-center">
                          <p className="text-green-600 font-semibold">{stats.completed}</p>
                          <p className="text-gray-600 text-xs">完了</p>
                        </div>
                        <div className="bg-blue-50 p-2 rounded-lg text-center">
                          <p className="text-blue-600 font-semibold">{stats.inProgress}</p>
                          <p className="text-gray-600 text-xs">進行中</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-sm text-gray-600 mb-2">コース受講状況</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">完了: {completedCount}</span>
                          <span className="text-gray-700">受講中: {inProgressCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* コース統計タブ */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {courses.map(course => {
              const stats = getCourseCompletionStats(course.id);

              return (
                <div
                  key={course.id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                >
                  <div className="flex items-start gap-6 mb-4">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-48 h-32 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-gray-600 mb-3">{course.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{course.lessons.length}レッスン</span>
                        <span>•</span>
                        <span>{course.totalDuration}分</span>
                        <span>•</span>
                        <span>
                          {course.level === 'beginner' && '初級'}
                          {course.level === 'intermediate' && '中級'}
                          {course.level === 'advanced' && '上級'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">受講者数</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.totalEnrolled}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">完了者数</p>
                      <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">受講中</p>
                      <p className="text-2xl font-bold text-purple-600">{stats.inProgress}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">平均進捗</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.averageProgress}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 全タスクタブ */}
        {activeTab === 'tasks' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">全タスク一覧</h3>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                <Plus className="h-5 w-5" />
                タスクを割り当て
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">タスク</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">メンバー</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">カテゴリ</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ステータス</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">進捗</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">期限</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {allTasks.slice(0, 20).map(task => {
                      const user = users.find(u => u.id === task.userId);

                      return (
                        <tr key={task.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-900">{task.title}</p>
                            <p className="text-sm text-gray-600">{task.description.slice(0, 50)}...</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {user && (
                                <>
                                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                                  <span className="text-sm text-gray-900">{user.name}</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">
                              {task.category === 'video-learning' && '動画学習'}
                              {task.category === 'assignment' && '課題'}
                              {task.category === 'event' && 'イベント'}
                              {task.category === 'practice' && '練習'}
                              {task.category === 'other' && 'その他'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              task.status === 'completed' ? 'bg-green-100 text-green-700' :
                              task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                              task.status === 'overdue' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {task.status === 'completed' && '完了'}
                              {task.status === 'in-progress' && '進行中'}
                              {task.status === 'overdue' && '期限切れ'}
                              {task.status === 'not-started' && '未着手'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${task.progress}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-700">{task.progress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">
                              {task.dueDate ? new Date(task.dueDate).toLocaleDateString('ja-JP') : '-'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLearningDashboard;
