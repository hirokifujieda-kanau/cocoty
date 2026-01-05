# 曼荼羅画像機能 - API仕様書

## 📋 概要

ユーザーが自分のプロフィールに曼荼羅画像を2枚（サムネイル・詳細）アップロードできる機能。

- **サムネイル画像**: プロフィール一覧・カード表示用（400x400px推奨）
- **詳細画像**: クリック時のモーダル表示用（1200x1200px推奨）

---

## 🔄 処理フロー

```
1. ユーザーが画像選択 → プレビュー表示（FE）
2. 「アップロード」ボタンクリック
3. サムネイル画像 → Cloudinaryへアップロード → URL取得
4. 詳細画像 → Cloudinaryへアップロード → URL取得
5. 両方のURL → Rails API（PUT /profiles/:id）→ DB保存
6. プロフィール再取得（GET /auth/me）→ 画面に反映
```

---

## 📤 1. Cloudinaryへの画像アップロード（FE → Cloudinary）

### エンドポイント
```
POST https://api.cloudinary.com/v1_1/{cloudName}/image/upload
```

### リクエスト

**Content-Type:** `multipart/form-data`

**パラメータ:**
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `file` | File | ✅ | 画像ファイル（JPEG/PNG/WebP/GIF） |
| `upload_preset` | string | ✅ | `"ml_default"` 固定 |
| `folder` | string | ✅ | サムネイル: `"community-platform/mandala/thumbnails"`<br>詳細: `"community-platform/mandala/details"` |

### レスポンス例

```json
{
  "public_id": "community-platform/mandala/thumbnails/xxx",
  "secure_url": "https://res.cloudinary.com/dq9cfrfvc/image/upload/v1766658257/community-platform/mandala/thumbnails/xxx.png",
  "width": 400,
  "height": 400,
  "format": "png",
  "resource_type": "image",
  "created_at": "2025-12-25T10:30:57Z"
}
```

---

## 📤 2. プロフィール更新（FE → Rails API）

### エンドポイント
```
PUT /api/v1/profiles/{userId}
```

### リクエストヘッダー

```http
Content-Type: application/json
Authorization: Bearer {firebaseIdToken}
```

### リクエストボディ

```json
{
  "profile": {
    "mandala_thumbnail_url": "https://res.cloudinary.com/dq9cfrfvc/image/upload/v.../thumbnail.png",
    "mandala_detail_url": "https://res.cloudinary.com/dq9cfrfvc/image/upload/v.../detail.png"
  }
}
```

### レスポンス例（成功）

```json
{
  "message": "プロフィールを更新しました",
  "profile": {
    "id": 19,
    "user_id": 123,
    "firebase_uid": "WZx0mq4V0ydGGHbV5fHeZNqlR1C2",
    "name": "fujiedaTest 5",
    "nickname": "fujiedaTest 5",
    "bio": "",
    "avatar_url": null,
    "cover_url": null,
    "mandala_thumbnail_url": "https://res.cloudinary.com/dq9cfrfvc/image/upload/v.../thumbnail.png",
    "mandala_detail_url": "https://res.cloudinary.com/dq9cfrfvc/image/upload/v.../detail.png",
    "birthday": "1990-01-01",
    "birthplace": "東京都",
    "age": 35,
    "hobbies": ["読書", "映画鑑賞"],
    "favorite_food": ["寿司", "ラーメン"],
    "mbti_type": "INFP",
    "blood_type": "A",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-12-25T10:42:52.000Z"
  }
}
```

### レスポンス例（エラー）

**401 Unauthorized** - 認証エラー
```json
{
  "error": "Authorization header is missing or invalid"
}
```

**422 Unprocessable Entity** - バリデーションエラー
```json
{
  "errors": ["Mandala thumbnail url is invalid"]
}
```

---

## 📥 3. プロフィール取得（Rails API → FE）

### エンドポイント
```
GET /api/v1/auth/me
```

### リクエストヘッダー

```http
Authorization: Bearer {firebaseIdToken}
```

### レスポンス例

```json
{
  "user": {
    "id": 123,
    "email": "testfujiedayama@exampledada.com",
    "firebase_uid": "WZx0mq4V0ydGGHbV5fHeZNqlR1C2"
  },
  "profile": {
    "id": 19,
    "user_id": 123,
    "firebase_uid": "WZx0mq4V0ydGGHbV5fHeZNqlR1C2",
    "name": "fujiedaTest 5",
    "nickname": "fujiedaTest 5",
    "bio": "",
    "avatar_url": null,
    "cover_url": null,
    "mandala_thumbnail_url": "https://res.cloudinary.com/dq9cfrfvc/image/upload/v.../thumbnail.png",
    "mandala_detail_url": "https://res.cloudinary.com/dq9cfrfvc/image/upload/v.../detail.png",
    "mandala_uploaded_at": "2025-12-25T10:42:52.000Z",
    "birthday": "1990-01-01",
    "birthplace": "東京都",
    "age": 35,
    "hobbies": ["読書", "映画鑑賞"],
    "favorite_food": ["寿司", "ラーメン"],
    "mbti_type": "INFP",
    "blood_type": "A",
    "posts_count": 42,
    "albums_count": 5,
    "friends_count": 28,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-12-25T10:42:52.000Z"
  }
}
```

---

## ⚙️ バックエンド実装要件（Rails）

### 1. データベーススキーマ

**テーブル:** `profiles`

```ruby
# db/schema.rb
create_table "profiles", force: :cascade do |t|
  # ... 既存カラム ...
  t.string "mandala_thumbnail_url"
  t.string "mandala_detail_url"
  t.datetime "mandala_uploaded_at"
  # ... 既存カラム ...
end
```

