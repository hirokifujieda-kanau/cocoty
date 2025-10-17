'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, Users, CheckCircle, XCircle, AlertCircle, Plus, Send } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  organizer: string;
  community: string;
  status: 'planning' | 'open' | 'closed' | 'completed';
  participants: {
    attending: Participant[];
    notAttending: Participant[];
    pending: Participant[];
  };
  tasks: TaskItem[];
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  respondedAt?: string;
}

interface TaskItem {
  id: string;
  title: string;
  assignee: string;
  completed: boolean;
  dueDate: string;
}

interface EventManagementProps {
  events: Event[];
  onCreateEvent: (event: Partial<Event>) => void;
  onUpdateAttendance: (eventId: string, participantId: string, status: 'attending' | 'not-attending') => void;
  onSendReminder: (eventId: string, participantIds: string[]) => void;
  onUpdateTask: (eventId: string, taskId: string, completed: boolean) => void;
}

const EventManagement: React.FC<EventManagementProps> = ({
  events,
  onSendReminder,
  onUpdateTask
}) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'tasks'>('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              イベント企画・出欠管理
            </h1>
            <p className="text-gray-600">
              日程調整、出欠管理、タスク管理を一元化
            </p>
          </div>
          <button
            onClick={() => alert('新しいイベント作成機能は今後実装予定です')}
            className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>新しいイベント</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Events List */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              イベント一覧
            </h2>
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedEvent?.id === event.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.status === 'open' ? 'bg-green-100 text-green-800' :
                      event.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                      event.status === 'closed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status === 'open' ? '募集中' :
                       event.status === 'planning' ? '企画中' :
                       event.status === 'closed' ? '受付終了' : '終了'}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{event.date} {event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>
                        {event.participants.attending.length}/{event.capacity}名
                        <span className="ml-2 text-blue-600">
                          (参加率: {Math.round((event.participants.attending.length / event.capacity) * 100)}%)
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Event Details */}
          <div className="lg:col-span-2">
            {selectedEvent ? (
              <div className="bg-white rounded-lg shadow-md">
                {/* Event Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedEvent.title}
                      </h2>
                      <p className="text-gray-600">{selectedEvent.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onSendReminder(selectedEvent.id, selectedEvent.participants.pending.map(p => p.id))}
                        className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                      >
                        <Send className="h-4 w-4" />
                        <span>リマインド送信</span>
                      </button>
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Calendar className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{selectedEvent.date}</div>
                        <div className="text-sm">{selectedEvent.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <MapPin className="h-5 w-5" />
                      <div>
                        <div className="font-medium">会場</div>
                        <div className="text-sm">{selectedEvent.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Users className="h-5 w-5" />
                      <div>
                        <div className="font-medium">参加者</div>
                        <div className="text-sm">
                          {selectedEvent.participants.attending.length}/{selectedEvent.capacity}名
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                    {[
                      { id: 'overview', label: '概要' },
                      { id: 'attendance', label: '出欠管理' },
                      { id: 'tasks', label: 'タスク' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as 'overview' | 'attendance' | 'tasks')}
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'overview' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        イベント詳細
                      </h3>
                      <div className="prose prose-sm text-gray-600">
                        <p>{selectedEvent.description}</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'attendance' && (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Attending */}
                        <div>
                          <div className="flex items-center space-x-2 mb-4">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              参加予定 ({selectedEvent.participants.attending.length})
                            </h3>
                          </div>
                          <div className="space-y-2">
                            {selectedEvent.participants.attending.map((participant) => (
                              <div
                                key={participant.id}
                                className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg"
                              >
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">
                                    {participant.name.charAt(0)}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">
                                    {participant.name}
                                  </div>
                                  {participant.respondedAt && (
                                    <div className="text-xs text-gray-500">
                                      {participant.respondedAt}に回答
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Not Attending */}
                        <div>
                          <div className="flex items-center space-x-2 mb-4">
                            <XCircle className="h-5 w-5 text-red-500" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              不参加 ({selectedEvent.participants.notAttending.length})
                            </h3>
                          </div>
                          <div className="space-y-2">
                            {selectedEvent.participants.notAttending.map((participant) => (
                              <div
                                key={participant.id}
                                className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg"
                              >
                                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">
                                    {participant.name.charAt(0)}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">
                                    {participant.name}
                                  </div>
                                  {participant.respondedAt && (
                                    <div className="text-xs text-gray-500">
                                      {participant.respondedAt}に回答
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Pending */}
                        <div>
                          <div className="flex items-center space-x-2 mb-4">
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              未回答 ({selectedEvent.participants.pending.length})
                            </h3>
                          </div>
                          <div className="space-y-2">
                            {selectedEvent.participants.pending.map((participant) => (
                              <div
                                key={participant.id}
                                className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg"
                              >
                                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">
                                    {participant.name.charAt(0)}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">
                                    {participant.name}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'tasks' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        やることリスト
                      </h3>
                      <div className="space-y-3">
                        {selectedEvent.tasks.map((task) => (
                          <div
                            key={task.id}
                            className={`flex items-center space-x-3 p-4 rounded-lg border-2 ${
                              task.completed
                                ? 'border-green-200 bg-green-50'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <button
                              onClick={() => onUpdateTask(selectedEvent.id, task.id, !task.completed)}
                              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                task.completed
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-gray-300 hover:border-green-500'
                              }`}
                            >
                              {task.completed && (
                                <CheckCircle className="h-4 w-4 text-white" />
                              )}
                            </button>
                            <div className="flex-1">
                              <div className={`font-medium ${
                                task.completed ? 'text-green-700 line-through' : 'text-gray-900'
                              }`}>
                                {task.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                担当: {task.assignee} • 期限: {task.dueDate}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  イベントを選択してください
                </h3>
                <p className="text-gray-600">
                  左側のリストからイベントを選択して詳細を確認できます
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManagement;