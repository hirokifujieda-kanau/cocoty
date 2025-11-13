'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getAllEvents, 
  getAllSurveys, 
  getAllPosts,
  joinEvent,
  leaveEvent,
  isUserJoined,
  likePost,
  isPostLiked,
  addComment
} from '@/lib/mock/mockSocialData';
import EventDetailModal from '@/components/social/EventDetailModal';
import SurveyAnswerModal from '@/components/social/SurveyAnswerModal';

type ContentType = 'all' | 'event' | 'post' | 'survey';

const MemberTimeline: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeFilter, setActiveFilter] = useState<ContentType>('all');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  // データ取得
  const [events, setEvents] = useState(getAllEvents());
  const [surveys, setSurveys] = useState(getAllSurveys());
  const [posts, setPosts] = useState(getAllPosts());

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

  const handleComment = (postId: string) => {
    if (!currentUser || !commentInputs[postId]?.trim()) return;
    
    addComment(postId, currentUser.id, currentUser.name, currentUser.avatar, commentInputs[postId]);
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

  // タイムラインアイテムを作成し、時系列順にソート
  const createTimeline = () => {
    const items: Array<{type: string; timestamp: Date; data: any}> = [];
    
    // イベントを追加
    events.forEach(event => {
      items.push({
        type: 'event',
        timestamp: new Date(event.date), // 仮の日付変換
        data: event
      });
    });
    
    // アンケートを追加
    surveys.forEach(survey => {
      items.push({
        type: 'survey',
        timestamp: new Date(survey.timestamp), // 仮の日付変換
        data: survey
      });
    });
    
    // 投稿を追加
    posts.forEach(post => {
      items.push({
        type: 'post',
        timestamp: new Date(post.timestamp), // 仮の日付変換
        data: post
      });
    });
    
    // 時系列順にソート（新しい順）
    return items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const timeline = createTimeline();

  // フィルタリング
  const filteredTimeline = timeline.filter(item => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* フィルタータブ */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors ' +
              (activeFilter === 'all'
                ? 'bg-slate-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
            }
          >
            すべて
          </button>
          <button
            onClick={() => setActiveFilter('post')}
            className={
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors ' +
              (activeFilter === 'post'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
            }
          >
            投稿
          </button>
          <button
            onClick={() => setActiveFilter('event')}
            className={
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors ' +
              (activeFilter === 'event'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
            }
          >
            イベント
          </button>
          <button
            onClick={() => setActiveFilter('survey')}
            className={
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors ' +
              (activeFilter === 'survey'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
            }
          >
            アンケート
          </button>
        </div>
      </div>

      {/* タイムライン */}
      {filteredTimeline.map((item, index) => {
        if (item.type === 'event') {
          const event = item.data;
          return (
            <div key={`event-${event.id}`} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border-l-4 border-purple-400 overflow-hidden">
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
                      <span className="text-xs text-gray-500">{event.community}</span>
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
          );
        }

        if (item.type === 'survey') {
          const survey = item.data;
          return (
            <div key={`survey-${survey.id}`} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border-l-4 border-green-400 overflow-hidden">
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
                      <span className="text-xs text-gray-500">{survey.community}</span>
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
          );
        }

        if (item.type === 'post') {
          const post = item.data;
          const isLiked = currentUser ? isPostLiked(post.id, currentUser.id) : false;
          const commentsExpanded = expandedComments.has(post.id);

          return (
            <div key={`post-${post.id}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 pb-4">
                <div className="flex items-center space-x-3">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                      <span className="text-sm text-gray-500">{post.author.community}</span>
                    </div>
                    <p className="text-sm text-gray-500">{post.timestamp}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-4">
                <p className="text-gray-800 whitespace-pre-wrap">{post.content.text}</p>
              </div>

              {post.content.images && post.content.images.length > 0 && (
                <div className={
                  post.content.images.length === 1
                    ? 'px-6 pb-4'
                    : 'grid grid-cols-2 gap-1'
                }>
                  {post.content.images
                    .filter((img: string) => img && img.startsWith('http'))
                    .map((img: string, idx: number) => (
                      <div key={idx} className="relative w-full" style={{ paddingBottom: post.content.images!.length === 1 ? '56.25%' : '100%' }}>
                        <Image
                          src={img}
                          alt={`Post image ${idx + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ))}
                </div>
              )}

              <div className="px-6 py-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 hover:text-red-500 transition-colors ${
                      isLiked ? 'text-red-500' : ''
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{post.likes.length}</span>
                  </button>
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>{post.comments.length}</span>
                  </button>
                  <button className="flex items-center space-x-2 hover:text-green-500 transition-colors">
                    <Share2 className="h-5 w-5" />
                    <span>{post.shares}</span>
                  </button>
                </div>
              </div>

              {commentsExpanded && (
                <div className="px-6 pb-4 border-t border-gray-100">
                  <div className="mt-4 space-y-3">
                    {post.comments.map((comment: any) => (
                      <div key={comment.id} className="flex space-x-3">
                        <Image
                          src={comment.author.avatar}
                          alt={comment.author.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <div className="flex-1 bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-900">{comment.author.name}</p>
                          <p className="text-sm text-gray-700">{comment.text}</p>
                          <p className="text-xs text-gray-500 mt-1">{comment.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {currentUser && (
                    <div className="mt-4 flex space-x-2">
                      <Image
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <input
                        type="text"
                        placeholder="コメントを入力..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleComment(post.id);
                          }
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleComment(post.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                      >
                        送信
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }

        return null;
      })}

      {filteredTimeline.length === 0 && (
        <div className="bg-white rounded-xl p-8 text-center text-gray-400">
          <p>該当するコンテンツがありません</p>
        </div>
      )}

      {/* モーダル */}
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

export default MemberTimeline;
