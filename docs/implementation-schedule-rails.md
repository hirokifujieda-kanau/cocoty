# 実装スケジュール（Rails + Next.js）

## 📋 前提条件

- **開発体制**: フルタイム1人（8h/日、営業日ベース）
- **バックエンド**: Ruby on Rails
- **フロントエンド**: Next.js 14 + TypeScript + Tailwind CSS（既に完成）
- **デプロイ**: Heroku / AWS
- **総工数**: 574時間

---

## 📅 実装スケジュール（全工程）

### フェーズ1: 環境構築・基礎設定（30h, 4営業日）

| 項目 | 内容 | 工数 | 期間 |
|------|------|------|------|
| Rails プロジェクト作成 | `rails new cocoty --api --database=postgresql --skip-javascript` | 2h | Day 1 |
| Gemfile 設定 | devise, devise_jwt, rails-cors, pg, puma, rack-cors など | 3h | Day 1 |
| データベース設定 | PostgreSQL ローカル環境構築、接続確認 | 3h | Day 1 |
| API 設定 | CORS, JSON レスポンスフォーマット設定 | 2h | Day 2 |
| ルーティング設計 | API エンドポイント一覧作成 | 4h | Day 2 |
| テスト環境構築 | RSpec, factory_bot 設定 | 4h | Day 2 |
| Docker 設定 | Dockerfile, docker-compose.yml 作成 | 4h | Day 3 |
| GitHub Actions 設定 | CI/CD パイプライン構築 | 2h | Day 3 |
| **小計** | | **30h** | **4営業日** |

---

### フェーズ2: 認証システム（100h, 13営業日）

#### 2-1. ユーザー登録・ログイン（50h, 6営業日）

| 項目 | 内容 | 工数 | 期間 |
|------|------|------|------|
| User モデル作成 | devise 統合、バリデーション | 4h | Day 4 |
| JWT トークン実装 | devise_jwt, JTI トークン管理 | 6h | Day 4-5 |
| SignUp API | POST /api/v1/auth/signup | 6h | Day 5 |
| SignIn API | POST /api/v1/auth/signin | 4h | Day 6 |
| SignOut API | POST /api/v1/auth/signout | 2h | Day 6 |
| パスワード変更 | PUT /api/v1/auth/password | 6h | Day 7 |
| パスワードリセット | POST /api/v1/auth/password_reset | 8h | Day 8 |
| メール送信設定 | ActionMailer, SendGrid 連携 | 4h | Day 8 |
| **小計** | | **50h** | **6営業日** |

#### 2-2. OAuth 連携（30h, 4営業日）

| 項目 | 内容 | 工数 | 期間 |
|------|------|------|------|
| OmniAuth 設定 | Gemfile に追加、設定ファイル作成 | 3h | Day 9 |
| Google OAuth | omniauth-google-oauth2, コールバック処理 | 8h | Day 9-10 |
| Facebook OAuth | omniauth-facebook, コールバック処理 | 8h | Day 10 |
| Twitter OAuth | omniauth-twitter-oauth2, コールバック処理 | 8h | Day 11 |
| OAuthAccount モデル | ユーザーと OAuth の関連付け | 3h | Day 12 |
| **小計** | | **30h** | **4営業日** |

#### 2-3. セッション・2FA（20h, 2.5営業日）

| 項目 | 内容 | 工数 | 期間 |
|------|------|------|------|
| セッション管理 | Redis, Session モデル | 5h | Day 12 |
| 2要素認証（TOTP） | devise-two-factor, QRコード生成 | 10h | Day 13 |
| デバイス管理 | 複数デバイスのセッション管理 | 5h | Day 13 |
| **小計** | | **20h** | **2.5営業日** |

**フェーズ2 合計**: **100h / 13営業日**

---

### フェーズ3: プロフィール管理（120h, 15営業日）

#### 3-1. ユーザープロフィール基本（40h, 5営業日）

