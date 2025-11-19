# 修正版：機能別リリース見積もり（機能内訳のみ）

**算出日**: 2025年11月17日  
**修正内容**: 
- ❌ チーム動画機能を削除
- ❌ 進捗管理（Daily）を削除
- ✅ プロフィール情報拡充機能を追加
- ✅ チームプロジェクト曼荼羅アート（画像表示のみ）を追加
- ✅ タグ検索 → タグ共通者一覧機能に変更

---

## 📋 修正後の機能一覧

| # | 機能 | 優先度 | フロント実装状況 | 概要 |
|---|------|--------|----------------|------|
| ① | タロット・パーソナル診断 | 4 | ✅ 完全実装 | デイリータロット、季節診断、メンタルチェック |
| ② | タスク管理系（ゴール系） | 7 | ✅ 完全実装 | 学習タスク管理、進捗追跡 |
| ③ | プロフィール情報拡充 | **NEW** | ✅ 完全実装 | 年齢、出身地、趣味、好きな食べ物、MBTI、血液型 |
| ④ | タグ共通者一覧機能 | 7 | ⚠️ タグ表示のみ | タグで同じ趣味の人を探す |
| ⑤ | チームプロジェクト画像 | - | ❌ 未実装 | 曼荼羅アート等の画像表示（アップロードは後回し） |

**削除した機能**:
- ~~③ 進捗管理（Daily）~~ → タスク管理に統合済み
- ~~⑤ チーム動画~~ → 不要

---

## 📊 機能①：タロット・パーソナル診断（優先度：4）

### ✅ フロント実装状況
**完全実装済み**（約1,250行）

#### 実装済みコンポーネント
1. **DailyTarot.tsx** (498行)
   - タロットカード抽選
   - メンタルチェック（5問）
   - 1日1回制限
   - 履歴保存（localStorage）

2. **SeasonalDiagnosisHub.tsx** (350行)
   - MBTI診断
   - RPG診断
   - カラー診断
   - 動物診断
   - フラワー診断

3. **MentalStatsAdmin.tsx** (400行)
   - メンタルスコア履歴
   - グラフ表示
   - CSV エクスポート

### ❌ 未実装（バックエンド + API）

#### 必要なAPI
1. **タロット占い API**
   - `POST /api/fortune/tarot` - タロット実行
   - `GET /api/fortune/tarot/history` - 履歴取得
   - `GET /api/fortune/tarot/today` - 今日の結果

2. **メンタルチェック API**
   - `POST /api/fortune/mental-check` - チェック実行
   - `GET /api/fortune/mental-check/history` - 履歴取得
   - `GET /api/fortune/mental-check/stats` - 統計

3. **季節診断 API**
   - `GET /api/fortune/diagnosis/available` - 診断一覧
   - `POST /api/fortune/diagnosis/take` - 診断実行
   - `GET /api/fortune/diagnosis/history` - 履歴

#### データベーススキーマ
```prisma
model TarotReading {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  mode         String   // 'self' | 'relationship'
  cardName     String
  cardImage    String
  cardMeaning  String
  advice       String
  luckyItem    String
  luckyColor   String
  mentalScore  Int?
  mentalLevel  String?
  createdAt    DateTime @default(now())
  
  @@index([userId, createdAt])
}

model MentalCheckHistory {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  answers      Json
  score        Int
  level        String
  message      String
  suggestions  Json
  createdAt    DateTime @default(now())
  
  @@index([userId, createdAt])
}

model DiagnosisResult {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  diagnosisId   String
  diagnosisType String
  resultType    String
  title         String
  description   String
  traits        Json
  advice        String
  answers       Json
  createdAt     DateTime @default(now())
  
  @@index([userId, diagnosisId])
}
```

#### インフラ要件
- PostgreSQL / MySQL
- Redis（1日1回制限用）
- バックグラウンドジョブ（期間限定診断管理）

---

## 📊 機能②：タスク管理系（ゴール系）（優先度：7）

### ✅ フロント実装状況
**完全実装済み**（約1,326行）

#### 実装済みコンポーネント
1. **MemberLearningProgress.tsx** (498行)
   - タスク一覧・作成・編集・削除
   - ステータス管理（未着手/進行中/完了/期限切れ）
   - 進捗率表示（0-100%）
   - 優先度設定（高/中/低）
   - カテゴリ分類（動画学習/課題/イベント/練習/その他）
   - 期限設定
   - フィルター・検索

2. **AdminLearningDashboard.tsx** (498行)
   - 全ユーザーのタスク一覧
   - ユーザー別統計
   - 完了率の可視化

3. **mockLearningTasks.ts** (330行)
   - localStorage でのタスク保存
   - CRUD 操作
   - 統計計算

