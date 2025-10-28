'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Image as ImageIcon, Paperclip, MoreVertical, Search } from 'lucide-react';
import { PH1, PH2, PH3 } from '@/lib/placeholders';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  image?: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  userId: string;
  userName: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

interface DirectMessageProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  initialRecipientId?: string;
}

const MESSAGES_KEY = 'cocoty_messages_v1';
const CONVERSATIONS_KEY = 'cocoty_conversations_v1';

const DirectMessage: React.FC<DirectMessageProps> = ({ 
  isOpen, 
  onClose, 
  currentUserId,
  initialRecipientId 
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(initialRecipientId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 初期データ読み込み
  useEffect(() => {
    if (!isOpen) return;

    // ダミー会話データ
    const dummyConversations: Conversation[] = [
      {
        userId: 'user_002',
        userName: '田中 太郎',
        avatar: PH1,
        lastMessage: '今日の撮影会、楽しみですね！',
        lastMessageTime: '10分前',
        unreadCount: 2,
        isOnline: true
      },
      {
        userId: 'user_003',
        userName: '佐藤 美咲',
        avatar: PH2,
        lastMessage: '写真ありがとうございます',
        lastMessageTime: '1時間前',
        unreadCount: 0,
        isOnline: false
      },
      {
        userId: 'user_005',
        userName: '高橋 さくら',
        avatar: PH3,
        lastMessage: 'また今度お願いします',
        lastMessageTime: '昨日',
        unreadCount: 0,
        isOnline: true
      }
    ];

    try {
      const conversationsRaw = localStorage.getItem(CONVERSATIONS_KEY);
      if (conversationsRaw) {
        setConversations(JSON.parse(conversationsRaw));
      } else {
        setConversations(dummyConversations);
        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(dummyConversations));
      }
    } catch (e) {
      setConversations(dummyConversations);
    }

    // 初期受信者が指定されている場合
    if (initialRecipientId) {
      setSelectedConversation(initialRecipientId);
      loadMessages(initialRecipientId);
    }
  }, [isOpen, initialRecipientId]);

  // 会話選択時にメッセージを読み込み
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
      markAsRead(selectedConversation);
    }
  }, [selectedConversation]);

  // メッセージが追加されたら自動スクロール
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = (userId: string) => {
    const dummyMessages: Message[] = [
      {
        id: 'm1',
        senderId: userId,
        receiverId: currentUserId,
        content: 'こんにちは！今日の撮影会の件ですが、',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isRead: true
      },
      {
        id: 'm2',
        senderId: currentUserId,
        receiverId: userId,
        content: 'はい、何でしょうか？',
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        isRead: true
      },
      {
        id: 'm3',
        senderId: userId,
        receiverId: currentUserId,
        content: '集合時間を30分早めることはできますか？',
        timestamp: new Date(Date.now() - 2400000).toISOString(),
        isRead: true
      },
      {
        id: 'm4',
        senderId: currentUserId,
        receiverId: userId,
        content: '大丈夫です！では9時半集合ですね',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        isRead: true
      },
      {
        id: 'm5',
        senderId: userId,
        receiverId: currentUserId,
        content: 'ありがとうございます！楽しみにしています 📸',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        isRead: false
      }
    ];

    try {
      const messagesRaw = localStorage.getItem(`${MESSAGES_KEY}_${userId}`);
      if (messagesRaw) {
        setMessages(JSON.parse(messagesRaw));
      } else {
        setMessages(dummyMessages);
        localStorage.setItem(`${MESSAGES_KEY}_${userId}`, JSON.stringify(dummyMessages));
      }
    } catch (e) {
      setMessages(dummyMessages);
    }
  };

  const markAsRead = (userId: string) => {
    // 会話リストの未読カウントをリセット
    const updatedConversations = conversations.map(conv => 
      conv.userId === userId ? { ...conv, unreadCount: 0 } : conv
    );
    setConversations(updatedConversations);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updatedConversations));

    // メッセージを既読にする
    const updatedMessages = messages.map(msg => 
      msg.senderId === userId ? { ...msg, isRead: true } : msg
    );
    setMessages(updatedMessages);
    localStorage.setItem(`${MESSAGES_KEY}_${userId}`, JSON.stringify(updatedMessages));
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `m_${Date.now()}`,
      senderId: currentUserId,
      receiverId: selectedConversation,
      content: newMessage,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem(`${MESSAGES_KEY}_${selectedConversation}`, JSON.stringify(updatedMessages));

    // 会話リストを更新
    const updatedConversations = conversations.map(conv => 
      conv.userId === selectedConversation 
        ? { ...conv, lastMessage: newMessage, lastMessageTime: '今' }
        : conv
    );
    setConversations(updatedConversations);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updatedConversations));

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedConversation) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      
      const message: Message = {
        id: `m_${Date.now()}`,
        senderId: currentUserId,
        receiverId: selectedConversation,
        content: '画像を送信しました',
        image: imageUrl,
        timestamp: new Date().toISOString(),
        isRead: false
      };

      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      localStorage.setItem(`${MESSAGES_KEY}_${selectedConversation}`, JSON.stringify(updatedMessages));

      // 会話リストを更新
      const updatedConversations = conversations.map(conv => 
        conv.userId === selectedConversation 
          ? { ...conv, lastMessage: '📷 画像', lastMessageTime: '今' }
          : conv
      );
      setConversations(updatedConversations);
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updatedConversations));
    };
    reader.readAsDataURL(file);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const filteredConversations = conversations.filter(conv =>
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedUser = conversations.find(c => c.userId === selectedConversation);
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-6xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex">
        {/* 会話リスト */}
        <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50">
          {/* ヘッダー */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold flex items-center gap-2">
                💬 メッセージ
                {totalUnread > 0 && (
                  <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                    {totalUnread}
                  </span>
                )}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            {/* 検索 */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="会話を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* 会話一覧 */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <button
                key={conv.userId}
                onClick={() => setSelectedConversation(conv.userId)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-100 transition-colors ${
                  selectedConversation === conv.userId ? 'bg-purple-50' : ''
                }`}
              >
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={conv.avatar} 
                    alt={conv.userName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conv.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></div>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm">{conv.userName}</h3>
                    <span className="text-xs text-gray-500">{conv.lastMessageTime}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unreadCount > 0 && (
                  <div className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {conv.unreadCount}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* メッセージエリア */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* チャットヘッダー */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={selectedUser.avatar} 
                      alt={selectedUser.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {selectedUser.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold">{selectedUser.userName}</h3>
                    <p className="text-xs text-gray-500">
                      {selectedUser.isOnline ? 'オンライン' : '最終ログイン: 2時間前'}
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* メッセージ一覧 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg) => {
                  const isSent = msg.senderId === currentUserId;
                  return (
                    <div key={msg.id} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] ${isSent ? 'order-2' : 'order-1'}`}>
                        <div className={`rounded-2xl p-3 ${
                          isSent 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-white text-gray-900 shadow-sm'
                        }`}>
                          {msg.image && (
                            <div className="mb-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img 
                                src={msg.image} 
                                alt="送信画像"
                                className="rounded-lg max-w-full"
                              />
                            </div>
                          )}
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                          isSent ? 'justify-end' : 'justify-start'
                        }`}>
                          <span>{formatTime(msg.timestamp)}</span>
                          {isSent && (
                            <span>{msg.isRead ? '既読' : '送信済み'}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* 入力エリア */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-end gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <ImageIcon size={20} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                    <Paperclip size={20} />
                  </button>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="メッセージを入力..."
                    rows={1}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-lg">会話を選択してください</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectMessage;
