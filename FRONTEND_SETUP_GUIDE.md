# 🎨 フロントエンド設定ガイド

**作成日:** 2025年12月11日  
**対象:** フロントエンド開発者

---

## 📝 **必須な設定変更**

### 1️⃣ 環境変数の更新

**ファイル:** `.env.local` ✅ **已設定完了**

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

**変更内容:**
- ✅ API ベースURL は `http://localhost:5000/api/v1` に設定済み

**その他の設定:**
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDwspTUsWohl7rAN8KHpplZE4cNKTN9PJY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cocoty-auth.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cocoty-auth
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cocoty-auth.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=619911394014
NEXT_PUBLIC_FIREBASE_APP_ID=1:619911394014:web:91db2ff19c38912b42884f

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dq9cfrfvc
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=ml_default
```

---

### 2️⃣ 認証ヘッダーの確認

API クライアント（`src/lib/api/client.ts`）が、すべてのリクエストに以下のヘッダーを自動的に追加しているか確認してください：

```typescript
headers: {
  'Authorization': 'Bearer demo-token-12345',
  'Content-Type': 'application/json'
}
```

**✅ 確認済み:** 実装完了

```typescript
// src/lib/api/client.ts:11-20
async function getIdToken(): Promise<string | null> {
  const demoToken = 'demo-token-12345';
  console.log('🔐 Getting ID token...');
  console.log('Using demo token for development');
  
  return demoToken;
}

// src/lib/api/client.ts:27-37
if (requireAuth) {
  const token = await getIdToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('✅ Authorization header added');
  }
}
```

---

## 🧪 **ブラウザで動作確認**

### Network タブでの確認

1. **F12** で開発者ツールを開く
2. **Network** タブをクリック
3. フロントエンドを再読み込み（Cmd+R）
4. プロフィール関連の API リクエストを探す

**確認チェックリスト:**
- [ ] Request URL が `http://localhost:5000/api/v1/...` か？
- [ ] Request Headers に `Authorization: Bearer demo-token-12345` が含まれているか？
- [ ] Status Code が `200` か？（`401` や `404` はエラー）
- [ ] Response に正常なデータが返されているか？

### Console タブでの確認

1. **Console** タブを開く
2. エラーメッセージがないか確認
3. ネットワークエラーやタイムアウトエラーがないか確認

---

## 📊 **バックエンド API 仕様**

### 📍 ベース URL
```
http://localhost:5000/api/v1
```

### 🔐 認証方式
```
Authorization: Bearer demo-token-12345
```

---

### 📋 主要エンドポイント

#### **1. プロフィール一覧取得**
```
GET /api/v1/profiles?page=1&per_page=20
```

**認証:** 不要  
**レスポンス例:**
```json
{
  "profiles": [
    {
      "id": 1,
      "firebase_uid": "test_firebase_uid_123",
      "nickname": "テストユーザー",
      "name": "山田太郎",
      "avatar_url": "https://...",
      "mbti_type": "INTJ",
      "bio": "これはテスト用のプロフィールです..."
    }
  ],
  "pagination": {
    "total_count": 11,
    "page": 1,
    "per_page": 20,
    "total_pages": 1
  }
}
```

---

#### **2. プロフィール詳細取得**
```
GET /api/v1/profiles/:id
```

**認証:** 必須（`Authorization: Bearer demo-token-12345`）  
**レスポンス例:**
```json
{
  "id": 1,
  "user_id": 1,
  "firebase_uid": "test_firebase_uid_123",
  "nickname": "テストユーザー",
  "name": "山田太郎",
  "bio": "これはテスト用のプロフィールです。Firebase認証のテストに使用してください。",
  "avatar_url": "https://i.pravatar.cc/150?img=1",
  "cover_url": "https://picsum.photos/seed/test/1200/400",
  "birthday": "1995-05-15",
  "age": 30,
  "birthplace": null,
  "hobbies": ["プログラミング", "読書", "ゲーム"],
  "mbti_type": "INTJ",
  "blood_type": "A",
  "social_link": null,
  "posts_count": null,
  "albums_count": null,
  "friends_count": null,
  "mandala_image_url": null,
  "mandala_uploaded_at": null,
  "diagnosis": null,
  "created_at": "2025-12-11T02:42:22.960Z",
  "updated_at": "2025-12-11T02:42:22.960Z"
}
```

---

#### **3. プロフィール更新**
```
PUT /api/v1/profiles/:id
```