### ❌ 未実装（バックエンド + API）

#### 必要なAPI
1. **タスク管理 API**
   - `GET /api/tasks` - タスク一覧
   - `GET /api/tasks/:id` - タスク詳細
   - `POST /api/tasks` - タスク作成
   - `PUT /api/tasks/:id` - タスク更新
   - `DELETE /api/tasks/:id` - タスク削除
   - `PUT /api/tasks/:id/progress` - 進捗更新
   - `PUT /api/tasks/:id/complete` - タスク完了

2. **統計 API**
   - `GET /api/tasks/stats` - ユーザー別統計
   - `GET /api/tasks/upcoming` - 期限が近いタスク
   - `GET /api/tasks/overdue` - 期限切れタスク

3. **管理者 API**
   - `GET /api/admin/tasks` - 全タスク取得
   - `GET /api/admin/tasks/stats` - 全体統計
   - `POST /api/admin/tasks/assign` - タスク割り当て

#### データベーススキーマ
```prisma
model LearningTask {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  title        String
  description  String
  category     String   // 'video-learning' | 'assignment' | 'event' | 'practice' | 'other'
  priority     String   // 'high' | 'medium' | 'low'
  status       String   @default("not-started")
  progress     Int      @default(0)
  dueDate      DateTime?
  completedAt  DateTime?
  timeSpent    Int      @default(0)
  tags         String[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  @@index([userId, status])
  @@index([userId, dueDate])
}

model TaskTemplate {
  id          String   @id @default(cuid())
  title       String
  description String
  category    String
  priority    String
  tags        String[]
  createdBy   String
  creator     User     @relation(fields: [createdBy], references: [id])
  createdAt   DateTime @default(now())
}
```

#### インフラ要件
- PostgreSQL / MySQL
- バックグラウンドジョブ（期限切れチェック、通知）
- Push通知（Firebase）

---

## 📊 機能③：プロフィール情報拡充（NEW）

### ✅ フロント実装状況
**完全実装済み**

#### 実装済み機能
1. **表示機能** (`InstagramProfilePage.tsx`)
   - ✅ 年齢バッジ（🎂 23歳）
   - ✅ 出身地バッジ（📍 東京都渋谷区）
   - ✅ 血液型バッジ（🩸 A型）
   - ✅ MBTI バッジ（🧠 ENFP）
   - ✅ 趣味タグ（複数、オレンジバッジ）
   - ✅ 好きな食べ物タグ（複数、ピンクバッジ）

2. **編集機能** (`ProfileEditModal.tsx`)
   - ✅ 誕生日入力（date picker）
   - ✅ 出身地入力（text）
   - ✅ 趣味入力（カンマ区切り）
   - ✅ 好きな食べ物入力（カンマ区切り）
   - ✅ MBTI 選択（16タイプのドロップダウン）
   - ✅ 血液型選択（A/B/O/AB）

3. **データ構造** (`dummyUsers.ts`)
   ```typescript
   interface User {
     birthday: string;      // '2001-04-15'
     age: number;          // 23
     birthplace: string;   // '東京都渋谷区'
     hobbies: string[];    // ['写真', 'カフェ巡り', '映画鑑賞']
     favoriteFood: string[]; // ['パスタ', 'タピオカ', 'パンケーキ']
     mbtiType: string;     // 'ENFP'
     bloodType: string;    // 'A'
   }
   ```

### ❌ 未実装（バックエンド + API）

#### 必要なAPI
1. **プロフィール拡張 API**
   - `GET /api/profiles/:id` - プロフィール取得（拡張フィールド含む）
   - `PUT /api/profiles/:id` - プロフィール更新
   - `GET /api/profiles/search` - プロフィール検索（後述のタグ検索に統合）

#### データベーススキーマ拡張
```prisma
model Profile {
  id           String   @id @default(cuid())
  userId       String   @unique
  user         User     @relation(fields: [userId], references: [id])
  
  // 既存フィールド
  nickname     String?
  bio          String?
  avatar       String?
  coverImage   String?
  
  // 拡張フィールド
  birthday     DateTime?
  birthplace   String?
  hobbies      String[]  // タグ配列
  favoriteFood String[]  // タグ配列
  mbtiType     String?   // 'ENFP', 'INTP', etc.
  bloodType    String?   // 'A', 'B', 'O', 'AB'
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  @@index([mbtiType])
  @@index([bloodType])
}
```

#### インフラ要件
- PostgreSQL / MySQL（配列型サポート必須）

---

## 📊 機能④：タグ共通者一覧機能（優先度：7）

### ⚠️ フロント部分実装

#### 実装済み
- ✅ タグ表示（投稿、イベント、作品、プロフィール）
- ✅ タグデータ構造（配列）
- ✅ プロフィールの趣味・好きな食べ物がタグ化されている

