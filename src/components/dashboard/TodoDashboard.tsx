'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  AlertCircle,
  Plus,
  Users,
  TrendingUp,
  Bell,
  Target
} from 'lucide-react';

interface TodoItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  community: string;
  assignee?: string;
  type: 'event' | 'task' | 'deadline' | 'meeting';
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  community: string;
  type: 'workshop' | 'meetup' | 'deadline' | 'meeting';
}

interface TodoDashboardProps {
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
  }>;
  recentPosts: Array<{
    id: string;
    title: string;
    author: string;
    community: string;
    timestamp: string;
  }>;
}

const TodoDashboard: React.FC<TodoDashboardProps> = ({
  communities,
  upcomingEvents,
  recentPosts
}) => {
  const [completedTodos, setCompletedTodos] = useState<Set<string>>(new Set());

  const sampleTodos: TodoItem[] = [
    {
      id: '1',
      title: '撮影会の機材準備',
      description: 'カメラ、三脚、レンズの点検と準備',
      dueDate: '今日',
      priority: 'high',
      status: 'pending',
      community: '写真部',
      assignee: '田中さん',
      type: 'task'
    },
    {
      id: '2',
      title: 'ハッカソン参加申込み',
      description: '来月のハッカソンの参加申し込み締切',
      dueDate: '明日',
      priority: 'high',
      status: 'pending',
      community: 'プログラミング部',
      type: 'deadline'
    },
    {
      id: '3',
      title: '料理レシピの資料作成',
      description: '次回の料理教室用のレシピ集作成',
      dueDate: '3日後',
      priority: 'medium',
      status: 'in-progress',
      community: '料理部',
      assignee: '佐藤さん',
      type: 'task'
    },
    {
      id: '4',
      title: '編集ソフトの勉強会',
      description: 'Premiere Proの使い方勉強会',
      dueDate: '1週間後',
      priority: 'medium',
      status: 'pending',
      community: '映像制作部',
      type: 'meeting'
    },
    {
      id: '5',
      title: 'イベント報告書提出',
      description: '前回のイベント報告書を作成・提出',
      dueDate: '2週間後',
      priority: 'low',
      status: 'completed',
      community: '写真部',
      assignee: '高橋さん',
      type: 'task'
    }
  ];

  const sampleEvents: Event[] = [
    {
      id: '1',
      title: '桜撮影会',
      date: '4月10日',
      time: '10:00-16:00',
      community: '写真部',
      type: 'workshop'
    },
    {
      id: '2',
      title: 'React勉強会',
      date: '4月15日',
      time: '14:00-17:00',
      community: 'プログラミング部',
      type: 'meetup'
    },
    {
      id: '3',
      title: '料理コンテスト',
      date: '4月20日',
      time: '13:00-18:00',
      community: '料理部',
      type: 'workshop'
    }
  ];

  const toggleTodo = (todoId: string) => {
    setCompletedTodos(prev => {
      const newCompleted = new Set(prev);
      if (newCompleted.has(todoId)) {
        newCompleted.delete(todoId);
      } else {
        newCompleted.add(todoId);
      }
      return newCompleted;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'event': return Calendar;
      case 'meeting': return Users;
      case 'deadline': return AlertCircle;
      case 'task': return Target;
      default: return Circle;
    }
  };

  const getCommunityColor = (community: string) => {
    switch (community) {
      case '写真部': return 'from-blue-400 to-cyan-500';
      case 'プログラミング部': return 'from-green-400 to-emerald-500';
      case '料理部': return 'from-orange-400 to-pink-500';
      case '映像制作部': return 'from-purple-400 to-indigo-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const pendingTodos = sampleTodos.filter(todo => todo.status !== 'completed' && !completedTodos.has(todo.id));
  const todayTodos = pendingTodos.filter(todo => todo.dueDate === '今日');
  const upcomingTodos = pendingTodos.filter(todo => todo.dueDate !== '今日');

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{todayTodos.length}</p>
            <p className="text-sm text-gray-500">今日</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{sampleEvents.length}</p>
            <p className="text-sm text-gray-500">イベント</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{completedTodos.size + sampleTodos.filter(t => t.status === 'completed').length}</p>
            <p className="text-sm text-gray-500">完了</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{communities.length}</p>
            <p className="text-sm text-gray-500">参加中</p>
          </div>
        </div>
      </div>

      {/* Simple TODO List */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">やること</h3>
          <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          {[...todayTodos, ...upcomingTodos.slice(0, 5)].map((todo) => {
            const isCompleted = completedTodos.has(todo.id);
            
            return (
              <div key={todo.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <button
                  onClick={() => toggleTodo(todo.id)}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors" />
                  )}
                </button>
                
                <div className="flex-1">
                  <p className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {todo.title}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className={`w-3 h-3 bg-gradient-to-br ${getCommunityColor(todo.community)} rounded`}></div>
                    <span className="text-sm text-gray-600">{todo.community}</span>
                    <span className="text-sm text-gray-500">• {todo.dueDate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">近日のイベント</h3>
        <div className="space-y-3">
          {sampleEvents.map((event) => (
            <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{event.date}</span>
                <span className="text-sm text-gray-500">• {event.community}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoDashboard;