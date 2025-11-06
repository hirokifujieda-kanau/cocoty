# 🚀 Vercelデプロイ手順

## 前提条件
- GitHubリポジトリ: `hirokifujieda-kanau/cocoty`
- Vercelアカウント（無料でOK）

## デプロイ手順

### 1. Vercelにログイン
1. [Vercel](https://vercel.com)にアクセス
2. 「Sign Up」または「Login」をクリック
3. GitHubアカウントでログイン

### 2. プロジェクトをインポート
1. ダッシュボードで「Add New...」→「Project」をクリック
2. 「Import Git Repository」セクションで、GitHubリポジトリを検索
3. `hirokifujieda-kanau/cocoty` を選択
4. 「Import」をクリック

### 3. プロジェクト設定
- **Framework Preset**: Next.js（自動検出される）
- **Root Directory**: `./`（デフォルト）
- **Build Command**: `npm run build`（自動設定される）
- **Output Directory**: `.next`（自動設定される）
- **Install Command**: `npm install`（自動設定される）

### 4. 環境変数（必要に応じて）
現在は環境変数は不要です（localStorageのみ使用）

### 5. デプロイ
1. 「Deploy」ボタンをクリック
2. 数分待つとデプロイ完了！🎉

## デプロイ後のURL
- 本番URL: `https://cocoty-xxx.vercel.app`（自動生成される）
- カスタムドメイン設定も可能

## 自動デプロイ
- `main`ブランチにpushすると自動的に再デプロイされます
- プレビュー環境: Pull Requestごとに自動生成

## ワンクリックデプロイ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hirokifujieda-kanau/cocoty)

---

## 🎯 機能一覧

### Phase 1-5: 基本機能（完成）
- ✅ プロフィールページ（5つのデザインパターン）
- ✅ ソーシャル機能（友達、メッセージ、通知）
- ✅ アクティビティカレンダー
- ✅ コメント・いいね機能

### Phase 6: 占い・診断機能（完成）
- ✅ デイリータロット占い × メンタルチェック
- ✅ 季節限定診断（MBTI、RPG）
- ✅ メンタル統計ダッシュボード
- ✅ ホームページ自動表示

---

## 📝 備考
- すべてのデータはlocalStorageに保存されます（クライアントサイド）
- バックエンドAPIは不要
- 静的サイトとして動作