| 項目 | 内容 | 工数 | 期間 |
|------|------|------|------|
| Profile モデル作成 | name, email, bio, phone, website, location | 3h | Day 14 |
| Users マイグレーション拡張 | birthday, age, birthplace, mbti_type, blood_type | 4h | Day 14 |
| プロフィール取得API | GET /api/v1/users/:id | 3h | Day 15 |
| プロフィール更新API | PUT /api/v1/users/:id | 6h | Day 15 |
| プロフィール一覧API | GET /api/v1/users（ページネーション） | 4h | Day 16 |
| バリデーション | 各フィールドの入力値検証 | 4h | Day 16 |
| バリデーションテスト | RSpec でのテスト | 6h | Day 17 |
| API テスト | request_spec で API テスト | 10h | Day 17 |
| **小計** | | **40h** | **5営業日** |

#### 3-2. 拡張フィールド・タグ（40h, 5営業日）

| 項目 | 内容 | 工数 | 期間 |
|------|------|------|------|
| Hobby モデル作成 | タグとの many-to-many 関連 | 4h | Day 18 |
| FavoriteFood モデル作成 | タグとの many-to-many 関連 | 4h | Day 18 |
| Tag モデル作成 | グローバルタグ管理 | 3h | Day 19 |
| UserHobbies マイグレーション | user_id, tag_id 外部キー | 2h | Day 19 |
| UserFavoriteFoods マイグレーション | user_id, tag_id 外部キー | 2h | Day 19 |
| Hobbies API | GET, POST, DELETE /api/v1/users/:id/hobbies | 6h | Day 20 |
| FavoriteFoods API | GET, POST, DELETE /api/v1/users/:id/favorite_foods | 6h | Day 20 |
| Tag 管理API | GET, POST /api/v1/tags | 5h | Day 21 |
| 自動タグ作成 | 新しいタグが自動追加される | 2h | Day 21 |
| **小計** | | **40h** | **5営業日** |

#### 3-3. 画像アップロード（40h, 5営業日）

| 項目 | 内容 | 工数 | 期間 |
|------|------|------|------|
| AWS S3 設定 | IAM ユーザー、バケット作成 | 4h | Day 22 |
| ActiveStorage 設定 | S3 連携設定 | 3h | Day 22 |
| Avatar アップロード | POST /api/v1/users/:id/avatar | 6h | Day 23 |
| CoverImage アップロード | POST /api/v1/users/:id/cover_image | 6h | Day 23 |
| 画像バリデーション | ファイルサイズ、MIME タイプ | 4h | Day 24 |
| 画像リサイズ | ImageMagick / ruby-vips で自動リサイズ | 6h | Day 24 |
| 画像削除API | DELETE /api/v1/users/:id/avatar | 4h | Day 25 |
| CDN 設定 | CloudFront キャッシング設定 | 4h | Day 25 |
| 画像アップロードテスト | 統合テスト | 3h | Day 26 |
| **小計** | | **40h** | **5営業日** |

**フェーズ3 合計**: **120h / 15営業日**

---

### フェーズ4: 設定管理（60h, 8営業日）

| 項目 | 内容 | 工数 | 期間 |
|------|------|------|------|
| UserSettings モデル | JSON カラムで設定保存 | 3h | Day 27 |
| マイグレーション | privacy, notifications, security カラム | 2h | Day 27 |
| プライバシー設定API | PUT /api/v1/settings/privacy | 6h | Day 28 |
| 通知設定API | PUT /api/v1/settings/notifications | 6h | Day 28 |
| セキュリティ設定API | PUT /api/v1/settings/security | 6h | Day 29 |
| 設定取得API | GET /api/v1/settings | 3h | Day 29 |
| デフォルト設定 | ユーザー作成時にデフォルト設定を生成 | 3h | Day 30 |
| 設定バリデーション | 入力値の検証 | 4h | Day 30 |
| 設定テスト | RSpec でのテスト | 8h | Day 31 |
| 設定ドキュメント | API 仕様書作成 | 4h | Day 31 |
| **小計** | | **60h** | **8営業日** |

**フェーズ4 合計**: **60h / 8営業日**

---

### フェーズ5: タロット・診断機能（100h, 13営業日）

#### 5-1. 診断ロジック・結果保存（60h, 8営業日）

| 項目 | 内容 | 工数 | 期間 |
|------|------|------|------|
| Diagnosis モデル | 診断種別、質問、回答 | 3h | Day 32 |
| Question モデル | 診断に紐付く質問 | 3h | Day 32 |
| DiagnosisResult モデル | ユーザーの診断結果保存 | 3h | Day 33 |
| マイグレーション | 各テーブル作成 | 5h | Day 33 |
| 診断ロジック実装 | スコア計算、結果判定アルゴリズム | 16h | Day 34-35 |
| 診断実行API | POST /api/v1/diagnoses/:id/execute | 8h | Day 36 |
| 診断結果取得API | GET /api/v1/users/:id/diagnosis_results | 5h | Day 36 |
| 診断履歴API | GET /api/v1/users/:id/diagnosis_results/:id | 4h | Day 37 |
| 診断結果共有API | POST /api/v1/diagnosis_results/:id/share | 6h | Day 37 |
| 診断テスト | RSpec でのテスト | 8h | Day 38 |
| **小計** | | **60h** | **8営業日** |

#### 5-2. チーム診断（40h, 5営業日）

| 項目 | 内容 | 工数 | 期間 |
|------|------|------|------|
| TeamDiagnosis モデル | チーム診断の定義 | 2h | Day 39 |
| チーム適性計算 | メンバー間の相性スコア計算 | 12h | Day 39-40 |
| チーム診断実行API | POST /api/v1/teams/:id/diagnose | 8h | Day 40 |
| チーム診断結果API | GET /api/v1/teams/:id/diagnosis_result | 6h | Day 41 |
| 相性スコアランキング | メンバー間の相性ランキング | 6h | Day 41 |
| チーム診断テスト | RSpec でのテスト | 6h | Day 42 |
| **小計** | | **40h** | **5営業日** |

**フェーズ5 合計**: **100h / 13営業日**

---

### フェーズ6: タグ・共通者機能（70h, 9営業日）

#### 7-1. タグ検索（40h, 5営業日）

| 項目 | 内容 | 工数 | 期間 |
|------|------|------|------|
| Tag モデル最適化 | インデックス追加、検索最適化 | 4h | Day 56 |
| タグ検索API | GET /api/v1/tags/search?q=写真 | 6h | Day 56 |
| 部分一致検索 | LIKE, フルテキスト検索 | 4h | Day 57 |
| タグ統計API | GET /api/v1/tags/:id/stats（使用者数など） | 4h | Day 57 |
| 人気タグランキングAPI | GET /api/v1/tags/trending | 4h | Day 58 |
| タグオートコンプリート | GET /api/v1/tags/autocomplete?q=写 | 4h | Day 58 |
| 検索パフォーマンス最適化 | インデックス調整、キャッシング | 4h | Day 59 |
| 検索テスト | パフォーマンステスト含む | 6h | Day 59-60 |
| **小計** | | **40h** | **5営業日** |

#### 7-2. 共通者一覧（30h, 4営業日）

| 項目 | 内容 | 工数 | 期間 |
|------|------|------|------|
| 共通者検索API | GET /api/v1/users?tag=写真（同じタグを持つユーザー） | 6h | Day 60 |
| 複数タグ検索 | tag=写真&tag=旅行（複数タグの交差） | 4h | Day 61 |
| ページネーション | limit, offset, cursor ページング | 4h | Day 61 |
| ユーザープロフィール取得 | 共通者の詳細情報を返す | 4h | Day 62 |
| 共通者数カウント | 各タグごとの共通者数 | 3h | Day 62 |
| フォローAPI連携 | 共通者をフォローできる機能 | 4h | Day 63 |
| 共通者テスト | RSpec でのテスト | 5h | Day 63 |
| **小計** | | **30h** | **4営業日** |

