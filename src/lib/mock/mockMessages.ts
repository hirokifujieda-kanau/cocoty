// メッセージの型定義
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

// 会話の型定義
export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

// ダミーメッセージデータ
export const mockMessages: Message[] = [
  // user_001とuser_002の会話
  { id: 'msg_001', conversationId: 'conv_001', senderId: 'user_002', receiverId: 'user_001', content: 'こんにちは！写真展の準備はどう？', createdAt: '2024-11-02T10:00:00Z', read: true },
  { id: 'msg_002', conversationId: 'conv_001', senderId: 'user_001', receiverId: 'user_002', content: 'おかげさまで順調です！作品選定も終わりました✨', createdAt: '2024-11-02T10:15:00Z', read: true },
  { id: 'msg_003', conversationId: 'conv_001', senderId: 'user_002', receiverId: 'user_001', content: 'それは良かった！当日楽しみにしてるよ📷', createdAt: '2024-11-02T10:20:00Z', read: false },
  
  // user_001とuser_003の会話
  { id: 'msg_004', conversationId: 'conv_002', senderId: 'user_003', receiverId: 'user_001', content: '今度一緒にカフェ巡りしませんか？☕', createdAt: '2024-11-01T14:00:00Z', read: true },
  { id: 'msg_005', conversationId: 'conv_002', senderId: 'user_001', receiverId: 'user_003', content: 'いいですね！来週末はどうですか？', createdAt: '2024-11-01T14:30:00Z', read: true },
  { id: 'msg_006', conversationId: 'conv_002', senderId: 'user_003', receiverId: 'user_001', content: '来週末OKです！渋谷の新しいカフェに行きましょう🍰', createdAt: '2024-11-01T15:00:00Z', read: false },
  
  // user_001とuser_005の会話
  { id: 'msg_007', conversationId: 'conv_003', senderId: 'user_005', receiverId: 'user_001', content: 'ウェディング撮影のアシスタント募集してるんだけど、興味ある？', createdAt: '2024-10-30T18:00:00Z', read: true },
  { id: 'msg_008', conversationId: 'conv_003', senderId: 'user_001', receiverId: 'user_005', content: 'ぜひやってみたいです！どんな感じですか？', createdAt: '2024-10-30T18:30:00Z', read: true },
  { id: 'msg_009', conversationId: 'conv_003', senderId: 'user_005', receiverId: 'user_001', content: '詳しくは今度会って説明するね！良い経験になると思うよ💐', createdAt: '2024-10-30T19:00:00Z', read: true },
  
  // user_002とuser_004の会話
  { id: 'msg_010', conversationId: 'conv_004', senderId: 'user_004', receiverId: 'user_002', content: 'スポーツ撮影の設定について教えてもらえますか？', createdAt: '2024-11-02T09:00:00Z', read: true },
  { id: 'msg_011', conversationId: 'conv_004', senderId: 'user_002', receiverId: 'user_004', content: 'もちろん！シャッタースピードは1/1000以上がおすすめだよ', createdAt: '2024-11-02T09:30:00Z', read: false },
  
  // user_003とuser_005の会話
  { id: 'msg_012', conversationId: 'conv_005', senderId: 'user_003', receiverId: 'user_005', content: '今日のウェディング撮影、お疲れ様でした！', createdAt: '2024-11-01T20:00:00Z', read: true },
  { id: 'msg_013', conversationId: 'conv_005', senderId: 'user_005', receiverId: 'user_003', content: 'お疲れ様！フードの撮影もとても綺麗でした✨', createdAt: '2024-11-01T20:30:00Z', read: true },
  
  // user_006とuser_010の会話
  { id: 'msg_014', conversationId: 'conv_006', senderId: 'user_010', receiverId: 'user_006', content: 'ノルウェーでオーロラ撮影されたんですね！設定教えてください🌌', createdAt: '2024-10-29T22:00:00Z', read: true },
  { id: 'msg_015', conversationId: 'conv_006', senderId: 'user_006', receiverId: 'user_010', content: 'ISO3200、F2.8、SS15秒で撮影しました！三脚必須です', createdAt: '2024-10-29T22:30:00Z', read: true },
  
  // user_007とuser_009の会話
  { id: 'msg_016', conversationId: 'conv_007', senderId: 'user_009', receiverId: 'user_007', content: 'ペット用のモデル募集してます！撮影協力してもらえますか？🐶', createdAt: '2024-10-28T16:00:00Z', read: true },
  { id: 'msg_017', conversationId: 'conv_007', senderId: 'user_007', receiverId: 'user_009', content: 'いいですよ！うちの子も撮影してもらえますか？📷', createdAt: '2024-10-28T16:30:00Z', read: true },
  
  // user_008とuser_012の会話
  { id: 'msg_018', conversationId: 'conv_008', senderId: 'user_012', receiverId: 'user_008', content: 'ストリートフォトのコツを教えてください！', createdAt: '2024-10-27T15:00:00Z', read: true },
  { id: 'msg_019', conversationId: 'conv_008', senderId: 'user_008', receiverId: 'user_012', content: '一番大事なのは待つこと。決定的瞬間を逃さないように', createdAt: '2024-10-27T15:30:00Z', read: true },
];

