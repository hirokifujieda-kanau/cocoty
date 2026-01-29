# Cocoty（ココティ）

社内コミュニティ（部活）の活動を記録・促進し、コミュニティマネージャーが活動を支援・昇華させるためのWebアプリケーションです。

## 🌟 主要機能

### 部員向け機能
- **📊 ココティ・ダッシュボード**: 各部活の新着投稿や次のイベント予定を確認
- **📸 活動ギャラリー（タイムライン）**: 写真や動画、テキストで活動報告を投稿・共有
- **🏆 成果物ポートフォリオ**: ベストショット、完成作品、制作動画を展示・アピール

### マネージャー向け機能
- **📅 イベント企画・出欠管理ツール**: 日程調整、出欠確認、タスク管理を一元化
- **📋 イベント企画アンケート機能**: メンバーの意見を収集して共創的なイベント企画
- **📢 イベント告知ページ作成機能**: 魅力的なイベントページを簡単に作成・公開

## 🚀 技術スタック

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **開発環境**: Node.js, ESLint

## 🛠️ セットアップ

1. 依存関係をインストール:
```bash
npm install
```

2. 環境変数を設定:
```bash
cp .env.local.example .env.local
# .env.local を編集して、Firebase・Cloudinary・API URLなどを設定
```

3. 開発サーバーを起動:
```bash
npm run dev
```

4. ブラウザで http://localhost:3000 を開いてアプリケーションを確認

## 🚢 Vercelデプロイ

### 環境変数設定

Vercelダッシュボード > Settings > Environment Variables で以下を設定：

#### Firebase設定（必須）
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### Cloudinary設定（必須）
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

#### バックエンドAPI URL（必須）
```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com/api/v1
```

#### Basic認証設定（Staging/Production）
```
BASIC_AUTH_ENABLED=true
BASIC_AUTH_USER=your_username
BASIC_AUTH_PASSWORD=your_secure_password
```

**注意**: 
- **Development環境**: `BASIC_AUTH_ENABLED=false` に設定
- **Preview/Staging環境**: `BASIC_AUTH_ENABLED=true` に設定
- **Production環境**: `BASIC_AUTH_ENABLED=true` に設定（必要に応じて）

### デプロイコマンド

```bash
# 変更をコミット
git add .
git commit -m "feat: セキュリティ脆弱性修正 + Basic認証実装"

# リモートリポジトリにプッシュ（Vercelの自動デプロイがトリガーされます）
git push origin main
```

### セキュリティチェック済み

✅ Next.js 15.5.11 - CVE脆弱性修正済み  
✅ Firebase設定 - 環境変数化済み  
✅ Basic認証 - Staging/Production対応済み

## 📁 プロジェクト構造

```
src/
├── app/                      # Next.js App Router
├── components/
│   ├── dashboard/           # ダッシュボード関連
│   ├── timeline/            # タイムライン機能
│   ├── portfolio/           # ポートフォリオ機能
│   ├── events/              # イベント関連機能
│   └── CommunityPlatform.tsx # メインアプリケーション
```

## 🎯 今後の開発予定

- バックエンドAPI連携
- ユーザー認証機能
- リアルタイム通知
- モバイルアプリ対応
- AI機能（イベント提案など）

## 📝 ライセンス

このプロジェクトは内部使用目的で開発されています。
