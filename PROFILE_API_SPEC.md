# 🎯 プロフィール API 仕様書

## エンドポイント

### 1. プロフィール一覧取得
```
GET /api/v1/profiles
```

**クエリパラメータ:**
- `page` (オプション): ページ番号（デフォルト: 1）
- `per_page` (オプション): 1ページあたりの件数（デフォルト: 20）

**レスポンス (200 OK):**
```json
{
  "profiles": [
    {
      "id": "profile_001",
      "user_id": "user_001",
      "nickname": "はなちゃん",
      "avatar_url": "https://...",
      "bio": "写真が好きな大学生です📷"
    }
  ],
  "pagination": {
    "total_count": 100,
    "page": 1,
    "per_page": 20,
    "total_pages": 5
  }
}
```

---

### 2. プロフィール詳細取得
```
GET /api/v1/profiles/:id
```

**レスポンス (200 OK):**
```json
{
  "profile": {
    "id": "profile_001",
    "user_id": "user_001",
    "nickname": "はなちゃん",
    "name": "山田 花子",
    "bio": "写真が好きな大学生です📷",
    "avatar_url": "https://...",
    "cover_url": "https://...",
    
    // 基本情報
    "birthday": "2001-04-15",
    "age": 23,
    "birthplace": "東京都渋谷区",
    "hobbies": ["写真", "カフェ巡り", "映画鑑賞"],
    "favorite_food": ["パスタ", "タピオカ"],
    "mbti_type": "ENFP",
    "blood_type": "A",
    
    // 目標・進捗
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
    
    // その他
    "skills": "写真,レタッチ,構図",
    "social_link": "https://twitter.com/hanachan_photo",
    
    // カウント
    "posts_count": 156,
    "albums_count": 12,
    "friends_count": 23,
    
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-11-18T10:00:00Z"
  }
}
```

---

### 3. プロフィール更新
```
PUT /api/v1/profiles/:id
```

**リクエストボディ:**
```json
{
  "nickname": "はなちゃん",
  "name": "山田 花子",
  "bio": "写真が好きな大学生です📷",
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
```

**レスポンス (200 OK):**
```json
{
  "profile": { /* 更新後のプロフィール */ }
}
```

---

### 4. アバター画像アップロード
```
POST /api/v1/profiles/:id/avatar
```

**リクエスト:**
- `Content-Type: multipart/form-data`
- `avatar`: 画像ファイル（JPEG, PNG）

**レスポンス (200 OK):**
```json
{
  "avatar_url": "https://cdn.example.com/avatars/profile_001.jpg"
}
```

---

### 5. カバー画像アップロード
```
POST /api/v1/profiles/:id/cover
```

**リクエスト:**
- `Content-Type: multipart/form-data`
- `cover`: 画像ファイル（JPEG, PNG）

**レスポンス (200 OK):**
```json
{
  "cover_url": "https://cdn.example.com/covers/profile_001.jpg"
}
```

---

## TypeScript型定義

```typescript
// プロフィール基本型
interface Profile {
  id: string;
  user_id: string;
  nickname: string;
  name: string;
  bio: string;
  avatar_url?: string;
  cover_url?: string;
  birthday?: string;
  age?: number;
  birthplace?: string;
  hobbies?: string[];
  favorite_food?: string[];
  mbti_type?: string;
  blood_type?: string;
  goal?: string;
  goal_progress?: number;
  milestones?: Milestone[];
  working_on?: string[];
  skills?: string;
  social_link?: string;
  posts_count: number;
  albums_count: number;
  friends_count: number;
  created_at: string;
  updated_at: string;
}

// マイルストーン型
interface Milestone {
  id: number;
  title: string;
  completed: boolean;
  date: string;
}

// プロフィール一覧レスポンス型
interface ProfilesResponse {
  profiles: Profile[];
  pagination: {
    total_count: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

// プロフィール詳細レスポンス型
interface ProfileResponse {
  profile: Profile;
}

// 更新リクエスト型
interface UpdateProfileRequest {
  nickname?: string;
  name?: string;
  bio?: string;
  birthday?: string;
  birthplace?: string;
  hobbies?: string[];
  favorite_food?: string[];
  mbti_type?: string;
  blood_type?: string;
  goal?: string;
  goal_progress?: number;
  skills?: string;
  social_link?: string;
}
```

---

## 認証

すべてのエンドポイントでJWTトークンが必要です：

```
Authorization: Bearer <JWT_TOKEN>
```

---

## エラーレスポンス

**400 Bad Request:**
```json
{
  "error": "Invalid request parameters"
}
```

**401 Unauthorized:**
```json
{
  "error": "Authentication required"
}
```

**404 Not Found:**
```json
{
  "error": "Profile not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```
