'use client';

import React from 'react';
import { X, Heart, MessageCircle, Share2, Clock } from 'lucide-react';
import Image from 'next/image';
import { getAllPosts } from '@/lib/mock/mockSocialData';

interface PostDetailModalProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ postId, isOpen, onClose }) => {
  if (!isOpen) return null;

  const posts = getAllPosts();
  const post = posts.find(p => p.id === postId);

  if (!post) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">投稿詳細</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* 投稿者情報 */}
          <div className="flex items-center space-x-3 mb-4">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-gray-900">{post.author.name}</h3>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  管理者
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className="text-blue-600">{post.author.community}</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{post.timestamp}</span>
                </span>
              </div>
            </div>
          </div>

          {/* 投稿本文 */}
          <div className="mb-4">
            <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
              {post.content.text}
            </p>
          </div>

          {/* 画像 */}
          {post.content.images && post.content.images.length > 0 && (
            <div className={`grid gap-2 mb-4 ${
              post.content.images.length === 1 ? 'grid-cols-1' : 
              post.content.images.length === 2 ? 'grid-cols-2' : 
              'grid-cols-2'
            }`}>
              {post.content.images.map((img, idx) => {
                const isValidUrl = img && (img.startsWith('http://') || img.startsWith('https://'));
                if (!isValidUrl) return null;
                
                return (
                  <div 
                    key={idx} 
                    className={`relative rounded-lg overflow-hidden bg-gray-100 ${
                      post.content.images!.length === 1 ? 'aspect-video' : 'aspect-square'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={'投稿画像 ' + (idx + 1)}
                      fill
                      className="object-cover"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* アクション */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-6">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                <Heart className="h-5 w-5" />
                <span className="text-sm font-medium">{post.likes.length}</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm font-medium">{post.comments.length}</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
                <Share2 className="h-5 w-5" />
                <span className="text-sm font-medium">{post.shares}</span>
              </button>
            </div>
          </div>

          {/* コメントセクション */}
          {post.comments.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">コメント ({post.comments.length})</h3>
              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-3">
                    <Image
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-sm text-gray-900">
                          {comment.author.name}
                        </span>
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
