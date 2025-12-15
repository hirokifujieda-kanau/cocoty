# 🔍 バックエンド確認チェックリスト

## 1️⃣ API ベースURL設定の確認

### フロントエンド側の設定
✅ **確認済み** - `.env.local`で設定

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001/api/v1
```

### バックエンド側で確認する項目
- [ ] バックエンドが `http://localhost:5001` で起動しているか
- [ ] API ルートが `/api/v1` で始まっているか
- [ ] Rails/Node.js の起動ログで確認:
  ```bash
  # Rails の場合
  rails server -p 5001
  # 出力: Listening on http://localhost:5001
  
  # Node.js の場合
  npm run dev -- -p 5001
  # 出力: listening on port 5001
  ```

### テスト方法
```bash
# ターミナルで確認
curl http://localhost:5001/api/v1/auth/me -H "Authorization: Bearer demo-token-12345"

# レスポンスが返ってくれば OK
```

---

## 2️⃣ プロフィール画像サポートの確認

### フロントエンド側の実装状況
✅ **実装済み機能:**
- Cloudinary SDK がインストール済み
- アバター画像アップロード機能 (`useAvatarUpload.ts`)

### バックエンド側で確認する項目
- [ ] プロフィール画像アップロードエンドポイントが実装されているか

  ```
  POST /api/v1/profiles/:id/avatar
  Content-Type: multipart/form-data
  Authorization: Bearer <JWT_TOKEN>
  ```

- [ ] 画像保存先の設定:
  - [ ] AWS S3 が設定されているか
  - [ ] Google Cloud Storage が設定されているか
  - [ ] その他のクラウドストレージが設定されているか

- [ ] アップロード成功時のレスポンス:
  ```json
  {
    "avatar_url": "https://cdn.example.com/avatars/profile_001.jpg"
  }
  ```

### テスト方法
```bash
# アバター画像アップロードエンドポイントをテスト
curl -X POST http://localhost:5001/api/v1/profiles/profile_001/avatar \
  -H "Authorization: Bearer demo-token-12345" \
  -F "avatar=@/path/to/image.jpg"

# 成功レスポンス例
# {"avatar_url": "https://..."}
```

---

## 3️⃣ Firebase 認証との連携確認

### フロントエンド側の実装状況
✅ **実装済み機能:**
- `AuthContext.tsx` でデモユーザーでログイン状態にしている（開発用）
- JWT トークン: `demo-token-12345`
- API クライアント (`client.ts`) で自動的に `Authorization: Bearer <token>` を送信

### バックエンド側で確認する項目
- [ ] JWT トークン検証が実装されているか
- [ ] プロフィール詳細取得時に認証チェックがあるか

  ```
  GET /api/v1/profiles/:id
  Authorization: Bearer <JWT_TOKEN>
  ```

- [ ] 認証なしの場合のエラーレスポンス:
  ```json
  {
    "error": "Authentication required",
    "status": 401
  }
  ```

- [ ] Firebase Admin SDK または JWT ライブラリが導入されているか

### テスト方法
```bash
# 認証ありでテスト（成功するはず）
curl http://localhost:5001/api/v1/profiles/profile_001 \
  -H "Authorization: Bearer demo-token-12345"

# 認証なしでテスト（401エラーが返るはず）
curl http://localhost:5001/api/v1/profiles/profile_001

# 不正なトークンでテスト（401エラーが返るはず）
curl http://localhost:5001/api/v1/profiles/profile_001 \
  -H "Authorization: Bearer invalid-token"
```

---

## 📋 確認チェックリスト

### バックエンド開発者へのチェック項目

```
[ ] 1. API ベースURL設定
  [ ] バックエンド起動: localhost:5001
  [ ] APIルート: /api/v1
  [ ] CORS設定: フロントエンド (localhost:3001) からのリクエストを許可
  
[ ] 2. プロフィール画像サポート
  [ ] アップロードエンドポイント実装: POST /api/v1/profiles/:id/avatar
  [ ] クラウドストレージ設定完了
  [ ] CDN URL返却機能実装
  
[ ] 3. Firebase/JWT 認証
  [ ] トークン検証ロジック実装
  [ ] Authorization ヘッダー解析
  [ ] 認証エラー時の 401 レスポンス
  [ ] プロフィール取得時の認証チェック
```

---

## 🚀 実装確認用 curl コマンド

```bash
# 1. バックエンド疎通確認
curl -v http://localhost:5001/api/v1/auth/me \
  -H "Authorization: Bearer demo-token-12345"

# 2. プロフィール一覧取得
curl http://localhost:5001/api/v1/profiles \
  -H "Authorization: Bearer demo-token-12345"

# 3. プロフィール詳細取得
curl http://localhost:5001/api/v1/profiles/user_001 \
  -H "Authorization: Bearer demo-token-12345"

# 4. プロフィール更新（PATCH/PUT）
curl -X PUT http://localhost:5001/api/v1/profiles/user_001 \
  -H "Authorization: Bearer demo-token-12345" \
  -H "Content-Type: application/json" \
  -d '{"nickname":"test"}'

# 5. アバター画像アップロード
curl -X POST http://localhost:5001/api/v1/profiles/user_001/avatar \
  -H "Authorization: Bearer demo-token-12345" \
  -F "avatar=@./test-image.jpg"
```

---

## ✅ 完了状況

| 項目 | フロントエンド | バックエンド | 備考 |
|------|---|---|---|
| API ベースURL | ✅ 設定済み | ⏳ 確認待ち | localhost:5001/api/v1 |
| アバター画像 | ✅ アップロード機能実装 | ⏳ エンドポイント実装待ち | S3/GCS 設定必要 |
| JWT 認証 | ✅ ヘッダー送信実装 | ⏳ トークン検証待ち | demo トークン使用中 |

