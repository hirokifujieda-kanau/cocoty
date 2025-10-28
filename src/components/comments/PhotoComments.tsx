'use client';

import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, X, Send } from 'lucide-react';
import { PH1, PH2, PH3 } from '@/lib/placeholders';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

interface PhotoCommentsProps {
  isOpen: boolean;
  onClose: () => void;
  photoId: string;
  photoUrl: string;
  photoOwner: string;
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar: string;
}

const COMMENTS_KEY = 'cocoty_comments_v1';
const LIKES_KEY = 'cocoty_likes_v1';

const PhotoComments: React.FC<PhotoCommentsProps> = ({
  isOpen,
  onClose,
  photoId,
  photoUrl,
  photoOwner,
  currentUserId,
  currentUserName,
  currentUserAvatar
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showReactions, setShowReactions] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    loadComments();
    loadLikes();
  }, [isOpen, photoId]);

  const loadComments = () => {
    const dummyComments: Comment[] = [
      {
        id: 'c1',
        userId: 'user_002',
        userName: '田中 太郎',
        userAvatar: PH1,
        content: '素晴らしい構図ですね！光の使い方が絶妙です',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        likes: 5,
        isLiked: false
      },
      {
        id: 'c2',
        userId: 'user_003',
        userName: '佐藤 美咲',
        userAvatar: PH2,
        content: '色彩が美しいです ✨',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        likes: 3,
        isLiked: true
      },
      {
        id: 'c3',
        userId: 'user_005',
        userName: '高橋 さくら',
        userAvatar: PH3,
        content: 'どこで撮影されましたか？ぜひ行ってみたいです！',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        likes: 2,
        isLiked: false
      }
    ];

    try {
      const commentsRaw = localStorage.getItem(`${COMMENTS_KEY}_${photoId}`);
      if (commentsRaw) {
        setComments(JSON.parse(commentsRaw));
      } else {
        setComments(dummyComments);
        localStorage.setItem(`${COMMENTS_KEY}_${photoId}`, JSON.stringify(dummyComments));
      }
    } catch (e) {
      setComments(dummyComments);
    }
  };

  const loadLikes = () => {
    try {
      const likesRaw = localStorage.getItem(`${LIKES_KEY}_${photoId}`);
      if (likesRaw) {
        const likes = JSON.parse(likesRaw);
        setLikeCount(likes.count || 12);
        setIsLiked(likes.users?.includes(currentUserId) || false);
      } else {
        setLikeCount(12);
        setIsLiked(false);
      }
    } catch (e) {
      setLikeCount(12);
      setIsLiked(false);
    }
  };

  const handleLike = () => {
    const newIsLiked = !isLiked;
    const newCount = newIsLiked ? likeCount + 1 : likeCount - 1;
    
    setIsLiked(newIsLiked);
    setLikeCount(newCount);

    try {
      const likesRaw = localStorage.getItem(`${LIKES_KEY}_${photoId}`);
      const likes = likesRaw ? JSON.parse(likesRaw) : { count: 12, users: [] };
      
      if (newIsLiked) {
        likes.users = [...(likes.users || []), currentUserId];
        likes.count = newCount;
      } else {
        likes.users = (likes.users || []).filter((id: string) => id !== currentUserId);
        likes.count = newCount;
      }
      
      localStorage.setItem(`${LIKES_KEY}_${photoId}`, JSON.stringify(likes));
    } catch (e) {
      console.error('Failed to save like', e);
    }
  };

  const handleCommentLike = (commentId: string) => {
    const updatedComments = comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          isLiked: !c.isLiked,
          likes: c.isLiked ? c.likes - 1 : c.likes + 1
        };
      }
      return c;
    });
    
    setComments(updatedComments);
    localStorage.setItem(`${COMMENTS_KEY}_${photoId}`, JSON.stringify(updatedComments));
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `c_${Date.now()}`,
      userId: currentUserId,
      userName: currentUserName,
      userAvatar: currentUserAvatar,
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    localStorage.setItem(`${COMMENTS_KEY}_${photoId}`, JSON.stringify(updatedComments));
    setNewComment('');
  };

  const handleReaction = (emoji: string) => {
    const comment: Comment = {
      id: `c_${Date.now()}`,
      userId: currentUserId,
      userName: currentUserName,
      userAvatar: currentUserAvatar,
      content: emoji,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    localStorage.setItem(`${COMMENTS_KEY}_${photoId}`, JSON.stringify(updatedComments));
    setShowReactions(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return '今';
    if (diffMins < 60) return `${diffMins}分前`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}時間前`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}日前`;
    
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  if (!isOpen) return null;

  const reactions = ['👍', '❤️', '😊', '🎉', '🔥', '👏', '✨', '😍'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-90 p-4">
      <div className="w-full max-w-6xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex">
        {/* 画像表示エリア */}
        <div className="flex-1 bg-black flex items-center justify-center relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={photoUrl} 
            alt="Photo"
            className="max-w-full max-h-full object-contain"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* コメント・いいねエリア */}
        <div className="w-96 flex flex-col bg-white">
          {/* ヘッダー */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={currentUserAvatar} 
                alt={photoOwner}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-bold">{photoOwner}</h3>
                <p className="text-xs text-gray-500">投稿者</p>
              </div>
            </div>
          </div>

          {/* いいね & リアクションバー */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 transition-colors ${
                  isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                }`}
              >
                <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
                <span className="font-medium">{likeCount}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
                <MessageCircle size={24} />
                <span className="font-medium">{comments.length}</span>
              </button>
              <div className="relative ml-auto">
                <button
                  onClick={() => setShowReactions(!showReactions)}
                  className="text-2xl hover:scale-110 transition-transform"
                >
                  😊
                </button>
                {showReactions && (
                  <div className="absolute bottom-full right-0 mb-2 p-2 bg-white rounded-lg shadow-xl border border-gray-200 flex gap-1">
                    {reactions.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(emoji)}
                        className="text-2xl hover:scale-125 transition-transform p-1"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* コメント一覧 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={comment.userAvatar} 
                    alt={comment.userName}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-100 rounded-2xl px-3 py-2">
                      <p className="font-bold text-sm">{comment.userName}</p>
                      <p className="text-sm mt-1 whitespace-pre-wrap break-words">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 px-3">
                      <span>{formatTime(comment.timestamp)}</span>
                      <button
                        onClick={() => handleCommentLike(comment.id)}
                        className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                          comment.isLiked ? 'text-red-500 font-medium' : ''
                        }`}
                      >
                        <Heart size={12} fill={comment.isLiked ? 'currentColor' : 'none'} />
                        {comment.likes > 0 && <span>{comment.likes}</span>}
                      </button>
                      <button className="hover:text-purple-600 transition-colors">返信</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <MessageCircle size={48} className="mx-auto mb-2 opacity-30" />
                <p>まだコメントがありません</p>
                <p className="text-sm">最初のコメントを投稿しましょう</p>
              </div>
            )}
          </div>

          {/* コメント入力 */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-end gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={currentUserAvatar} 
                alt={currentUserName}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                  placeholder="コメントを入力..."
                  rows={1}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoComments;
