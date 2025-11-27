'use client';

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Plus,
  X,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import Image from 'next/image';
import PublicProfile from '@/components/profile/PublicProfile';
import EventDetailModal from '@/components/social/EventDetailModal';
import SurveyAnswerModal from '@/components/social/SurveyAnswerModal';
import { PH1, PH2, PH3 } from '@/lib/placeholders';
import { useAuth } from '@/context/AuthContext';
import {
  getAllEvents,
  getAllSurveys,
  getAllPosts,
  joinEvent,
  leaveEvent,
  isUserJoined,
  likePost,
  isPostLiked,
  addComment,
  createPost
} from '@/lib/mock/mockSocialData';

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
  const { currentUser } = useAuth();
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');
  const [publicProfileOpen, setPublicProfileOpen] = useState(false);
  const [publicProfileData, setPublicProfileData] = useState<any>(null);
  
  // 投稿フォーム
  const [postText, setPostText] = useState('');
  const [postImages, setPostImages] = useState<string[]>([]);
  
  // モーダル状態
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  
  // データ状態
  const [events, setEvents] = useState(getAllEvents());
  const [surveys, setSurveys] = useState(getAllSurveys());
  const [posts, setPosts] = useState(getAllPosts());

  // データを定期的に更新
  const refreshData = () => {
    setEvents(getAllEvents());
    setSurveys(getAllSurveys());
    setPosts(getAllPosts());
  };

  const handleJoinEvent = (eventId: string) => {
    if (!currentUser) return;
    
    if (isUserJoined(eventId, currentUser.id)) {
      leaveEvent(eventId, currentUser.id);
    } else {
      if (!joinEvent(eventId, currentUser.id)) {
        alert('定員に達しているため参加できません');
      }
    }
    refreshData();
  };

  const handleLike = (postId: string) => {
    if (!currentUser) return;
    likePost(postId, currentUser.id);
    refreshData();
  };

  const handleAddComment = (postId: string) => {
    if (!currentUser) return;
    const text = commentInputs[postId];
    if (!text?.trim()) return;

    addComment(postId, currentUser.id, currentUser.name, currentUser.avatar, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    refreshData();
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  // 画像をBase64に変換
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const readers = fileArray.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(images => {
      setPostImages(prev => [...prev, ...images].slice(0, 4)); // 最大4枚
    });
  };

  // 画像を削除
  const removeImage = (index: number) => {
    setPostImages(prev => prev.filter((_, i) => i !== index));
  };

  // 投稿を作成
  const handleCreatePost = () => {
    if (!currentUser || !postText.trim() || !selectedCommunity) return;

    const newPost = createPost(
      currentUser.id,
      currentUser.name,
      selectedCommunity,
      currentUser.avatar,
      currentUser.diagnosis,
      postText,
      postImages
    );

    if (newPost) {
      setPostText('');
      setPostImages([]);
      setSelectedCommunity('');
      setShowActivityModal(false);
      refreshData();
    }
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
        {events.map((event) => (
          <div key={event.id} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border-l-4 border-purple-400 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">CM</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">🎯 {event.title}</h3>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      イベント
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                  <div className="bg-white rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">📅 {event.date} {event.time}</span>
                      <span className="text-sm text-green-600 font-medium">
                        {(event.participants || []).length}/{event.capacity}名参加
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">📍 {event.location}</div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button 
                      onClick={() => handleJoinEvent(event.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentUser && isUserJoined(event.id, currentUser.id)
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-slate-600 text-white hover:bg-slate-700'
                      }`}
                    >
                      {currentUser && isUserJoined(event.id, currentUser.id) ? 'キャンセル' : '参加する'}
                    </button>
                    <button 
                      onClick={() => setSelectedEventId(event.id)}
                      className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm hover:bg-stone-200"
                    >
                      詳細を見る
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {surveys.map((survey) => (
          <div key={survey.id} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border-l-4 border-green-400 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-stone-600 to-stone-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">CM</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">📊 {survey.title}</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      アンケート
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{survey.description}</p>
                  <button 
                    onClick={() => setSelectedSurveyId(survey.id)}
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 font-medium"
                  >
                    アンケートに回答
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Community Posts */}
        {posts.map((post) => (
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
              
              {post.content.images && post.content.images.length > 0 && (
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
                <span>{post.likes.length}いいね</span>
                <div className="flex space-x-4">
                  <span>{post.comments.length}コメント</span>
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
                    currentUser && isPostLiked(post.id, currentUser.id)
                      ? 'text-rose-700 bg-rose-50'
                      : 'text-stone-600 hover:text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${currentUser && isPostLiked(post.id, currentUser.id) ? 'fill-current' : ''}`} />
                  <span className="font-medium">いいね</span>
                </button>
                <button 
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-stone-600 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-medium">コメント</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-stone-600 hover:text-amber-700 hover:bg-amber-50 transition-colors">
                  <Share2 className="h-5 w-5" />
                  <span className="font-medium">シェア</span>
                </button>
              </div>
            </div>

            {/* Comments Section */}
            {expandedComments.has(post.id) && (
              <div className="px-6 py-4 border-t border-gray-100 bg-white space-y-4">
                {/* Comment Input */}
                <div className="flex items-start space-x-3">
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      placeholder="コメントを追加..."
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    />
                  </div>
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm font-medium"
                  >
                    投稿
                  </button>
                </div>

                {/* Comment List */}
                {post.comments.length > 0 && (
                  <div className="space-y-3">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={comment.author.avatar}
                          alt={comment.author.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-medium text-sm text-gray-900">{comment.author.name}</p>
                            <span className="text-xs text-gray-500">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Activity Post Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">今日の活動を投稿</h3>
              <button 
                onClick={() => {
                  setShowActivityModal(false);
                  setPostText('');
                  setPostImages([]);
                  setSelectedCommunity('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  所属部活 <span className="text-red-500">*</span>
                </label>
                <select 
                  value={selectedCommunity}
                  onChange={(e) => setSelectedCommunity(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                  活動内容 <span className="text-red-500">*</span>
                </label>
                <textarea 
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="今日はどんな活動をしましたか？"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  rows={4}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  写真を追加（任意・最大4枚）
                </label>
                
                {/* 画像プレビュー */}
                {postImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {postImages.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={image} 
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* アップロードボタン */}
                {postImages.length < 4 && (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors block">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-600">クリックして写真を選択</span>
                    <p className="text-xs text-gray-400 mt-1">
                      残り{4 - postImages.length}枚まで追加できます
                    </p>
                  </label>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => {
                  setShowActivityModal(false);
                  setPostText('');
                  setPostImages([]);
                  setSelectedCommunity('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button 
                onClick={handleCreatePost}
                disabled={!postText.trim() || !selectedCommunity}
                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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
      
      {/* Event Detail Modal */}
      {selectedEventId && (
        <EventDetailModal
          eventId={selectedEventId}
          isOpen={!!selectedEventId}
          onClose={() => {
            setSelectedEventId(null);
            refreshData();
          }}
        />
      )}

      {/* Survey Answer Modal */}
      {selectedSurveyId && (
        <SurveyAnswerModal
          surveyId={selectedSurveyId}
          isOpen={!!selectedSurveyId}
          onClose={() => {
            setSelectedSurveyId(null);
            refreshData();
          }}
        />
      )}
    </div>
  );
};

export default SocialFeed;