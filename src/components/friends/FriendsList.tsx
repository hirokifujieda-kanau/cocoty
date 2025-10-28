'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, UserPlus, UserMinus, UserX, MessageCircle, MoreVertical, Check, XCircle } from 'lucide-react';
import { PH1, PH2, PH3 } from '@/lib/placeholders';
import { dummyUsers, getAllUsers } from '@/lib/dummyUsers';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  diagnosis: string;
  bio: string;
  status: 'friends' | 'pending_sent' | 'pending_received';
  mutualFriends: number;
  isOnline: boolean;
}

interface FriendsListProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  onSendMessage?: (userId: string) => void;
}

const FRIENDS_KEY = 'cocoty_friends_list_v1';
const BLOCKED_KEY = 'cocoty_blocked_users_v1';

const FriendsList: React.FC<FriendsListProps> = ({ 
  isOpen, 
  onClose, 
  currentUserId,
  onSendMessage 
}) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'pending' | 'suggestions'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [suggestions, setSuggestions] = useState<Friend[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // ダミーデータの読み込み
    loadFriendsData();
  }, [isOpen]);

  const loadFriendsData = () => {
    // 友達リスト
    const friendsList: Friend[] = [
      {
        id: 'user_002',
        name: '田中 太郎',
        avatar: PH1,
        diagnosis: 'INTJ',
        bio: 'フォトグラファー兼デザイナー',
        status: 'friends',
        mutualFriends: 5,
        isOnline: true
      },
      {
        id: 'user_003',
        name: '佐藤 美咲',
        avatar: PH2,
        diagnosis: 'ESFJ',
        bio: '料理とテーブルフォトが大好き',
        status: 'friends',
        mutualFriends: 3,
        isOnline: false
      },
      {
        id: 'user_005',
        name: '高橋 さくら',
        avatar: PH3,
        diagnosis: 'ENFP',
        bio: 'ウェディングフォトグラファー',
        status: 'friends',
        mutualFriends: 8,
        isOnline: true
      }
    ];

    // 保留中のリクエスト
    const pending: Friend[] = [
      {
        id: 'user_006',
        name: '山本 健一',
        avatar: PH1,
        diagnosis: 'ISTP',
        bio: 'スポーツカメラマン',
        status: 'pending_received',
        mutualFriends: 2,
        isOnline: false
      },
      {
        id: 'user_007',
        name: '木村 結衣',
        avatar: PH2,
        diagnosis: 'ENFJ',
        bio: 'ファッションフォトグラファー',
        status: 'pending_sent',
        mutualFriends: 1,
        isOnline: true
      }
    ];

    // おすすめユーザー
    const suggest: Friend[] = [
      {
        id: 'user_008',
        name: '伊藤 翔太',
        avatar: PH3,
        diagnosis: 'INTP',
        bio: '建築写真が専門です',
        status: 'friends',
        mutualFriends: 4,
        isOnline: false
      },
      {
        id: 'user_009',
        name: '中村 愛',
        avatar: PH1,
        diagnosis: 'ESFP',
        bio: 'ペット写真家',
        status: 'friends',
        mutualFriends: 6,
        isOnline: true
      }
    ];

    try {
      const friendsRaw = localStorage.getItem(FRIENDS_KEY);
      if (friendsRaw) {
        const data = JSON.parse(friendsRaw);
        setFriends(data.friends || friendsList);
        setPendingRequests(data.pending || pending);
        setSuggestions(data.suggestions || suggest);
      } else {
        setFriends(friendsList);
        setPendingRequests(pending);
        setSuggestions(suggest);
        saveFriendsData(friendsList, pending, suggest);
      }

      const blockedRaw = localStorage.getItem(BLOCKED_KEY);
      if (blockedRaw) {
        setBlockedUsers(JSON.parse(blockedRaw));
      }
    } catch (e) {
      setFriends(friendsList);
      setPendingRequests(pending);
      setSuggestions(suggest);
    }
  };

  const saveFriendsData = (friendsList: Friend[], pending: Friend[], suggest: Friend[]) => {
    const data = {
      friends: friendsList,
      pending: pending,
      suggestions: suggest
    };
    localStorage.setItem(FRIENDS_KEY, JSON.stringify(data));
  };

  const handleAcceptRequest = (userId: string) => {
    // 保留中から友達リストへ移動
    const user = pendingRequests.find(u => u.id === userId);
    if (user) {
      const updatedPending = pendingRequests.filter(u => u.id !== userId);
      const updatedFriends = [...friends, { ...user, status: 'friends' as const }];
      
      setPendingRequests(updatedPending);
      setFriends(updatedFriends);
      saveFriendsData(updatedFriends, updatedPending, suggestions);
    }
  };

  const handleRejectRequest = (userId: string) => {
    const updatedPending = pendingRequests.filter(u => u.id !== userId);
    setPendingRequests(updatedPending);
    saveFriendsData(friends, updatedPending, suggestions);
  };

  const handleAddFriend = (userId: string) => {
    // おすすめから保留中へ移動
    const user = suggestions.find(u => u.id === userId);
    if (user) {
      const updatedSuggestions = suggestions.filter(u => u.id !== userId);
      const updatedPending = [...pendingRequests, { ...user, status: 'pending_sent' as const }];
      
      setSuggestions(updatedSuggestions);
      setPendingRequests(updatedPending);
      saveFriendsData(friends, updatedPending, updatedSuggestions);
    }
  };

  const handleRemoveFriend = (userId: string) => {
    const updatedFriends = friends.filter(u => u.id !== userId);
    setFriends(updatedFriends);
    saveFriendsData(updatedFriends, pendingRequests, suggestions);
    setShowActionMenu(null);
  };

  const handleBlockUser = (userId: string) => {
    const updatedBlocked = [...blockedUsers, userId];
    const updatedFriends = friends.filter(u => u.id !== userId);
    const updatedPending = pendingRequests.filter(u => u.id !== userId);
    
    setBlockedUsers(updatedBlocked);
    setFriends(updatedFriends);
    setPendingRequests(updatedPending);
    
    localStorage.setItem(BLOCKED_KEY, JSON.stringify(updatedBlocked));
    saveFriendsData(updatedFriends, updatedPending, suggestions);
    setShowActionMenu(null);
  };

  const filterUsers = (users: Friend[]) => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderUserCard = (user: Friend, type: 'friend' | 'pending' | 'suggestion') => {
    return (
      <div key={user.id} className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          {/* アバター */}
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            {user.isOnline && (
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white"></div>
            )}
          </div>

          {/* ユーザー情報 */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg">{user.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                    {user.diagnosis}
                  </span>
                  {user.mutualFriends > 0 && (
                    <span className="text-xs text-gray-500">
                      共通の友達 {user.mutualFriends}人
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">{user.bio}</p>
              </div>

              {/* アクションメニュー（友達のみ） */}
              {type === 'friend' && (
                <div className="relative">
                  <button
                    onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {showActionMenu === user.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                      <button
                        onClick={() => {
                          onSendMessage?.(user.id);
                          setShowActionMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <MessageCircle size={16} />
                        メッセージを送る
                      </button>
                      <button
                        onClick={() => handleRemoveFriend(user.id)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-orange-600"
                      >
                        <UserMinus size={16} />
                        友達を解除
                      </button>
                      <button
                        onClick={() => handleBlockUser(user.id)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                      >
                        <UserX size={16} />
                        ブロック
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* アクションボタン */}
            <div className="mt-3 flex gap-2">
              {type === 'friend' && (
                <button
                  onClick={() => onSendMessage?.(user.id)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <MessageCircle size={16} />
                  メッセージ
                </button>
              )}
              
              {type === 'pending' && user.status === 'pending_received' && (
                <>
                  <button
                    onClick={() => handleAcceptRequest(user.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <Check size={16} />
                    承認
                  </button>
                  <button
                    onClick={() => handleRejectRequest(user.id)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <XCircle size={16} />
                    拒否
                  </button>
                </>
              )}

              {type === 'pending' && user.status === 'pending_sent' && (
                <button
                  disabled
                  className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed"
                >
                  承認待ち...
                </button>
              )}

              {type === 'suggestion' && (
                <button
                  onClick={() => handleAddFriend(user.id)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <UserPlus size={16} />
                  友達に追加
                </button>
              )}

              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                プロフィール
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  const filteredFriends = filterUsers(friends);
  const filteredPending = filterUsers(pendingRequests);
  const filteredSuggestions = filterUsers(suggestions);
  const pendingReceivedCount = pendingRequests.filter(u => u.status === 'pending_received').length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-4xl h-[90vh] bg-gray-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* ヘッダー */}
        <div className="p-6 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">👥 友達</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          {/* タブ */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('friends')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'friends'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              友達 ({friends.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
                activeTab === 'pending'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              リクエスト ({pendingRequests.length})
              {pendingReceivedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {pendingReceivedCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'suggestions'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              おすすめ ({suggestions.length})
            </button>
          </div>

          {/* 検索バー */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="友達を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* コンテンツエリア */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {activeTab === 'friends' && (
              <>
                {filteredFriends.length > 0 ? (
                  filteredFriends.map(friend => renderUserCard(friend, 'friend'))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <p>友達がいません</p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'pending' && (
              <>
                {filteredPending.length > 0 ? (
                  <>
                    {/* 受信したリクエスト */}
                    {filteredPending.filter(u => u.status === 'pending_received').length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">
                          承認待ちのリクエスト
                        </h3>
                        <div className="space-y-4">
                          {filteredPending
                            .filter(u => u.status === 'pending_received')
                            .map(user => renderUserCard(user, 'pending'))}
                        </div>
                      </div>
                    )}

                    {/* 送信したリクエスト */}
                    {filteredPending.filter(u => u.status === 'pending_sent').length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">
                          送信したリクエスト
                        </h3>
                        <div className="space-y-4">
                          {filteredPending
                            .filter(u => u.status === 'pending_sent')
                            .map(user => renderUserCard(user, 'pending'))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <p>保留中のリクエストはありません</p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'suggestions' && (
              <>
                {filteredSuggestions.length > 0 ? (
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-blue-800">
                        💡 共通の友達が多いユーザーや、同じ興味を持つユーザーをおすすめしています
                      </p>
                    </div>
                    {filteredSuggestions.map(user => renderUserCard(user, 'suggestion'))}
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <p>おすすめのユーザーはいません</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsList;