**フェーズ6 合計**: **70h / 9営業日**

---

### フェーズ7: チームプロジェクト機能（50h, 6営業日）

| 項目 | 内容 | 工数 | 期間 |
|------|------|------|------|
| Project モデル | name, description, team_id, created_at | 2h | Day 64 |
| ProjectImage モデル | image_url, display_order | 2h | Day 64 |
| マイグレーション | Projects, ProjectImages テーブル | 3h | Day 65 |
| プロジェクト作成API | POST /api/v1/teams/:id/projects | 4h | Day 65 |
| プロジェクト一覧API | GET /api/v1/teams/:id/projects | 3h | Day 66 |
| プロジェクト詳細API | GET /api/v1/projects/:id | 3h | Day 66 |
| 画像登録API | POST /api/v1/projects/:id/images | 6h | Day 67 |
| 画像表示API | GET /api/v1/projects/:id/images | 3h | Day 67 |
| 画像削除API | DELETE /api/v1/projects/:id/images/:id | 3h | Day 68 |
| 画像順序変更API | PATCH /api/v1/projects/:id/images/reorder | 4h | Day 68 |
| プロジェクトテスト | RSpec でのテスト | 6h | Day 69 |
| ドキュメント作成 | API 仕様書 | 3h | Day 69 |
| **小計** | | **50h** | **6営業日** |

**フェーズ7 合計**: **50h / 6営業日**

---

### フェーズ8: 統合・パフォーマンス最適化（60h, 8営業日）

| 項目 | 内容 | 工数 | 期間 |
|------|------|------|------|
| エンドポイント統合テスト | 全 API の統合テスト | 12h | Day 70-71 |
| N+1 クエリ最適化 | includes, eager_load, preload | 8h | Day 71 |
| キャッシング戦略 | Redis, HTTP キャッシング | 8h | Day 72 |
| レート制限実装 | Rack::Attack でのレート制限 | 4h | Day 72 |
| エラーハンドリング | 統一的なエラーレスポンス | 4h | Day 73 |
| ログ設定 | 本番環境でのログ管理 | 3h | Day 73 |
| API レスポンス最適化 | 不要なフィールド削除、ページネーション | 6h | Day 74 |
| ドキュメント作成 | Swagger/OpenAPI スペック | 8h | Day 74 |
| 負荷テスト | wrk, Apache Bench でのテスト | 4h | Day 75 |
| **小計** | | **60h** | **8営業日** |

**フェーズ8 合計**: **60h / 8営業日**

---

### フェーズ9: デプロイ・本番環境構築（60h, 8営業日）

| 項目 | 内容 | 工数 | 期間 |
|------|------|------|------|
| Heroku デプロイ設定 | Procfile, buildpack 設定 | 3h | Day 76 |
| AWS セットアップ | EC2, RDS, S3, CloudFront | 12h | Day 76-77 |
| 環境変数管理 | .env.local, .env.production | 2h | Day 78 |
| データベースマイグレーション | 本番 DB マイグレーション | 4h | Day 78 |
| SSL/TLS 設定 | HTTPS 設定、証明書 | 3h | Day 78 |
| CDN 設定 | CloudFront キャッシング、CORS | 4h | Day 79 |
| Redis セットアップ | ElastiCache 設定 | 3h | Day 79 |
| メール設定 | SendGrid API キー、テンプレート | 2h | Day 80 |
| ドメイン設定 | DNS, Route 53 | 2h | Day 80 |
| バックアップ戦略 | RDS スナップショット、災害復旧 | 4h | Day 81 |
| 監視・ログ | DataDog, CloudWatch | 6h | Day 81-82 |
| パフォーマンステスト | 本番環境でのテスト | 6h | Day 82 |
| セキュリティチェック | SSL Labs, OWASP チェック | 4h | Day 83 |
| **小計** | | **60h** | **8営業日** |

