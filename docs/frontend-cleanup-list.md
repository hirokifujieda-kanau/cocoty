# フロントエンド不要実装リスト

## 📋 概要

現在のスコープ（認証・プロフィール管理・設定）に対して、**削除または無効化すべき**フロントエンド実装をリストアップします。

---

## ❌ 削除対象のコンポーネント

### 1. タロット・診断機能（フェーズ5: 実装見送り）

| ファイルパス | 説明 | 対応 |
|:---|:---|:---:|
| `src/components/fortune/DailyTarot.tsx` | タロットカードUI | 🗑️ 削除 |
| `src/components/fortune/SeasonalDiagnosisHub.tsx` | 季節診断ハブ | 🗑️ 削除 |
| `src/components/fortune/MentalStatsAdmin.tsx` | メンタル統計管理画面 | 🗑️ 削除 |
| `src/components/profile/Diagnosis.tsx` | プロフィール診断表示 | 🗑️ 削除 |

### 2. タスク管理・TODO機能（削除済みフェーズ）

| ファイルパス | 説明 | 対応 |
|:---|:---|:---:|
| `src/components/todo/SimpleTodoList.tsx` | シンプルTODOリスト | 🗑️ 削除 |
| `src/components/dashboard/TodoDashboard.tsx` | TODOダッシュボード | 🗑️ 削除 |
| `src/lib/mock/mockLearningTasks.ts` | 学習タスクモックデータ | 🗑️ 削除 |

### 3. タグ検索・共通者機能（フェーズ6: 実装見送り）

| ファイルパス | 説明 | 対応 |
|:---|:---|:---:|
| ❌ **該当なし** | タグ検索機能は未実装 | - |

### 4. プロジェクト・チーム機能（フェーズ7: 実装見送り）

| ファイルパス | 説明 | 対応 |
|:---|:---|:---:|
| `src/components/member/TeamView.tsx` | チーム表示 | 🗑️ 削除 |
| `src/components/member/TeamHome.tsx` | チームホーム | 🗑️ 削除 |
| `src/components/member/TeamTimeline.tsx` | チームタイムライン | 🗑️ 削除 |
| `src/components/member/MemberApp.tsx` | メンバーアプリ | 🗑️ 削除 |
| `src/components/member/MemberList.tsx` | メンバーリスト | 🗑️ 削除 |
| `src/components/member/MemberTimeline.tsx` | メンバータイムライン | 🗑️ 削除 |
| `src/app/team/[teamName]/**/*.tsx` | チーム関連ページ | 🗑️ 削除 |

### 5. ソーシャル機能（スコープ外）

| ファイルパス | 説明 | 対応 |
|:---|:---|:---:|
| `src/components/social/SocialFeed.tsx` | ソーシャルフィード | 🗑️ 削除 |
| `src/components/social/SimpleFeed.tsx` | シンプルフィード | 🗑️ 削除 |
| `src/components/social/SocialGallery.tsx` | ソーシャルギャラリー | 🗑️ 削除 |
| `src/components/social/SocialEvents.tsx` | ソーシャルイベント | 🗑️ 削除 |
| `src/components/social/PostDetailModal.tsx` | 投稿詳細モーダル | 🗑️ 削除 |
| `src/components/social/EventDetailModal.tsx` | イベント詳細モーダル | 🗑️ 削除 |
| `src/components/social/SurveyAnswerModal.tsx` | アンケート回答モーダル | 🗑️ 削除 |
| `src/lib/mock/mockSocialData.ts` | ソーシャルモックデータ | 🗑️ 削除 |

### 6. イベント管理機能（スコープ外）

| ファイルパス | 説明 | 対応 |
|:---|:---|:---:|
| `src/components/events/EventManagement.tsx` | イベント管理 | 🗑️ 削除 |
| `src/components/events/EventFormModal.tsx` | イベントフォーム | 🗑️ 削除 |
| `src/components/events/EventPageBuilder.tsx` | イベントページビルダー | 🗑️ 削除 |
| `src/components/events/EventSurvey.tsx` | イベントアンケート | 🗑️ 削除 |
| `src/components/events/EventDetailModal.tsx` | イベント詳細 | 🗑️ 削除 |
| `src/lib/mock/mockEvents.ts` | イベントモックデータ | 🗑️ 削除 |

### 7. タイムライン機能（スコープ外）

