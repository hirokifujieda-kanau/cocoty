'use client';

import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Calendar, MapPin, Users as UsersIcon, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import EventDetailModal from '@/components/social/EventDetailModal';
import SurveyAnswerModal from '@/components/social/SurveyAnswerModal';
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
} from '@/lib/mock/mockSocialData';

interface TeamTimelineProps {
  teamName: string;
}

const TeamTimeline: React.FC<TeamTimelineProps> = ({ teamName }) => {
  const { currentUser } = useAuth();
  const router = useRouter();
  
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  
  const [events, setEvents] = useState(getAllEvents());
  const [surveys, setSurveys] = useState(getAllSurveys());
  const [posts, setPosts] = useState(getAllPosts());

  const refreshData = () => {
    setEvents(getAllEvents());
    setSurveys(getAllSurveys());
    setPosts(getAllPosts());
  };

  // チームに関連するイベントのみフィルタリング
  const teamEvents = events.filter(event => event.community === teamName);
  
  // チームに関連するアンケートのみフィルタリング
  const teamSurveys = surveys.filter(survey => survey.community === teamName);
  
  // チームの管理者投稿のみフィルタリング（コミュニティが一致し、作成者が管理者）
  const teamPosts = posts.filter(post => {
    const isSameCommunity = post.author.community === teamName;
    // 管理者の投稿のみ（user_001は管理者として扱う）
    const isManagerPost = post.author.id === 'user_001';
    return isSameCommunity && isManagerPost;
  });

  // すべてのアイテムを統合してタイムスタンプでソート
  const timelineItems = [
    ...teamEvents.map(event => ({ type: 'event' as const, data: event, timestamp: new Date(event.date) })),
    ...teamSurveys.map(survey => ({ type: 'survey' as const, data: survey, timestamp: new Date(survey.timestamp) })),
    ...teamPosts.map(post => ({ type: 'post' as const, data: post, timestamp: new Date(post.timestamp) })),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const handleJoinEvent = (eventId: string) => {
    if (!currentUser) {
      // ログインしていない場合は何もしない（サイレント）
      return;
    }
    
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
    if (!currentUser) {
      // ログインしていない場合は何もしない（サイレント）
      return;
    }
    likePost(postId, currentUser.id);
    refreshData();
  };

  const handleComment = (postId: string) => {
    if (!currentUser) {
      // ログインしていない場合は何もしない（サイレント）
      return;
    }
    if (!commentInputs[postId]?.trim()) return;
    
    addComment(postId, currentUser.id, currentUser.name, currentUser.avatar, commentInputs[postId]);
    
    setCommentInputs({ ...commentInputs, [postId]: '' });
    refreshData();
  };

  const toggleComments = (postId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedComments(newExpanded);
  };

  if (timelineItems.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="text-center py-8 text-gray-400">
          <p className="text-base">まだ投稿がありません</p>
          <p className="text-sm mt-2">チームのイベントやお知らせが表示されます</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {timelineItems.map((item, index) => {
        if (item.type === 'event') {
          const event = item.data;
          return (
            <div key={`event-${event.id}`} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border-l-4 border-purple-400 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">CM</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">🎯 {event.title}</h3>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        イベント
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                    <div className="bg-white rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {event.date} {event.time}
                        </span>
                        <span className="text-sm text-green-600 font-medium flex items-center">
                          <UsersIcon className="h-4 w-4 mr-1" />
                          {(event.participants || []).length}/{event.capacity}名
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {event.location}
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <button 
                        onClick={() => handleJoinEvent(event.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentUser && isUserJoined(event.id, currentUser.id)
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center space-x-1'
                            : 'bg-slate-600 text-white hover:bg-slate-700'
                        }`}
                      >
                        {currentUser && isUserJoined(event.id, currentUser.id) ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span>参加済み</span>
                          </>
                        ) : (
                          '参加する'
                        )}
                      </button>
                      <button 
                        onClick={() => setSelectedEventId(event.id)}
                        className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm hover:bg-stone-200 transition-colors"
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
            <div key={`survey-${survey.id}`} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-l-4 border-green-400 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">CM</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">📊 {survey.title}</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        アンケート
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{survey.description}</p>
                    <button 
                      onClick={() => setSelectedSurveyId(survey.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 font-medium transition-colors"
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
          return (
            <div key={`post-${post.id}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full cursor-pointer"
                    onClick={() => router.push(`/profile?userId=${post.author.id}`)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p 
                        className="font-medium text-gray-900 cursor-pointer hover:underline"
                        onClick={() => router.push(`/profile?userId=${post.author.id}`)}
                      >
                        {post.author.name}
                      </p>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                        管理者
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{post.timestamp}</p>
                  </div>
                </div>

                <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content.text}</p>

                {post.content.images && post.content.images.length > 0 && (
                  <div className={`grid gap-2 mb-4 ${
                    post.content.images.length === 1 ? 'grid-cols-1' : 
                    post.content.images.length === 2 ? 'grid-cols-2' : 
                    'grid-cols-2'
                  }`}>
                    {post.content.images.map((img, idx) => {
                      // 有効なURLかチェック
                      const isValidUrl = img && (img.startsWith('http://') || img.startsWith('https://'));
                      if (!isValidUrl) {
                        console.warn('Invalid image URL:', img);
                        return null;
                      }
                      
                      return (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={img}
                            alt={`投稿画像 ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 transition-colors ${
                      currentUser && isPostLiked(post.id, currentUser.id)
                        ? 'text-red-500'
                        : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${
                      currentUser && isPostLiked(post.id, currentUser.id) ? 'fill-current' : ''
                    }`} />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">{post.comments.length}</span>
                  </button>
                </div>

                {expandedComments.has(post.id) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="space-y-3 mb-4">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex items-start space-x-2">
                          <Image
                            src={comment.author.avatar}
                            alt={comment.author.name}
                            width={32}
                            height={32}
                            className="rounded-full cursor-pointer"
                            onClick={() => router.push(`/profile?userId=${comment.author.id}`)}
                          />
                          <div className="flex-1 bg-gray-50 rounded-lg p-3">
                            <p 
                              className="text-sm font-medium text-gray-900 cursor-pointer hover:underline"
                              onClick={() => router.push(`/profile?userId=${comment.author.id}`)}
                            >
                              {comment.author.name}
                            </p>
                            <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                            <p className="text-xs text-gray-400 mt-1">{comment.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {currentUser && (
                      <div className="flex items-center space-x-2">
                        <Image
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleComment(post.id);
                            }
                          }}
                          placeholder="コメントを入力..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleComment(post.id)}
                          disabled={!commentInputs[post.id]?.trim()}
                          className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          送信
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        }

        return null;
      })}

      {selectedEventId && (
        <EventDetailModal
          isOpen={true}
          eventId={selectedEventId}
          onClose={() => {
            setSelectedEventId(null);
            refreshData();
          }}
        />
      )}

      {selectedSurveyId && (
        <SurveyAnswerModal
          isOpen={true}
          surveyId={selectedSurveyId}
          onClose={() => {
            setSelectedSurveyId(null);
            refreshData();
          }}
        />
      )}
    </div>
  );
};

export default TeamTimeline;
