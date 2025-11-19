# バックエンドAPI一覧（全機能対応版）

feature-summary.md（フェーズ1-10）に対応する全APIエンドポイント

---

## 🔐 Phase 2: 認証システム（70h）

```
POST   /api/v1/auth/signup              ユーザー登録
POST   /api/v1/auth/login               ログイン
DELETE /api/v1/auth/logout              ログアウト
GET    /api/v1/auth/me                  現在のユーザー情報
POST   /api/v1/auth/password/reset      パスワードリセット（メール送信）
PUT    /api/v1/auth/password/reset      パスワードリセット（実行）
POST   /api/v1/auth/2fa/enable          2FA有効化
DELETE /api/v1/auth/2fa/disable         2FA無効化
POST   /api/v1/auth/2fa/verify          2FAコード検証
```

---

## 👤 Phase 3: プロフィール管理（120h）

```
GET    /api/v1/profiles/:id             プロフィール取得
PUT    /api/v1/profiles/:id             プロフィール更新
POST   /api/v1/profiles/:id/avatar      アバター画像アップロード
POST   /api/v1/profiles/:id/cover       カバー画像アップロード
PUT    /api/v1/profiles/:id/milestones  マイルストーン更新
GET    /api/v1/profiles                 プロフィール一覧（検索）
```

---

## ⚙️ Phase 4: 設定管理（48h）

```
GET    /api/v1/settings/privacy         プライバシー設定取得
PUT    /api/v1/settings/privacy         プライバシー設定更新
PUT    /api/v1/settings/password        パスワード変更
GET    /api/v1/settings/sessions        アクティブセッション一覧
DELETE /api/v1/settings/sessions/:id    セッション削除
DELETE /api/v1/settings/account         アカウント削除
```

---

## 🔮 Phase 5: タロット・診断（100h）

```
GET    /api/v1/tarot/daily              今日のタロット結果取得
POST   /api/v1/tarot/draw               タロットカードを引く
GET    /api/v1/tarot/history            タロット履歴

POST   /api/v1/mental_check             メンタルチェック実行
GET    /api/v1/mental_check/latest      最新のメンタルチェック取得
GET    /api/v1/mental_check/history     メンタルチェック履歴

POST   /api/v1/diagnosis/seasonal       四季診断実行
GET    /api/v1/diagnosis/seasonal       四季診断結果取得

POST   /api/v1/diagnosis/team           チーム適性診断実行
GET    /api/v1/diagnosis/team           チーム適性診断結果取得
```

---

## 🏷️ Phase 6: タグ・共通者機能（70h）

```
GET    /api/v1/tags                     全タグ一覧
GET    /api/v1/tags/popular             人気タグTOP20
GET    /api/v1/tags/:tag/users          タグを持つユーザー一覧
POST   /api/v1/profiles/:id/tags        タグ追加
DELETE /api/v1/profiles/:id/tags/:tag   タグ削除

GET    /api/v1/users/search             ユーザー検索（タグフィルター対応）
GET    /api/v1/users/:id/common_tags    共通タグを持つユーザー
GET    /api/v1/users/:id/recommendations タグベースのおすすめユーザー
```

---

## 🎨 Phase 7: プロジェクト（曼荼羅アート）（30h）

```
GET    /api/v1/projects                 プロジェクト一覧
POST   /api/v1/projects                 プロジェクト作成
GET    /api/v1/projects/:id             プロジェクト詳細
PUT    /api/v1/projects/:id             プロジェクト更新
DELETE /api/v1/projects/:id             プロジェクト削除

POST   /api/v1/projects/:id/image       曼荼羅アート画像アップロード
GET    /api/v1/projects/:id/members     プロジェクトメンバー一覧
POST   /api/v1/projects/:id/members     メンバー追加
DELETE /api/v1/projects/:id/members/:user_id メンバー削除
```

---

## 👥 フォロー・友達機能（追加）

```
POST   /api/v1/users/:id/follow         フォロー
DELETE /api/v1/users/:id/unfollow       フォロー解除
GET    /api/v1/users/:id/follow_status  フォロー状態確認
GET    /api/v1/users/:id/followers      フォロワー一覧
GET    /api/v1/users/:id/following      フォロー中のユーザー一覧
GET    /api/v1/users/:id/common_friends 共通の友達
```

---

## 💬 メッセージ機能（追加）

```
POST   /api/v1/messages                 メッセージ送信
GET    /api/v1/messages/threads/:user_id メッセージスレッド取得
GET    /api/v1/messages/threads         メッセージスレッド一覧
GET    /api/v1/messages/unread_count    未読メッセージ数
PUT    /api/v1/messages/:id/read        メッセージを既読にする
```

---

## 📊 データベーステーブル

### 認証・ユーザー
- `users` - ユーザーアカウント
- `profiles` - プロフィール詳細
- `privacy_settings` - プライバシー設定
- `sessions` - セッション管理

### 診断・占い
- `tarot_results` - タロット結果
- `mental_checks` - メンタルチェック結果
- `seasonal_diagnoses` - 四季診断結果
- `team_diagnoses` - チーム適性診断結果

### タグ・検索
- `tags` - タグマスタ
- `profile_tags` - プロフィール×タグ（中間テーブル）

### プロジェクト
- `projects` - プロジェクト
- `project_members` - プロジェクトメンバー（中間テーブル）

### ソーシャル
- `follows` - フォロー関係
- `messages` - メッセージ

---

## 🚀 実装順序

1. ✅ Phase 1: Rails環境構築
2. ✅ Phase 2: 認証システム
3. ✅ Phase 3: プロフィール管理
4. ✅ Phase 4: 設定管理
5. ⏳ Phase 5: タロット・診断
6. ⏳ Phase 6: タグ・共通者機能
7. ⏳ Phase 7: プロジェクト機能
8. ⏳ フォロー・メッセージ機能
9. ⏳ Phase 8: 統合・最適化
10. ⏳ Phase 9-10: デプロイ・リリース

---

**総API数**: 約50エンドポイント  
**総工数**: 484時間（約63営業日）
