# 🚀 バックエンド移行計画

## 📊 現状分析

### 現在のデータ管理方法
- **すべてのデータがlocalStorageに保存**（クライアントサイドのみ）
- **22個のlocalStorageキー**を使用
- **ダミーデータ**が各コンポーネントにハードコーディング
- **認証機能なし**（ユーザーID固定）

### 主要な課題
1. ❌ **データの永続性がない** - ブラウザキャッシュクリアでデータ消失
2. ❌ **複数デバイス間の同期不可** - データが端末ごとに異なる
3. ❌ **セキュリティリスク** - すべてのデータがクライアントで改ざん可能
4. ❌ **リアルタイム機能の制限** - 他ユーザーとのインタラクション不可
5. ❌ **スケーラビリティの欠如** - 画像アップロードや大量データに対応不可

---

## 🎯 移行戦略：段階的アプローチ

### 【推奨】フェーズ別移行計画

## Phase 1: 認証・ユーザー管理（最優先）🔥
**期間**: 1-2週間  
**理由**: すべての機能の基盤となるため最優先

### 実装内容
1. **認証システム**
   - NextAuth.js または Supabase Auth
   - Email/Password認証
   - OAuth（Google, GitHub）
   - セッション管理

2. **ユーザーデータベース**
   ```prisma
   model User {
     id            String    @id @default(cuid())
     email         String    @unique
     name          String?
     nickname      String?
     avatar        String?
     coverImage    String?
     bio           String?
     diagnosis     String?   // MBTI診断結果
     createdAt     DateTime  @default(now())
     updatedAt     DateTime  @updatedAt
     
     // リレーション
     profiles      Profile[]
     friends       Friendship[]
     messages      Message[]
     notifications Notification[]
   }
   ```

3. **API実装**
   - `POST /api/auth/signup` - ユーザー登録
   - `POST /api/auth/signin` - ログイン
   - `GET /api/users/me` - 自分のプロフィール取得
   - `PUT /api/users/me` - プロフィール更新

### 移行対象コンポーネント
- `src/components/profile/Profile.tsx`
- `src/components/profile/ProfilePage.tsx`
- `src/lib/dummyUsers.ts` → 実データに置き換え

### localStorage → DB移行
- `cocoty_profile_v1` → `User` テーブル
- `cocoty_current_user_v1` → セッション管理

---

## Phase 2: プロフィール・プライバシー設定 📝
**期間**: 1週間  
**依存**: Phase 1完了後

### 実装内容
1. **プロフィール管理**
   ```prisma
   model Profile {
     id              String   @id @default(cuid())
     userId          String
     user            User     @relation(fields: [userId], references: [id])
     customUrl       String?  @unique
     goal            String?
     teamName        String?
     teamGoal        String?
     createdAt       DateTime @default(now())
     updatedAt       DateTime @updatedAt
   }
   ```

2. **プライバシー設定**
   ```prisma
   model PrivacySettings {
     id                    String  @id @default(cuid())
     userId                String  @unique
     user                  User    @relation(fields: [userId], references: [id])
     profileVisibility     String  @default("public") // public, friends, private
     activityVisibility    String  @default("public")
     messagePrivacy        String  @default("friends")
     galleryVisibility     String  @default("public")
     diagnosisVisibility   String  @default("public")
     friendsListVisibility String  @default("public")
   }
   ```

3. **訪問者統計**
   ```prisma
   model ProfileView {
     id          String   @id @default(cuid())
     profileId   String
     visitorId   String
     visitor     User     @relation(fields: [visitorId], references: [id])
     viewedAt    DateTime @default(now())
     
     @@index([profileId, viewedAt])
   }
   ```

### API実装
- `GET /api/profile/:userId` - プロフィール取得
- `PUT /api/profile/settings` - プライバシー設定更新
- `GET /api/profile/:userId/stats` - 訪問者統計
- `POST /api/profile/:userId/view` - 訪問記録

### 移行対象
- `cocoty_privacy_settings_v1` → `PrivacySettings` テーブル
- `cocoty_display_settings_v1` → `Profile` テーブル
- `cocoty_visitor_stats_v1` → `ProfileView` テーブル

---

## Phase 3: ソーシャル機能（友達・メッセージ） 👥💬
**期間**: 2週間  
**依存**: Phase 1, 2完了後  
**優先度**: 高（ユーザー体験の核心）

### 実装内容
1. **友達関係**
   ```prisma
   model Friendship {
     id          String   @id @default(cuid())
     requesterId String
     requester   User     @relation("FriendshipRequester", fields: [requesterId], references: [id])
     addresseeId String
     addressee   User     @relation("FriendshipAddressee", fields: [addresseeId], references: [id])
     status      String   // pending, accepted, blocked
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
     
     @@unique([requesterId, addresseeId])
     @@index([requesterId])
     @@index([addresseeId])
   }
   ```

2. **メッセージング**
   ```prisma
   model Conversation {
     id          String    @id @default(cuid())
     participant1 String
     participant2 String
     user1       User      @relation("ConversationUser1", fields: [participant1], references: [id])
     user2       User      @relation("ConversationUser2", fields: [participant2], references: [id])
     messages    Message[]
     createdAt   DateTime  @default(now())
     updatedAt   DateTime  @updatedAt
     
     @@unique([participant1, participant2])
   }

   model Message {
     id             String       @id @default(cuid())
     conversationId String
     conversation   Conversation @relation(fields: [conversationId], references: [id])
     senderId       String
     sender         User         @relation(fields: [senderId], references: [id])
     content        String
     attachments    String[]     // 画像URLの配列
     isRead         Boolean      @default(false)
     createdAt      DateTime     @default(now())
     
     @@index([conversationId, createdAt])
   }
   ```

3. **リアルタイム機能**
   - WebSocket (Pusher, Ably, Socket.io)
   - オンラインステータス
   - 既読/未読のリアルタイム同期

### API実装
- `GET /api/friends` - 友達リスト取得
- `POST /api/friends/request` - 友達申請
- `PUT /api/friends/:id/accept` - 友達申請承認
- `DELETE /api/friends/:id` - 友達削除
- `GET /api/messages` - 会話リスト取得
- `GET /api/messages/:conversationId` - メッセージ履歴取得
- `POST /api/messages` - メッセージ送信
- `PUT /api/messages/:id/read` - 既読マーク

### 移行対象
- `cocoty_friends_list_v1` → `Friendship` テーブル
- `cocoty_messages_v1_*` → `Message` テーブル
- `cocoty_conversations_v1` → `Conversation` テーブル

---

## Phase 4: 通知・コメント・いいね 🔔❤️
**期間**: 1週間  
**依存**: Phase 3完了後

### 実装内容
1. **通知システム**
   ```prisma
   model Notification {
     id         String   @id @default(cuid())
     userId     String
     user       User     @relation(fields: [userId], references: [id])
     type       String   // friend_request, message, like, comment, profile_visit
     actorId    String?
     actor      User?    @relation("NotificationActor", fields: [actorId], references: [id])
     content    String
     actionUrl  String?
     isRead     Boolean  @default(false)
     createdAt  DateTime @default(now())
     
     @@index([userId, isRead, createdAt])
   }
   ```

2. **コメント・いいね**
   ```prisma
   model Photo {
     id          String    @id @default(cuid())
     userId      String
     user        User      @relation(fields: [userId], references: [id])
     url         String
     caption     String?
     albumId     String?
     comments    Comment[]
     likes       Like[]
     createdAt   DateTime  @default(now())
   }

   model Comment {
     id        String   @id @default(cuid())
     photoId   String
     photo     Photo    @relation(fields: [photoId], references: [id])
     userId    String
     user      User     @relation(fields: [userId], references: [id])
     content   String
     likes     Int      @default(0)
     createdAt DateTime @default(now())
   }

   model Like {
     id        String   @id @default(cuid())
     photoId   String
     photo     Photo    @relation(fields: [photoId], references: [id])
     userId    String
     user      User     @relation(fields: [userId], references: [id])
     createdAt DateTime @default(now())
     
     @@unique([photoId, userId])
   }
   ```

### API実装
- `GET /api/notifications` - 通知一覧取得
- `PUT /api/notifications/:id/read` - 既読マーク
- `POST /api/photos/:id/comments` - コメント投稿
- `POST /api/photos/:id/like` - いいね
- `DELETE /api/photos/:id/like` - いいね解除

### 移行対象
- `cocoty_notifications_v1` → `Notification` テーブル
- `cocoty_comments_v1_*` → `Comment` テーブル
- `cocoty_likes_v1_*` → `Like` テーブル

---

## Phase 5: 占い・診断機能 🔮
**期間**: 1週間  
**依存**: Phase 1完了後（独立して実装可能）