**フェーズ9 合計**: **60h / 8営業日**

---

### フェーズ10: ドキュメント・テスト・リリース準備（44h, 6営業日）

| 項目 | 内容 | 工数 | 期間 |
|------|------|------|------|
| API ドキュメント完成 | Swagger UI デプロイ | 4h | Day 90 |
| セットアップガイド作成 | 開発環境構築手順 | 4h | Day 90 |
| デプロイメントガイド | 本番環境へのデプロイ手順 | 4h | Day 91 |
| トラブルシューティングガイド | よくあるエラーと対処法 | 4h | Day 91 |
| 最終テスト | 全機能の E2E テスト | 16h | Day 92-93 |
| バグ修正 | テストで発見したバグ修正 | 8h | Day 94 |
| **小計** | | **44h** | **6営業日** |

**フェーズ10 合計**: **44h / 6営業日**

---

## 📊 全体スケジュール

| フェーズ | 内容 | 工数 | 営業日 | 期間 |
|----------|------|------|--------|------|
| **フェーズ1** | 環境構築・基礎設定 | 30h | 4日 | Week 1 |
| **フェーズ2** | 認証システム | 100h | 13日 | Week 2-3 |
| **フェーズ3** | プロフィール管理 | 120h | 15日 | Week 4-6 |
| **フェーズ4** | 設定管理 | 60h | 8日 | Week 7 |
| **フェーズ5** | タロット・診断 | 100h | 13日 | Week 8-9 |
| **フェーズ6** | タグ・共通者機能 | 70h | 9日 | Week 10 |
| **フェーズ7** | プロジェクト機能 | 50h | 6日 | Week 10-11 |
| **フェーズ8** | 統合・最適化 | 60h | 8日 | Week 11-12 |
| **フェーズ9** | デプロイ・本番環境 | 60h | 8日 | Week 12-13 |
| **フェーズ10** | ドキュメント・リリース | 44h | 6日 | Week 13-14 |
| **合計** | | **694h** | **90営業日** | **約4.5ヶ月** |

---

## 📊 全体スケジュール

| フェーズ | 内容 | 工数 | 営業日 | 期間 |
|----------|------|------|--------|------|
| **フェーズ1** | 環境構築・基礎設定 | 30h | 4日 | Week 1 |
| **フェーズ2** | 認証システム | 100h | 13日 | Week 2-3 |
| **フェーズ3** | プロフィール管理 | 120h | 15日 | Week 4-6 |
| **フェーズ4** | 設定管理 | 60h | 8日 | Week 7 |
| **フェーズ5** | タロット・診断 | 100h | 13日 | Week 8-9 |
| **フェーズ6** | タスク管理 | 110h | 14日 | Week 10-11 |
| **フェーズ7** | タグ・共通者機能 | 70h | 9日 | Week 12 |
| **フェーズ8** | プロジェクト機能 | 50h | 6日 | Week 12-13 |
| **フェーズ9** | 統合・最適化 | 60h | 8日 | Week 13-14 |
| **フェーズ10** | デプロイ・本番環境 | 60h | 8日 | Week 14-15 |
| **フェーズ11** | セキュリティ・最適化 | 50h | 6日 | Week 15-16 |
| **フェーズ12** | ドキュメント・リリース | 44h | 6日 | Week 16-17 |
| **合計** | | **754h** | **100営業日** | **約5ヶ月** |

---

## 📝 Notes

### ⏰ 実装期間
- **約4.5ヶ月**（フルタイム1人、営業日ベース）
- 内訳: 90営業日 × 8h/日
- 削除項目: タスク管理（110h）、セキュリティ・最適化フェーズ（50h）