| ファイルパス | 説明 | 対応 |
|:---|:---|:---:|
| `src/components/timeline/ActivityTimeline.tsx` | アクティビティタイムライン | 🗑️ 削除 |
| `src/components/timeline/SimpleTimeline.tsx` | シンプルタイムライン | 🗑️ 削除 |
| `src/lib/mock/mockActivities.ts` | アクティビティモックデータ | 🗑️ 削除 |

### 8. ポートフォリオ機能（スコープ外）

| ファイルパス | 説明 | 対応 |
|:---|:---|:---:|
| `src/components/portfolio/Portfolio.tsx` | ポートフォリオ | 🗑️ 削除 |
| `src/components/portfolio/PortfolioShowcase.tsx` | ポートフォリオショーケース | 🗑️ 削除 |
| `src/app/album/[id]/page.tsx` | アルバム詳細ページ | 🗑️ 削除 |
| `src/app/album/create/page.tsx` | アルバム作成ページ | 🗑️ 削除 |

### 9. 学習・コース機能（スコープ外）

| ファイルパス | 説明 | 対応 |
|:---|:---|:---:|
| `src/components/learning/MemberLearningProgress.tsx` | メンバー学習進捗 | 🗑️ 削除 |
| `src/components/learning/AdminLearningDashboard.tsx` | 管理者学習ダッシュボード | 🗑️ 削除 |
| `src/app/learning/page.tsx` | 学習ページ | 🗑️ 削除 |
| `src/app/admin/learning/page.tsx` | 管理者学習ページ | 🗑️ 削除 |
| `src/lib/mock/mockLearningCourses.ts` | 学習コースモックデータ | 🗑️ 削除 |

### 10. メッセージング・通知機能（スコープ外）

| ファイルパス | 説明 | 対応 |
|:---|:---|:---:|
| `src/components/messaging/DirectMessage.tsx` | ダイレクトメッセージ | 🗑️ 削除 |
| `src/components/notifications/NotificationCenter.tsx` | 通知センター | 🗑️ 削除 |
| `src/lib/mock/mockMessages.ts` | メッセージモックデータ | 🗑️ 削除 |
| `src/lib/mock/mockNotifications.ts` | 通知モックデータ | 🗑️ 削除 |

### 11. 管理者・ダッシュボード機能（スコープ外）

| ファイルパス | 説明 | 対応 |
|:---|:---|:---:|
| `src/components/dashboard/ManagerDashboard.tsx` | 管理者ダッシュボード | 🗑️ 削除 |
| `src/components/dashboard/Dashboard.tsx` | ダッシュボード | 🗑️ 削除 |
| `src/components/management/MemberManagement.tsx` | メンバー管理 | 🗑️ 削除 |

### 12. その他の機能（スコープ外）

| ファイルパス | 説明 | 対応 |
|:---|:---|:---:|
| `src/components/friends/FriendsList.tsx` | フレンドリスト | 🗑️ 削除 |
| `src/components/analytics/Analytics.tsx` | アナリティクス | 🗑️ 削除 |
| `src/components/store/Store.tsx` | ストア機能 | 🗑️ 削除 |
| `src/app/store/**/*.tsx` | ストア関連ページ | 🗑️ 削除 |
| `src/components/ai/AIAssistant.tsx` | AIアシスタント | 🗑️ 削除 |
| `src/components/calendar/ActivityCalendarEnhanced.tsx` | アクティビティカレンダー | 🗑️ 削除 |
| `src/components/comments/PhotoComments.tsx` | 写真コメント | 🗑️ 削除 |
| `src/lib/mock/mockPhotos.ts` | 写真モックデータ | 🗑️ 削除 |

---

## ✅ 残すべきコンポーネント（必須）

### 認証機能

| ファイルパス | 説明 | 状態 |
|:---|:---|:---:|
| `src/components/auth/LoginPage.tsx` | ログインページ | ✅ 保持 |
| `src/components/auth/SignupPage.tsx` | 新規登録ページ | ✅ 保持 |
| `src/components/auth/UserSwitcher.tsx` | ユーザー切り替え | ✅ 保持 |
| `src/contexts/AuthContext.tsx` | 認証コンテキスト | ✅ 保持 |
| `src/lib/mock/mockAuth.ts` | 認証モックデータ | ✅ 保持 |

### プロフィール管理