**マイグレーション:**
```ruby
# db/migrate/YYYYMMDDHHMMSS_add_mandala_urls_to_profiles.rb
class AddMandalaUrlsToProfiles < ActiveRecord::Migration[8.1]
  def change
    add_column :profiles, :mandala_thumbnail_url, :string
    add_column :profiles, :mandala_detail_url, :string
    add_column :profiles, :mandala_uploaded_at, :datetime
  end
end
```

### 2. モデル（app/models/profile.rb）

```ruby
class Profile < ApplicationRecord
  # バリデーション（任意）
  validates :mandala_thumbnail_url, 
            format: { with: URI::regexp(%w[http https]), allow_blank: true }
  validates :mandala_detail_url, 
            format: { with: URI::regexp(%w[http https]), allow_blank: true }
  
  # コールバック（任意）
  before_save :update_mandala_uploaded_at, 
              if: :mandala_urls_changed?

  private

  def mandala_urls_changed?
    mandala_thumbnail_url_changed? || mandala_detail_url_changed?
  end

  def update_mandala_uploaded_at
    self.mandala_uploaded_at = Time.current if mandala_urls_changed?
  end
end
```

### 3. コントローラー（app/controllers/api/v1/profiles_controller.rb）

```ruby
class Api::V1::ProfilesController < ApplicationController
  before_action :authenticate_user!

  # PUT /api/v1/profiles/:id
  def update
    @profile = current_user.profile
    
    if @profile.update(profile_params)
      render json: {
        message: 'プロフィールを更新しました',
        profile: profile_response(@profile)
      }, status: :ok
    else
      render json: { errors: @profile.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def profile_params
    params.require(:profile).permit(
      :nickname, :name, :bio, :birthday, :birthplace, :blood_type, :mbti_type,
      :goal, :goal_progress, :skills, :social_link, :avatar_url, :cover_url,
      :mandala_thumbnail_url, :mandala_detail_url, # ← 追加
      hobbies: [], favorite_food: []
    )
  end

  def profile_response(profile)
    {
      id: profile.id,
      user_id: profile.user_id,
      firebase_uid: profile.user.firebase_uid,
      nickname: profile.nickname,
      name: profile.name,
      bio: profile.bio,
      avatar_url: profile.avatar_url,
      cover_url: profile.cover_url,
      mandala_thumbnail_url: profile.mandala_thumbnail_url, # ← 追加
      mandala_detail_url: profile.mandala_detail_url,       # ← 追加
      mandala_uploaded_at: profile.mandala_uploaded_at,     # ← 追加
      birthday: profile.birthday,
      birthplace: profile.birthplace,
      age: profile.age,
      hobbies: profile.hobbies,
      favorite_food: profile.favorite_food,
      mbti_type: profile.mbti_type,
      blood_type: profile.blood_type,
      posts_count: profile.posts_count,
      albums_count: profile.albums_count,
      friends_count: profile.friends_count,
      created_at: profile.created_at,
      updated_at: profile.updated_at
    }
  end
end
```

---

## 🧪 テスト方法

### 1. curlでのテスト

```bash
# Firebaseトークン取得（ブラウザコンソールで実行）
localStorage.getItem('firebaseIdToken')

# プロフィール更新
curl -X PUT http://localhost:5000/api/v1/profiles/19 \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_FIREBASE_TOKEN' \
  -d '{
    "profile": {
      "mandala_thumbnail_url": "https://res.cloudinary.com/demo/test_thumb.png",
      "mandala_detail_url": "https://res.cloudinary.com/demo/test_detail.png"
    }
  }'

# プロフィール取得確認
curl http://localhost:5000/api/v1/auth/me \
  -H 'Authorization: Bearer YOUR_FIREBASE_TOKEN'
```

### 2. Railsコンソールでの確認

```ruby
# Rails console
rails c

# プロフィール確認
profile = Profile.find(19)
puts profile.mandala_thumbnail_url
puts profile.mandala_detail_url
puts profile.mandala_uploaded_at

# 手動更新テスト
profile.update(
  mandala_thumbnail_url: 'https://test.com/thumb.png',
  mandala_detail_url: 'https://test.com/detail.png'
)
```

---

## 🐛 トラブルシューティング

### エラー: "Authorization header is missing or invalid"
→ Firebaseトークンが送信されていない、または無効  
→ `requireAuth: true` がAPIリクエストに含まれているか確認

### エラー: "Unpermitted parameter: :mandala_thumbnail_url"
→ Strong Parametersに追加されていない  
→ `profile_params` に `:mandala_thumbnail_url`, `:mandala_detail_url` を追加

### 画像がアップロードされない
→ Cloudinaryの認証情報（CLOUDINARY_CLOUD_NAME）を確認  
→ `upload_preset` が正しく設定されているか確認

### DBに保存されない
→ プロフィール更新APIのレスポンスを確認  
→ Railsログでパラメータが正しく受信されているか確認

---

## 📝 関連ファイル

### フロントエンド
- `src/components/profile/MandalaUpload.tsx` - アップロードコンポーネント
- `src/components/profile/MandalaDisplay.tsx` - 表示コンポーネント
- `src/components/profile/ProfileEditModal.tsx` - 編集モーダル統合
- `src/components/profile/InstagramProfilePage.tsx` - プロフィールページ表示
- `src/lib/cloudinary/upload.ts` - Cloudinaryアップロード関数
- `src/lib/cloudinary/config.ts` - Cloudinary設定
- `src/lib/api/client.ts` - API型定義

### バックエンド
- `app/models/profile.rb` - プロフィールモデル
- `app/controllers/api/v1/profiles_controller.rb` - プロフィールコントローラー
- `db/schema.rb` - データベーススキーマ

---

## 📅 更新履歴

- **2025-12-25**: 初版作成
