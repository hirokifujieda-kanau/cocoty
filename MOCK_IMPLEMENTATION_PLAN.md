# 🎨 フロントエンドモック完全実装計画

## 📊 現状分析

### ✅ 既に実装済みの機能
1. **占い・診断機能** - 完全動作（タロット、季節診断、メンタル統計）
2. **プロフィール表示** - 基本的な表示は動作
3. **通知センター** - ダミーデータで表示可能
4. **メッセージング** - UI実装済み、データは静的
5. **友達リスト** - UI実装済み、データは静的
6. **コメント・いいね** - UI実装済み、データは静的

### ❌ 未実装・不完全な機能
1. **ユーザー切り替え** - 動作するが体験が不完全
2. **データの永続化** - localStorageのみ、リレーションが不完全
3. **アクション後の状態更新** - 友達申請、メッセージ送信後の反映が不完全
4. **画像アップロード** - プレビュー機能なし
5. **検索機能** - 実装されていない
6. **フィルタリング** - 一部のみ実装
7. **ページネーション** - 未実装
8. **リアルタイム風の更新** - タイムスタンプのみ静的

---

## 🎯 優先順位付け

### 🔥 Phase 1: ユーザー体験の基盤（最優先）
**期間**: 3-5日  
**目的**: 複数ユーザーでの動作を完全に実現

#### 1-1. モックユーザー管理システム
**実装内容:**
- ログイン/ログアウト機能（モック）
- ユーザー切り替え機能の改善
- セッション管理（localStorage）
- 初回訪問時のオンボーディング

**実装ファイル:**
```
src/lib/mockAuth.ts          # モック認証システム
src/contexts/AuthContext.tsx # 認証コンテキスト
src/components/auth/Login.tsx # ログイン画面
src/components/auth/UserSwitcher.tsx # ユーザー切り替えUI
```

**具体的な機能:**
```typescript
// src/lib/mockAuth.ts
export interface MockUser {
  id: string;
  email: string;
  name: string;
  nickname: string;
  avatar: string;
  bio: string;
  diagnosis: string;
  createdAt: string;
}

export const mockUsers: MockUser[] = [
  {
    id: 'user_001',
    email: 'yamada@example.com',
    name: '山田 花子',
    nickname: 'はなちゃん',
    avatar: '/avatars/user1.jpg',
    bio: '写真が好きな大学生です',
    diagnosis: 'ENFP',
    createdAt: '2024-01-15'
  },
  // ... 20人分のユーザー
];

export const login = (userId: string) => {
  const user = mockUsers.find(u => u.id === userId);
  if (user) {
    localStorage.setItem('cocoty_session', JSON.stringify(user));
    return user;
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem('cocoty_session');
};

export const getCurrentUser = (): MockUser | null => {
  const session = localStorage.getItem('cocoty_session');
  return session ? JSON.parse(session) : null;
};
```

#### 1-2. グローバル状態管理の導入
**実装内容:**
- React Context APIでのグローバルステート
- 認証状態、現在のユーザー、通知数など

**実装ファイル:**
```
src/contexts/AppContext.tsx # アプリ全体のコンテキスト
src/hooks/useAuth.ts        # 認証フック
src/hooks/useNotifications.ts # 通知フック
```

---

### 🚀 Phase 2: インタラクション機能の完全実装（高優先）
**期間**: 5-7日  
**目的**: すべてのアクションが正しく動作し、状態が更新される

#### 2-1. 友達管理システムの完全実装
**実装内容:**
- 友達申請→承認→友達関係の完全なフロー
- ブロック機能
- 共通の友達の計算
- 友達リストのリアルタイム更新

**実装ファイル:**
```
src/lib/mockFriends.ts # 友達関係のモックデータ管理
src/hooks/useFriends.ts # 友達管理フック
```

**データ構造:**
```typescript
// src/lib/mockFriends.ts
export interface Friendship {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: string;
  updatedAt: string;
}

export const friendshipStore = {
  friendships: [] as Friendship[],
  
  // 友達申請
  sendRequest: (requesterId: string, addresseeId: string) => {
    const friendship: Friendship = {
      id: generateId(),
      requesterId,
      addresseeId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    friendshipStore.friendships.push(friendship);
    saveFriendships();
    return friendship;
  },
  
  // 承認
  acceptRequest: (friendshipId: string) => {
    const friendship = friendshipStore.friendships.find(f => f.id === friendshipId);
    if (friendship) {
      friendship.status = 'accepted';
      friendship.updatedAt = new Date().toISOString();
      saveFriendships();
    }
  },
  
  // 友達一覧取得
  getFriends: (userId: string) => {
    return friendshipStore.friendships.filter(
      f => f.status === 'accepted' && 
           (f.requesterId === userId || f.addresseeId === userId)
    );
  }
};
```

