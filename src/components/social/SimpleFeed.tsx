'use client';

import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Plus
} from 'lucide-react';
import Image from 'next/image';
import PublicProfile from '@/components/profile/PublicProfile';
import { PH1, PH2, PH3 } from '@/lib/placeholders';

interface SocialFeedProps {
  communities: Array<{
    name: string;
    memberCount: number;
    recentPosts: number;
    upcomingEvents: number;
    activeRate: number;
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
    community: string;
    status?: string;
    participants?: number;
    capacity?: number;
    description?: string;
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
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');
  const [publicProfileOpen, setPublicProfileOpen] = useState(false);
  const [publicProfileData, setPublicProfileData] = useState<any>(null);

  const samplePosts = [
    {
      id: '1',
      author: {
        name: '田中花子',
        community: '写真部',
        avatar: '',
        diagnosis: 'ENFP'
      },
      content: {
        text: '今日の撮影会、天気に恵まれて素晴らしい写真がたくさん撮れました！新しいメンバーの皆さんも上達が早くて驚きです 📸✨',
        images: [PH1, PH2]
      },
      timestamp: '2時間前',
      likes: 24,
      comments: 8,
      shares: 3
    },
    {
      id: '2',
      author: {
        name: '山田太郎',
        community: 'プログラミング部',
        avatar: '',
        diagnosis: 'INTP'
      },
      content: {
        text: 'ハッカソン完了！React + TypeScriptで作ったアプリがついに形になりました 🎉 チーム開発の面白さを実感できた3日間でした。',
        images: []
      },
      timestamp: '4時間前',
      likes: 32,
      comments: 12,
      shares: 5
    },
    {
      id: '3',
      author: {
        name: '佐藤美咲',
        community: '料理部',
        avatar: '',
        diagnosis: 'ISFP'
      },
      content: {
        text: '今日はパスタ作りに挑戦！手打ちは難しいけど、みんなでワイワイ作ると楽しいですね 🍝 来週はピザ作りの予定です！',
        images: [PH3]
      },
      timestamp: '6時間前',
      likes: 18,
      comments: 6,
      shares: 2
    }
  ];

  // CM投稿（イベント・アンケート通知）のサンプルデータ
  const managerPosts = [
    {
      id: 'cm-1',
      type: 'event',
      title: '春の撮影会 - 参加者募集中！',
      description: '桜の季節に合わせて屋外撮影を行います。カメラの基本操作から構図のコツまで、初心者の方も安心してご参加ください！',
      community: '写真部',
      author: 'コミュニティマネージャー',
      date: '2024年4月10日 10:00-16:00',
      location: '上野公園',
      participants: 12,
      capacity: 20,
      timestamp: '30分前'
    },
    {
      id: 'cm-2', 
      type: 'survey',
      title: '料理部の次回企画についてアンケート',
      description: 'みんなで作ってみたい料理ジャンルを教えてください！回答期限は今週末までです。',
      community: '料理部',
      author: 'コミュニティマネージャー',
      questions: ['和食', '洋食', 'イタリアン', 'デザート'],
      timestamp: '1時間前'
    }
  ];

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
      }
      return newLiked;
    });
  };

  const getCommunityGradient = (community: string) => {
    switch (community) {
      case '写真部': return 'from-slate-500 to-slate-600';
      case 'プログラミング部': return 'from-stone-600 to-stone-700';
      case '料理部': return 'from-amber-600 to-amber-700';
      case '映像制作部': return 'from-zinc-600 to-zinc-700';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Main Feed */}
      <div className="space-y-6">
        {/* Post Creation */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-medium">あ</span>
            </div>
            <div className="flex-1">
              <button 
                onClick={() => setShowActivityModal(true)}
                className="w-full text-left px-4 py-3 bg-stone-50 hover:bg-stone-100 rounded-xl text-stone-600 transition-colors"
              >
                今日の活動を投稿しましょう...
              </button>
            </div>
            <button 
              onClick={() => setShowActivityModal(true)}
              className="p-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* CM Posts (Events & Surveys) */}
        {managerPosts.map((cmPost) => (
          <div key={cmPost.id} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border-l-4 border-purple-400 overflow-hidden">
            {cmPost.type === 'event' ? (
              <div className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">CM</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">🎯 {cmPost.title}</h3>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        イベント
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{cmPost.description}</p>
                    <div className="bg-white rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">📅 {cmPost.date}</span>
                        <span className="text-sm text-green-600 font-medium">
                          {cmPost.participants}/{cmPost.capacity}名参加
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">📍 {cmPost.location}</div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <button className="px-4 py-2 bg-slate-600 text-white rounded-lg text-sm hover:bg-slate-700">
                        参加する
                      </button>
                      <button className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm hover:bg-stone-200">
                        詳細を見る
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-stone-600 to-stone-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">CM</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">📊 {cmPost.title}</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        アンケート
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{cmPost.description}</p>
                    <div className="bg-white rounded-lg p-4 space-y-2">
                      {cmPost.questions?.map((question, index) => (
                        <button 
                          key={index} 
                          className="w-full text-left p-2 hover:bg-gray-50 rounded border border-gray-200"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                    <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">
                      アンケートに回答
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Community Posts */}
        {samplePosts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Post Header */}
            <div className="p-6 pb-4">
              <div className="flex items-center space-x-3">
                <button onClick={() => { setPublicProfileData({ nickname: post.author.name, bio: '', goal: '', diagnosis: post.author.diagnosis }); setPublicProfileOpen(true); }} className={`flex-1 text-left flex items-center gap-3`}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${getCommunityGradient(post.author.community)} rounded-xl flex items-center justify-center`}>
                    <span className="text-white font-medium">{post.author.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        {post.author.name}
                        {post.author.diagnosis && (
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full font-medium">{post.author.diagnosis}</span>
                        )}
                      </h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">{post.author.community}</span>
                    </div>
                    <p className="text-sm text-gray-500">{post.timestamp}</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Post Content */}
            <div className="px-6 pb-4">
              <p className="text-gray-800 leading-relaxed mb-4">{post.content.text}</p>
              
              {post.content.images.length > 0 && (
                <div className={`grid gap-2 rounded-xl overflow-hidden ${
                  post.content.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                }`}>
                  {post.content.images.slice(0, 4).map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-sm">画像 {index + 1}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Post Stats */}
            <div className="px-6 py-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}いいね</span>
                <div className="flex space-x-4">
                  <span>{post.comments}コメント</span>
                  <span>{post.shares}シェア</span>
                </div>
              </div>
            </div>

            {/* Post Actions */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-around">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    likedPosts.has(post.id)
                      ? 'text-rose-700 bg-rose-50'
                      : 'text-stone-600 hover:text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                  <span className="font-medium">いいね</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-stone-600 hover:text-slate-700 hover:bg-slate-50 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-medium">コメント</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-stone-600 hover:text-amber-700 hover:bg-amber-50 transition-colors">
                  <Share2 className="h-5 w-5" />
                  <span className="font-medium">シェア</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Post Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">今日の活動を投稿</h3>
              <button 
                onClick={() => setShowActivityModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  所属部活
                </label>
                <select 
                  value={selectedCommunity}
                  onChange={(e) => setSelectedCommunity(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">選択してください</option>
                  {communities.map((community) => (
                    <option key={community.name} value={community.name}>
                      {community.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  活動内容
                </label>
                <textarea 
                  placeholder="今日はどんな活動をしましたか？"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  写真を追加（任意）
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <span className="text-gray-500">クリックして写真を選択</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => setShowActivityModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button 
                onClick={() => {
                  // 投稿処理（実装時に追加）
                  setShowActivityModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                投稿する
              </button>
            </div>
          </div>
        </div>
      )}
      {publicProfileOpen && (
        <PublicProfile onClose={() => { setPublicProfileOpen(false); setPublicProfileData(null); }} profileData={publicProfileData} />
      )}
    </div>
  );
};

export default SocialFeed;