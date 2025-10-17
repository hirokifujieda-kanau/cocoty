'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Plus, Camera, FileText, Calendar } from 'lucide-react';
import Image from 'next/image';

interface TimelinePost {
  id: string;
  author: {
    name: string;
    avatar: string;
    community: string;
  };
  content: {
    text: string;
    images: string[];
  };
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

interface SimpleTimelineProps {
  posts: TimelinePost[];
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
}

const SimpleTimeline: React.FC<SimpleTimelineProps> = ({
  posts,
  onLike,
  onComment,
  onShare
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'photos' | 'events' | 'achievements'>('all');

  const getCommunityColor = (community: string) => {
    switch (community) {
      case '写真部': return 'from-blue-400 to-cyan-500';
      case 'プログラミング部': return 'from-green-400 to-emerald-500';
      case '料理部': return 'from-orange-400 to-pink-500';
      case '映像制作部': return 'from-purple-400 to-indigo-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const samplePosts = [
    {
      id: '1',
      author: {
        name: '田中花子',
        avatar: '',
        community: '写真部'
      },
      content: {
        text: '桜の撮影会での一枚。光の使い方を意識して撮影しました。春の柔らかい光が桜の花びらを美しく照らしてくれました 🌸',
        images: ['/placeholder-1.jpg']
      },
      timestamp: '1時間前',
      likes: 28,
      comments: 12,
      isLiked: false,
      type: 'photo'
    },
    {
      id: '2',
      author: {
        name: '山田太郎',
        avatar: '',
        community: 'プログラミング部'
      },
      content: {
        text: 'チーム開発プロジェクト完成！3週間かけて作ったWebアプリがついにリリースできました。みんなで協力して作り上げたものは格別です 🚀',
        images: []
      },
      timestamp: '3時間前',
      likes: 45,
      comments: 18,
      isLiked: true,
      type: 'achievement'
    },
    {
      id: '3',
      author: {
        name: '佐藤美咲',
        avatar: '',
        community: '料理部'
      },
      content: {
        text: '今日は手作りピザに挑戦！生地から作るのは初めてでしたが、みんなで作ると楽しいですね。次回はパスタ作りに挑戦予定です 🍕',
        images: ['/placeholder-2.jpg', '/placeholder-3.jpg']
      },
      timestamp: '5時間前',
      likes: 22,
      comments: 8,
      isLiked: false,
      type: 'activity'
    },
    {
      id: '4',
      author: {
        name: '高橋智子',
        avatar: '',
        community: '映像制作部'
      },
      content: {
        text: '短編映画の撮影が完了しました！編集作業に入ります。今回はドローンも使用してダイナミックな映像が撮れました 🎬',
        images: ['/placeholder-4.jpg']
      },
      timestamp: '8時間前',
      likes: 35,
      comments: 15,
      isLiked: false,
      type: 'project'
    }
  ];

  const filters = [
    { id: 'all', label: 'すべて', icon: null },
    { id: 'photos', label: '写真', icon: Camera },
    { id: 'events', label: 'イベント', icon: Calendar },
    { id: 'achievements', label: '成果', icon: FileText }
  ];

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
        <div className="flex space-x-2">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span className="font-medium">{filter.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Post Creation */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-medium">あ</span>
          </div>
          <div className="flex-1">
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors">
              活動の記録を投稿しましょう...
            </button>
          </div>
          <button className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Timeline Posts */}
      <div className="space-y-6">
        {samplePosts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Post Header */}
            <div className="p-6 pb-4">
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${getCommunityColor(post.author.community)} rounded-xl flex items-center justify-center`}>
                  <span className="text-white font-medium text-lg">
                    {post.author.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-bold text-gray-900">{post.author.name}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                      {post.author.community}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{post.timestamp}</p>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="px-6 pb-6">
              <p className="text-gray-800 leading-relaxed text-lg mb-6">{post.content.text}</p>
              
              {post.content.images.length > 0 && (
                <div className="rounded-2xl overflow-hidden">
                  {post.content.images.length === 1 ? (
                    <div className="aspect-video bg-gray-200 rounded-2xl flex items-center justify-center">
                      <span className="text-gray-400">画像プレビュー</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {post.content.images.map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-200 rounded-xl flex items-center justify-center">
                          <span className="text-gray-400 text-sm">画像 {index + 1}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Post Stats */}
            <div className="px-6 py-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="font-medium">{post.likes}いいね</span>
                <div className="flex space-x-4">
                  <span>{post.comments}コメント</span>
                </div>
              </div>
            </div>

            {/* Post Actions */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-around">
                <button
                  onClick={() => onLike(post.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-colors ${
                    post.isLiked
                      ? 'text-red-600 bg-red-50'
                      : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span className="font-medium">いいね</span>
                </button>
                <button
                  onClick={() => onComment(post.id)}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-medium">コメント</span>
                </button>
                <button
                  onClick={() => onShare(post.id)}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                  <span className="font-medium">シェア</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleTimeline;