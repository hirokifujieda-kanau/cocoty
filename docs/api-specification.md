# API仕様書（feature-summary.md ベース）

## 📋 概要

`feature-summary.md` に記載されたフロントエンド機能に対応するバックエンドAPIの仕様書です。

**実装範囲**:
- ✅ 認証システム（70h）
- ✅ プロフィール管理（120h）
- ✅ 設定管理（48h）
- ⏸️ タロット・診断（将来実装）
- ⏸️ タグ・共通者機能（将来実装）
- ⏸️ プロジェクト機能（将来実装）

---

## 🔐 Phase 2: 認証システム API（70h）

### 2.1 ユーザー登録
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

**レスポンス (201 Created):**
```json
{
  "message": "ユーザー登録が完了しました",
  "user": {
    "id": "user_001",
    "email": "user@example.com",
    "created_at": "2024-11-18T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**フロントエンド使用箇所:**
- `SignupPage.tsx` (264行)
- `AuthContext.tsx` - signup()関数

---

### 2.2 ログイン
```
POST /api/v1/auth/login
```

**リクエスト:**
```json
{
  "user": {
    "email": "user@example.com",
    "password": "password123",
    "remember_me": true
  }
}
```

**レスポンス (200 OK):**
```json
{
  "message": "ログインしました",
  "user": {
    "id": "user_001",
    "email": "user@example.com",
    "nickname": "はなちゃん",
    "avatar_url": "https://..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**フロントエンド使用箇所:**
- `LoginPage.tsx` (202行) - メール・パスワードログイン、Remember me
- `AuthContext.tsx` - login()関数

---

### 2.3 ログアウト
```
DELETE /api/v1/auth/logout
```

**ヘッダー:**
```
Authorization: Bearer <token>
```

**レスポンス (200 OK):**
```json
{
  "message": "ログアウトしました"
}
```

**フロントエンド使用箇所:**
- `UserSwitcher.tsx` - ログアウトボタン
- `AuthContext.tsx` - logout()関数

---

### 2.4 現在のユーザー情報取得
```
GET /api/v1/auth/me
```

**ヘッダー:**
```
Authorization: Bearer <token>
```

**レスポンス (200 OK):**
```json
{
  "user": {
    "id": "user_001",
    "email": "user@example.com",
    "nickname": "はなちゃん",
    "name": "山田 花子",
    "bio": "写真が好きな大学生です📷",
    "avatar_url": "https://...",
    "cover_url": "https://...",
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

**フロントエンド使用箇所:**
- `AuthContext.tsx` - initializeSession()
- `InstagramProfilePage.tsx` - currentUser取得

---

### 2.5 パスワードリセット（メール送信）
```
POST /api/v1/auth/password/reset
```

**リクエスト:**
```json
{
  "email": "user@example.com"
}
```

**レスポンス (200 OK):**
```json
{
  "message": "パスワードリセット用のメールを送信しました"
}
```

---

### 2.6 パスワードリセット（実行）
```
PUT /api/v1/auth/password/reset
```

**リクエスト:**
```json
{
  "token": "reset_token_from_email",
  "password": "new_password123",
  "password_confirmation": "new_password123"
}
```

**レスポンス (200 OK):**
```json
{
  "message": "パスワードを変更しました"
}
```

---

## 👤 Phase 3: プロフィール管理 API（120h）

### 3.1 プロフィール取得
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
    "bio": "写真が好きな大学生です📷 風景とポートレートを撮っています",
    "avatar_url": "https://...",
    "cover_url": "https://...",
    
    // 拡張フィールド
    "birthday": "2001-04-15",
    "age": 23,
    "birthplace": "東京都渋谷区",
    "hobbies": ["写真", "カフェ巡り", "映画鑑賞"],
    "favorite_food": ["パスタ", "タピオカ", "パンケーキ"],
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
      },
      {
        "id": 2,
        "title": "作品選定（30点）",
        "completed": true,
        "date": "2024-10-01"
      }
    ],
    "working_on": ["展示の企画", "ポートフォリオ整理", "写真教室の企画"],
    
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

**フロントエンド使用箇所:**
- `InstagramProfilePage.tsx` (1057行)
  - プロフィール表示（アバター、カバー画像、自己紹介）
  - 拡張フィールド表示（年齢、出身地、血液型、MBTI）
  - 趣味タグ（オレンジバッジ）、好きな食べ物タグ（ピンクバッジ）

---

### 3.2 プロフィール更新
```
PUT /api/v1/profiles/:id
```

**ヘッダー:**
```
Authorization: Bearer <token>
```

**リクエスト:**
```json
{
  "profile": {
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
}
```

**レスポンス (200 OK):**
```json
{
  "message": "プロフィールを更新しました",
  "profile": {
    // 更新後のプロフィール全体（3.1と同じ形式）
  }
}
```

**フロントエンド使用箇所:**
- `ProfileEditModal.tsx` (301行)
  - 基本情報編集（名前、自己紹介、メール、電話、ウェブサイト、場所）
  - 拡張情報編集（誕生日、出身地、趣味、好きな食べ物、MBTI、血液型）

---

### 3.3 アバター画像アップロード
```
POST /api/v1/profiles/:id/avatar
```

**ヘッダー:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**リクエスト:**
```
FormData:
  avatar: <File>
```

**レスポンス (200 OK):**
```json
{
  "message": "アバター画像を更新しました",
  "avatar_url": "https://storage.example.com/avatars/user_001_20241118.jpg"
}
```

**フロントエンド使用箇所:**
- `ProfileEditModal.tsx` - 画像アップロードUI（アバター）

---

### 3.4 カバー画像アップロード
```
POST /api/v1/profiles/:id/cover
```

**ヘッダー:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**リクエスト:**
```
FormData:
  cover: <File>
```

**レスポンス (200 OK):**
```json
{
  "message": "カバー画像を更新しました",
  "cover_url": "https://storage.example.com/covers/user_001_20241118.jpg"
}
```

**フロントエンド使用箇所:**
- `ProfileEditModal.tsx` - 画像アップロードUI（カバー画像）

---

### 3.5 マイルストーン更新
```
PUT /api/v1/profiles/:id/milestones
```

**ヘッダー:**
```
Authorization: Bearer <token>
```

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
      "title": "新しいマイルストーン",
      "completed": false,
      "target_date": "2024-12-31"
    }
  ]
}
```

**レスポンス (200 OK):**
```json
{
  "message": "マイルストーンを更新しました",
  "milestones": [
    // 更新後のマイルストーン配列
  ]
}
```

**フロントエンド使用箇所:**
- `InstagramProfilePage.tsx` - マイルストーン表示（将来的に編集機能追加予定）

---

## ⚙️ Phase 4: 設定管理 API（48h）

### 4.1 プライバシー設定取得
```
GET /api/v1/settings/privacy
```

**ヘッダー:**
```
Authorization: Bearer <token>
```

**レスポンス (200 OK):**
```json
{
  "privacy": {
    "profile_visibility": "public",
    "allow_tagging": true,
    "allow_messages_from": "everyone",
    "show_online_status": true,
    "show_last_seen": false
  }
}
```

**フロントエンド使用箇所:**
- `ProfileSettings.tsx` (666行) - プライバシータブ
  - 公開範囲、タグ付け許可、メッセージ許可

---

### 4.2 プライバシー設定更新
```
PUT /api/v1/settings/privacy
```

**ヘッダー:**
```
Authorization: Bearer <token>
```

**リクエスト:**
```json
{
  "privacy": {
    "profile_visibility": "friends_only",
    "allow_tagging": false,
    "allow_messages_from": "friends",
    "show_online_status": false,
    "show_last_seen": false
  }
}
```

**レスポンス (200 OK):**
```json
{
  "message": "プライバシー設定を更新しました",
  "privacy": {
    // 更新後の設定
  }
}
```

---

### 4.3 パスワード変更
```
PUT /api/v1/settings/password
```

**ヘッダー:**
```
Authorization: Bearer <token>
```

**リクエスト:**
```json
{
  "current_password": "old_password123",
  "new_password": "new_password456",
  "new_password_confirmation": "new_password456"
}
```

**レスポンス (200 OK):**
```json
{
  "message": "パスワードを変更しました"
}
```

**フロントエンド使用箇所:**
- `ProfileSettings.tsx` - セキュリティタブ
  - パスワード変更

---

### 4.4 2要素認証の有効化
```
POST /api/v1/settings/2fa/enable
```

**ヘッダー:**
```
Authorization: Bearer <token>
```

**レスポンス (200 OK):**
```json
{
  "message": "2要素認証を有効にしました",
  "qr_code": "data:image/png;base64,...",
  "secret": "JBSWY3DPEHPK3PXP",
  "backup_codes": [
    "12345678",
    "87654321"
  ]
}
```

**フロントエンド使用箇所:**
- `ProfileSettings.tsx` - セキュリティタブ
  - 2FA設定

---

### 4.5 2要素認証の無効化
```
DELETE /api/v1/settings/2fa/disable
```

**ヘッダー:**
```
Authorization: Bearer <token>
```

**リクエスト:**
```json
{
  "password": "current_password123"
}
```

**レスポンス (200 OK):**
```json
{
  "message": "2要素認証を無効にしました"
}
```

---

### 4.6 アクティブセッション一覧取得
```
GET /api/v1/settings/sessions
```

**ヘッダー:**
```
Authorization: Bearer <token>
```

**レスポンス (200 OK):**
```json
{
  "sessions": [
    {
      "id": "session_001",
      "device": "Chrome on macOS",
      "ip_address": "192.168.1.1",
      "location": "東京, 日本",
      "last_active": "2024-11-18T10:30:00Z",
      "current": true
    },
    {
      "id": "session_002",
      "device": "Safari on iPhone",
      "ip_address": "192.168.1.2",
      "location": "東京, 日本",
      "last_active": "2024-11-17T15:20:00Z",
      "current": false
    }
  ]
}
```

**フロントエンド使用箇所:**
- `ProfileSettings.tsx` - セキュリティタブ
  - セッション管理

---

### 4.7 セッション削除（ログアウト）
```
DELETE /api/v1/settings/sessions/:id
```

**ヘッダー:**
```
Authorization: Bearer <token>
```

**レスポンス (200 OK):**
```json
{
  "message": "セッションを削除しました"
}
```

---

### 4.8 アカウント削除
```
DELETE /api/v1/settings/account
```

**ヘッダー:**
```
Authorization: Bearer <token>
```

**リクエスト:**
```json
{
  "password": "current_password123",
  "confirmation": "DELETE MY ACCOUNT"
}
```

**レスポンス (200 OK):**
```json
{
  "message": "アカウントを削除しました"
}
```

**フロントエンド使用箇所:**
- `ProfileSettings.tsx` - セキュリティタブ
  - アカウント削除

---

## 📊 データベーススキーマ

### users テーブル
```ruby
create_table :users do |t|
  t.string :email, null: false, index: { unique: true }
  t.string :password_digest, null: false
  t.boolean :two_factor_enabled, default: false
  t.string :two_factor_secret
  t.timestamps
end
```

### profiles テーブル
```ruby
create_table :profiles do |t|
  t.references :user, null: false, foreign_key: true
  t.string :nickname
  t.string :name
  t.text :bio
  t.string :avatar_url
  t.string :cover_url
  
  # 拡張フィールド
  t.date :birthday
  t.string :birthplace
  t.json :hobbies, default: []
  t.json :favorite_food, default: []
  t.string :mbti_type
  t.string :blood_type
  
  # 目標・進捗
  t.string :goal
  t.integer :goal_progress, default: 0
  t.json :milestones, default: []
  t.json :working_on, default: []
  
  # その他
  t.string :skills
  t.string :social_link
  
  # カウントキャッシュ
  t.integer :posts_count, default: 0
  t.integer :albums_count, default: 0
  t.integer :friends_count, default: 0
  
  t.timestamps
end
```

### privacy_settings テーブル
```ruby
create_table :privacy_settings do |t|
  t.references :user, null: false, foreign_key: true
  t.string :profile_visibility, default: 'public'
  t.boolean :allow_tagging, default: true
  t.string :allow_messages_from, default: 'everyone'
  t.boolean :show_online_status, default: true
  t.boolean :show_last_seen, default: true
  t.timestamps
end
```

### sessions テーブル
```ruby
create_table :sessions do |t|
  t.references :user, null: false, foreign_key: true
  t.string :token, null: false, index: { unique: true }
  t.string :device
  t.string :ip_address
  t.string :location
  t.datetime :last_active
  t.datetime :expires_at
  t.timestamps
end
```

---

## 🔒 認証・セキュリティ

### JWT トークン
- **アルゴリズム**: HS256
- **有効期限**: 24時間（remember_meの場合は30日）
- **格納場所**: フロントエンドのlocalStorage
- **ヘッダー形式**: `Authorization: Bearer <token>`

### パスワード
- **ハッシュ化**: bcrypt
- **最小文字数**: 8文字
- **複雑性要件**: 英数字を含む

### 2要素認証
- **方式**: TOTP（Time-based One-Time Password）
- **ライブラリ**: rotp gem
- **バックアップコード**: 8桁の数字 × 10個

---

## 📈 API レート制限

| エンドポイント | 制限 |
|---------------|------|
| POST /api/v1/auth/signup | 5回/時間 |
| POST /api/v1/auth/login | 10回/時間 |
| POST /api/v1/auth/password/reset | 3回/時間 |
| その他の認証済みAPI | 100回/分 |

---

## 🚀 次のステップ

1. ✅ Rails プロジェクト作成
2. ✅ データベース設計・マイグレーション
3. ✅ モデル実装（User, Profile, PrivacySetting, Session）
4. ✅ 認証システム実装（JWT + bcrypt）
5. ✅ プロフィールAPI実装
6. ✅ 設定管理API実装
7. ✅ 画像アップロード実装（Active Storage）
8. ✅ テスト実装（RSpec）
9. ✅ フロントエンド連携テスト

---

**作成日**: 2024年11月18日  
**バージョン**: 1.0.0  
**対応フロントエンド**: `feature-summary.md` 記載の完成機能