**認証:** 必須  
**リクエスト例:**
```json
{
  "profile": {
    "nickname": "新しいニックネーム",
    "name": "新しい名前",
    "bio": "新しい自己紹介",
    "birthday": "1995-05-15",
    "birthplace": "東京都",
    "hobbies": ["趣味1", "趣味2"],
    "favorite_food": ["食べ物1", "食べ物2"],
    "mbti_type": "ENFP",
    "blood_type": "A"
  }
}
```

---

## 📦 **テスト用ダミーデータ**

データベースに **11 個** のテストプロフィールが既に作成されています。

### ユーザー一覧

| ID | ニックネーム | 名前 | Firebase UID |
|----|------------|------|-------------|
| 1 | テストユーザー | 山田太郎 | `test_firebase_uid_123` |
| 2 | さくら | 田中一郎 | `dummy_firebase_uid_1` |
| 3 | けんた | 佐藤二郎 | `dummy_firebase_uid_2` |
| 4 | ゆい | 鈴木花子 | `dummy_firebase_uid_3` |
| 5 | たくみ | 高橋太郎 | `dummy_firebase_uid_4` |
| 6 | あやか | 渡辺美咲 | `dummy_firebase_uid_5` |
| 7 | しょうた | 伊藤健太 | `dummy_firebase_uid_6` |
| 8 | みほ | 山本愛 | `dummy_firebase_uid_7` |
| 9 | りょう | 中村翔 | `dummy_firebase_uid_8` |
| 10 | なつき | 小林結衣 | `dummy_firebase_uid_9` |
| 11 | かずき | 加藤蓮 | `dummy_firebase_uid_10` |

各プロフィールには以下の情報が含まれています：
- ✅ ニックネーム、名前、自己紹介
- ✅ 誕生日、出身地、血液型、MBTI タイプ
- ✅ 趣味、好きな食べ物
- ✅ 投稿数、アルバム数、友人数
- ✅ アバター画像 URL、カバー画像 URL

---

## 🔐 **認証について**

### 開発環境での認証

**デモトークン:**
```
demo-token-12345
```

**特徴:**
- Firebase トークン検証をスキップ
- すべてのリクエストで同じトークンを使用
- 自動的にデモユーザー（UID: `demo-user-dev`）として認証

### 本番環境への移行

**バックエンド側の対応:**
- `app/controllers/api/v1/application_controller.rb` の以下の部分を削除
```ruby
# 開発環境：デモトークンをスキップ
if Rails.env.development? && token == 'demo-token-12345'
  @current_user = find_or_create_demo_user
  return
end
```

**フロントエンド側の対応:**
- デモトークン (`demo-token-12345`) を削除
- 実際の Firebase ID Token に置き換える
```typescript
// ❌ 削除
// const token = 'demo-token-12345';

// ✅ Firebase から取得
const token = await auth.currentUser?.getIdToken();
```

---

## 🚀 **クイックスタート**

### 1. 環境変数を設定 ✅ 完了
```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

### 2. フロントエンドを起動
```bash
npm run dev
# または
yarn dev

# ポート 3000 で起動
# http://localhost:3000
```

### 3. ブラウザで確認
```
http://localhost:3000
```

### 4. プロフィールページにアクセス
- Network タブで確認
- Status Code が `200` か確認
- データが正常に表示されているか確認

---

## ⚠️ **よくあるトラブル**

### ❌ エラー: `Authorization header is missing or invalid`
**原因:** `Authorization` ヘッダーが送信されていない  
**解決:** API クライアントで `Authorization: Bearer demo-token-12345` を追加

### ❌ エラー: `http://localhost:5001` に接続できない
**原因:** バックエンド URL が古いままになっている  
**解決:** `.env.local` を `http://localhost:5000/api/v1` に更新（✅ 已更新）

### ❌ エラー: CORS エラー
**原因:** CORS 設定が `localhost:3000` を許可していない  
**解決:** バックエンド側で既に許可済み。キャッシュをクリアして再読み込み

### ❌ エラー: `404 Not Found`
**原因:** エンドポイント URL が間違っている  
**解決:** Network タブで実際のリクエスト URL を確認

---

## 📞 **サポート**

問題が発生した場合は、以下の情報を収集してバックエンド開発者に報告してください：

1. **ブラウザの Network タブのスクリーンショット**
2. **Console タブのエラーメッセージ**
3. **Request Headers と Response の内容**
4. **`.env.local` の内容**（API URL のみ）

---

**最終更新:** 2025年12月11日  
**ステータス:** ✅ すべて設定完了