#### 2-2. メッセージング機能の完全実装
**実装内容:**
- メッセージ送信・受信
- 既読/未読管理
- 会話の作成
- メッセージ履歴の永続化

**実装ファイル:**
```
src/lib/mockMessages.ts # メッセージのモックデータ管理
src/hooks/useMessages.ts # メッセージ管理フック
```

**データ構造:**
```typescript
// src/lib/mockMessages.ts
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachments: string[];
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participant1: string;
  participant2: string;
  lastMessageAt: string;
  unreadCount: { [userId: string]: number };
}

export const messageStore = {
  messages: [] as Message[],
  conversations: [] as Conversation[],
  
  // メッセージ送信
  sendMessage: (senderId: string, recipientId: string, content: string, attachments: string[] = []) => {
    // 会話を取得または作成
    let conversation = messageStore.conversations.find(c => 
      (c.participant1 === senderId && c.participant2 === recipientId) ||
      (c.participant1 === recipientId && c.participant2 === senderId)
    );
    
    if (!conversation) {
      conversation = {
        id: generateId(),
        participant1: senderId,
        participant2: recipientId,
        lastMessageAt: new Date().toISOString(),
        unreadCount: { [recipientId]: 0 }
      };
      messageStore.conversations.push(conversation);
    }
    
    // メッセージ作成
    const message: Message = {
      id: generateId(),
      conversationId: conversation.id,
      senderId,
      content,
      attachments,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    messageStore.messages.push(message);
    conversation.lastMessageAt = message.createdAt;
    conversation.unreadCount[recipientId] = (conversation.unreadCount[recipientId] || 0) + 1;
    
    saveMessages();
    return message;
  }
};
```

#### 2-3. 通知システムの完全実装
**実装内容:**
- アクションに応じた通知の自動生成
- 通知のリアルタイム表示
- 未読カウントの更新

**実装ファイル:**
```
src/lib/mockNotifications.ts # 通知のモックデータ管理
src/hooks/useNotifications.ts # 通知管理フック
```

**データ構造:**
```typescript
// src/lib/mockNotifications.ts
export interface Notification {
  id: string;
  userId: string;
  type: 'friend_request' | 'message' | 'like' | 'comment' | 'profile_visit';
  actorId: string;
  content: string;
  actionUrl: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationStore = {
  notifications: [] as Notification[],
  
  // 通知作成
  createNotification: (
    userId: string,
    type: Notification['type'],
    actorId: string,
    content: string,
    actionUrl: string
  ) => {
    const notification: Notification = {
      id: generateId(),
      userId,
      type,
      actorId,
      content,
      actionUrl,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    notificationStore.notifications.push(notification);
    saveNotifications();
    return notification;
  },
  
  // ユーザーの通知取得
  getNotifications: (userId: string) => {
    return notificationStore.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
};
```

#### 2-4. コメント・いいね機能の完全実装
**実装内容:**
- 写真へのコメント投稿
- コメントへのいいね
- 写真へのいいね
- リアクション絵文字

**実装ファイル:**
```
src/lib/mockComments.ts # コメントのモックデータ管理
src/hooks/useComments.ts # コメント管理フック
```

---

### 📸 Phase 3: コンテンツ管理機能（中優先）
**期間**: 4-6日  
**目的**: 写真・アルバム・投稿の管理を完全実装

#### 3-1. 画像アップロード機能（モック）
**実装内容:**
- ファイル選択UI
- プレビュー表示
- Base64変換してlocalStorageに保存
- 画像最適化（リサイズ）

**実装ファイル:**
```
src/lib/mockImageUpload.ts # 画像アップロードのモック
src/components/upload/ImageUploader.tsx # 画像アップローダーUI
src/hooks/useImageUpload.ts # 画像アップロードフック
```