### 実装内容
1. **タロット・メンタルチェック**
   ```prisma
   model TarotReading {
     id        String   @id @default(cuid())
     userId    String
     user      User     @relation(fields: [userId], references: [id])
     cardName  String
     mode      String   // self, relationship
     partnerId String?
     mentalScore Int
     mentalLevel String  // excellent, good, normal, low, critical
     createdAt DateTime @default(now())
     
     @@index([userId, createdAt])
   }

   model MentalCheckHistory {
     id        String   @id @default(cuid())
     userId    String
     user      User     @relation(fields: [userId], references: [id])
     score     Int
     level     String
     answers   Json     // 5つの質問の回答
     createdAt DateTime @default(now())
     
     @@index([userId, createdAt])
   }
   ```

2. **季節診断**
   ```prisma
   model DiagnosisResult {
     id           String   @id @default(cuid())
     userId       String
     user         User     @relation(fields: [userId], references: [id])
     diagnosisId  String
     diagnosisType String  // mbti, rpg, color, animal, flower
     resultType   String   // ENFP, Warrior, etc.
     answers      Json
     createdAt    DateTime @default(now())
     
     @@index([userId, diagnosisId])
   }
   ```

### API実装
- `POST /api/fortune/tarot` - タロット占い実行
- `GET /api/fortune/tarot/history` - 占い履歴取得
- `POST /api/fortune/mental-check` - メンタルチェック実行
- `GET /api/fortune/mental-stats` - メンタル統計取得
- `POST /api/fortune/diagnosis` - 季節診断実行
- `GET /api/fortune/diagnosis/history` - 診断履歴取得

### 移行対象
- `cocoty_daily_tarot_v1_*` → `TarotReading` テーブル
- `cocoty_mental_check_v1_*` → `MentalCheckHistory` テーブル
- `cocoty_seasonal_diagnosis_v1_*` → `DiagnosisResult` テーブル

---

## Phase 6: アルバム・アクティビティ 📸📅
**期間**: 1週間  
**依存**: Phase 1完了後

### 実装内容
1. **アルバム管理**
   ```prisma
   model Album {
     id          String   @id @default(cuid())
     userId      String
     user        User     @relation(fields: [userId], references: [id])
     title       String
     description String?
     coverImage  String?
     photos      Photo[]
     isPublic    Boolean  @default(true)
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
   }
   ```

2. **アクティビティカレンダー**
   ```prisma
   model Activity {
     id          String   @id @default(cuid())
     userId      String
     user        User     @relation(fields: [userId], references: [id])
     type        String   // upload, event, comment, achievement
     description String
     date        DateTime
     metadata    Json?
     
     @@index([userId, date])
   }

   model Streak {
     id            String   @id @default(cuid())
     userId        String   @unique
     user          User     @relation(fields: [userId], references: [id])
     currentStreak Int      @default(0)
     longestStreak Int      @default(0)
     lastActivity  DateTime?
     updatedAt     DateTime @updatedAt
   }
   ```

### API実装
- `GET /api/albums` - アルバム一覧取得
- `POST /api/albums` - アルバム作成
- `POST /api/photos` - 写真アップロード（Cloudinaryなど）
- `GET /api/activities` - アクティビティカレンダー取得
- `GET /api/activities/streak` - ストリーク情報取得

### 移行対象
- `cocoty_albums_v1` → `Album`, `Photo` テーブル
- `cocoty_activity_calendar_v1_*` → `Activity` テーブル
- `cocoty_streak_v1_*` → `Streak` テーブル

---

## 🛠️ 推奨技術スタック

### バックエンド
1. **データベース**: PostgreSQL（Supabase or Vercel Postgres）
   - スケーラブル
   - リアルタイム機能サポート
   - 無料枠が充実

2. **ORM**: Prisma
   - TypeScript完全対応
   - マイグレーション管理が簡単
   - 型安全なクエリ

3. **認証**: NextAuth.js または Supabase Auth
   - Next.jsとの統合が簡単
   - OAuth対応
   - セッション管理

4. **ストレージ**: Cloudinary or Vercel Blob
   - 画像最適化
   - CDN配信
   - 無料枠あり

5. **リアルタイム**: Pusher or Ably
   - メッセージング
   - オンラインステータス
   - 通知のリアルタイム配信

### API設計
- **Next.js App Router API Routes** (`app/api/**/*.ts`)
- RESTful API
- 必要に応じてGraphQL（Apollo Server）

---

## 📋 移行チェックリスト

### Phase 1: 認証・ユーザー管理 ✅
- [ ] データベースセットアップ（Supabase/Vercel Postgres）
- [ ] Prismaスキーマ定義
- [ ] 認証システム実装（NextAuth.js）
- [ ] User APIエンドポイント作成
- [ ] ProfilePage コンポーネントをAPI接続
- [ ] localStorageからDBへデータ移行スクリプト作成
- [ ] テスト（ユニット・E2E）

