'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Heart, MessageCircle, Share2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { AuthProvider } from '@/contexts/AuthContext';
import { getAllPosts } from '@/lib/mock/mockSocialData';

const TeamPostsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const teamName = decodeURIComponent(params.teamName as string);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    // チームの投稿のみをフィルタリング
    const allPosts = getAllPosts();
    const teamPosts = allPosts.filter(post => post.author.community === teamName);
    setPosts(teamPosts);
  }, [teamName]);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{teamName}の投稿</h1>
                <p className="text-sm text-gray-500">{posts.length}件の投稿</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 py-8">
          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
                >
                  {/* Post Header */}
                  <div className="p-4 flex items-center space-x-3">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={48}
                      height={48}
                      className="rounded-full cursor-pointer hover:opacity-80"
                      onClick={() => router.push(`/profile?userId=${post.author.id}`)}
                    />
                    <div className="flex-1">
                      <p 
                        className="font-semibold text-gray-900 cursor-pointer hover:underline"
                        onClick={() => router.push(`/profile?userId=${post.author.id}`)}
                      >
                        {post.author.name}
                      </p>
                      <p className="text-sm text-gray-500">{post.timestamp}</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      {post.author.community}
                    </span>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-3">
                    <p className="text-gray-900 whitespace-pre-wrap">{post.content.text}</p>
                  </div>

                  {/* Post Images */}
                  {post.content.images && post.content.images.length > 0 && (
                    <div className={`grid ${
                      post.content.images.length === 1 ? 'grid-cols-1' :
                      post.content.images.length === 2 ? 'grid-cols-2' :
                      post.content.images.length === 3 ? 'grid-cols-3' :
                      'grid-cols-2'
                    } gap-1`}>
                      {post.content.images.slice(0, 4).map((img: string, idx: number) => {
                        // 有効なURLかチェック
                        const isValidUrl = img && (img.startsWith('http://') || img.startsWith('https://'));
                        if (!isValidUrl) return null;
                        
                        return (
                          <div key={idx} className="relative aspect-square bg-gray-100">
                            <Image
                              src={img}
                              alt={`投稿画像 ${idx + 1}`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            {idx === 3 && post.content.images.length > 4 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white text-2xl font-bold">
                                  +{post.content.images.length - 4}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                        <Heart className="h-5 w-5" />
                        <span className="text-sm font-medium">{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                        <MessageCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">{post.comments}</span>
                      </button>
                    </div>
                    <button className="text-gray-600 hover:text-green-500 transition-colors">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">まだ投稿がありません</p>
              <p className="text-gray-400 text-sm mt-2">最初の投稿をしてみましょう！</p>
              <button
                onClick={() => router.push('/?tab=feed')}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                投稿する
              </button>
            </div>
          )}
        </div>
      </div>
    </AuthProvider>
  );
};

export default TeamPostsPage;
