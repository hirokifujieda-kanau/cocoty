# フロントエンド機能の無効化方法

## 📋 概要

スコープ外の機能を**削除せず**に無効化し、将来の実装に備えて保持します。

---

## 🎯 無効化の方針

1. **コンポーネントは保持** - 将来使うため、ファイルは削除しない
2. **ルーティングを無効化** - ページへの遷移をできなくする
3. **ナビゲーションから非表示** - UIからリンクを削除

---

## 🔧 実装方法

### 方法1: ページファイルを `.disabled` にリネーム（推奨）

ページファイルの拡張子を変更して、Next.js のルーティングから除外します。

```bash
# チーム関連ページを無効化
mv src/app/team src/app/team.disabled

# アルバム関連ページを無効化
mv src/app/album src/app/album.disabled

# ストア関連ページを無効化
mv src/app/store src/app/store.disabled

# 学習関連ページを無効化
mv src/app/learning src/app/learning.disabled
mv src/app/admin/learning src/app/admin/learning.disabled
```

**メリット**:
- ファイルは保持されるため、いつでも復元可能
- Next.js のビルドから自動的に除外される
- Git 履歴も保持される

**復元方法**:
```bash
# 元に戻す
mv src/app/team.disabled src/app/team
```

---

### 方法2: ページコンポーネントを条件分岐で無効化

ページファイル内で条件分岐を追加し、アクセスを制限します。

```typescript
// src/app/team/[teamName]/page.tsx
'use client';

const FEATURE_ENABLED = false; // 機能フラグ

export default function TeamPage() {
  if (!FEATURE_ENABLED) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">🚧 準備中</h1>
          <p className="text-gray-600">この機能は現在開発中です</p>
        </div>
      </div>
    );
  }
  
  // 既存のコンポーネント
  return <TeamView />;
}
```

**メリット**:
- ファイル構造を変更しない
- フラグを切り替えるだけで有効化できる
- 開発中であることをユーザーに明示できる

---

### 方法3: 環境変数で機能フラグ管理（最も柔軟）

`.env.local` で機能の有効/無効を管理します。

#### ステップ1: 環境変数ファイルを作成

```bash
# .env.local
NEXT_PUBLIC_FEATURE_TAROT=false
NEXT_PUBLIC_FEATURE_TEAM=false
NEXT_PUBLIC_FEATURE_ALBUM=false
NEXT_PUBLIC_FEATURE_STORE=false
NEXT_PUBLIC_FEATURE_LEARNING=false
NEXT_PUBLIC_FEATURE_EVENTS=false
NEXT_PUBLIC_FEATURE_MESSAGING=false
```

#### ステップ2: 機能フラグユーティリティを作成

```typescript
// src/lib/featureFlags.ts
export const featureFlags = {
  tarot: process.env.NEXT_PUBLIC_FEATURE_TAROT === 'true',
  team: process.env.NEXT_PUBLIC_FEATURE_TEAM === 'true',
  album: process.env.NEXT_PUBLIC_FEATURE_ALBUM === 'true',
  store: process.env.NEXT_PUBLIC_FEATURE_STORE === 'true',
  learning: process.env.NEXT_PUBLIC_FEATURE_LEARNING === 'true',
  events: process.env.NEXT_PUBLIC_FEATURE_EVENTS === 'true',
  messaging: process.env.NEXT_PUBLIC_FEATURE_MESSAGING === 'true',
};
```

#### ステップ3: ページで使用

```typescript
// src/app/team/[teamName]/page.tsx
import { featureFlags } from '@/lib/featureFlags';

export default function TeamPage() {
  if (!featureFlags.team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">🚧 準備中</h1>
          <p className="text-gray-600">この機能は現在開発中です</p>
        </div>
      </div>
    );
  }
  
  return <TeamView />;
}
```

**メリット**:
- 環境ごとに機能の有効/無効を切り替え可能
- 本番環境で無効化、開発環境で有効化などが可能
- 将来の段階的リリースに対応しやすい

---

## 🔗 ナビゲーションから非表示にする

### トップページやナビゲーションメニューから該当リンクを削除

```typescript
// src/app/page.tsx または src/components/Navigation.tsx
import { featureFlags } from '@/lib/featureFlags';

export default function Navigation() {
  return (
    <nav>
      <a href="/profile">プロフィール</a>
      <a href="/login">ログイン</a>
      
      {/* 無効化された機能のリンクをコメントアウト */}
      {/* {featureFlags.team && <a href="/team">チーム</a>} */}
      {/* {featureFlags.album && <a href="/album">アルバム</a>} */}
      {/* {featureFlags.store && <a href="/store">ストア</a>} */}
    </nav>
  );
}
```

---

## 📊 無効化対象のページ一覧

| ページパス | 機能 | 無効化方法 | 復元方法 |
|:---|:---|:---:|:---:|
| `src/app/team/**` | チーム機能 | リネーム or フラグ | リネーム戻し or フラグ有効化 |
| `src/app/album/**` | アルバム機能 | リネーム or フラグ | リネーム戻し or フラグ有効化 |
| `src/app/store/**` | ストア機能 | リネーム or フラグ | リネーム戻し or フラグ有効化 |
| `src/app/learning/**` | 学習機能 | リネーム or フラグ | リネーム戻し or フラグ有効化 |
| `src/app/admin/learning/**` | 管理者学習 | リネーム or フラグ | リネーム戻し or フラグ有効化 |

---

## 🎯 推奨アプローチ

**フェーズ1（即時対応）**: 方法1のリネーム
- 素早く無効化できる
- ファイルは保持される

**フェーズ2（将来の拡張性）**: 方法3の機能フラグ
- 環境変数で管理
- 段階的リリースに対応

---

## 🛠️ 実装手順

### ステップ1: ページのリネーム（無効化）

```bash
cd /Users/fujiedahiroki/Projects/community-platform

# チーム関連ページを無効化
mv src/app/team src/app/team.disabled

# アルバム関連ページを無効化
mv src/app/album src/app/album.disabled

# ストア関連ページを無効化
mv src/app/store src/app/store.disabled

# 学習関連ページを無効化
mv src/app/learning src/app/learning.disabled
mv src/app/admin/learning src/app/admin/learning.disabled

# Git にコミット
git add .
git commit -m "chore: スコープ外機能ページの無効化（将来の実装に備えて保持）"
```

### ステップ2: ビルド確認

```bash
npm run build
```

### ステップ3: 開発サーバーで確認

```bash
npm run dev
```

以下のページが404になることを確認：
- http://localhost:3000/team
- http://localhost:3000/album
- http://localhost:3000/store
- http://localhost:3000/learning

---

## ✅ 確認事項

- [ ] 無効化したページにアクセスすると404エラーになるか
- [ ] ビルドが正常に完了するか
- [ ] プロフィール・認証機能は正常に動作するか
- [ ] コンポーネントファイルは保持されているか

---

## 🔄 将来の復元方法

機能を実装する際は、以下の手順で復元します：

```bash
# ページを復元
mv src/app/team.disabled src/app/team

# または環境変数を変更
# .env.local
NEXT_PUBLIC_FEATURE_TEAM=true

# Git にコミット
git add .
git commit -m "feat: チーム機能の有効化"
```

---

## 📝 補足

- **コンポーネントは全て保持** - `src/components/` 配下のファイルは削除していません
- **モックデータも保持** - `src/lib/mock/` のファイルも削除していません
- **将来の実装に備える** - 必要になったらすぐに復元できます

すべてのファイルは Git 履歴に残っているため、安心して無効化できます。