#### 未実装
- ❌ タグクリック → 共通者一覧画面
- ❌ タグ検索UI
- ❌ 類似度スコア表示
- ❌ フィルター機能

### 🎯 実装する機能

#### 1. タグ共通者一覧画面
**画面構成**:
```
┌─────────────────────────────────────┐
│ 🏷️ タグ: 写真                      │
│                                     │
│ 共通の趣味を持つメンバー (23人)     │
├─────────────────────────────────────┤
│ 👤 山田花子                         │
│    ENFP | A型 | 東京都              │
│    共通タグ: 写真, カフェ巡り (2)   │
│    一致度: 85%                      │
├─────────────────────────────────────┤
│ 👤 佐藤太郎                         │
│    INTP | B型 | 神奈川県            │
│    共通タグ: 写真, プログラミング (2)│
│    一致度: 75%                      │
└─────────────────────────────────────┘
```

#### 2. フィルター機能
- MBTI タイプ
- 血液型
- 地域
- 一致度（高い順/低い順）

#### 3. マッチングアルゴリズム
- **Jaccard係数**: `共通タグ数 / 全体タグ数の和集合`
- **重み付け**: 趣味 > 好きな食べ物
- **スコア化**: 0-100%で表示

### ❌ 未実装（バックエンド + API）

#### 必要なAPI
1. **タグマスター管理**
   - `GET /api/tags` - タグ一覧取得
   - `GET /api/tags/popular` - 人気タグランキング
   - `GET /api/tags/:tagName/users` - タグを持つユーザー一覧
   - `POST /api/tags` - タグ作成（管理者のみ）

2. **タグ検索・マッチング**
   - `GET /api/profiles/search/by-tags` - タグ検索
     - Params: `tags[]`, `mbtiType?`, `bloodType?`, `location?`, `minScore?`
     - Response: `{ users: [], totalCount, matchScores: {} }`
   
   - `GET /api/profiles/:id/similar` - 類似ユーザー
     - Response: `{ users: [], matchScores: {} }`

3. **タグ統計**
   - `GET /api/tags/stats` - タグ使用統計
   - `GET /api/tags/:tagName/stats` - 特定タグの統計

#### データベーススキーマ
```prisma
// タグマスター
model Tag {
  id          String   @id @default(cuid())
  name        String   @unique
  category    String   // 'hobby' | 'food' | 'skill' | 'other'
  usageCount  Int      @default(0)
  createdAt   DateTime @default(now())
  
  @@index([category])
  @@index([usageCount])
}

// ユーザータグ関連（多対多）
model UserTag {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  tagId     String
  tag       Tag      @relation(fields: [tagId], references: [id])
  source    String   // 'hobby' | 'food' | 'manual'
  createdAt DateTime @default(now())
  
  @@unique([userId, tagId])
  @@index([userId])
  @@index([tagId])
}
```

#### ビジネスロジック
1. **マッチングスコア計算**
   ```typescript
   function calculateMatchScore(userA: User, userB: User): number {
     const tagsA = new Set([...userA.hobbies, ...userA.favoriteFood]);
     const tagsB = new Set([...userB.hobbies, ...userB.favoriteFood]);
     
     const intersection = new Set([...tagsA].filter(x => tagsB.has(x)));
     const union = new Set([...tagsA, ...tagsB]);
     
     // Jaccard係数
     return (intersection.size / union.size) * 100;
   }
   ```

2. **類似ユーザー推薦**
   - 共通タグが3つ以上
   - スコア50%以上
   - 上位20人を返す

#### インフラ要件
- PostgreSQL / MySQL
- Elasticsearch（全文検索・タグ検索最適化）
- Redis（タグランキングキャッシュ）

---

## 📊 機能⑤：チームプロジェクト画像表示（曼荼羅アート）

### ❌ フロント未実装

### 🎯 実装する機能

#### 1. 画像表示機能（アップロードは後回し）
**画面構成**:
```
┌─────────────────────────────────────┐
│ 📸 チームプロジェクト                │
│                                     │
│ 🎨 曼荼羅アート                     │
│ ┌─────────┐                         │
│ │         │  プロジェクト名          │
│ │  画像   │  作成日: 2024-11-01     │
│ │         │  メンバー: 5人           │
│ └─────────┘                         │
│                                     │
│ 🎭 演劇プロジェクト                  │
│ ┌─────────┐                         │
│ │  画像   │  ...                    │
│ └─────────┘                         │
└─────────────────────────────────────┘
```

#### 2. 実装範囲
**Phase 1（最初）: 画像表示のみ**
- ✅ プロジェクト一覧表示
- ✅ 画像表示（固定URLまたはダミー画像）
- ✅ プロジェクト名、説明、メンバー表示
- ✅ フィルター（チーム別、カテゴリ別）