### Phase 2: プロフィール・プライバシー ⏳
- [ ] Profile, PrivacySettings スキーマ追加
- [ ] プロフィールAPI実装
- [ ] 訪問者統計API実装
- [ ] フロントエンド接続
- [ ] テスト

### Phase 3: ソーシャル機能 ⏳
- [ ] Friendship, Conversation, Message スキーマ追加
- [ ] 友達管理API実装
- [ ] メッセージAPI実装
- [ ] WebSocketセットアップ
- [ ] リアルタイム機能実装
- [ ] フロントエンド接続
- [ ] テスト

### Phase 4: 通知・コメント ⏳
- [ ] Notification, Comment, Like スキーマ追加
- [ ] 通知API実装
- [ ] コメント・いいねAPI実装
- [ ] フロントエンド接続
- [ ] テスト

### Phase 5: 占い・診断 ⏳
- [ ] TarotReading, MentalCheckHistory, DiagnosisResult スキーマ追加
- [ ] 占い・診断API実装
- [ ] フロントエンド接続
- [ ] テスト

### Phase 6: アルバム・アクティビティ ⏳
- [ ] Album, Photo, Activity, Streak スキーマ追加
- [ ] 画像アップロードAPI実装
- [ ] アクティビティAPI実装
- [ ] フロントエンド接続
- [ ] テスト

---

## 🚀 クイックスタートガイド

### 1. データベースセットアップ（Supabase推奨）

```bash
# Supabaseプロジェクト作成
https://supabase.com/dashboard

# 環境変数設定
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Prismaセットアップ

```bash
npm install prisma @prisma/client
npx prisma init

# schema.prisma編集後
npx prisma migrate dev --name init
npx prisma generate
```

### 3. NextAuth.jsセットアップ

```bash
npm install next-auth @auth/prisma-adapter

# .env.local
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### 4. 最初のAPI作成

```typescript
// app/api/users/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  return NextResponse.json(user);
}
```

---

## 💡 重要な考慮事項

### データ移行
- **段階的移行**: 機能ごとに徐々に移行（一度にすべて変更しない）
- **フィーチャーフラグ**: 新旧機能を切り替えられるように
- **データバリデーション**: localStorage→DB移行時の整合性チェック

### パフォーマンス
- **キャッシング**: React Query, SWRでデータキャッシュ
- **ページネーション**: 大量データの効率的な取得
- **画像最適化**: Next.js Imageコンポーネント + CDN

### セキュリティ
- **認証**: すべてのAPIエンドポイントで認証チェック
- **認可**: プライバシー設定に基づいたアクセス制御
- **サニタイゼーション**: ユーザー入力の検証・エスケープ
- **レート制限**: APIの過度な使用を防止

### コスト最適化
- **無料枠活用**: Supabase, Vercel, Cloudinaryの無料プラン
- **段階的スケール**: ユーザー数に応じてプラン変更

---

## 📊 見積もり

### 開発期間（総計）
- **Phase 1**: 1-2週間
- **Phase 2**: 1週間
- **Phase 3**: 2週間
- **Phase 4**: 1週間
- **Phase 5**: 1週間
- **Phase 6**: 1週間

**合計**: 7-9週間（約2ヶ月）

### コスト見積もり（月額）
- **Supabase**: $0（無料枠で十分）
- **Vercel**: $0（Hobbyプラン）
- **Cloudinary**: $0（無料枠で十分）
- **Pusher**: $0-49（無料枠 or Starter）

**合計**: $0-49/月

---

## 🎯 結論：最初に取り組むべきこと

### 今すぐ始めるべき Phase 1
1. **Supabaseプロジェクト作成**
2. **Prismaセットアップ**
3. **User, Profile スキーマ定義**
4. **NextAuth.js統合**
5. **最初のAPI作成（GET /api/users/me）**

### 具体的な次のステップ
```bash
# 1. 依存関係インストール
npm install @prisma/client prisma next-auth @auth/prisma-adapter

# 2. Prisma初期化
npx prisma init

# 3. スキーマ定義（schema.prisma）
# 4. マイグレーション実行
npx prisma migrate dev --name init

# 5. NextAuth設定
# app/api/auth/[...nextauth]/route.ts 作成

# 6. 最初のAPIエンドポイント作成
# app/api/users/me/route.ts
```

---

これで、モックから実際のバックエンド機能への移行計画が完成です！🎉