### 🛠 技術スタック
- **バックエンド**: Ruby on Rails 7.0+
- **データベース**: PostgreSQL 14+
- **キャッシング**: Redis
- **ファイルストレージ**: AWS S3
- **メール**: SendGrid
- **デプロイ**: Heroku または AWS (EC2 + RDS)
- **モニタリング**: DataDog / CloudWatch
- **テスト**: RSpec, Factory Bot, Faker

### 📚 重要な詳細

#### Rails Gem 一覧
```ruby
# 認証
gem 'devise'
gem 'devise_jwt'
gem 'omniauth'
gem 'omniauth-google-oauth2'
gem 'omniauth-facebook'
gem 'omniauth-twitter'

# パスワード管理
gem 'bcrypt'
gem 'devise-two-factor'

# キャッシング
gem 'redis'
gem 'hiredis'

# ファイル管理
gem 'aws-sdk-s3'
gem 'image_processing'

# API
gem 'active_model_serializers'
gem 'rack-cors'

# テスト
gem 'rspec-rails'
gem 'factory_bot_rails'
gem 'faker'

# セキュリティ
gem 'brakeman'
gem 'bundler-audit'

# 監視
gem 'datadog'
```

#### API 仕様の特徴
- RESTful API 設計
- JWT ベース認証
- JSON レスポンスフォーマット統一
- ページネーション対応
- エラーレスポンス統一

#### パフォーマンス対策
- N+1 クエリ最適化
- Redis キャッシング（セッション、タグ検索結果）
- HTTP キャッシング（ETag, Cache-Control）
- CDN（CloudFront）での画像配信
- インデックス設定（タグ検索、ユーザー検索）

#### テスト戦略
- ユニットテスト（モデル、バリデーション）
- 統合テスト（API エンドポイント）
- E2E テスト（重要なワークフロー）
- パフォーマンステスト（負荷テスト）
- セキュリティテスト（脆弱性スキャン）

### 🎯 リスク要因と対策

| リスク | 影響度 | 対策 |
|--------|--------|------|
| OAuth 連携の複雑性 | 中 | フェーズ2 初期に検証、テスト充実 |
| データベース設計のやり直し | 高 | 詳細な ER 図設計、早期レビュー |
| パフォーマンス劣化 | 高 | 定期的な負荷テスト、キャッシング戦略 |
| セキュリティ脆弱性 | 高 | Brakeman, Bundler Audit の継続実行 |
| 画像アップロードの問題 | 中 | S3 設定の早期検証、ウイルススキャン |
| タグ検索の遅延 | 中 | インデックス最適化、レディス キャッシング |

### 🚀 今後のフェーズ

#### 後続機能（別フェーズ）
- ユーザー間のメッセージング
- フォロー・フォロワー機能
- いいね・コメント機能
- ユーザー通知システムの強化
- アナリティクス・ダッシュボード
- 管理画面

#### アップグレード項目
- 画像アップロード機能（チームプロジェクト用）
- GraphQL への移行
- マイクロサービス化
- モバイルアプリ開発

---

## ✅ 最終チェックリスト

### リリース前
- [ ] 全ユニットテスト合格
- [ ] 全統合テスト合格
- [ ] 負荷テスト完了（1000 req/s）
- [ ] セキュリティテスト完了
- [ ] ドキュメント完成
- [ ] ステージング環境での最終確認
- [ ] バックアップ戦略確認
- [ ] 災害復旧計画確認

### リリース当日
- [ ] 本番データベースバックアップ
- [ ] ロールバック計画確認
- [ ] モニタリング設定確認
- [ ] 関係者への通知
- [ ] リリース後のモニタリング

---

## 📞 コンタクト・サポート

何か質問や懸念がある場合は、以下をご確認ください:
- API ドキュメント: `/docs/api.md`
- セットアップガイド: `/docs/setup.md`
- トラブルシューティング: `/docs/troubleshooting.md`