**実装例:**
```typescript
// src/lib/mockImageUpload.ts
export const uploadImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // ファイルサイズチェック（5MB以下）
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('ファイルサイズが大きすぎます'));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // リサイズ（最大1200px）
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > 1200) {
          height = (height * 1200) / width;
          width = 1200;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Base64に変換
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        // モックストレージに保存
        const imageId = generateId();
        const imageData = {
          id: imageId,
          url: dataUrl,
          uploadedAt: new Date().toISOString()
        };
        
        const images = JSON.parse(localStorage.getItem('cocoty_images_v1') || '[]');
        images.push(imageData);
        localStorage.setItem('cocoty_images_v1', JSON.stringify(images));
        
        resolve(imageId);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};
```

#### 3-2. アルバム機能の完全実装
**実装内容:**
- アルバム作成・編集・削除
- 写真の追加・削除
- アルバムの並び替え

**実装ファイル:**
```
src/lib/mockAlbums.ts # アルバムのモックデータ管理
src/hooks/useAlbums.ts # アルバム管理フック
```

#### 3-3. タイムライン・フィード機能
**実装内容:**
- 投稿の作成・編集・削除
- タイムライン表示
- フィルタリング（友達のみ、公開のみ）

**実装ファイル:**
```
src/lib/mockPosts.ts # 投稿のモックデータ管理
src/hooks/usePosts.ts # 投稿管理フック
```

---

### 🔍 Phase 4: 検索・フィルター機能（中優先）
**期間**: 3-4日  
**目的**: ユーザー・投稿の検索と絞り込み

#### 4-1. ユーザー検索
**実装内容:**
- 名前、ニックネーム、bioで検索
- 診断結果でフィルター
- オンラインステータスでフィルター

**実装ファイル:**
```
src/lib/mockSearch.ts # 検索のモックロジック
src/hooks/useSearch.ts # 検索フック
src/components/search/SearchBar.tsx # 検索UI
```

#### 4-2. 投稿検索・フィルター
**実装内容:**
- キーワード検索
- 日付範囲フィルター
- タグフィルター
- ユーザーフィルター

---

### 📊 Phase 5: アクティビティ・統計機能（低優先）
**期間**: 2-3日  
**目的**: ユーザー行動の記録と可視化

#### 5-1. アクティビティ記録システム
**実装内容:**
- ユーザー行動のトラッキング
- アクティビティカレンダーへの反映
- ストリーク計算

**実装ファイル:**
```
src/lib/mockActivityTracker.ts # アクティビティ記録
src/hooks/useActivityTracker.ts # アクティビティフック
```

#### 5-2. 訪問者統計
**実装内容:**
- プロフィール訪問の記録
- 週次・月次統計
- 人気投稿の計算

---

### 🎨 Phase 6: UI/UX改善（低優先）
**期間**: 3-5日  
**目的**: ユーザー体験の向上

#### 6-1. ローディング状態
**実装内容:**
- スケルトンローダー
- ローディングスピナー
- プログレスバー

#### 6-2. エラーハンドリング
**実装内容:**
- エラーメッセージの表示
- トースト通知
- リトライ機能

#### 6-3. アニメーション
**実装内容:**
- ページ遷移アニメーション
- モーダルの開閉アニメーション
- リスト項目のアニメーション

---

## 📋 実装チェックリスト

### Phase 1: ユーザー体験の基盤 🔥
- [ ] モック認証システム (`src/lib/mockAuth.ts`)
- [ ] 認証コンテキスト (`src/contexts/AuthContext.tsx`)
- [ ] ログイン画面 (`src/components/auth/Login.tsx`)
- [ ] ユーザー切り替えUI改善
- [ ] セッション管理
- [ ] 20人分のモックユーザーデータ作成
- [ ] グローバル状態管理セットアップ

### Phase 2: インタラクション機能 🚀
- [ ] 友達管理システム (`src/lib/mockFriends.ts`)
  - [ ] 友達申請機能
  - [ ] 承認/拒否機能
  - [ ] ブロック機能
  - [ ] 友達リスト表示
  - [ ] 共通の友達計算
- [ ] メッセージング (`src/lib/mockMessages.ts`)
  - [ ] メッセージ送信
  - [ ] 会話作成
  - [ ] 既読/未読管理
  - [ ] 会話リスト表示
  - [ ] メッセージ履歴表示
- [ ] 通知システム (`src/lib/mockNotifications.ts`)
  - [ ] 通知自動生成
  - [ ] 通知一覧表示
  - [ ] 既読管理
  - [ ] 未読カウント
- [ ] コメント・いいね (`src/lib/mockComments.ts`)
  - [ ] コメント投稿
  - [ ] コメント削除
  - [ ] いいね機能
  - [ ] リアクション絵文字

### Phase 3: コンテンツ管理 📸
- [ ] 画像アップロード (`src/lib/mockImageUpload.ts`)
  - [ ] ファイル選択
  - [ ] プレビュー表示
  - [ ] リサイズ処理
  - [ ] Base64変換
- [ ] アルバム管理 (`src/lib/mockAlbums.ts`)
  - [ ] アルバム作成
  - [ ] 写真追加/削除
  - [ ] アルバム編集
- [ ] タイムライン (`src/lib/mockPosts.ts`)
  - [ ] 投稿作成
  - [ ] 投稿編集
  - [ ] 投稿削除
  - [ ] フィード表示

### Phase 4: 検索・フィルター 🔍
- [ ] ユーザー検索 (`src/lib/mockSearch.ts`)
- [ ] 投稿検索
- [ ] フィルター機能
- [ ] ソート機能

### Phase 5: アクティビティ・統計 📊
- [ ] アクティビティ記録 (`src/lib/mockActivityTracker.ts`)
- [ ] ストリーク計算
- [ ] 訪問者統計

### Phase 6: UI/UX改善 🎨
- [ ] ローディング状態
- [ ] エラーハンドリング
- [ ] トースト通知
- [ ] アニメーション

---

## 🚀 今すぐ始めるべきこと

### ステップ1: モック認証システムの実装
```bash
# 1. 必要なディレクトリ作成
mkdir -p src/lib/mock
mkdir -p src/contexts
mkdir -p src/hooks
mkdir -p src/components/auth

# 2. 最初のファイル作成
touch src/lib/mock/mockAuth.ts
touch src/lib/mock/mockData.ts
touch src/contexts/AuthContext.tsx
touch src/hooks/useAuth.ts
touch src/components/auth/Login.tsx
```

### ステップ2: 基本的なモックデータ構造の定義
```typescript
// src/lib/mock/mockData.ts
export const MOCK_USERS = [
  {
    id: 'user_001',
    email: 'yamada@example.com',
    name: '山田 花子',
    nickname: 'はなちゃん',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: '写真が好きな大学生です📷',
    diagnosis: 'ENFP',
    createdAt: '2024-01-15'
  },
  // ... 19人追加
];
```

### ステップ3: 認証コンテキストの実装
```typescript
// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  currentUser: MockUser | null;
  login: (userId: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // セッションから復元
    const session = localStorage.getItem('cocoty_session');
    if (session) {
      setCurrentUser(JSON.parse(session));
    }
    setIsLoading(false);
  }, []);

  const login = (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('cocoty_session', JSON.stringify(user));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cocoty_session');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

---

## 📊 見積もり

### 総開発期間
- **Phase 1**: 3-5日
- **Phase 2**: 5-7日
- **Phase 3**: 4-6日
- **Phase 4**: 3-4日
- **Phase 5**: 2-3日
- **Phase 6**: 3-5日

**合計**: 20-30日（約4-6週間）

### 優先度別の実装順序
1. **最優先（1週間）**: Phase 1 → Phase 2の一部（友達・メッセージ）
2. **高優先（1-2週間）**: Phase 2の残り（通知・コメント）→ Phase 3の一部（画像アップロード）
3. **中優先（1週間）**: Phase 3の残り → Phase 4
4. **低優先（1週間）**: Phase 5 → Phase 6

---

## 🎯 結論：最初に取り組むべきこと

### 今日から始める Phase 1
1. **`src/lib/mock/mockAuth.ts`** - モック認証システム
2. **`src/lib/mock/mockData.ts`** - 20人分のモックユーザー
3. **`src/contexts/AuthContext.tsx`** - グローバル認証状態
4. **`src/components/auth/Login.tsx`** - ログイン画面
5. **`src/hooks/useAuth.ts`** - 認証フック

### 具体的な次のステップ
```bash
# 1. ディレクトリ作成
mkdir -p src/lib/mock src/contexts src/hooks src/components/auth

# 2. モック認証システムから実装開始
# 3. 既存のコンポーネントを認証システムに接続
# 4. ユーザー切り替えUIの改善
```

これで、実際に使えるレベルのモック実装が完成します！🎉
