'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, Eye, Search, Grid, List, Filter, Play } from 'lucide-react';
import Image from 'next/image';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  community: string;
  author: string;
  type: 'photo' | 'video' | 'document' | 'artwork';
  thumbnail: string;
  url: string;
  likes: number;
  views: number;
  comments: number;
  createdAt: string;
  tags: string[];
}

interface SocialGalleryProps {
  items: PortfolioItem[];
  onLike: (itemId: string) => void;
  onView: (itemId: string) => void;
  onComment: (itemId: string) => void;
}

const SocialGallery: React.FC<SocialGalleryProps> = ({
  items,
  onLike,
  onView,
  onComment
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'feed'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'photo': return '📸';
      case 'video': return '🎬';
      case 'artwork': return '🎨';
      case 'document': return '📄';
      default: return '📁';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              ギャラリー
            </h1>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="作品を検索..."
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
              
              <div className="flex bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-500 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('feed')}
                  className={`p-2 rounded-full transition-colors ${
                    viewMode === 'feed' 
                      ? 'bg-white text-blue-500 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'すべて', emoji: '🌟' },
                  { value: 'photo', label: '写真', emoji: '📸' },
                  { value: 'video', label: '動画', emoji: '🎬' },
                  { value: 'artwork', label: 'アート', emoji: '🎨' },
                  { value: 'document', label: '資料', emoji: '📄' },
                ].map(type => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
                      selectedType === type.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{type.emoji}</span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-4">
        {viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer"
                onClick={() => onView(item.id)}
              >
                <div className="aspect-square relative overflow-hidden">
                  {/* Type indicator */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="text-lg drop-shadow-lg">
                      {getTypeEmoji(item.type)}
                    </span>
                  </div>
                  
                  {/* Video play button */}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <Play className="h-6 w-6 text-white ml-0.5" />
                      </div>
                    </div>
                  )}
                  
                  {/* Thumbnail */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-4xl text-gray-400">{getTypeEmoji(item.type)}</span>
                  </div>
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
                    <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="font-semibold text-sm truncate mb-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center space-x-3 text-xs">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>{item.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{item.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Meta info */}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm truncate mb-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{item.author}</span>
                    <span>{item.createdAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Feed View */
          <div className="space-y-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Post Header */}
                <div className="p-4 pb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {item.author.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {item.author}
                        </h3>
                        <span className="text-gray-500 text-sm">@{item.author.toLowerCase()}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.community}
                        </span>
                        <span className="text-xs text-gray-500">{item.createdAt}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg">{getTypeEmoji(item.type)}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-4 pb-3">
                  <h2 className="font-semibold text-gray-900 mb-1">{item.title}</h2>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  
                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.slice(0, 4).map((tag, index) => (
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

                {/* Preview */}
                <div className="relative aspect-video bg-gray-200 mx-4 rounded-xl overflow-hidden mb-4">
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <Play className="h-8 w-8 text-white ml-1" />
                      </div>
                    </div>
                  )}
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-6xl text-gray-400">{getTypeEmoji(item.type)}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="px-4 py-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex space-x-4">
                      <span>{item.likes}人がいいね</span>
                      <span>{item.comments}件のコメント</span>
                      <span>{item.views}回表示</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-4 py-3 border-t border-gray-100">
                  <div className="flex items-center justify-around">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLike(item.id);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Heart className="h-5 w-5" />
                      <span className="text-sm font-medium">いいね</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onComment(item.id);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">コメント</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(item.id);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-500 hover:text-green-500 hover:bg-green-50 transition-colors"
                    >
                      <Eye className="h-5 w-5" />
                      <span className="text-sm font-medium">詳細</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialGallery;