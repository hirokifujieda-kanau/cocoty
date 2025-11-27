'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Users, MessageCircle, Share2 } from 'lucide-react';
import { Event, getEventById, joinEvent, leaveEvent, isUserJoined, addComment, getCommentsForPost } from '@/lib/mock/mockSocialData';
import { useAuth } from '@/context/AuthContext';
import { getUserById } from '@/lib/mock/mockAuth';

interface EventDetailModalProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ eventId, isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (isOpen && eventId && currentUser) {
      const eventData = getEventById(eventId);
      setEvent(eventData);
      setIsJoined(eventData ? isUserJoined(eventId, currentUser.id) : false);
    }
  }, [isOpen, eventId, currentUser]);

  const handleJoinToggle = () => {
    if (!event || !currentUser) return;

    if (isJoined) {
      if (leaveEvent(event.id, currentUser.id)) {
        setIsJoined(false);
        // イベント情報を再取得
        const updatedEvent = getEventById(event.id);
        setEvent(updatedEvent);
      }
    } else {
      if (joinEvent(event.id, currentUser.id)) {
        setIsJoined(true);
        // イベント情報を再取得
        const updatedEvent = getEventById(event.id);
        setEvent(updatedEvent);
      } else {
        alert('定員に達しているため参加できません');
      }
    }
  };

  const handleAddComment = () => {
    if (!event || !currentUser || !commentText.trim()) return;

    const comment = addComment(
      event.id,
      currentUser.id,
      currentUser.name,
      currentUser.avatar,
      commentText
    );

    if (comment) {
      setCommentText('');
      // イベント情報を再取得
      const updatedEvent = getEventById(event.id);
      setEvent(updatedEvent);
    }
  };

  const handleShare = () => {
    if (!event) return;
    
    const shareText = `${event.title}\n${event.date} ${event.time}\n${event.location}`;
    
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: shareText,
        url: window.location.href
      });
    } else {
      // フォールバック: クリップボードにコピー
      navigator.clipboard.writeText(shareText);
      alert('イベント情報をクリップボードにコピーしました！');
    }
  };

  if (!isOpen || !event) return null;

  const participants = event.participants.map(userId => getUserById(userId)).filter(Boolean);
  const availableSlots = event.capacity - event.participants.length;
  const isFull = availableSlots <= 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6 space-y-6">
          {/* イベント基本情報 */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">{event.date}</p>
                <p className="text-sm text-gray-500">{event.time}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">{event.location}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Users className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">
                  {event.participants.length}/{event.capacity}名参加
                </p>
                <p className="text-sm text-gray-500">
                  {isFull ? '定員に達しました' : `残り${availableSlots}枠`}
                </p>
              </div>
            </div>
          </div>

          {/* 説明 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-2">イベント説明</h3>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </div>

          {/* 参加者リスト */}
          {participants.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">参加者（{participants.length}名）</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {participants.map((user) => (
                  <div
                    key={user!.id}
                    className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={user!.avatar}
                      alt={user!.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user!.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* コメントセクション */}
          <div>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 mb-3"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold">
                コメント {event.comments?.length || 0}件
              </span>
            </button>

            {showComments && (
              <div className="space-y-4">
                {/* コメント入力 */}
                <div className="flex items-start space-x-3">
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="コメントを追加..."
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                      rows={2}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleAddComment}
                        disabled={!commentText.trim()}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                      >
                        投稿
                      </button>
                    </div>
                  </div>
                </div>

                {/* コメント一覧 */}
                {event.comments && event.comments.length > 0 && (
                  <div className="space-y-3">
                    {event.comments.map((comment) => (
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
        </div>

        {/* フッター（アクションボタン） */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleJoinToggle}
              disabled={isFull && !isJoined}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                isJoined
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : isFull
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-500 text-white hover:bg-purple-600'
              }`}
            >
              {isJoined ? '参加をキャンセル' : isFull ? '定員に達しました' : '参加する'}
            </button>
            <button
              onClick={handleShare}
              className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
