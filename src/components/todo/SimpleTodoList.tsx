'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus,
  Calendar,
  Clock
} from 'lucide-react';

interface SimpleTodo {
  id: string;
  title: string;
  dueDate: string;
  community: string;
  completed: boolean;
}

interface SimpleEvent {
  id: string;
  title: string;
  date: string;
  community: string;
}

interface SimpleTodoListProps {
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
}

const SimpleTodoList: React.FC<SimpleTodoListProps> = ({
  communities,
  upcomingEvents
}) => {
  const [completedTodos, setCompletedTodos] = useState<Set<string>>(new Set());

  const sampleTodos: SimpleTodo[] = [
    {
      id: '1',
      title: '撮影会の準備',
      dueDate: '今日',
      community: '写真部',
      completed: false
    },
    {
      id: '2',
      title: 'ハッカソン申込み',
      dueDate: '明日',
      community: 'プログラミング部',
      completed: false
    },
    {
      id: '3',
      title: 'レシピ資料作成',
      dueDate: '今週',
      community: '料理部',
      completed: false
    }
  ];

  const sampleEvents: SimpleEvent[] = [
    {
      id: '1',
      title: '桜撮影会',
      date: '4月10日',
      community: '写真部'
    },
    {
      id: '2',
      title: 'React勉強会',
      date: '4月15日',
      community: 'プログラミング部'
    },
    {
      id: '3',
      title: '料理コンテスト',
      date: '4月20日',
      community: '料理部'
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

  const getCommunityColor = (community: string) => {
    switch (community) {
      case '写真部': return 'bg-blue-100 text-blue-700';
      case 'プログラミング部': return 'bg-green-100 text-green-700';
      case '料理部': return 'bg-orange-100 text-orange-700';
      case '映像制作部': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const pendingTodos = sampleTodos.filter(todo => !completedTodos.has(todo.id));
  const todayTodos = pendingTodos.filter(todo => todo.dueDate === '今日');
  const otherTodos = pendingTodos.filter(todo => todo.dueDate !== '今日');

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Today's Tasks */}
      {todayTodos.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">今日やること</h2>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
              {todayTodos.length}件
            </span>
          </div>
          
          <div className="space-y-4">
            {todayTodos.map((todo) => {
              const isCompleted = completedTodos.has(todo.id);
              
              return (
                <div key={todo.id} className={`flex items-center space-x-4 p-4 rounded-xl transition-all ${
                  isCompleted ? 'bg-green-50 border border-green-200' : 'bg-gray-50 hover:bg-gray-100'
                }`}>
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="flex-shrink-0"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-400 hover:text-blue-500 transition-colors" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <h3 className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {todo.title}
                    </h3>
                    <span className={`inline-block mt-1 px-2 py-1 rounded-lg text-xs font-medium ${getCommunityColor(todo.community)}`}>
                      {todo.community}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Other Tasks */}
      {otherTodos.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">今後の予定</h2>
          </div>
          
          <div className="space-y-3">
            {otherTodos.map((todo) => (
              <div key={todo.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <Circle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{todo.title}</h4>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCommunityColor(todo.community)}`}>
                      {todo.community}
                    </span>
                    <span className="text-sm text-gray-500">{todo.dueDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <Calendar className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-bold text-gray-900">近日のイベント</h2>
        </div>
        
        <div className="space-y-3">
          {sampleEvents.map((event) => (
            <div key={event.id} className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{event.title}</h4>
                <div className="flex items-center space-x-3 mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCommunityColor(event.community)}`}>
                    {event.community}
                  </span>
                  <span className="text-sm text-gray-500">{event.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Task */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <button className="w-full flex items-center justify-center space-x-3 py-4 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-colors border-2 border-dashed border-gray-200 hover:border-blue-300">
          <Plus className="h-5 w-5" />
          <span className="font-medium">新しいタスクを追加</span>
        </button>
      </div>
    </div>
  );
};

export default SimpleTodoList;