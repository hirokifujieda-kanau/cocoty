'use client';

import React, { useState } from 'react';
import { 
  Star, 
  Eye, 
  Download, 
  Share2, 
  Award, 
  Camera, 
  Film, 
  FileText, 
  Code,
  Search,
  Filter,
  Grid,
  List
} from 'lucide-react';
import Image from 'next/image';

interface Achievement {
  id: string;
  title: string;
  description: string;
  community: string;
  author: string;
  type: 'photo' | 'video' | 'code' | 'document' | 'artwork';
  thumbnail: string;
  url: string;
  likes: number;
  views: number;
  downloads: number;
  createdAt: string;
  tags: string[];
  featured: boolean;
  award?: string;
}

interface PortfolioShowcaseProps {
  achievements: Achievement[];
  onLike: (itemId: string) => void;
  onView: (itemId: string) => void;
  onDownload: (itemId: string) => void;
  onShare: (itemId: string) => void;
}

const PortfolioShowcase: React.FC<PortfolioShowcaseProps> = ({
  achievements,
  onLike,
  onView,
  onDownload,
  onShare
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'featured'>('featured');

  const sampleAchievements: Achievement[] = [
    {
      id: '1',
      title: '桜咲く季節の風景写真集',
      description: '今年の桜シーズンに撮影した美しい風景写真をまとめた作品集です。光の使い方や構図にこだわって撮影しました。',
      community: '写真部',
      author: '田中花子',
      type: 'photo',
      thumbnail: '/placeholder-1.jpg',
      url: '#',
      likes: 156,
      views: 2340,
      downloads: 45,
      createdAt: '2024年4月1日',
      tags: ['桜', '風景', '春', 'ポートレート'],
      featured: true,
      award: '月間ベストフォト'
    },
    {
      id: '2',
      title: 'コミュニティ管理システム',
      description: 'React + TypeScriptで開発したコミュニティ活動を管理するWebアプリケーション。イベント管理からメンバー管理まで一元化。',
      community: 'プログラミング部',
      author: '山田太郎',
      type: 'code',
      thumbnail: '/placeholder-2.jpg',
      url: '#',
      likes: 89,
      views: 1567,
      downloads: 23,
      createdAt: '2024年3月28日',
      tags: ['React', 'TypeScript', 'WebApp', 'UI/UX'],
      featured: true,
      award: 'イノベーション賞'
    },
    {
      id: '3',
      title: '手作りパスタ完全ガイド',
      description: '生地作りから仕上げまで、本格的なパスタ作りの全工程を動画で解説。初心者でも失敗しないコツを詳しく紹介。',
      community: '料理部',
      author: '佐藤美咲',
      type: 'video',
      thumbnail: '/placeholder-3.jpg',
      url: '#',
      likes: 234,
      views: 4521,
      downloads: 89,
      createdAt: '2024年3月25日',
      tags: ['料理', 'パスタ', '手作り', 'レシピ'],
      featured: true,
      award: '視聴者賞'
    },
    {
      id: '4',
      title: 'ドローン空撮映像作品集',
      description: '最新のドローン技術を使用して撮影した空撮映像をまとめた作品です。ダイナミックなアングルと美しい景色をお楽しみください。',
      community: '映像制作部',
      author: '高橋智子',
      type: 'video',
      thumbnail: '/placeholder-4.jpg',
      url: '#',
      likes: 178,
      views: 3200,
      downloads: 56,
      createdAt: '2024年3月20日',
      tags: ['ドローン', '空撮', '映像', '風景'],
      featured: false
    },
    {
      id: '5',
      title: 'デザインシステム設計書',
      description: 'コミュニティプラットフォームのUI/UXデザインガイドライン。カラーパレット、タイポグラフィ、コンポーネント設計まで網羅。',
      community: 'デザイン部',
      author: '鈴木一郎',
      type: 'document',
      thumbnail: '/placeholder-5.jpg',
      url: '#',
      likes: 67,
      views: 1234,
      downloads: 34,
      createdAt: '2024年3月15日',
      tags: ['UI', 'UX', 'デザイン', 'ガイドライン'],
      featured: false
    },
    {
      id: '6',
      title: 'ミニマリストアートコレクション',
      description: 'シンプルでありながら心に響くミニマリストアートの作品集。日常の中の美しい瞬間を切り取った抽象的な表現。',
      community: 'アート部',
      author: '伊藤美香',
      type: 'artwork',
      thumbnail: '/placeholder-6.jpg',
      url: '#',
      likes: 123,
      views: 1890,
      downloads: 41,
      createdAt: '2024年3月10日',
      tags: ['アート', 'ミニマル', '抽象', 'デザイン'],
      featured: false
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'photo': return Camera;
      case 'video': return Film;
      case 'code': return Code;
      case 'document': return FileText;
      case 'artwork': return Award;
      default: return FileText;
    }
  };

  const getCommunityColor = (community: string) => {
    switch (community) {
      case '写真部': return 'from-blue-400 to-cyan-500';
      case 'プログラミング部': return 'from-green-400 to-emerald-500';
      case '料理部': return 'from-orange-400 to-pink-500';
      case '映像制作部': return 'from-purple-400 to-indigo-500';
      case 'デザイン部': return 'from-pink-400 to-rose-500';
      case 'アート部': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const filteredAchievements = sampleAchievements.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesCommunity = selectedCommunity === 'all' || item.community === selectedCommunity;
    
    return matchesSearch && matchesType && matchesCommunity;
  });

  const featuredAchievements = filteredAchievements.filter(item => item.featured);
  const regularAchievements = filteredAchievements.filter(item => !item.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                成果物ポートフォリオ
              </h1>
              <p className="text-gray-600 mt-1">各コミュニティの優秀な作品を展示</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="作品を検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white w-64"
                />
              </div>
              
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('featured')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'featured' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  注目作品
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  すべて
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { value: 'all', label: 'すべて' },
              { value: 'photo', label: '写真', icon: Camera },
              { value: 'video', label: '動画', icon: Film },
              { value: 'code', label: 'コード', icon: Code },
              { value: 'document', label: '資料', icon: FileText },
              { value: 'artwork', label: 'アート', icon: Award },
            ].map(type => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    selectedType === type.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Featured Section */}
        {viewMode === 'featured' && featuredAchievements.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Star className="h-6 w-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">注目の作品</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {featuredAchievements.map((item) => {
                const TypeIcon = getTypeIcon(item.type);
                
                return (
                  <div key={item.id} className="group bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {/* Award Badge */}
                    {item.award && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs font-medium">
                          <Award className="h-3 w-3" />
                          <span>{item.award}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-gray-200 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <TypeIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`px-3 py-1 bg-gradient-to-r ${getCommunityColor(item.community)} text-white rounded-full text-sm font-medium`}>
                          {item.community}
                        </div>
                        <TypeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      
                      <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>by {item.author}</span>
                        <span>{item.createdAt}</span>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex space-x-4">
                          <span>{item.likes}いいね</span>
                          <span>{item.views}表示</span>
                          <span>{item.downloads}DL</span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onView(item.id)}
                          className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Eye className="h-4 w-4" />
                          <span>詳細</span>
                        </button>
                        <button
                          onClick={() => onDownload(item.id)}
                          className="py-2 px-4 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onShare(item.id)}
                          className="py-2 px-4 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* All Items Grid */}
        {(viewMode === 'grid' || (viewMode === 'featured' && regularAchievements.length > 0)) && (
          <section>
            {viewMode === 'featured' && (
              <div className="flex items-center space-x-3 mb-6">
                <Grid className="h-6 w-6 text-gray-500" />
                <h2 className="text-2xl font-bold text-gray-900">その他の作品</h2>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(viewMode === 'grid' ? filteredAchievements : regularAchievements).map((item) => {
                const TypeIcon = getTypeIcon(item.type);
                
                return (
                  <div key={item.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-gray-200 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <TypeIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`px-2 py-1 bg-gradient-to-r ${getCommunityColor(item.community)} text-white rounded-lg text-xs font-medium`}>
                          {item.community}
                        </div>
                        <TypeIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{item.author}</span>
                        <span>{item.createdAt}</span>
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex space-x-3">
                          <span>{item.likes}👍</span>
                          <span>{item.views}👁️</span>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => onView(item.id)}
                            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                          >
                            <Eye className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => onShare(item.id)}
                            className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                          >
                            <Share2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default PortfolioShowcase;