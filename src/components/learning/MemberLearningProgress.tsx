'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, Clock, Calendar, PlayCircle, 
  BookOpen, Trophy, TrendingUp, AlertCircle, ChevronRight,
  Filter, Search
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  getUserTasks, 
  getTaskStats, 
  getTasksByStatus,
  getUpcomingTasks,
  completeTask,
  updateProgress,
  type LearningTask,
  type TaskStats
} from '@/lib/mock/mockLearningTasks';
import {
  getUserCourseProgress,
  getCourses,
  getUserProgressForCourse,
  completeLesson,
  type Course,
  type UserCourseProgress
} from '@/lib/mock/mockLearningCourses';

const MemberLearningProgress: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'tasks' | 'courses'>('tasks');
  const [tasks, setTasks] = useState<LearningTask[]>([]);
  const [stats, setStats] = useState<TaskStats>({ total: 0, completed: 0, inProgress: 0, overdue: 0, completionRate: 0 });
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseProgress, setCourseProgress] = useState<UserCourseProgress[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'not-started' | 'in-progress' | 'completed' | 'overdue'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    
    loadData();
  }, [currentUser, filterStatus]);

  const loadData = () => {
    if (!currentUser) return;

    // タスクデータ読み込み
    const allTasks = getUserTasks(currentUser.id);
    const taskStats = getTaskStats(currentUser.id);
    
    // フィルター適用
    let filteredTasks = allTasks;
    if (filterStatus !== 'all') {
      filteredTasks = getTasksByStatus(currentUser.id, filterStatus);
    }
    
    setTasks(filteredTasks);
    setStats(taskStats);

    // コースデータ読み込み
    const allCourses = getCourses();
    const userProgress = getUserCourseProgress(currentUser.id);
    
    setCourses(allCourses);
    setCourseProgress(userProgress);
  };

  const handleTaskComplete = (taskId: string) => {
    completeTask(taskId);
    loadData();
  };

  const handleLessonComplete = (courseId: string, lessonId: string) => {
    if (!currentUser) return;
    
    completeLesson(currentUser.id, courseId, lessonId, 30); // 仮の視聴時間30分
    loadData();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'video-learning': return <PlayCircle className="h-5 w-5" />;
      case 'assignment': return <BookOpen className="h-5 w-5" />;
      case 'event': return <Calendar className="h-5 w-5" />;
      default: return <Circle className="h-5 w-5" />;
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">学習進捗</h1>
          <p className="text-gray-600">あなたの学習状況とタスクを管理しましょう</p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">総タスク数</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">完了</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">進行中</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">達成率</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{stats.completionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* タブ切り替え */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'tasks'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            タスク一覧
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'courses'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            受講中のコース
          </button>
        </div>

        {/* タスク一覧 */}
        {activeTab === 'tasks' && (
          <div>
            {/* 検索とフィルター */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="タスクを検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                {['all', 'not-started', 'in-progress', 'completed', 'overdue'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status as any)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                      filterStatus === status
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {status === 'all' && 'すべて'}
                    {status === 'not-started' && '未着手'}
                    {status === 'in-progress' && '進行中'}
                    {status === 'completed' && '完了'}
                    {status === 'overdue' && '期限切れ'}
                  </button>
                ))}
              </div>
            </div>

            {/* タスクリスト */}
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl text-center">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">タスクがありません</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => task.status !== 'completed' && handleTaskComplete(task.id)}
                        className="mt-1"
                      >
                        {task.status === 'completed' ? (
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        ) : (
                          <Circle className="h-6 w-6 text-gray-400 hover:text-purple-600 transition-colors" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className={`text-lg font-semibold ${
                              task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'
                            }`}>
                              {task.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                            {task.priority === 'high' && '高'}
                            {task.priority === 'medium' && '中'}
                            {task.priority === 'low' && '低'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(task.category)}
                            <span>
                              {task.category === 'video-learning' && '動画学習'}
                              {task.category === 'assignment' && '課題'}
                              {task.category === 'event' && 'イベント'}
                              {task.category === 'practice' && '練習'}
                              {task.category === 'other' && 'その他'}
                            </span>
                          </div>
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(task.dueDate).toLocaleDateString('ja-JP')}</span>
                            </div>
                          )}
                          {task.timeSpent > 0 && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{task.timeSpent}分</span>
                            </div>
                          )}
                        </div>

                        {/* プログレスバー */}
                        {task.progress > 0 && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">進捗</span>
                              <span className="font-semibold text-purple-600">{task.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* タグ */}
                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {task.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* コース一覧 */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {courses.map((course) => {
              const progress = getUserProgressForCourse(currentUser.id, course.id);
              const isEnrolled = !!progress;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-6">
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-48 h-32 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                            <p className="text-gray-600 mt-1">{course.description}</p>
                          </div>
                          {course.isRequired && (
                            <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium border border-red-200">
                              必須
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
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

                        {isEnrolled && progress && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-gray-600">受講進捗</span>
                              <span className="font-semibold text-purple-600">{progress.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                style={{ width: `${progress.progress}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              {progress.completedLessons.length} / {course.lessons.length} レッスン完了
                            </p>
                          </div>
                        )}

                        {!isEnrolled && (
                          <button className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                            受講を開始する
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberLearningProgress;