**Phase 2（後回し）: アップロード機能**
- ❌ 画像アップロード UI
- ❌ 画像編集機能
- ❌ 複数画像対応
- ❌ 権限管理（チームメンバーのみ）

### ❌ 未実装（バックエンド + API）

#### 必要なAPI（Phase 1: 表示のみ）
1. **プロジェクト管理 API**
   - `GET /api/team-projects` - プロジェクト一覧
     - Params: `teamId?`, `category?`, `page`, `limit`
     - Response: `{ projects: [], totalCount }`
   
   - `GET /api/team-projects/:id` - プロジェクト詳細
     - Response: `{ project }`

2. **チーム API（既存に追加）**
   - `GET /api/teams/:id/projects` - チームのプロジェクト一覧

#### データベーススキーマ
```prisma
model TeamProject {
  id          String   @id @default(cuid())
  teamId      String
  team        Team     @relation(fields: [teamId], references: [id])
  title       String
  description String?
  category    String   // 'art' | 'performance' | 'tech' | 'other'
  imageUrl    String   // 最初は固定URL、後でS3に変更
  status      String   @default("active") // 'active' | 'completed' | 'archived'
  members     Json     // メンバーID配列（簡易版）
  createdBy   String
  creator     User     @relation(fields: [createdBy], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([teamId])
  @@index([category])
  @@index([status])
}
```

#### インフラ要件（Phase 1）
- PostgreSQL / MySQL
- 固定画像URL（Placeholder画像でOK）

#### インフラ要件（Phase 2: 後回し）
- AWS S3（画像保存）
- CloudFront（CDN）
- 画像リサイズ処理

---

## 📊 全体サマリー（修正版）

### 機能比較表

| 機能 | 優先度 | フロント状況 | バックエンド状況 | 複雑度 | 変更点 |
|------|--------|------------|----------------|-------|--------|
| ① タロット・診断 | 4 | ✅ 完全実装 | ❌ 未実装 | 高 | 変更なし |
| ② タスク管理 | 7 | ✅ 完全実装 | ❌ 未実装 | 中 | 変更なし |
| ③ プロフィール拡充 | NEW | ✅ 完全実装 | ❌ 未実装 | 低 | **新規追加** |
| ④ タグ共通者一覧 | 7 | ⚠️ 部分実装 | ❌ 未実装 | 中 | **修正**（検索→一覧） |
| ⑤ チームプロジェクト画像 | - | ❌ 未実装 | ❌ 未実装 | 低 | **新規追加** |

**削除した機能**:
- ~~進捗管理（Daily）~~ → タスク管理に統合
- ~~チーム動画~~ → 不要

---

### フロント実装済み vs 未実装

#### ✅ フロント完全実装済み（約2,576行）
1. **タロット・診断**: 1,250行
2. **タスク管理**: 1,326行
3. **プロフィール拡充**: 実装済み（InstagramProfilePage, ProfileEditModal）

**合計**: 約2,576行

#### ⚠️ フロント部分実装
4. **タグ共通者一覧**: タグ表示のみ、検索UI未実装

#### ❌ フロント未実装
5. **チームプロジェクト画像**: 0行

---

## 🎯 推奨実装順序

### Phase 1（優先度高 + フロント完成済み）: 約2ヶ月
1. **プロフィール拡充**（1週間） - フロント完成、バックエンド簡単
2. **タスク管理**（4週間） - フロント完成、バックエンドは複雑
3. **タロット・診断**（4週間） - フロント完成、バックエンドは複雑

### Phase 2（中優先度）: 約1.5ヶ月
4. **タグ共通者一覧**（5週間） - フロント一部あり、検索ロジック複雑

### Phase 3（低優先度、簡易版）: 約2週間
5. **チームプロジェクト画像（表示のみ）**（2週間） - アップロードは後回し

---

## 📝 補足事項

### 削除理由
1. **進捗管理（Daily）**: タスク管理機能に統合されており、独立した機能として不要
2. **チーム動画**: 実装コストが高く、優先度が低いため削除

### 新規追加理由
1. **プロフィール拡充**: フロントに既に実装済みで、バックエンド工数が少ない
2. **チームプロジェクト画像（表示のみ）**: アップロード機能を後回しにすることで工数削減

### タグ検索の変更点
- **旧**: タグによる検索機能全般
- **新**: タグをクリック → 同じタグを持つ人の一覧表示
- **理由**: よりシンプルで実用的な機能に絞る

---

## 次のステップ

各機能の詳細工数見積もりが必要な場合は、個別に算出します。
現時点では**機能内訳のみ**を提示しています。