| ファイルパス | 説明 | 状態 |
|:---|:---|:---:|
| `src/components/profile/InstagramProfilePage.tsx` | プロフィールページ | ✅ 保持 |
| `src/components/profile/ProfileEditModal.tsx` | プロフィール編集 | ✅ 保持 |
| `src/components/profile/ProfileSettings.tsx` | プロフィール設定 | ✅ 保持 |
| `src/lib/dummyUsers.ts` | ユーザーモックデータ | ✅ 保持 |
| `src/lib/mock/mockUserSettings.ts` | ユーザー設定モックデータ | ✅ 保持 |

### 共通・UI

| ファイルパス | 説明 | 状態 |
|:---|:---|:---:|
| `src/components/ui/BackButton.tsx` | 戻るボタン | ✅ 保持 |
| `src/app/page.tsx` | トップページ | ✅ 保持 |
| `src/app/layout.tsx` | レイアウト | ✅ 保持 |
| `src/app/login/page.tsx` | ログインページ | ✅ 保持 |
| `src/app/signup/page.tsx` | 新規登録ページ | ✅ 保持 |
| `src/app/profile/page.tsx` | プロフィールページ | ✅ 保持 |

---

## 📊 削除対象の統計

| カテゴリ | ファイル数 | 対応 |
|:---|:---:|:---:|
| タロット・診断 | 4 | 🗑️ |
| タスク・TODO | 3 | 🗑️ |
| チーム・プロジェクト | 7 | 🗑️ |
| ソーシャル機能 | 8 | 🗑️ |
| イベント管理 | 6 | 🗑️ |
| タイムライン | 3 | 🗑️ |
| ポートフォリオ | 4 | 🗑️ |
| 学習・コース | 5 | 🗑️ |
| メッセージング・通知 | 4 | 🗑️ |
| 管理者・ダッシュボード | 3 | 🗑️ |
| その他 | 8 | 🗑️ |
| **合計** | **55ファイル** | **🗑️** |

### 保持するファイル数

| カテゴリ | ファイル数 |
|:---|:---:|
| 認証機能 | 5 |
| プロフィール管理 | 5 |
| 共通・UI | 6 |
| **合計** | **16ファイル** |

---

## 🎯 削除手順の提案

### オプション1: 段階的な削除（推奨）
1. まずは動作を確認するため、削除対象のディレクトリを `_archived/` に移動
2. アプリケーションの動作確認
3. 問題なければ完全削除

### オプション2: Git ブランチでの削除
1. 新しいブランチを作成: `git checkout -b cleanup/remove-unused-features`
2. 削除対象のファイルを削除
3. 動作確認後、main にマージ

### オプション3: 一括削除スクリプト

```bash
# 削除対象のディレクトリを一括削除
rm -rf src/components/fortune
rm -rf src/components/todo
rm -rf src/components/member
rm -rf src/components/social
rm -rf src/components/events
rm -rf src/components/timeline
rm -rf src/components/portfolio
rm -rf src/components/learning
rm -rf src/components/messaging
rm -rf src/components/notifications
rm -rf src/components/dashboard
rm -rf src/components/management
rm -rf src/components/friends
rm -rf src/components/analytics
rm -rf src/components/store
rm -rf src/components/ai
rm -rf src/components/calendar
rm -rf src/components/comments

# 削除対象のページを一括削除
rm -rf src/app/team
rm -rf src/app/album
rm -rf src/app/store
rm -rf src/app/learning
rm -rf src/app/admin/learning

# 削除対象のモックデータを削除
rm -f src/lib/mock/mockEvents.ts
rm -f src/lib/mock/mockLearningCourses.ts
rm -f src/lib/mock/mockSocialData.ts
rm -f src/lib/mock/mockNotifications.ts
rm -f src/lib/mock/mockMessages.ts
rm -f src/lib/mock/mockPhotos.ts
rm -f src/lib/mock/mockActivities.ts
rm -f src/lib/mock/mockLearningTasks.ts

# Git にコミット
git add .
git commit -m "chore: スコープ外機能の削除（認証・プロフィール管理のみに集中）"
```

---

## 📝 削除後の確認事項

- [ ] `npm run build` が成功するか確認
- [ ] ログイン → プロフィール表示 → 編集 → 設定の一連の動作が正常か確認
- [ ] 不要なimport文のエラーがないか確認
- [ ] 使用されていないモックデータがないか確認

---

## 🔄 今後の対応

削除したファイルは Git 履歴に残っているため、将来的に必要になった場合は復元可能です。

**復元コマンド例**:
```bash
git checkout <コミットハッシュ> -- src/components/fortune/DailyTarot.tsx
```
