'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bell, 
  Plus, 
  Search,
  Filter,
  Bookmark
} from 'lucide-react';
import Image from 'next/image';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  community: string;
  category: 'workshop' | 'meetup' | 'conference' | 'social' | 'online';
  capacity: number;
  attendees: number;
  image?: string;
  tags: string[];
  price: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isAttending: boolean;
}

interface SocialEventsProps {
  events: Event[];
  onLike: (eventId: string) => void;
  onBookmark: (eventId: string) => void;
  onAttend: (eventId: string) => void;
  onShare: (eventId: string) => void;
}

const SocialEvents: React.FC<SocialEventsProps> = ({
  events,
  onLike,
  onBookmark,
  onAttend,
  onShare
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'workshop': return '🛠️';
      case 'meetup': return '👥';
      case 'conference': return '🎤';
      case 'social': return '🎉';
      case 'online': return '💻';
      default: return '📅';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'workshop': return 'from-orange-400 to-red-500';
      case 'meetup': return 'from-blue-400 to-cyan-500';
      case 'conference': return 'from-purple-400 to-pink-500';
      case 'social': return 'from-green-400 to-emerald-500';
      case 'online': return 'from-indigo-400 to-blue-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              イベント
            </h1>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="イベントを検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white w-48"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Filter className="h-5 w-5" />
              </button>
              
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium">作成</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'すべて', emoji: '🌟' },
                  { value: 'workshop', label: 'ワークショップ', emoji: '🛠️' },
                  { value: 'meetup', label: 'ミートアップ', emoji: '👥' },
                  { value: 'conference', label: 'カンファレンス', emoji: '🎤' },
                  { value: 'social', label: '交流会', emoji: '🎉' },
                  { value: 'online', label: 'オンライン', emoji: '💻' },
                ].map(category => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
                      selectedCategory === category.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{category.emoji}</span>
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Events Feed */}
      <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Event Header */}
            <div className="p-4 pb-3">
              <div className="flex items-start space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(event.category)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-lg">
                    {getCategoryEmoji(event.category)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {event.organizer}
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {event.community}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onBookmark(event.id)}
                  className={`p-2 rounded-full transition-colors ${
                    event.isBookmarked 
                      ? 'text-yellow-500 bg-yellow-50' 
                      : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                  }`}
                >
                  <Bookmark className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Event Content */}
            <div className="px-4 pb-4">
              <h2 className="font-bold text-lg text-gray-900 mb-2">{event.title}</h2>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
              
              {/* Event Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{event.attendees}/{event.capacity}人参加</span>
                  </div>
                  {event.price > 0 ? (
                    <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                      ¥{event.price.toLocaleString()}
                    </div>
                  ) : (
                    <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                      無料
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">参加者</span>
                  <span className="text-xs text-gray-500">{Math.round((event.attendees / event.capacity) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((event.attendees / event.capacity) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Tags */}
              {event.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {event.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  <button
                    onClick={() => onLike(event.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      event.isLiked
                        ? 'text-red-600 bg-red-50 hover:bg-red-100'
                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${event.isLiked ? 'fill-current' : ''}`} />
                    <span>いいね</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">コメント</span>
                  </button>
                  <button
                    onClick={() => onShare(event.id)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="text-sm font-medium">シェア</span>
                  </button>
                </div>
                
                <button
                  onClick={() => onAttend(event.id)}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    event.isAttending
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {event.isAttending ? '参加済み' : '参加する'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialEvents;