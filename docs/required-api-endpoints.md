# 🚀 必要なAPIエンドポイント一覧

フロントエンドコードを分析した結果、実装が必要なAPIエンドポイントをまとめました。

## 📋 現状の実装方法
- **認証**: `localStorage` + モックユーザーデータ（`mockAuth.ts`、`dummyUsers.ts`）
- **プロフィール**: `localStorage`（`cocoty_profile_v1`）
- **フォロー関係**: `localStorage`（`follow_{userId}_{targetUserId}`）
- **メッセージ**: `localStorage`（`messages_{fromId}_{toId}`）
- **タロット占い**: `localStorage`（`daily_tarot_{userId}`、`mental_check_{userId}`）
- **ユーザーデータ**: 静的な20人のモックユーザー

---

## 🔐 1. 認証系API（最優先）

### 1.1 ユーザー登録
```
POST /api/v1/auth/signup
```
**リクエスト:**
```json
{
  "user": {
    "email": "user@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }
}
```

**レスポンス:**
```json
{
  "message": "Signed up successfully.",
  "user": {
    "data": {
      "id": "user_001",
      "type": "user",
      "attributes": {
        "email": "user@example.com",
        "role": "member",
        "created_at": "2024-01-15T10:00:00Z"
      },
      "relationships": {
        "profile": {
          "data": {
            "id": "profile_001",
            "type": "profile"
          }
        }
      }
    }
  }
}
```

**現在の使用箇所:**
- `AuthContext.tsx` - モックログイン処理
- `login/page.tsx` - ログインフォーム（実装予定）

---

### 1.2 ログイン
```
POST /api/v1/auth/login
```
**リクエスト:**
```json
{
  "user": {
    "email": "user@example.com",
    "password": "password123"
  }
}
```

**レスポンス:**
```json
{
  "message": "Logged in successfully.",
  "user": {
    "data": {
      "id": "user_001",
      "attributes": {
        "email": "user@example.com",
        "role": "member"
      },
      "relationships": {
        "profile": {
          "data": {
            "id": "profile_001",
            "type": "profile"
          }
        }
      }
    }
  }
}
```

**ヘッダー:**
- `Authorization: Bearer <JWT_TOKEN>`（レスポンスヘッダーで返却）

**現在の使用箇所:**
- `AuthContext.tsx` - `login()` 関数
- `mockAuth.ts` - `login()` 関数（モック実装）

---

### 1.3 ログアウト
```
DELETE /api/v1/auth/logout
```
**ヘッダー:**
- `Authorization: Bearer <JWT_TOKEN>`

**レスポンス:**
```json
{
  "message": "Logged out successfully."
}
```

**現在の使用箇所:**
- `AuthContext.tsx` - `logout()` 関数
- `mockAuth.ts` - `logout()` 関数

---

### 1.4 現在のユーザー情報取得
```
GET /api/v1/auth/me
```
**ヘッダー:**
- `Authorization: Bearer <JWT_TOKEN>`

**レスポンス:**
```json
{
  "data": {
    "id": "user_001",
    "type": "user",
    "attributes": {
      "email": "user@example.com",
      "role": "member"
    },
    "relationships": {
      "profile": {
        "data": {
          "id": "profile_001",
          "type": "profile"
        }
      }
    }
  },
  "included": [
    {
      "id": "profile_001",
      "type": "profile",
      "attributes": {
        "nickname": "はなちゃん",
        "name": "山田 花子",
        "bio": "写真が好きな大学生です📷",
        "avatar_url": "https://...",
        "cover_url": "https://...",
        "birthday": "2001-04-15",
        "birthplace": "東京都渋谷区",
        "hobbies": ["写真", "カフェ巡り"],
        "favorite_food": ["パスタ", "タピオカ"],
        "mbti_type": "ENFP",
        "blood_type": "A",
        "goal": "今年は写真展を1回開催する",
        "goal_progress": 75,
        "skills": "写真,レタッチ,構図",
        "social_link": "https://twitter.com/hanachan_photo"
      }
    }
  ]
}
```

**現在の使用箇所:**
- `AuthContext.tsx` - `initializeSession()` 内で使用予定
- `InstagramProfilePage.tsx` - `currentUser` 状態の取得

---

### 1.5 パスワードリセット
```
POST /api/v1/auth/password/reset
```
**リクエスト:**
```json
{
  "email": "user@example.com"
}
```

**レスポンス:**
```json
{
  "message": "Password reset email sent."
}
```

---

## 👤 2. プロフィール系API

### 2.1 プロフィール取得
```
GET /api/v1/profiles/:id
```
**レスポンス:**
```json
{
  "data": {
    "id": "profile_001",
    "type": "profile",
    "attributes": {
      "nickname": "はなちゃん",
      "name": "山田 花子",
      "bio": "写真が好きな大学生です📷",
      "avatar_url": "https://...",
      "cover_url": "https://...",
      "birthday": "2001-04-15",
      "age": 23,
      "birthplace": "東京都渋谷区",
      "hobbies": ["写真", "カフェ巡り", "映画鑑賞"],
      "favorite_food": ["パスタ", "タピオカ"],
      "mbti_type": "ENFP",
      "blood_type": "A",
      "goal": "今年は写真展を1回開催する",
      "goal_progress": 75,
      "milestones": [
        {
          "id": 1,
          "title": "会場の確保",
          "completed": true,
          "date": "2024-09-15"
        }
      ],
      "working_on": ["展示の企画", "ポートフォリオ整理"],
      "skills": "写真,レタッチ,構図",
      "social_link": "https://twitter.com/hanachan_photo",
      "posts_count": 156,
      "albums_count": 12,
      "friends_count": 23
    },
    "relationships": {
      "user": {
        "data": {
          "id": "user_001",
          "type": "user"
        }
      }
    }
  }
}
```

**現在の使用箇所:**
- `InstagramProfilePage.tsx` - `getUserById()` でプロフィール表示
- `dummyUsers.ts` - 20人のダミーユーザーデータ

---

### 2.2 プロフィール一覧（検索・ページネーション）
```
GET /api/v1/profiles?page=1&per_page=20&search=keyword
```
**クエリパラメータ:**
- `page`: ページ番号（デフォルト: 1）
- `per_page`: 1ページあたりの件数（デフォルト: 20）
- `search`: 検索キーワード（nickname, name, bio で検索）

**レスポンス:**
```json
{
  "data": [
    {
      "id": "profile_001",
      "type": "profile",
      "attributes": {
        "nickname": "はなちゃん",
        "name": "山田 花子",
        "avatar_url": "https://...",
        "bio": "写真が好きな大学生です📷"
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 100,
    "per_page": 20
  }
}
```

**現在の使用箇所:**
- 友達検索機能（実装予定）
- ユーザー一覧ページ（実装予定）

---

### 2.3 プロフィール更新
```
PUT /api/v1/profiles/:id
```
**ヘッダー:**
- `Authorization: Bearer <JWT_TOKEN>`

**リクエスト:**
```json
{
  "profile": {
    "nickname": "新しいニックネーム",
    "name": "新しい名前",
    "bio": "新しい自己紹介",
    "birthday": "2001-04-15",
    "birthplace": "東京都渋谷区",
    "hobbies": ["写真", "旅行"],
    "favorite_food": ["パスタ", "寿司"],
    "mbti_type": "ENFP",
    "blood_type": "A",
    "goal": "新しい目標",
    "goal_progress": 50,
    "skills": "写真,デザイン",
    "social_link": "https://twitter.com/username"
  }
}
```

**レスポンス:**
```json
{
  "data": {
    "id": "profile_001",
    "type": "profile",
    "attributes": {
      // 更新後のプロフィール全体
    }
  }
}
```

**現在の使用箇所:**
- `ProfileEditModal.tsx` - プロフィール編集フォーム
- `localStorage` で `cocoty_profile_v1` に保存

---

### 2.4 アバター画像アップロード
```
POST /api/v1/profiles/:id/avatar
```
**ヘッダー:**
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: multipart/form-data`

**リクエスト:**
```
FormData:
  avatar: <File>
```

**レスポンス:**
```json
{
  "data": {
    "id": "profile_001",
    "type": "profile",
    "attributes": {
      "avatar_url": "https://storage.example.com/avatars/user_001.jpg"
    }
  }
}
```

**現在の使用箇所:**
- `ProfileEditModal.tsx` - アバター変更（実装予定）
- 現在は画像URLを直接入力

---

### 2.5 カバー画像アップロード
```
POST /api/v1/profiles/:id/cover
```
**ヘッダー:**
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: multipart/form-data`

**リクエスト:**
```
FormData:
  cover: <File>
```

**レスポンス:**
```json
{
  "data": {
    "id": "profile_001",
    "type": "profile",
    "attributes": {
      "cover_url": "https://storage.example.com/covers/user_001.jpg"
    }
  }
}
```

---

### 2.6 マイルストーン管理
```
PUT /api/v1/profiles/:id/milestones
```
**ヘッダー:**
- `Authorization: Bearer <JWT_TOKEN>`

**リクエスト:**
```json
{
  "milestones": [
    {
      "id": 1,
      "title": "会場の確保",
      "completed": true,
      "date": "2024-09-15"
    },
    {
      "id": 2,
      "title": "新しいマイルストーン",
      "completed": false,
      "target_date": "2024-12-31"
    }
  ]
}
```

**現在の使用箇所:**
- `InstagramProfilePage.tsx` - `displayUser.milestones` 表示
- マイルストーン管理機能（実装予定）

---

## 👥 3. フォロー・友達関係API

### 3.1 フォロー
```
POST /api/v1/users/:id/follow
```
**ヘッダー:**
- `Authorization: Bearer <JWT_TOKEN>`

**レスポンス:**
```json
{
  "message": "Followed successfully.",
  "following": true
}
```

**現在の使用箇所:**
- `InstagramProfilePage.tsx` - `handleFollowToggle()`
- `localStorage` で `follow_{currentUserId}_{targetUserId}` に保存

---

### 3.2 フォロー解除
```
DELETE /api/v1/users/:id/unfollow
```
**ヘッダー:**
- `Authorization: Bearer <JWT_TOKEN>`

**レスポンス:**
```json
{
  "message": "Unfollowed successfully.",
  "following": false
}
```

---

### 3.3 フォロー状態確認
```
GET /api/v1/users/:id/follow_status
```
**ヘッダー:**
- `Authorization: Bearer <JWT_TOKEN>`

**レスポンス:**
```json
{
  "following": true,
  "followed_by": false
}
```

**現在の使用箇所:**
- `InstagramProfilePage.tsx` - `useEffect` でフォロー状態読み込み

---

### 3.4 フォロワー一覧
```
GET /api/v1/users/:id/followers?page=1&per_page=20
```
**レスポンス:**
```json
{
  "data": [
    {
      "id": "user_002",
      "type": "user",
      "attributes": {
        "nickname": "たろさん",
        "name": "田中 太郎",
        "avatar_url": "https://..."
      }
    }
  ],
  "meta": {
    "total_count": 150
  }
}
```

---

### 3.5 フォロー中のユーザー一覧
```
GET /api/v1/users/:id/following?page=1&per_page=20
```
**レスポンス:**（フォロワー一覧と同じ構造）

---

### 3.6 共通の友達取得
```
GET /api/v1/users/:id/common_friends
```
**ヘッダー:**
- `Authorization: Bearer <JWT_TOKEN>`

**レスポンス:**
```json
{
  "data": [
    {
      "id": "user_003",
      "type": "user",
      "attributes": {
        "nickname": "みさきん",
        "name": "佐藤 美咲",
        "avatar_url": "https://..."
      }
    }
  ],
  "meta": {
    "count": 5
  }
}
```

**現在の使用箇所:**
- `dummyUsers.ts` - `getCommonFriends()` 関数
- プロフィールページの「共通の友達」表示（実装予定）

---

## 💬 4. メッセージ系API

### 4.1 メッセージ送信
```
POST /api/v1/messages
```
**ヘッダー:**
- `Authorization: Bearer <JWT_TOKEN>`

**リクエスト:**
```json
{
  "message": {
    "recipient_id": "user_002",
    "text": "こんにちは！"
  }
}
```

**レスポンス:**
```json
{
  "data": {
    "id": "msg_001",
    "type": "message",
    "attributes": {
      "text": "こんにちは！",
      "sender_id": "user_001",
      "recipient_id": "user_002",
      "created_at": "2024-11-18T10:30:00Z",
      "read": false
    }
  }
}
```

**現在の使用箇所:**
- `InstagramProfilePage.tsx` - `handleSendMessage()`
- `localStorage` で `messages_{fromId}_{toId}` に保存

---

### 4.2 メッセージ一覧取得（会話スレッド）
```
GET /api/v1/messages/threads/:user_id?page=1&per_page=50
```
**ヘッダー:**
- `Authorization: Bearer <JWT_TOKEN>`

**レスポンス:**
```json
{
  "data": [
    {
      "id": "msg_001",
      "type": "message",
      "attributes": {
        "text": "こんにちは！",
        "sender_id": "user_001",
        "recipient_id": "user_002",
        "created_at": "2024-11-18T10:30:00Z",
        "read": true
      }
    }
  ],
  "meta": {
    "total_count": 25
  }
}
```

---

### 4.3 未読メッセージ数取得
```
GET /api/v1/messages/unread_count
```
**ヘッダー:**
- `Authorization: Bearer <JWT_TOKEN>`

**レスポンス:**
```json
{
  "unread_count": 3
}
```

---

## 🔮 5. タロット占い・診断系API

### 5.1 今日のタロット結果取得
```
GET /api/v1/tarot/daily
```
**ヘッダー:**
- `Authorization: Bearer <JWT_TOKEN>`

**レスポンス:**
```json
{
  "data": {
    "id": "tarot_20241118_user001",
    "type": "daily_tarot",
    "attributes": {
      "date": "2024-11-18",
      "card_name": "愚者",
      "card_name_en": "The Fool",
      "card_number": 0,
      "overall": "新しい冒険の始まり。恐れずに一歩踏み出す時です。",
      "love": "新しい出会いの予感。心を開いて。",
      "work": "思い切った挑戦が成功への鍵。",
      "money": "計画的な行動で安定を得られます。",
      "advice": "直感を信じて進みましょう。",
      "lucky_color": "青",
      "lucky_number": 7,
      "drawn_at": "2024-11-18T09:00:00Z"
    }
  }
}
```

**現在の使用箇所:**
- `DailyTarot.tsx` - `localStorage` で `daily_tarot_{userId}` に保存
- タロット占い機能

---

### 5.2 タロットカードを引く
```
POST /api/v1/tarot/draw
```
**ヘッダー:**
- `Authorization: Bearer <JWT_TOKEN>`

**レスポンス:**（5.1と同じ構造）

---

### 5.3 メンタルチェック結果取得
```
GET /api/v1/mental_check/latest
```
**ヘッダー:**
- `Authorization: Bearer <JWT_TOKEN>`

**レスポンス:**
```json
{
  "data": {
    "id": "mental_20241118_user001",
    "type": "mental_check",
    "attributes": {
      "date": "2024-11-18",
      "mood": "great",
      "energy": 85,
      "stress": 25,
      "motivation": 90,
      "overall_score": 83,
      "message": "今日はとても良い調子です！",
      "advice": "この調子で新しいことに挑戦してみましょう。",
      "created_at": "2024-11-18T10:00:00Z"
    }
  }
}
```

**現在の使用箇所:**
- `DailyTarot.tsx` - `localStorage` で `mental_check_{userId}` に保存
- メンタルチェック機能

---

### 5.4 メンタルチェックを実行
```
POST /api/v1/mental_check
```
**ヘッダー:**
- `Authorization: Bearer <JWT_TOKEN>`

**リクエスト:**
```json
{
  "mood": "great",
  "energy": 85,
  "stress": 25,
  "motivation": 90
}
```

**レスポンス:**（5.3と同じ構造）

---

### 5.5 メンタルチェック履歴取得
```
GET /api/v1/mental_check/history?days=30
```
**ヘッダー:**
- `Authorization: Bearer <JWT_TOKEN>`

**レスポンス:**
```json
{
  "data": [
    {
      "id": "mental_20241118_user001",
      "type": "mental_check",
      "attributes": {
        "date": "2024-11-18",
        "overall_score": 83
      }
    }
  ],
  "meta": {
    "total_count": 30,
    "average_score": 75
  }
}
```

**現在の使用箇所:**
- `DailyTarot.tsx` - `localStorage` で `mental_check_history_{userId}` に保存
- `MentalStatsAdmin.tsx` - メンタル統計表示

---

### 5.6 四季診断取得
```
GET /api/v1/seasonal_diagnosis
```
**ヘッダー:**
- `Authorization: Bearer <JWT_TOKEN>`

**レスポンス:**
```json
{
  "data": {
    "id": "diagnosis_user001",
    "type": "seasonal_diagnosis",
    "attributes": {
      "season": "spring",
      "personality_type": "ENFP",
      "description": "春のような明るく前向きな性格です。",
      "strengths": ["社交的", "創造的", "柔軟性"],
      "weaknesses": ["計画性不足", "飽きっぽい"],
      "compatible_seasons": ["summer", "autumn"],
      "career_advice": "クリエイティブな職種が向いています。",
      "relationship_advice": "オープンなコミュニケーションを大切に。"
    }
  }
}
```

**現在の使用箇所:**
- `SeasonalDiagnosisHub.tsx` - 四季診断機能
- プロフィールの `diagnosis` フィールド

---

## 📚 6. 学習・タスク系API（将来実装）

### 6.1 タスク一覧取得
```
GET /api/v1/tasks?status=pending&page=1&per_page=20
```

### 6.2 タスク作成
```
POST /api/v1/tasks
```

### 6.3 タスク更新
```
PUT /api/v1/tasks/:id
```

### 6.4 タスク削除
```
DELETE /api/v1/tasks/:id
```

**現在の使用箇所:**
- `mockLearningTasks.ts` - モックタスクデータ
- タスク管理機能（非表示中）

---

## 📷 7. アルバム・投稿系API（将来実装）

### 7.1 投稿一覧取得
```
GET /api/v1/posts?user_id=user_001&page=1&per_page=20
```

### 7.2 投稿作成
```
POST /api/v1/posts
```

### 7.3 アルバム一覧取得
```
GET /api/v1/albums?user_id=user_001
```

### 7.4 アルバム作成
```
POST /api/v1/albums
```

**現在の使用箇所:**
- `InstagramProfilePage.tsx` - 投稿グリッド表示（非表示中）
- `Store.tsx` - アルバム管理（`localStorage` で保存）

---

## 🔔 8. 通知系API（将来実装）

### 8.1 通知一覧取得
```
GET /api/v1/notifications?page=1&per_page=20
```

### 8.2 未読通知数取得
```
GET /api/v1/notifications/unread_count
```

### 8.3 通知を既読にする
```
PUT /api/v1/notifications/:id/read
```

**現在の使用箇所:**
- `mockNotifications.ts` - モック通知データ
- 通知機能（実装予定）

---

## ⚙️ 9. 設定系API（将来実装）

### 9.1 ユーザー設定取得
```
GET /api/v1/settings
```

### 9.2 ユーザー設定更新
```
PUT /api/v1/settings
```

**現在の使用箇所:**
- `ProfileSettings.tsx` - 設定モーダル
- `mockUserSettings.ts` - モック設定データ

---

## 📊 優先度順

### 🔥 最優先（MVP必須）
1. ✅ **認証系API**（1.1 ~ 1.4）
   - ユーザー登録、ログイン、ログアウト、現在のユーザー取得
2. ✅ **プロフィール系API**（2.1 ~ 2.3）
   - プロフィール取得、更新
3. ✅ **画像アップロードAPI**（2.4 ~ 2.5）
   - アバター、カバー画像アップロード

### 🔶 高優先度
4. ✅ **フォロー機能API**（3.1 ~ 3.3）
   - フォロー、フォロー解除、状態確認
5. ✅ **メッセージ機能API**（4.1 ~ 4.3）
   - メッセージ送信、一覧取得、未読数

### 🔷 中優先度
6. ⏳ **タロット占い・診断API**（5.1 ~ 5.6）
   - タロット、メンタルチェック、四季診断
7. ⏳ **フォロワー関係API**（3.4 ~ 3.6）
   - フォロワー一覧、フォロー中一覧、共通の友達

### 🔹 低優先度（将来実装）
8. ⏸️ **学習・タスク系API**（6.x）
9. ⏸️ **アルバム・投稿系API**（7.x）
10. ⏸️ **通知系API**（8.x）
11. ⏸️ **設定系API**（9.x）

---

## 🛠️ 技術要件

### 認証方式
- **JWT (JSON Web Token)** をHTTPヘッダーで送信
- `Authorization: Bearer <token>`

### レスポンス形式
- **JSON:API** 仕様に準拠（推奨）
- エラーレスポンスも統一フォーマット

### エラーハンドリング
```json
{
  "errors": [
    {
      "status": "422",
      "code": "validation_error",
      "title": "Validation Failed",
      "detail": "Email is already taken"
    }
  ]
}
```

### ページネーション
- クエリパラメータ: `page`, `per_page`
- レスポンスに `meta` オブジェクトで総数を返却

### 画像アップロード
- **Active Storage**（Rails）または **AWS S3** 使用
- FormData で `multipart/form-data` 送信
- レスポンスでCDN URLを返却

---

## 📝 フロントエンド側の変更が必要な箇所

### 1. API クライアント作成
```typescript
// lib/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 2. 認証コンテキストの修正
```typescript
// contexts/AuthContext.tsx
const login = async (email: string, password: string) => {
  const response = await authApi.login(email, password);
  setCurrentUser(response.user.data.attributes);
  localStorage.setItem('authToken', response.headers.authorization);
};
```

### 3. localStorage からAPI呼び出しへ移行
- `handleFollowToggle()` → `followApi.follow(userId)`
- `handleSendMessage()` → `messageApi.send(recipientId, text)`
- プロフィール更新 → `profileApi.update(profileId, data)`

---

## 🚀 次のステップ

1. ✅ **このAPI仕様書をもとにRails バックエンド実装**
2. ✅ **フロントエンドのAPIクライアント作成**（`lib/api/`）
3. ✅ **認証機能の統合**（localStorage → JWT トークン）
4. ✅ **プロフィール機能の統合**（モックデータ → 実API）
5. ✅ **画像アップロード機能実装**（Active Storage + S3）

---

**作成日**: 2024年11月18日  
**更新日**: 2024年11月18日  
**バージョン**: 1.0.0
