# 🚀 バックエンドエンドポイント一覧（簡潔版）

## 🔐 認証系 API
```
POST   /api/v1/auth/signup              ユーザー登録
POST   /api/v1/auth/login               ログイン
DELETE /api/v1/auth/logout              ログアウト
GET    /api/v1/auth/me                  現在のユーザー情報
POST   /api/v1/auth/password/reset      パスワードリセット
```

## 👤 ユーザー・プロフィール系
```
GET    /api/v1/profiles                 プロフィール一覧
GET    /api/v1/profiles/:id             プロフィール詳細
PUT    /api/v1/profiles/:id             プロフィール更新
POST   /api/v1/profiles/:id/avatar      アバター画像アップロード
```

## 🔮 タロット・占い系
```
GET    /api/v1/tarot/daily              今日のタロット結果取得
POST   /api/v1/tarot/draw               タロットカードを引く
GET    /api/v1/tarot/history            タロット履歴

POST   /api/v1/mental_check             メンタルチェック実行
GET    /api/v1/mental_check/latest      最新のメンタルチェック取得
GET    /api/v1/mental_check/history     メンタルチェック履歴

POST   /api/v1/diagnosis/seasonal       四季診断実行
GET    /api/v1/diagnosis/seasonal       四季診断結果取得
```

## 📝 投稿・SNS系
```
POST   /api/v1/posts                    投稿作成
GET    /api/v1/posts                    投稿一覧（フィード）
GET    /api/v1/posts/:id                投稿詳細
PUT    /api/v1/posts/:id                投稿編集
DELETE /api/v1/posts/:id                投稿削除
POST   /api/v1/posts/:id/like           いいね
DELETE /api/v1/posts/:id/like           いいね解除
```

## 📸 アルバム系
```
GET    /api/v1/albums                   アルバム一覧取得
POST   /api/v1/albums                   アルバム作成
POST   /api/v1/photos                   写真アップロード
GET    /api/v1/activities               アクティビティカレンダー取得
GET    /api/v1/activities/streak        ストリーク情報取得
```

## 💬 メッセージ系
```
POST   /api/v1/messages                 メッセージ送信
GET    /api/v1/messages/threads/:user_id メッセージスレッド取得
GET    /api/v1/messages/threads         メッセージスレッド一覧
GET    /api/v1/messages/unread_count    未読メッセージ数
PUT    /api/v1/messages/:id/read        メッセージを既読にする
```

## 🎨 プロジェクト・曼荼羅系
```
GET    /api/v1/projects                 プロジェクト一覧
POST   /api/v1/projects                 プロジェクト作成
GET    /api/v1/projects/:id             プロジェクト詳細
PUT    /api/v1/projects/:id             プロジェクト更新
DELETE /api/v1/projects/:id             プロジェクト削除
POST   /api/v1/projects/:id/image       曼荼羅アート画像アップロード
```

---

## 🔑 認証方式
- **JWT トークン**をヘッダーで送信
- Header: `Authorization: Bearer <JWT_TOKEN>`

## 📌 ベースURL
- 開発環境: `http://localhost:4000/api/v1`
- 本番環境: `.env.NEXT_PUBLIC_API_BASE_URL` で設定

---

**詳細は以下のドキュメントを参照:**
- `/docs/required-api-endpoints.md` - 完全なAPI仕様書
- `/docs/backend-api-list.md` - 全機能対応版API一覧
