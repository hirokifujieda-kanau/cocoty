'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Share2, Camera, Video, FileText, MoreHorizontal, Send, Smile } from 'lucide-react';

interface ActivityPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    community: string;
  };
  content: {
    text: string;
    images?: string[];
    videos?: string[];
  };
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

interface TimelineProps {
  posts: ActivityPost[];
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
}

const ActivityTimeline: React.FC<TimelineProps> = ({
  posts,
  onLike,
  onComment,
  onShare
}) => {
  const [newPost, setNewPost] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50 px-3 sm:px-4 py-3 sm:py-4">
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent text-center">
            タイムライン
          </h1>
        </div>

        <div className="p-2 sm:p-4">
          {/* New Post Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 mb-3 sm:mb-4">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-medium text-xs sm:text-sm">あ</span>
              </div>
              <div className="flex-1 min-w-0">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="今日の活動をシェアしよう！✨"
                  className="w-full p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-colors border-0"
                  rows={3}
                />
                <div className="flex items-center justify-between mt-2 sm:mt-3">
                  <div className="flex space-x-1 sm:space-x-3">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors p-1.5 sm:p-2 hover:bg-blue-50 rounded-lg">
                      <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-sm hidden sm:inline">写真</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-purple-500 transition-colors p-1.5 sm:p-2 hover:bg-purple-50 rounded-lg">
                      <Video className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-sm hidden sm:inline">動画</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors p-1.5 sm:p-2 hover:bg-green-50 rounded-lg">
                      <Smile className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-sm hidden sm:inline">気分</span>
                    </button>
                  </div>
                  <button
                    disabled={!newPost.trim()}
                    className="px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:transform-none flex items-center justify-center"
                  >
                    <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Posts */}
          <div className="space-y-3 sm:space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Post Header */}
                <div className="p-3 sm:p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium text-xs sm:text-sm">
                          {post.author.name.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                            {post.author.name}
                          </h3>
                          <span className="text-gray-500 text-xs hidden sm:inline truncate">@{post.author.name.toLowerCase()}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 flex-wrap">
                          <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-1 sm:mr-2">
                            {post.author.community}
                          </span>
                          <span className="hidden sm:inline mx-2">•</span>
                          <span className="text-xs">{post.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-1 sm:p-1.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                      <MoreHorizontal className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-3 sm:px-4 pb-3">
                  <p className="text-gray-900 leading-relaxed text-xs sm:text-sm mb-2 sm:mb-3">
                    {post.content.text}
                  </p>

                  {/* Images */}
                  {post.content.images && post.content.images.length > 0 && (
                    <div className={`grid gap-0.5 rounded-lg sm:rounded-xl overflow-hidden ${
                      post.content.images.length === 1 ? 'grid-cols-1' :
                      post.content.images.length === 2 ? 'grid-cols-2' :
                      'grid-cols-2'
                    }`}>
                      {post.content.images.slice(0, 4).map((image, index) => (
                        <div
                          key={index}
                          className={`relative bg-gray-200 ${
                            post.content.images!.length === 1 ? 'aspect-video' : 'aspect-square'
                          }`}
                        >
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Videos */}
                  {post.content.videos && post.content.videos.length > 0 && (
                    <div className="mt-2 sm:mt-3 rounded-lg sm:rounded-xl overflow-hidden">
                      {post.content.videos.map((video, index) => (
                        <div
                          key={index}
                          className="aspect-video bg-gray-900 rounded-lg sm:rounded-xl overflow-hidden"
                        >
                          <video
                            src={video}
                            controls
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Stats */}
                <div className="px-3 sm:px-4 py-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex space-x-2 sm:space-x-4">
                      {post.likes > 0 && (
                        <span>{post.likes}人がいいね</span>
                      )}
                      {post.comments > 0 && (
                        <span>{post.comments}件のコメント</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Post Actions */}
                <div className="px-2 sm:px-4 py-2 sm:py-3 border-t border-gray-100">
                  <div className="flex items-center justify-around">
                    <button
                      onClick={() => onLike(post.id)}
                      className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors ${
                        post.isLiked
                          ? 'text-red-500 bg-red-50'
                          : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${post.isLiked ? 'fill-current' : ''}`}
                      />
                      <span className="text-xs sm:text-sm font-medium hidden sm:inline">いいね</span>
                    </button>
                    <button
                      onClick={() => onComment(post.id)}
                      className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-sm font-medium hidden sm:inline">コメント</span>
                    </button>
                    <button
                      onClick={() => onShare(post.id)}
                      className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-gray-500 hover:text-green-500 hover:bg-green-50 transition-colors"
                    >
                      <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-sm font-medium hidden sm:inline">シェア</span>
                    </button>
                  </div>
                </div>

                {/* Comment Input */}
                <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-medium">あ</span>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                      <input
                        type="text"
                        placeholder="コメントを追加..."
                        className="w-full text-xs sm:text-sm bg-transparent focus:outline-none"
                      />
                    </div>
                    <button className="text-blue-500 text-xs sm:text-sm font-medium hover:text-blue-600 transition-colors">
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

export default ActivityTimeline;