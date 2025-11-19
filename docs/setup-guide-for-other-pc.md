# 他のPCでの環境構築手順

## 📋 必要な情報

### 👤 ユーザー情報
- **GitHubアカウント**: `hirokifujieda-kanau`
- **Git設定用メールアドレス**: `hiroki.fujieda@kanau-lab.co.jp`
- **macOSユーザー名**: `fujiedahiroki`

### 🔑 認証情報（必要に応じて準備）
- GitHubのPersonal Access Token（HTTPSでpush/pullする場合）
- または SSH鍵の設定

---

## 🚀 他のPCでのセットアップ手順

### 1. Git設定

```bash
# Gitユーザー情報を設定
git config --global user.name "hirokifujieda-kanau"
git config --global user.email "hiroki.fujieda@kanau-lab.co.jp"

# 確認
git config --global user.name
git config --global user.email
```

---

### 2. フロントエンド（Next.js）のクローン

#### リポジトリ情報
- **リポジトリURL**: `https://github.com/hirokifujieda-kanau/cocoty.git`
- **ブランチ**: `main`

#### セットアップ手順
```bash
# 1. リポジトリをクローン
cd ~/Projects  # または任意のディレクトリ
git clone https://github.com/hirokifujieda-kanau/cocoty.git community-platform
cd community-platform

# 2. Node.jsのバージョン確認（推奨: v18以上）
node -v

# 3. 依存パッケージをインストール
npm install

# 4. 開発サーバー起動
npm run dev

# → http://localhost:3000 でアクセス
```

#### 主要ファイル
- `src/app/page.tsx` - ホームページ（プロフィールへリダイレクト）
- `src/app/profile/page.tsx` - プロフィールページ
- `src/app/rpg/page.tsx` - ピクセルアートRPGページ
- `src/contexts/AuthContext.tsx` - 認証コンテキスト
- `src/lib/mock/mockAuth.ts` - モックユーザーデータ（20人）
- `docs/` - 全てのドキュメント

---

### 3. バックエンド（Rails API）のクローン

#### リポジトリ情報
- **リポジトリURL**: まだ作成されていません
- **推奨リポジトリ名**: `cocoty-api`

#### ⚠️ 現在の状態
Rails APIはまだGitHubにプッシュされていません。

#### セットアップ手順（リポジトリ作成後）

**このPCでリポジトリ作成 & プッシュ:**
```bash
# 1. GitHubでリポジトリ作成
# ブラウザで https://github.com/new にアクセス
# リポジトリ名: cocoty-api
# 公開設定: Private推奨

# 2. ローカルのRailsプロジェクトをプッシュ
cd /Users/fujiedahiroki/Projects/cocoty-api
git remote add origin https://github.com/hirokifujieda-kanau/cocoty-api.git
git branch -M main
git add .
git commit -m "Initial commit: Rails 8 API with User and Profile models"
git push -u origin main
```

**他のPCでクローン:**
```bash
# 1. リポジトリをクローン
cd ~/Projects
git clone https://github.com/hirokifujieda-kanau/cocoty-api.git
cd cocoty-api

# 2. Rubyのバージョン確認（必要: 3.2以上）
ruby -v

# 3. Ruby 3.2以上がない場合（Homebrew使用）
brew install ruby
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
echo 'export PATH="/opt/homebrew/lib/ruby/gems/3.4.0/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 4. Bundlerでgemをインストール
gem install bundler
bundle install

# 5. PostgreSQLのインストール（必要な場合）
brew install postgresql@15
brew services start postgresql@15

# 6. データベース作成
rails db:create
rails db:migrate

# 7. 開発サーバー起動
rails server -p 4000

# → http://localhost:4000 でアクセス
```

---

## 📁 プロジェクト構成

```
~/Projects/
├── community-platform/       # Next.js フロントエンド
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # Reactコンポーネント
│   │   ├── contexts/        # AuthContext等
│   │   └── lib/             # モックデータ・ユーティリティ
│   ├── docs/                # 設計ドキュメント
│   ├── package.json
│   └── .git/
│
└── cocoty-api/              # Rails API バックエンド
    ├── app/
    │   ├── controllers/
    │   ├── models/
    │   └── ...
    ├── config/
    ├── db/
    ├── Gemfile
    └── .git/
```

---

## 🔐 認証方法の選択

### 方法1: HTTPS（Personal Access Token）

#### トークン作成手順:
1. GitHubにログイン
2. Settings → Developer settings → Personal access tokens → Tokens (classic)
3. "Generate new token (classic)"
4. スコープ選択:
   - ✅ `repo` (全てのリポジトリアクセス)
   - ✅ `workflow` (GitHub Actions)
5. トークンをコピー（後で見れないので保存）

#### 使用方法:
```bash
# クローン時
git clone https://github.com/hirokifujieda-kanau/cocoty.git

# プッシュ時（初回のみパスワード入力）
# Username: hirokifujieda-kanau
# Password: <Personal Access Token>

# macOSのKeychainに保存される（2回目以降は不要）
```

---

### 方法2: SSH鍵

#### SSH鍵作成:
```bash
# 1. SSH鍵生成
ssh-keygen -t ed25519 -C "hiroki.fujieda@kanau-lab.co.jp"
# Enter押下（パスフレーズなしでOK）

# 2. 公開鍵をコピー
cat ~/.ssh/id_ed25519.pub

# 3. GitHubに登録
# Settings → SSH and GPG keys → New SSH key
# Titleに "MacBook Pro" など
# Keyに公開鍵を貼り付け

# 4. 接続テスト
ssh -T git@github.com
```

#### 使用方法:
```bash
# SSHのURLでクローン
git clone git@github.com:hirokifujieda-kanau/cocoty.git

# プッシュ時にパスワード不要
```

---

## 🌍 環境変数（将来的に必要）

### フロントエンド（Next.js）
`.env.local` ファイルを作成:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### バックエンド（Rails）
`.env` ファイルを作成:
```env
DATABASE_URL=postgresql://localhost/cocoty_development
SECRET_KEY_BASE=<rails secretで生成>
FRONTEND_URL=http://localhost:3000
```

---

## 📝 便利なコマンド

### フロントエンド
```bash
npm run dev          # 開発サーバー起動
npm run build        # 本番ビルド
npm run start        # 本番サーバー起動
npm run lint         # ESLint実行
```

### バックエンド
```bash
rails server -p 4000       # サーバー起動
rails db:migrate           # マイグレーション実行
rails db:seed              # シードデータ投入
rails console              # Railsコンソール
rails routes               # ルート一覧
bundle exec rspec          # テスト実行
```

---

## 🚨 トラブルシューティング

### Node.jsのバージョンが古い
```bash
# nvmを使う場合
nvm install 20
nvm use 20

# Homebrewを使う場合
brew install node@20
```

### Rubyのバージョンが古い
```bash
# Homebrewでインストール
brew install ruby

# パスを通す
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
echo 'export PATH="/opt/homebrew/lib/ruby/gems/3.4.0/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### PostgreSQLが起動しない
```bash
# インストール
brew install postgresql@15

# 起動
brew services start postgresql@15

# 確認
psql --version
```

### Gitのpushで認証エラー
```bash
# Personal Access Tokenを再生成して使用
# または SSH鍵を設定
```

---

## 📞 連絡先

- **GitHub**: hirokifujieda-kanau
- **Email**: hiroki.fujieda@kanau-lab.co.jp

---

**作成日**: 2024年11月18日
