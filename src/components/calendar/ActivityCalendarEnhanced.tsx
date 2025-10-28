'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Flame, TrendingUp } from 'lucide-react';

interface DayActivity {
  date: string;
  count: number;
  activities: ActivityDetail[];
  isGoalAchievement?: boolean;
  isPlanned?: boolean;
}

interface ActivityDetail {
  id: string;
  type: 'upload' | 'event' | 'comment' | 'achievement';
  text: string;
  time: string;
  image?: string;
}

interface ActivityCalendarEnhancedProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const ACTIVITY_KEY = 'cocoty_activity_calendar_v1';
const STREAK_KEY = 'cocoty_streak_v1';

const ActivityCalendarEnhanced: React.FC<ActivityCalendarEnhancedProps> = ({
  isOpen,
  onClose,
  userId
}) => {
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activities, setActivities] = useState<Map<string, DayActivity>>(new Map());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    loadActivities();
    calculateStreaks();
  }, [isOpen, userId]);

  const loadActivities = () => {
    const activitiesMap = new Map<string, DayActivity>();
    const today = new Date();

    // 過去90日分のダミーデータを生成
    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];

      // ランダムなアクティビティ数（0-5）
      const count = Math.random() > 0.3 ? Math.floor(Math.random() * 5) + 1 : 0;
      
      if (count > 0) {
        const activities: ActivityDetail[] = [];
        for (let j = 0; j < count; j++) {
          const types: ActivityDetail['type'][] = ['upload', 'event', 'comment', 'achievement'];
          const type = types[Math.floor(Math.random() * types.length)];
          const hour = 9 + (j * 2) + Math.floor(Math.random() * 2);
          const minute = Math.floor(Math.random() * 60);

          activities.push({
            id: `${dateKey}-${j}`,
            type,
            text: type === 'upload' ? `${j + 1}枚の写真をアップロード` :
                  type === 'event' ? 'ワークショップに参加' :
                  type === 'comment' ? 'メンバーの投稿にコメント' :
                  '月間目標を達成！',
            time: `${hour}:${String(minute).padStart(2, '0')}`
          });
        }

        // 目標達成日をランダムに設定
        const isGoalAchievement = i === 30 || i === 60; // 30日前と60日前

        activitiesMap.set(dateKey, {
          date: dateKey,
          count,
          activities,
          isGoalAchievement
        });
      }
    }

    // 今後7日分の予定を追加
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];

      if (Math.random() > 0.5) {
        activitiesMap.set(dateKey, {
          date: dateKey,
          count: 0,
          activities: [{
            id: `${dateKey}-planned`,
            type: 'event',
            text: i === 2 ? '撮影会（予定）' :
                  i === 5 ? '写真展見学（予定）' :
                  'オンライン勉強会（予定）',
            time: '14:00'
          }],
          isPlanned: true
        });
      }
    }

    try {
      const savedActivities = localStorage.getItem(`${ACTIVITY_KEY}_${userId}`);
      if (savedActivities) {
        const parsed = JSON.parse(savedActivities);
        setActivities(new Map(Object.entries(parsed)));
      } else {
        setActivities(activitiesMap);
        localStorage.setItem(
          `${ACTIVITY_KEY}_${userId}`,
          JSON.stringify(Object.fromEntries(activitiesMap))
        );
      }
    } catch (e) {
      setActivities(activitiesMap);
    }
  };

  const calculateStreaks = () => {
    let current = 0;
    let longest = 0;
    let temp = 0;
    const today = new Date();

    // 現在のストリークを計算
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const activity = activities.get(dateKey);

      if (activity && activity.count > 0) {
        if (i === 0 || temp > 0) {
          temp++;
        }
        if (temp > longest) longest = temp;
      } else {
        if (i === 0) {
          current = 0;
        }
        if (temp > 0 && current === 0) {
          current = temp;
        }
        temp = 0;
      }
    }

    setCurrentStreak(current || temp);
    setLongestStreak(longest);

    try {
      localStorage.setItem(`${STREAK_KEY}_${userId}`, JSON.stringify({ current: current || temp, longest }));
    } catch (e) {
      // ignore
    }
  };

  const getMonthDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // 前月の日付で埋める
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // 当月の日付
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getWeekDays = (date: Date) => {
    const days: Date[] = [];
    const currentDay = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - currentDay + (currentDay === 0 ? -6 : 1));

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      days.push(day);
    }

    return days;
  };

  const getActivityLevel = (count: number) => {
    if (count === 0) return 'bg-gray-100';
    if (count === 1) return 'bg-green-200';
    if (count === 2) return 'bg-green-400';
    if (count === 3) return 'bg-green-500';
    return 'bg-green-600';
  };

  const handleDateClick = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    setSelectedDate(selectedDate === dateKey ? null : dateKey);
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setDate(currentDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else {
      newDate.setDate(currentDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isFuture = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  if (!isOpen) return null;

  const days = viewMode === 'month' 
    ? getMonthDays(currentDate.getFullYear(), currentDate.getMonth())
    : getWeekDays(currentDate);

  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const weekDays = ['月', '火', '水', '木', '金', '土', '日'];

  const selectedActivity = selectedDate ? activities.get(selectedDate) : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* ヘッダー */}
        <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <CalendarIcon size={28} className="text-purple-600" />
              アクティビティカレンダー
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          {/* ストリーク情報 */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="text-orange-500" size={24} />
                <h3 className="font-bold text-gray-700">現在のストリーク</h3>
              </div>
              <p className="text-3xl font-bold text-orange-500">{currentStreak}日</p>
              <p className="text-xs text-gray-500 mt-1">連続でアクティブな日数</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-green-500" size={24} />
                <h3 className="font-bold text-gray-700">最長ストリーク</h3>
              </div>
              <p className="text-3xl font-bold text-green-500">{longestStreak}日</p>
              <p className="text-xs text-gray-500 mt-1">これまでの最高記録</p>
            </div>
          </div>

          {/* コントロール */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  viewMode === 'month'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                月表示
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  viewMode === 'week'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                週表示
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="font-bold text-lg min-w-[150px] text-center">
                {viewMode === 'month'
                  ? `${currentDate.getFullYear()}年 ${monthNames[currentDate.getMonth()]}`
                  : `${currentDate.getFullYear()}年 ${currentDate.getMonth() + 1}月 第${Math.ceil(currentDate.getDate() / 7)}週`
                }
              </span>
              <button
                onClick={handleNext}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* カレンダー本体 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4">
            {/* 曜日ヘッダー */}
            <div className={`grid ${viewMode === 'month' ? 'grid-cols-7' : 'grid-cols-7'} gap-2 mb-2`}>
              {weekDays.map((day) => (
                <div key={day} className="text-center text-sm font-bold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* カレンダーグリッド */}
            <div className={`grid ${viewMode === 'month' ? 'grid-cols-7' : 'grid-cols-7'} gap-2`}>
              {days.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="aspect-square"></div>;
                }

                const dateKey = day.toISOString().split('T')[0];
                const dayActivity = activities.get(dateKey);
                const activityLevel = dayActivity ? getActivityLevel(dayActivity.count) : 'bg-gray-100';
                const future = isFuture(day);
                const today = isToday(day);

                return (
                  <button
                    key={dateKey}
                    onClick={() => handleDateClick(day)}
                    className={`aspect-square rounded-lg p-2 transition-all hover:scale-105 hover:shadow-lg relative ${
                      today ? 'ring-2 ring-purple-500' : ''
                    } ${selectedDate === dateKey ? 'ring-2 ring-blue-500' : ''} ${activityLevel}`}
                  >
                    <div className="text-sm font-medium">
                      {day.getDate()}
                    </div>
                    {dayActivity && !future && (
                      <div className="text-xs font-bold text-gray-700 mt-1">
                        {dayActivity.count}
                      </div>
                    )}
                    {dayActivity?.isGoalAchievement && (
                      <div className="absolute top-1 right-1 text-lg">🏆</div>
                    )}
                    {dayActivity?.isPlanned && (
                      <div className="absolute bottom-1 right-1 text-xs">📅</div>
                    )}
                    {today && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 選択された日の詳細 */}
          {selectedActivity && (
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-blue-900">
                  {new Date(selectedDate!).toLocaleDateString('ja-JP', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </h3>
                {selectedActivity.isGoalAchievement && (
                  <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-bold flex items-center gap-1">
                    🏆 目標達成日
                  </span>
                )}
                {selectedActivity.isPlanned && (
                  <span className="px-3 py-1 bg-purple-400 text-purple-900 rounded-full text-sm font-bold flex items-center gap-1">
                    📅 予定
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {selectedActivity.activities.map((activity) => (
                  <div key={activity.id} className="bg-white rounded-lg p-4 shadow-sm flex items-start gap-3">
                    <div className="text-2xl">
                      {activity.type === 'upload' ? '📸' :
                       activity.type === 'event' ? '🎯' :
                       activity.type === 'achievement' ? '🏆' : '💬'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.text}</p>
                      <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 凡例 */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-bold text-gray-700 mb-3">アクティビティレベル</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-100"></div>
                <span className="text-xs text-gray-600">なし</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-200"></div>
                <span className="text-xs text-gray-600">1</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-400"></div>
                <span className="text-xs text-gray-600">2</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500"></div>
                <span className="text-xs text-gray-600">3</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-600"></div>
                <span className="text-xs text-gray-600">4+</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-lg">🏆</span>
                <span className="text-xs text-gray-600">目標達成</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">📅</span>
                <span className="text-xs text-gray-600">予定</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCalendarEnhanced;
