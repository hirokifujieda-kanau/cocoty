'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Plus, Search } from 'lucide-react';
import { Event, getUpcomingEvents, getPastEvents, getEventsByCategory, getEventsByStatus, searchEvents } from '@/lib/mock/mockEvents';
import { EventFormModal } from './EventFormModal';
import { EventDetailModal } from './EventDetailModal';
import { useAuth } from '@/context/AuthContext';

type FilterType = 'all' | 'upcoming' | 'past' | Event['category'] | Event['status'];

const EventManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('upcoming');

  // イベント一覧の読み込み
  const loadEvents = () => {
    let loaded: Event[] = [];
    
    switch (filter) {
      case 'upcoming':
        loaded = getUpcomingEvents();
        break;
      case 'past':
        loaded = getPastEvents();
        break;
      case 'all':
        loaded = [...getUpcomingEvents(), ...getPastEvents()];
        break;
      case 'workshop':
      case 'online':
      case 'social':
      case 'competition':
      case 'exhibition':
        loaded = getEventsByCategory(filter);
        break;
      case 'open':
      case 'closed':
      case 'cancelled':
      case 'full':
        loaded = getEventsByStatus(filter);
        break;
      default:
        loaded = getUpcomingEvents();
    }

    setEvents(loaded);
    setFilteredEvents(loaded);
  };

  useEffect(() => {
    loadEvents();
  }, [filter]);

  // 検索処理
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEvents(events);
    } else {
      const results = searchEvents(searchQuery);
      setFilteredEvents(results);
    }
  }, [searchQuery, events]);

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setIsFormModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsDetailModalOpen(false);
    setIsFormModalOpen(true);
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleFormSuccess = () => {
    loadEvents();
    setIsFormModalOpen(false);
    setEditingEvent(null);
  };

  const getCategoryBadge = (category: Event['category']) => {
    const badges = {
      workshop: { text: 'ワークショップ', color: 'bg-blue-100 text-blue-800' },
      online: { text: 'オンライン', color: 'bg-green-100 text-green-800' },
      social: { text: '交流会', color: 'bg-yellow-100 text-yellow-800' },
      competition: { text: 'コンテスト', color: 'bg-red-100 text-red-800' },
      exhibition: { text: '展示会', color: 'bg-purple-100 text-purple-800' }
    };
    return badges[category];
  };

  const getStatusBadge = (status: Event['status']) => {
    const badges = {
      open: { text: '募集中', color: 'bg-green-100 text-green-800' },
      closed: { text: '締切', color: 'bg-gray-100 text-gray-800' },
      cancelled: { text: '中止', color: 'bg-red-100 text-red-800' },
      full: { text: '満員', color: 'bg-orange-100 text-orange-800' }
    };
    return badges[status];
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                イベント企画・出欠管理
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                イベントの作成、参加、管理を行います
              </p>
            </div>
            <button
              onClick={handleCreateEvent}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span>新しいイベント</span>
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="イベントを検索..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {[
                { id: 'upcoming', label: '今後' },
                { id: 'past', label: '過去' },
                { id: 'workshop', label: 'ワークショップ' },
                { id: 'online', label: 'オンライン' },
                { id: 'social', label: '交流会' }
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id as FilterType)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === filterOption.id
                      ? 'bg-purple-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              イベントが見つかりません
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? '検索条件に一致するイベントがありません' : 'イベントがありません'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreateEvent}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
              >
                <Plus className="h-5 w-5" />
                <span>最初のイベントを作成</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredEvents.map((event) => {
              const categoryBadge = getCategoryBadge(event.category);
              const statusBadge = getStatusBadge(event.status);
              const attendanceRate = event.capacity > 0 
                ? Math.round((event.attendees.length / event.capacity) * 100)
                : 0;

              return (
                <div
                  key={event.id}
                  onClick={() => handleViewEvent(event)}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="p-4 md:p-5 border-b border-gray-100">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-bold text-gray-900 text-base md:text-lg line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {event.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${statusBadge.color}`}>
                        {statusBadge.text}
                      </span>
                    </div>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${categoryBadge.color}`}>
                      {categoryBadge.text}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 md:p-5 space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="truncate">{event.date} {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-pink-500 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span>
                          {event.attendees.length}/{event.capacity}名
                          <span className="ml-2 text-purple-600 font-medium">
                            ({attendanceRate}%)
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    {event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {event.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                        {event.tags.length > 3 && (
                          <span className="px-2 py-1 text-gray-500 text-xs">
                            +{event.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="px-4 md:px-5 py-3 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>主催: {event.organizer}</span>
                      {event.price > 0 && (
                        <span className="font-medium text-yellow-600">
                          ¥{event.price.toLocaleString()}
                        </span>
                      )}
                      {event.price === 0 && (
                        <span className="font-medium text-green-600">無料</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <EventFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingEvent(null);
        }}
        onSuccess={handleFormSuccess}
        editEvent={editingEvent}
        currentUserId={currentUser.id}
        currentUserName={currentUser.name}
      />

      <EventDetailModal
        event={selectedEvent}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedEvent(null);
        }}
        onEdit={handleEditEvent}
        onRefresh={loadEvents}
        currentUserId={currentUser.id}
      />
    </div>
  );
};

export default EventManagement;
