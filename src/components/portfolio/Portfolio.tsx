'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, Download, Heart, Share2, Grid3X3, List, Search } from 'lucide-react';

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
  createdAt: string;
  tags: string[];
}

interface PortfolioProps {
  items: PortfolioItem[];
  onLike: (itemId: string) => void;
  onView: (itemId: string) => void;
  onDownload: (itemId: string) => void;
  onShare: (itemId: string) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({
  items,
  onLike,
  onView,
  onDownload,
  onShare
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesCommunity = selectedCommunity === 'all' || item.community === selectedCommunity;
    
    return matchesSearch && matchesType && matchesCommunity;
  });

  const communities = [...new Set(items.map(item => item.community))];
  const types = [
    { value: 'all', label: 'すべて' },
    { value: 'photo', label: '写真' },
    { value: 'video', label: '動画' },
    { value: 'artwork', label: 'アートワーク' },
    { value: 'document', label: '資料' },
  ];

  const getTypeIcon = (type: string) => {
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
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            成果物ポートフォリオ
          </h1>
          <p className="text-gray-600">
            各部活が作成したベストショット、完成作品、制作動画を展示
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="作品を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {types.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            {/* Community Filter */}
            <select
              value={selectedCommunity}
              onChange={(e) => setSelectedCommunity(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">すべてのココティ</option>
              {communities.map(community => (
                <option key={community} value={community}>
                  {community}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 ${
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                } transition-colors`}
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                } transition-colors`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredItems.length}件の作品が見つかりました
          </p>
        </div>

        {/* Portfolio Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onView(item.id)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-200 overflow-hidden">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-2xl">{getTypeIcon(item.type)}</span>
                  </div>
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload(item.id);
                      }}
                      className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShare(item.id);
                      }}
                      className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  
                  {/* Metadata */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{item.community}</span>
                    <span>{item.author}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{item.views}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onLike(item.id);
                        }}
                        className="flex items-center space-x-1 text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Heart className="h-4 w-4" />
                        <span>{item.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onView(item.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {getTypeIcon(item.type)} {item.title}
                        </h3>
                        <p className="text-gray-600 mb-3">{item.description}</p>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span>{item.community}</span>
                          <span>•</span>
                          <span>{item.author}</span>
                          <span>•</span>
                          <span>{item.createdAt}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDownload(item.id);
                          }}
                          className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onShare(item.id);
                          }}
                          className="p-2 text-gray-500 hover:text-green-500 transition-colors"
                        >
                          <Share2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
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

export default Portfolio;