// ダミー会話データ
export const mockConversations: Conversation[] = [
  { id: 'conv_001', participants: ['user_001', 'user_002'], lastMessage: 'それは良かった！当日楽しみにしてるよ📷', lastMessageTime: '2024-11-02T10:20:00Z', unreadCount: 1 },
  { id: 'conv_002', participants: ['user_001', 'user_003'], lastMessage: '来週末OKです！渋谷の新しいカフェに行きましょう🍰', lastMessageTime: '2024-11-01T15:00:00Z', unreadCount: 1 },
  { id: 'conv_003', participants: ['user_001', 'user_005'], lastMessage: '詳しくは今度会って説明するね！良い経験になると思うよ💐', lastMessageTime: '2024-10-30T19:00:00Z', unreadCount: 0 },
  { id: 'conv_004', participants: ['user_002', 'user_004'], lastMessage: 'もちろん！シャッタースピードは1/1000以上がおすすめだよ', lastMessageTime: '2024-11-02T09:30:00Z', unreadCount: 1 },
  { id: 'conv_005', participants: ['user_003', 'user_005'], lastMessage: 'お疲れ様！フードの撮影もとても綺麗でした✨', lastMessageTime: '2024-11-01T20:30:00Z', unreadCount: 0 },
  { id: 'conv_006', participants: ['user_006', 'user_010'], lastMessage: 'ISO3200、F2.8、SS15秒で撮影しました！三脚必須です', lastMessageTime: '2024-10-29T22:30:00Z', unreadCount: 0 },
  { id: 'conv_007', participants: ['user_007', 'user_009'], lastMessage: 'いいですよ！うちの子も撮影してもらえますか？📷', lastMessageTime: '2024-10-28T16:30:00Z', unreadCount: 0 },
  { id: 'conv_008', participants: ['user_008', 'user_012'], lastMessage: '一番大事なのは待つこと。決定的瞬間を逃さないように', lastMessageTime: '2024-10-27T15:30:00Z', unreadCount: 0 },
];

// ユーザーIDから会話を取得
export const getConversationsByUserId = (userId: string): Conversation[] => {
  return mockConversations.filter(c => c.participants.includes(userId));
};

// 会話IDからメッセージを取得
export const getMessagesByConversationId = (conversationId: string): Message[] => {
  return mockMessages.filter(m => m.conversationId === conversationId);
};

// 2人のユーザー間の会話を取得
export const getConversationBetweenUsers = (userId1: string, userId2: string): Conversation | undefined => {
  return mockConversations.find(c => 
    c.participants.includes(userId1) && c.participants.includes(userId2)
  );
};

// ユーザーの未読メッセージ数を取得
export const getUnreadCount = (userId: string): number => {
  const conversations = getConversationsByUserId(userId);
  return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
};
