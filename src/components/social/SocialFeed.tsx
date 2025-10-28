'use client';

import React from 'react';
import { Heart, MessageCircle, Share2, Plus, Search, Bell, Camera } from 'lucide-react';
import Image from 'next/image';
import { PH1, PH2, PH3 } from '@/lib/placeholders';

interface SocialFeedProps {
  communities: Array<{
    name: string;
    memberCount: number;
    recentPosts: number;
    upcomingEvents: number;
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

const SocialFeed: React.FC<SocialFeedProps> = ({
  communities,
  upcomingEvents,
  recentPosts
}) => {
  const feedPosts = [
    {
      id: '1',
      author: {
        name: '田中花子',
        username: '@hanako_photo',
        avatar: '',
        community: '写真部'
      },
      content: {
        text: '今日の撮影会、本当に楽しかった！📸✨ みんなの笑顔をたくさん撮れて幸せです。次回はポートレート撮影に挑戦してみたいな〜',
  images: [PH1, PH2],
        location: '上野公園'
      },
      stats: {
        likes: 24,
        comments: 8,
        shares: 3
      },
      timestamp: '2時間前',
      isLiked: false
    },
    {
      id: '2',
      author: {
        name: '山田太郎',
        username: '@taro_dev',
        avatar: '',
        community: 'プログラミング部'
      },
      content: {
        text: 'React + TypeScriptでのハッカソン、無事完成🎉 チーム開発って本当に勉強になる。次は機械学習にも挑戦してみたい！',
  images: [PH3]
      },
      stats: {
        likes: 18,
        comments: 5,
        shares: 2
      },
      timestamp: '4時間前',
      isLiked: true
    },
    {
      id: '3',
      author: {
        name: '佐藤美咲',
        username: '@misaki_cook',
        avatar: '',
        community: '料理部'
      },
      content: {
        text: '初めてのパン作りに挑戦！🍞 思ったより難しかったけど、みんなで食べると美味しさ倍増でした💕 次はケーキ作りに挑戦します',
  images: [PH1, PH2, PH3]
      },
      stats: {
        likes: 31,
        comments: 12,
        shares: 6
      },
      timestamp: '6時間前',
      isLiked: false
    }
  ];

  const stories = [
    { id: '1', name: '写真部', image: '', hasNew: true },
    { id: '2', name: 'プログラミング部', image: '', hasNew: true },
    { id: '3', name: '料理部', image: '', hasNew: false },
    { id: '4', name: '映像制作部', image: '', hasNew: true },
    { id: '5', name: '音楽部', image: '', hasNew: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                Community
              </h1>
            </div>
            
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="投稿やメンバーを検索..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
          {/* Left Sidebar - Stories & Communities */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stories */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">ストーリー</h3>
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {/* Add Story */}
                <div className="flex-shrink-0 text-center">
                  <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-2">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-600">追加</span>
                </div>
                
                {stories.map((story) => (
                  <div key={story.id} className="flex-shrink-0 text-center">
                    <div className={`w-16 h-16 rounded-full p-0.5 mb-2 ${
                      story.hasNew 
                        ? 'bg-gradient-to-tr from-pink-500 to-yellow-500' 
                        : 'bg-gray-300'
                    }`}>
                      <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {story.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 truncate block w-16">
                      {story.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">マイコミュニティ</h3>
              <div className="space-y-3">
                {communities.map((community) => (
                  <div key={community.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {community.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{community.name}</p>
                        <p className="text-xs text-gray-500">{community.memberCount}人</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{community.recentPosts}件の新着</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">🗓️ 今度のイベント</h3>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                    <p className="text-xs text-gray-600">{event.community}</p>
                    <p className="text-xs text-blue-600 mt-1">{event.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Creation */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">あ</span>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="今日の活動をシェアしよう！✨"
                    className="w-full p-3 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                    <Camera className="h-5 w-5" />
                    <span className="text-sm">写真</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-purple-500 transition-colors">
                    <span className="text-lg">🎥</span>
                    <span className="text-sm">動画</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                    <span className="text-lg">📝</span>
                    <span className="text-sm">テキスト</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Feed Posts */}
            {feedPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Post Header */}
                <div className="p-4 pb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {post.author.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {post.author.name}
                        </h3>
                        <span className="text-gray-500 text-sm">{post.author.username}</span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span className="text-gray-500 text-sm">{post.timestamp}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {post.author.community}
                        </span>
                        {post.content.location && (
                          <span className="text-xs text-gray-500">📍 {post.content.location}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  <p className="text-gray-900 leading-relaxed">{post.content.text}</p>
                </div>

                {/* Post Images */}
                {post.content.images && post.content.images.length > 0 && (
                  <div className={`grid gap-1 ${
                    post.content.images.length === 1 ? 'grid-cols-1' :
                    post.content.images.length === 2 ? 'grid-cols-2' :
                    'grid-cols-2'
                  }`}>
                    {post.content.images.slice(0, 4).map((image, index) => (
                      <div
                        key={index}
                        className={`relative bg-gray-200 ${
                          post.content.images!.length === 1 ? 'aspect-video' : 'aspect-square'
                        } ${index === 3 && post.content.images!.length > 4 ? 'relative' : ''}`}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <Camera className="h-8 w-8 text-gray-400" />
                        </div>
                        {index === 3 && post.content.images!.length > 4 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              +{post.content.images!.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Post Actions */}
                <div className="p-4 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex space-x-6">
                      <button className={`flex items-center space-x-2 transition-colors ${
                        post.isLiked 
                          ? 'text-red-500' 
                          : 'text-gray-500 hover:text-red-500'
                      }`}>
                        <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span className="text-sm font-medium">{post.stats.likes}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                        <MessageCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">{post.stats.comments}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                        <Share2 className="h-5 w-5" />
                        <span className="text-sm font-medium">{post.stats.shares}</span>
                      </button>
                    </div>
                  </div>
                  
                  {post.stats.likes > 0 && (
                    <p className="text-sm text-gray-900 font-medium mb-1">
                      {post.stats.likes}人がいいねしました
                    </p>
                  )}
                  
                  {post.stats.comments > 0 && (
                    <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                      コメント{post.stats.comments}件をすべて表示
                    </button>
                  )}
                </div>

                {/* Comment Input */}
                <div className="border-t border-gray-100 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">あ</span>
                    </div>
                    <input
                      type="text"
                      placeholder="コメントを追加..."
                      className="flex-1 text-sm focus:outline-none"
                    />
                    <button className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors">
                      投稿
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialFeed;